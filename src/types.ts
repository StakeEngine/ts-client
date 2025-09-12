// The lang parameter should be an ISO 639-1 language code.
// These are the currently supported language codes
type Language =
  | 'ar' // (Arabic)
  | 'de' // (German)
  | 'en' // (English)
  | 'es' // (Spanish)
  | 'fi' // (Finnish)
  | 'fr' // (French)
  | 'hi' // (Hindi)
  | 'id' // (Indonesian)
  | 'ja' // (Japanese)
  | 'ko' // (Korean)
  | 'pl' // (Polish)
  | 'pt' // (Portuguese)
  | 'ru' // (Russian)
  | 'tr' // (Turkish)
  | 'vi' // (Vietnamese)
  | 'zh'; // (Chinese)

// Available currency codes for Stake Engine
type Currency =
  | 'USD' // (United States Dollar)
  | 'CAD' // (Canadian Dollar)
  | 'JPY' // (Japanese Yen)
  | 'EUR' // (Euro)
  | 'RUB' // (Russian Ruble)
  | 'CNY' // (Chinese Yuan)
  | 'PHP' // (Philippine Peso)
  | 'INR' // (Indian Rupee)
  | 'IDR' // (Indonesian Rupiah)
  | 'KRW' // (South Korean Won)
  | 'BRL' // (Brazilian Real)
  | 'MXN' // (Mexican Peso)
  | 'DKK' // (Danish Krone)
  | 'PLN' // (Polish Złoty)
  | 'VND' // (Vietnamese Đồng)
  | 'TRY' // (Turkish Lira)
  | 'CLP' // (Chilean Peso)
  | 'ARS' // (Argentine Peso)
  | 'PEN' // (Peruvian Sol)
  | 'XGC' // Stake US Gold Coin
  | 'XSC'; // Stake US Stake Cash

type Balance = {
  amount: number;
  currency: Currency;
};

type JurisdictionFlags = {
  socialCasino: boolean;
  disabledFullscreen: boolean;
  disabledTurbo: boolean;
  disabledSuperTurbo: boolean;
  disabledAutoplay: boolean;
  disabledSlamstop: boolean;
  disabledSpacebar: boolean;
  disabledBuyFeature: boolean;
  displayNetPosition: boolean;
  displayRTP: boolean;
  displaySessionTimer: boolean;
  minimumRoundDuration: number;
};

type AuthenticateConfig = {
  minBet: number;
  maxBet: number;
  stepBet: number;
  defaultBetLevel: number;
  betLevels: number[];
};

type Round = {
  betID: number;
  amount?: number;
  payout?: number;
  payoutMultiplier?: number;
  active: boolean;
  mode: string;
  event?: string;
  state: unknown;
};

type AuthenticateResponse = {
  balance: Balance;
  config: AuthenticateConfig;
  jurisdictionFlags: JurisdictionFlags;
  round: Round | null;
};

type BalanceResponse = {
  balance: Balance;
};

type PlayParameters = {
  amount: number;
  mode: string;
};

type PlayResponse = {
  balance: Balance;
  round: Round;
};

type EndRoundResponse = {
  balance: Balance;
};

type EventResponse = {
  event: string;
};

export type {
  AuthenticateConfig,
  AuthenticateResponse,
  Balance,
  BalanceResponse,
  Currency,
  EndRoundResponse,
  EventResponse,
  JurisdictionFlags,
  Language,
  PlayParameters,
  PlayResponse,
  Round,
};
