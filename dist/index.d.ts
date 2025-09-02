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
type AuthenticateResponse = {
    balance: Balance;
    config: AuthenticateConfig;
    jurisdictionFlags: JurisdictionFlags;
    round: any | null;
};
type BalanceResponse = {
    balance: Balance;
};
type PlayParameters = {
    amount: number;
    mode: string;
};
type PlayRound = {
    betID: number;
    amount: number | undefined;
    payout: number | undefined;
    payoutMultiplier: number | undefined;
    active: boolean;
    mode: string;
    event: string | undefined;
    state: unknown;
};
type PlayResponse = {
    balance: Balance;
    round: PlayRound;
};
type EndRoundResponse = {
    balance: Balance;
};
type EventResponse = {
    event: string;
};
type Client = {
    sessionID: string;
    lang: Language;
    device: string;
    rgsURL: string;
    balance: Balance;
    authenticateConfig: AuthenticateConfig;
    jurisdictionFlags: JurisdictionFlags;
    Authenticate: () => Promise<AuthenticateResponse>;
    Balance: () => Promise<BalanceResponse>;
    Play: (params: PlayParameters) => Promise<PlayResponse>;
    EndRound: () => Promise<EndRoundResponse>;
    Event: (eventValue: string) => Promise<EventResponse>;
};
/**
 * Formats a number with its currency symbol, respecting default decimals and symbol placement.
 * The function is intended to be used for displaying balances.
 */
declare function DisplayBalance(balance: Balance): string;
declare const _default: {
    NewClient: (options: {
        url: string;
    }) => Client;
    DisplayBalance: typeof DisplayBalance;
    DisplayAmount: (val: number) => string;
    ParseAmount: (val: number) => number;
    API_MULTIPLIER: number;
};
export default _default;
//# sourceMappingURL=index.d.ts.map