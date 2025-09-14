import * as data from '../package.json' with { type: 'json' };

import { parseBalance } from './helpers.js';
import type {
  AuthenticateConfig,
  AuthenticateResponse,
  Balance,
  BalanceResponse,
  EndRoundResponse,
  EventResponse,
  JurisdictionFlags,
  Language,
  PlayParameters,
  PlayResponse,
} from './types.js';

type Client = {
  // URL Parameters
  sessionID: string;
  lang: Language;
  device: string;

  // Authenticate Parameters
  balance: Balance;
  authenticateConfig: AuthenticateConfig;
  jurisdictionFlags: JurisdictionFlags;

  // API Methods
  Authenticate: () => Promise<AuthenticateResponse>;
  Play: (params: PlayParameters) => Promise<PlayResponse>;
  EndRound: () => Promise<EndRoundResponse>;
  Event: (eventValue: string) => Promise<EventResponse>;
};

const RGSClient = (options: {
  url: string;
  enforceBetLevels?: boolean;
}): Client => {
  console.log(
    `Stake Engine Client Version: ${data.default.version}`,
    'background: #222; color: #e9bc6fff',
  );
  const client = {} as Client;

  const url = new URL(options.url);
  const searchParams = url.searchParams;

  // Setup the client and collect any relevant parameters
  // Language is defined in the URL and passed by the Operator, not necessarily the same as the browser language.
  client.lang = (searchParams.get('lang') || 'en') as Language;

  // Device is a parameter helper for responsive design. A developer may use this parameter or create a responsive design.
  const device = searchParams.get('device') || 'desktop';
  if (device !== 'desktop' && device !== 'mobile') {
    throw new Error(`Unsupported device type: ${device}`);
  }
  client.device = device;

  // SessionID is a unique identifier for the user's session and will be used by all requests.
  const sessionID = searchParams.get('sessionID');

  if (!sessionID) {
    throw new Error('sessionID is not in set in url parameters');
  }
  client.sessionID = sessionID;

  // rgsURL is the base URL for the RGS API. This URL could change based on the environment or Jurisdiction(e.g., rgs.stake-engine.com, rgs-us.stake-engine.com).
  const paramRGSURL = searchParams.get('rgs_url');
  if (!paramRGSURL) {
    throw new Error('rgs_url is not in set in url parameters');
  }
  const fullRGSURL = `https://${paramRGSURL}`;

  // Boolean to determine if the client should enforce bet levels on Play requests.
  // This will default to true if not set.
  const enforceBetLevels = options.enforceBetLevels ?? true;
  let roundActive = false;

  // Authenticate authorises the session to be used for game play. It also sends back information regarding jurisdiction, player balance and currency
  // and bet levels available for the game for the operator.
  client.Authenticate = async (): Promise<AuthenticateResponse> => {
    const response = await fetch(`${fullRGSURL}/wallet/authenticate`, {
      method: 'POST',
      body: JSON.stringify({
        sessionID: client.sessionID,
        language: client.lang,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status / 100 !== 2) {
      throw new Error(data);
    }

    client.jurisdictionFlags = {
      socialCasino: data.config.jurisdiction.socialCasino,
      disabledFullscreen: data.config.jurisdiction.disabledFullscreen,
      disabledTurbo: data.config.jurisdiction.disabledTurbo,
      disabledSuperTurbo: data.config.jurisdiction.disabledSuperTurbo,
      disabledAutoplay: data.config.jurisdiction.disabledAutoplay,
      disabledSlamstop: data.config.jurisdiction.disabledSlamstop,
      disabledSpacebar: data.config.jurisdiction.disabledSpacebar,
      disabledBuyFeature: data.config.jurisdiction.disabledBuyFeature,
      displayNetPosition: data.config.jurisdiction.displayNetPosition,
      displayRTP: data.config.jurisdiction.displayRTP,
      displaySessionTimer: data.config.jurisdiction.displaySessionTimer,
      minimumRoundDuration: data.config.jurisdiction.minimumRoundDuration,
    };

    client.authenticateConfig = {
      minBet: data.config.minBet,
      maxBet: data.config.maxBet,
      stepBet: data.config.stepBet,
      defaultBetLevel: data.config.defaultBetLevel,
      betLevels: data.config.betLevels,
    };

    const parsed = parseBalance(data.balance);

    // Emit the balance updated event for any listeners
    emitBalanceEvent(parsed);
    if (data?.round?.active) {
      emitRoundActiveEvent(true);
      roundActive = true;
    }

    // Update the client with the new balance
    client.balance = parsed;

    return {
      balance: parsed,
      config: client.authenticateConfig,
      jurisdictionFlags: client.jurisdictionFlags,
      round: data.round,
    };
  };

  // Balance is used to retrieve the current balance of the user.
  // This function should not be the primary way to get the balance as other APIs return the balance.
  // Instead, use this API if the player has been inactive for a few minutes to update their balance value.
  const balanceFn = async (): Promise<BalanceResponse> => {
    if (!client.authenticateConfig) {
      throw new Error(
        'Client is not authenticated, please call Authenticate()',
      );
    }

    const response = await fetch(`${fullRGSURL}/wallet/balance`, {
      method: 'POST',
      body: JSON.stringify({
        sessionID: client.sessionID,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status / 100 !== 2) {
      throw new Error(data);
    }

    const parsed = parseBalance(data.balance);
    // Emit the balance updated event for any listeners
    emitBalanceEvent(parsed);
    // Update the client with the new balance
    client.balance = parsed;

    return {
      balance: parsed,
    };
  };

  // We want to run the balance on a timer to keep the balance fresh.
  // So when there isn't a play request we will request the current balance every minute.
  let balanceInterval: NodeJS.Timeout;

  const startBalanceInterval = () => {
    if (balanceInterval) {
      clearInterval(balanceInterval);
    }
    balanceInterval = setInterval(balanceFn, 60 * 1000);
  };

  // Play creates a bet for the player and returns the player balance and the result for the bet.
  client.Play = async (params: PlayParameters): Promise<PlayResponse> => {
    if (!client.authenticateConfig) {
      throw new Error(
        'Client is not authenticated, please call Authenticate()',
      );
    }

    if (roundActive) {
      throw new Error(
        'A round is already active, please call EndRound() before starting a new round',
      );
    }

    if (params.amount % client.authenticateConfig.stepBet !== 0) {
      throw new Error(
        `Bet amount must be a multiple of ${client.authenticateConfig.stepBet}`,
      );
    }

    if (
      params.amount < client.authenticateConfig.minBet ||
      params.amount > client.authenticateConfig.maxBet
    ) {
      throw new Error(
        `Bet amount must between min bet (${client.authenticateConfig.minBet}) and max bet (${client.authenticateConfig.maxBet})`,
      );
    }

    if (enforceBetLevels) {
      if (!client.authenticateConfig.betLevels.includes(params.amount)) {
        throw new Error(
          `Bet amount must be one of the following levels: ${client.authenticateConfig.betLevels.join(
            ', ',
          )}. You may disable bet level enforcement by setting enforceBetLevels to false when creating the client.`,
        );
      }
    }

    emitRoundActiveEvent(true);
    roundActive = true;

    const response = await fetch(`${fullRGSURL}/wallet/play`, {
      method: 'POST',
      body: JSON.stringify({
        sessionID: client.sessionID,
        mode: params.mode,
        amount: params.amount,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status / 100 !== 2) {
      emitRoundActiveEvent(false);
      roundActive = false;
      throw new Error(data);
    }

    const parsed = parseBalance(data.balance);

    // Emit the balance updated event for any listeners
    emitBalanceEvent(parsed);

    if (!data?.round?.active) {
      emitRoundActiveEvent(false);
      roundActive = false;
    }

    // Restart the balance interval to keep the balance fresh
    startBalanceInterval();

    // Update the client with the new balance
    client.balance = parsed;

    return {
      balance: parsed,
      round: data.round,
    };
  };

  // EndRound completes a currently active bet for the player. Only call this API if Play() has returned an Active result otherwise this
  // API will return an error.
  client.EndRound = async (): Promise<EndRoundResponse> => {
    if (!client.authenticateConfig) {
      throw new Error(
        'Client is not authenticated, please call Authenticate()',
      );
    }

    const response = await fetch(`${fullRGSURL}/wallet/end-round`, {
      method: 'POST',
      body: JSON.stringify({
        sessionID: client.sessionID,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status / 100 !== 2) {
      throw new Error(data);
    }

    const parsed = parseBalance(data.balance);

    // Emit the balance updated event for any listeners
    emitBalanceEvent(parsed);
    emitRoundActiveEvent(false);
    roundActive = false;

    // Restart the balance interval to keep the balance fresh
    startBalanceInterval();
    // Update the client with the new balance
    client.balance = parsed;

    return {
      balance: parsed,
    };
  };

  client.Event = async (eventValue: string): Promise<EventResponse> => {
    if (!client.authenticateConfig) {
      throw new Error(
        'Client is not authenticated, please call Authenticate()',
      );
    }

    const response = await fetch(`${fullRGSURL}/bet/event`, {
      method: 'POST',
      body: JSON.stringify({
        sessionID: client.sessionID,
        event: eventValue,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status / 100 !== 2) {
      throw new Error(data);
    }

    return {
      event: data.event,
    };
  };

  return client;
};

const emitBalanceEvent = (balance: Balance) => {
  window.dispatchEvent(new CustomEvent('balanceUpdate', { detail: balance }));
};

const emitRoundActiveEvent = (active: boolean) => {
  window.dispatchEvent(new CustomEvent('roundActive', { detail: { active } }));
};

export { RGSClient };
