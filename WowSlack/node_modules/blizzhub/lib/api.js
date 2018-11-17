"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const request = __importStar(require("request-promise"));
var BlizzardTypo;
(function (BlizzardTypo) {
    /**
     * Implements all the requests interfaces in order to proceed
     * blizzard valid requests
     * (Mentioned to be scope only for the individual games)
     *
     * @author Enigma
     * @package BlizzardTypo
     */
    class API {
        /**
         * Initializes our api with the given credentials
         * @param clientId
         * @param clientSecret
         * @param region    default europe
         * @param locale    default eu_GB
         */
        constructor(clientId, clientSecret, callbackOnConnect, region, locale) {
            this.hasToken = false;
            /**
             * Sets the Authorization Bearer token
             * (Just set if you have a valid one)
             *
             * @param {BearerToken} token
             *
             * @return void
             */
            this.setBearerToken = (token) => {
                this.authToken = token;
            };
            /**
             * Retrieves our Authorization Bearer Token in order to proceed
             * further requests
             *
             * @return void
             */
            this.retrieveToken = () => {
                request.get(`https://${this.region}.battle.net/oauth/token?client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=client_credentials`)
                    .then(JSON.parse)
                    .then(body => {
                    this.authToken = {
                        identifier: body.access_token,
                        type: body.token_type,
                        expires_in: body.expires_in,
                        scope: body.scope
                    };
                    this.hasToken = true;
                    this.callbackOnConnect(true, this.authToken);
                })
                    .catch(err => {
                    console.log(err);
                    //filter error and throw exception according to it
                });
            };
            this.region = typeof region != 'undefined' ? region : "eu";
            this.locale = typeof locale != 'undefined' ? locale : "en_GB";
            this.client_id = clientId;
            this.client_secret = clientSecret;
            this.callbackOnConnect = callbackOnConnect;
            this.retrieveToken();
        }
        /**
         * Returns the Authorization Bearer Token
         *
         * @return IBearer
         */
        get getBearerToken() {
            return this.authToken;
        }
        /**
         * Returns whether the authorization token has been
         * initialized
         *
         * @return boolean
         */
        hasAuthorizationToken() {
            return this.hasToken;
        }
    }
    BlizzardTypo.API = API;
})(BlizzardTypo || (BlizzardTypo = {}));
module.exports = BlizzardTypo;
