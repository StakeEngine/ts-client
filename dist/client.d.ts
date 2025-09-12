import type { AuthenticateConfig, AuthenticateResponse, Balance, EndRoundResponse, EventResponse, JurisdictionFlags, Language, PlayParameters, PlayResponse } from './types.js';
type Client = {
    sessionID: string;
    lang: Language;
    device: string;
    balance: Balance;
    authenticateConfig: AuthenticateConfig;
    jurisdictionFlags: JurisdictionFlags;
    Authenticate: () => Promise<AuthenticateResponse>;
    Play: (params: PlayParameters) => Promise<PlayResponse>;
    EndRound: () => Promise<EndRoundResponse>;
    Event: (eventValue: string) => Promise<EventResponse>;
};
declare const RGSClient: (options: {
    url: string;
    enforceBetLevels?: boolean;
}) => Client;
export { RGSClient };
//# sourceMappingURL=client.d.ts.map