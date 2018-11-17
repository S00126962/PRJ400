"use strict";
const httpRequest_1 = require("./httpRequest");
/**
 * Diablo III API Reference
 * @link https://develop.battle.net/documentation/api-reference/
 */
var Diablo3;
(function (Diablo3) {
    /**
     * Profile requests of bnet account data
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Profile {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns the specified account profile.
             *
             * @param string region
             * @param string bnet
             * @param string locale
             *
             * @return Promise
             */
            this.getApiAccount = (region, bnet, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/profile/${bnet}/?locale=${locale}&access_token=${this.token.identifier}`);
            };
            /**
             * Returns a single hero.
             *
             * @param string region
             * @param string bnet
             * @param string heroId
             * @param string}locale
             *
             * @return Promise
             */
            this.getApiHero = (region, bnet, heroId, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/profile/${bnet}/hero/${heroId}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            /**
             * Returns a list of items for the specified hero.
             *
             * @param string region
             * @param string bnet
             * @param string heroId
             * @param string locale
             *
             * @return Promise
             */
            this.getApiDetailedHeroItems = (region, bnet, heroId, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/profile/${bnet}/hero/${heroId}/
            items?locale=${locale}&access_token=${this.token.identifier}`);
            };
            /**
             * Returns a list of items for the specified hero's followers.
             *
             * @param string region
             * @param string bnet
             * @param string heroId
             * @param string locale
             *
             * @return Promise
             */
            this.getApiDetailedFollowerItems = (region, bnet, heroId, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/profile/${bnet}/hero/${heroId}/
            follower-items?locale=${locale}&access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.Profile = Profile;
    /**
     * Era requests all the data of diablo3 story
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-game-data-api
     */
    class Era {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns an index of available eras.
             *
             * @param string region
             *
             * @return Promise
             */
            this.eraIndexes = (region) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/data/d3/era/?access_token=${this.token.identifier}`);
            };
            /**
             * Returns leaderboards of a specific era in a specific region
             *
             * @param number id
             * @param string region
             *
             * @return Promise
             */
            this.eraById = (id, region) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/data/d3/era/${id}?access_token=${this.token.identifier}`);
            };
            /**
             * Returns the learboard data
             *
             * @param number id
             * @param string region
             * @param string leaderboard
             *
             * @return Promise
             */
            this.eraLearboard = (id, region, leaderboard) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/data/d3/era/${id}/leaderboard/${leaderboard}?access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.Era = Era;
    /**
     * Season requests all the data of diablo3 seasons
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-game-data-api
     */
    class Season {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns an index of available seasons.
             *
             * @param string region
             *
             * @return Promise
             */
            this.seasonIndexes = (region) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/data/d3/season/?access_token=${this.token.identifier}`);
            };
            /**
             * Returns leaderboards of a specific season in a specific region
             *
             * @param number id
             * @param string region
             *
             * @return Promise
             */
            this.seasonById = (id, region) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/data/d3/season/${id}?access_token=${this.token.identifier}`);
            };
            /**
             * Returns the learboard data
             *
             * @param number id
             * @param string region
             * @param string leaderboard
             *
             * @return Promise
             */
            this.seasonLearboard = (id, region, leaderboard) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/data/d3/season/${id}/leaderboard/${leaderboard}?access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.Season = Season;
    /**
     * Item requests all the data of diablo3 item and types
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Item {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns a single item by item slug and ID.
             *
             * @param string region
             * @param string itemSlugAndId
             * @param string locale
             *
             * @return Promise
             */
            this.getItem = (region, itemSlugAndId, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/item/${escape(itemSlugAndId)}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            /**
             * Returns an index of item types.
             *
             * @param string region
             * @param string locale
             *
             * @return Promise
             */
            this.getItemTypeIndex = (region, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/item-type
                ?locale=${locale}&access_token=USLGWLnbFGMQ5lS1LQ0A4wnGukM1I18MvI`);
            };
            /**
             * Returns a single item type by slug.
             *
             * @param string region
             * @param string itemSlug
             * @param string locale
             *
             * @return Promise
             */
            this.getItemType = (region, itemSlug, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/item-type/${escape(itemSlug)}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.Item = Item;
    /**
     * Follower requests all the data of diablo3 follower
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Follower {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns a single follower by slug.
             *
             * @param string region
             * @param string followerSlug
             * @param string locale
             *
             * @return Promise
             */
            this.getFollower = (region, followerSlug, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/follower/${followerSlug}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.Follower = Follower;
    /**
     * Act requests all the data of diablo acts (lore)
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Act {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns an index of acts.
             *
             * @param string region
             * @param string locale
             *
             * @return Promise
             */
            this.getActIndex = (region, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/act?locale=${locale}&access_token=${this.token.identifier}`);
            };
            /**
             * Returns a single act by ID.
             *
             * @param string region
             * @param number actId
             * @param string locale
             *
             * @return Promise
             */
            this.getAct = (region, actId, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/act/${actId}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.Act = Act;
    /**
     * Artisan and Recipe requests all the data of artisan or recipe
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class ArtisanAndRecipe {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns a single artisan by slug.
             *
             * @param string region
             * @param string artisanSlug
             * @param string locale
             *
             * @return Promise
             */
            this.getArtisan = (region, artisanSlug, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/artisan/${artisanSlug}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            /**
             * Returns a single recipe by slug for the specified artisan.
             *
             * @param string region
             * @param string artisanSlug
             * @param string recipeSlug
             * @param string locale
             *
             * @return Promise
             */
            this.getRecipe = (region, artisanSlug, recipeSlug, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/artisan/${artisanSlug}/recipe/${recipeSlug}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.ArtisanAndRecipe = ArtisanAndRecipe;
    /**
     * Character and Skills requests all for character or skills data
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class CharacterAndSkill {
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken) {
            /**
             * Returns a single character class by slug.
             *
             * @param string region
             * @param string classSlug
             * @param string locale
             *
             * @return Promise
             */
            this.getCharacterClass = (region, classSlug, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/hero/${classSlug}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            /**
             * Returns a single skill by slug for a specific character class.
             *
             * @param string region
             * @param string classSlug
             * @param string skillSlug
             * @param string locale
             *
             * @return Promise
             */
            this.getApiSkill = (region, classSlug, skillSlug, locale) => {
                return httpRequest_1.HttpRequest.get(`https://${region}.api.blizzard.com/d3/data/hero/${classSlug}/skill/${skillSlug}
                ?locale=${locale}&access_token=${this.token.identifier}`);
            };
            this.token = bearerToken;
        }
        /**
         * Initializes the authorization token for this profile can operate
         */
        set bearerToken(token) {
            this.token = token;
        }
    }
    Diablo3.CharacterAndSkill = CharacterAndSkill;
})(Diablo3 || (Diablo3 = {}));
module.exports = Diablo3;
