// Currency metadata: symbol, default decimals, symbol placement
const CurrencyMeta = {
    USD: { symbol: '$', decimals: 2 },
    CAD: { symbol: 'CA$', decimals: 2 },
    JPY: { symbol: '¥', decimals: 0 },
    EUR: { symbol: '€', decimals: 2 },
    RUB: { symbol: '₽', decimals: 2 },
    CNY: { symbol: 'CN¥', decimals: 2 },
    PHP: { symbol: '₱', decimals: 2 },
    INR: { symbol: '₹', decimals: 2 },
    IDR: { symbol: 'Rp', decimals: 0 },
    KRW: { symbol: '₩', decimals: 0 },
    BRL: { symbol: 'R$', decimals: 2 },
    MXN: { symbol: 'MX$', decimals: 2 },
    DKK: { symbol: 'KR', decimals: 2, symbolAfter: true },
    PLN: { symbol: 'zł', decimals: 2, symbolAfter: true },
    VND: { symbol: '₫', decimals: 0, symbolAfter: true },
    TRY: { symbol: '₺', decimals: 2 },
    CLP: { symbol: 'CLP', decimals: 0, symbolAfter: true },
    ARS: { symbol: 'ARS', decimals: 2, symbolAfter: true },
    PEN: { symbol: 'S/', decimals: 2 },
    XGC: { symbol: 'GC', decimals: 2 },
    XSC: { symbol: 'SC', decimals: 2 },
};
const API_MULTIPLIER = 1000000;
const NewClient = (options) => {
    const client = {};
    const url = new URL(options.url);
    const searchParams = url.searchParams;
    // Setup the client and collect any relevant parameters
    // Language is defined in the URL and passed by the Operator, not necessarily the same as the browser language.
    client.lang = (searchParams.get('lang') || 'en');
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
    const rgsURL = searchParams.get('rgs_url');
    if (!rgsURL) {
        throw new Error('rgs_url is not in set in url parameters');
    }
    client.rgsURL = `https://${rgsURL}`;
    // Authenticate authorises the session to be used for game play. It also sends back information regarding jurisdiction, player balance and currency
    // and bet levels available for the game for the operator.
    client.Authenticate = async () => {
        const response = await fetch(`${client.rgsURL}/wallet/authenticate`, {
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
        return {
            balance: parseBalance(data.balance),
            config: client.authenticateConfig,
            jurisdictionFlags: client.jurisdictionFlags,
            round: data.round,
        };
    };
    // Balance is used to retrieve the current balance of the user.
    // This function should not be the primary way to get the balance as other APIs return the balance.
    // Instead, use this API if the player has been inactive for a few minutes to update their balance value.
    client.Balance = async () => {
        if (!client.authenticateConfig) {
            throw new Error('Client is not authenticated, please call Authenticate()');
        }
        const response = await fetch(`${client.rgsURL}/wallet/balance`, {
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
        return {
            balance: parseBalance(data.balance),
        };
    };
    // Play creates a bet for the player and returns the player balance and the result for the bet.
    client.Play = async (params) => {
        if (!client.authenticateConfig) {
            throw new Error('Client is not authenticated, please call Authenticate()');
        }
        if (params.amount % client.authenticateConfig.stepBet !== 0) {
            throw new Error(`Bet amount must be a multiple of ${client.authenticateConfig.stepBet}`);
        }
        const response = await fetch(`${client.rgsURL}/wallet/play`, {
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
            throw new Error(data);
        }
        return {
            balance: parseBalance(data.balance),
            round: data.round,
        };
    };
    // EndRound completes a currently active bet for the player. Only call this API if Play() has returned an Active result otherwise this
    // API will return an error.
    client.EndRound = async () => {
        if (!client.authenticateConfig) {
            throw new Error('Client is not authenticated, please call Authenticate()');
        }
        const response = await fetch(`${client.rgsURL}/wallet/end-round`, {
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
        return {
            balance: parseBalance(data.balance),
        };
    };
    // Event is used to keep track of where the player is in an extended round
    client.Event = async (eventValue) => {
        if (!client.authenticateConfig) {
            throw new Error('Client is not authenticated, please call Authenticate()');
        }
        const response = await fetch(`${client.rgsURL}/bet/event`, {
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
/**
 * parseBalance is a helper to parse a balance from the request to a typed balance object.
 */
const parseBalance = (balance) => {
    return {
        amount: balance.amount,
        currency: balance.currency,
    };
};
/**
 * ParseAmount converts an RGS amount to a regular decimal number.
 * eg 1_000_000 to a regular decimal number 1.00
 */
const ParseAmount = (val) => {
    return val / API_MULTIPLIER;
};
/**
 * Displays a formatted amount from the RGS (eg 1_000_000) to a regular decimal number (eg 1.00).
 * The function is intended to be used for displaying amounts.
 */
const DisplayAmount = (val) => {
    return ParseAmount(val).toFixed(2);
};
/**
 * Formats a number with its currency symbol, respecting default decimals and symbol placement.
 * The function is intended to be used for displaying balances.
 */
function DisplayBalance(balance) {
    const meta = CurrencyMeta[balance.currency] ?? {
        symbol: balance.currency,
        amount: ParseAmount(balance.amount),
        symbolAfter: true,
    };
    const useDecimals = meta.decimals;
    const formattedAmount = balance.amount.toFixed(useDecimals);
    if (meta.symbolAfter) {
        return `${formattedAmount} ${meta.symbol}`;
    }
    else {
        return `${meta.symbol}${formattedAmount}`;
    }
}
export default {
    NewClient,
    DisplayBalance,
    DisplayAmount,
    ParseAmount,
    API_MULTIPLIER,
};
//# sourceMappingURL=index.js.map