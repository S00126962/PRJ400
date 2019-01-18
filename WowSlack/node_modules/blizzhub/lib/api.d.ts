/**
 * Isolated interface only exclusive
 * for this API class
 */
export interface IBearerToken {
    identifier: string;
    type: string;
    expires_in: number;
    scope?: string;
}
/**
 * Implements all the requests interfaces in order to proceed
 * blizzard valid requests
 * (Mentioned to be scope only for the individual games)
 *
 * @author Enigma
 * @package BlizzardTypo
 */
export declare class API {
    private hasToken;
    private region;
    private locale;
    private client_id;
    private client_secret;
    private authToken?;
    private callbackOnConnect;
    /**
     * Initializes our api with the given credentials
     * @param clientId
     * @param clientSecret
     * @param region    default europe
     * @param locale    default eu_GB
     */
    constructor(clientId: string, clientSecret: string, callbackOnConnect: Function, region?: string, locale?: string);
    /**
     * Sets the Authorization Bearer token
     * (Just set if you have a valid one)
     *
     * @param {BearerToken} token
     *
     * @return void
     */
    setBearerToken: (token: IBearerToken) => void;
    /**
     * Returns the Authorization Bearer Token
     *
     * @return IBearer
     */
    readonly getBearerToken: IBearerToken | undefined;
    /**
     * Returns whether the authorization token has been
     * initialized
     *
     * @return boolean
     */
    hasAuthorizationToken(): boolean;
    /**
     * Retrieves our Authorization Bearer Token in order to proceed
     * further requests
     *
     * @return void
     */
    private retrieveToken;
}
//# sourceMappingURL=api.d.ts.map