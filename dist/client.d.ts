import type { AuthenticateConfig, AuthenticateResponse, Balance, EndRoundResponse, EventResponse, JurisdictionFlags, Language, PlayParameters, PlayResponse } from './types.js';
type Client<T = unknown> = {
    sessionID: string;
    lang: Language;
    device: string;
    balance: Balance;
    authenticateConfig: AuthenticateConfig;
    jurisdictionFlags: JurisdictionFlags;
    Authenticate: () => Promise<AuthenticateResponse<T>>;
    Play: (params: PlayParameters) => Promise<PlayResponse<T>>;
    EndRound: () => Promise<EndRoundResponse>;
    Event: (eventValue: string) => Promise<EventResponse>;
};
declare const RGSClient: <T = unknown>(options: {
    url: string;
    enforceBetLevels?: boolean;
    protocol?: "http" | "https";
}) => Client<T>;
export { RGSClient };
//# sourceMappingURL=client.d.ts.map