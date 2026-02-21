type Language = 'ar' | 'de' | 'en' | 'es' | 'fi' | 'fr' | 'hi' | 'id' | 'ja' | 'ko' | 'pl' | 'pt' | 'ru' | 'tr' | 'vi' | 'zh';
type Currency = 'USD' | 'CAD' | 'JPY' | 'EUR' | 'RUB' | 'CNY' | 'PHP' | 'INR' | 'IDR' | 'KRW' | 'BRL' | 'MXN' | 'DKK' | 'PLN' | 'VND' | 'TRY' | 'CLP' | 'ARS' | 'PEN' | 'NGN' | 'SAR' | 'ILS' | 'AED' | 'TWD' | 'NOK' | 'KWD' | 'JOD' | 'CRC' | 'TND' | 'SGD' | 'MYR' | 'OMR' | 'QAR' | 'BHD' | 'XGC' | 'XSC';
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
type Round<T = unknown> = {
    betID: number;
    amount?: number;
    payout?: number;
    payoutMultiplier?: number;
    active: boolean;
    mode: string;
    event?: string;
    state: T;
};
type AuthenticateResponse<T = unknown> = {
    balance: Balance;
    config: AuthenticateConfig;
    jurisdictionFlags: JurisdictionFlags;
    round: Round<T> | null;
};
type BalanceResponse = {
    balance: Balance;
};
type PlayParameters = {
    amount: number;
    mode: string;
};
type PlayResponse<T = unknown> = {
    balance: Balance;
    round: Round<T>;
};
type EndRoundResponse = {
    balance: Balance;
};
type EventResponse = {
    event: string;
};
export type { AuthenticateConfig, AuthenticateResponse, Balance, BalanceResponse, Currency, EndRoundResponse, EventResponse, JurisdictionFlags, Language, PlayParameters, PlayResponse, Round, };
//# sourceMappingURL=types.d.ts.map