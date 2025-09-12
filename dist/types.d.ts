type Language = 'ar' | 'de' | 'en' | 'es' | 'fi' | 'fr' | 'hi' | 'id' | 'ja' | 'ko' | 'pl' | 'pt' | 'ru' | 'tr' | 'vi' | 'zh';
type Currency = 'USD' | 'CAD' | 'JPY' | 'EUR' | 'RUB' | 'CNY' | 'PHP' | 'INR' | 'IDR' | 'KRW' | 'BRL' | 'MXN' | 'DKK' | 'PLN' | 'VND' | 'TRY' | 'CLP' | 'ARS' | 'PEN' | 'XGC' | 'XSC';
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
export type { AuthenticateConfig, AuthenticateResponse, Balance, BalanceResponse, Currency, EndRoundResponse, EventResponse, JurisdictionFlags, Language, PlayParameters, PlayResponse, Round, };
//# sourceMappingURL=types.d.ts.map