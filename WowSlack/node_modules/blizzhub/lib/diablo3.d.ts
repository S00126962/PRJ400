import { IBearerToken } from "./api";
import { ApiException } from "./exceptions";
/**
 * Diablo III API Reference
 * @link https://develop.battle.net/documentation/api-reference/
 */
declare namespace Diablo3 {
    /**
     * Profile requests of bnet account data
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Profile {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns the specified account profile.
         *
         * @param string region
         * @param string bnet
         * @param string locale
         *
         * @return Promise
         */
        getApiAccount: (region: string, bnet: string, locale: string) => Promise<JSON | ApiException>;
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
        getApiHero: (region: string, bnet: string, heroId: string, locale: string) => Promise<JSON | ApiException>;
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
        getApiDetailedHeroItems: (region: string, bnet: string, heroId: string, locale: string) => Promise<JSON | ApiException>;
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
        getApiDetailedFollowerItems: (region: string, bnet: string, heroId: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Era requests all the data of diablo3 story
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-game-data-api
     */
    class Era {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns an index of available eras.
         *
         * @param string region
         *
         * @return Promise
         */
        eraIndexes: (region: string) => Promise<JSON | ApiException>;
        /**
         * Returns leaderboards of a specific era in a specific region
         *
         * @param number id
         * @param string region
         *
         * @return Promise
         */
        eraById: (id: number, region: string) => Promise<JSON | ApiException>;
        /**
         * Returns the learboard data
         *
         * @param number id
         * @param string region
         * @param string leaderboard
         *
         * @return Promise
         */
        eraLearboard: (id: number, region: string, leaderboard: string) => Promise<JSON | ApiException>;
    }
    /**
     * Season requests all the data of diablo3 seasons
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-game-data-api
     */
    class Season {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns an index of available seasons.
         *
         * @param string region
         *
         * @return Promise
         */
        seasonIndexes: (region: string) => Promise<JSON | ApiException>;
        /**
         * Returns leaderboards of a specific season in a specific region
         *
         * @param number id
         * @param string region
         *
         * @return Promise
         */
        seasonById: (id: number, region: string) => Promise<JSON | ApiException>;
        /**
         * Returns the learboard data
         *
         * @param number id
         * @param string region
         * @param string leaderboard
         *
         * @return Promise
         */
        seasonLearboard: (id: number, region: string, leaderboard: string) => Promise<JSON | ApiException>;
    }
    /**
     * Item requests all the data of diablo3 item and types
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Item {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns a single item by item slug and ID.
         *
         * @param string region
         * @param string itemSlugAndId
         * @param string locale
         *
         * @return Promise
         */
        getItem: (region: string, itemSlugAndId: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns an index of item types.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getItemTypeIndex: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a single item type by slug.
         *
         * @param string region
         * @param string itemSlug
         * @param string locale
         *
         * @return Promise
         */
        getItemType: (region: string, itemSlug: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Follower requests all the data of diablo3 follower
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Follower {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns a single follower by slug.
         *
         * @param string region
         * @param string followerSlug
         * @param string locale
         *
         * @return Promise
         */
        getFollower: (region: string, followerSlug: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Act requests all the data of diablo acts (lore)
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class Act {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns an index of acts.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getActIndex: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a single act by ID.
         *
         * @param string region
         * @param number actId
         * @param string locale
         *
         * @return Promise
         */
        getAct: (region: string, actId: number, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Artisan and Recipe requests all the data of artisan or recipe
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class ArtisanAndRecipe {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns a single artisan by slug.
         *
         * @param string region
         * @param string artisanSlug
         * @param string locale
         *
         * @return Promise
         */
        getArtisan: (region: string, artisanSlug: string, locale: string) => Promise<JSON | ApiException>;
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
        getRecipe: (region: string, artisanSlug: string, recipeSlug: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Character and Skills requests all for character or skills data
     *
     * @author Enigma
     * @package Diablo3
     * @link https://develop.battle.net/documentation/api-reference/diablo-3-community-api
     */
    class CharacterAndSkill {
        /**
         * Authorization token instance
         */
        private token;
        /**
         * Initializes our bearer token
         * @param IBearerToken bearerToken
         */
        constructor(bearerToken: IBearerToken);
        /**
         * Initializes the authorization token for this profile can operate
         */
        bearerToken: IBearerToken;
        /**
         * Returns a single character class by slug.
         *
         * @param string region
         * @param string classSlug
         * @param string locale
         *
         * @return Promise
         */
        getCharacterClass: (region: string, classSlug: string, locale: string) => Promise<JSON | ApiException>;
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
        getApiSkill: (region: string, classSlug: string, skillSlug: string, locale: string) => Promise<JSON | ApiException>;
    }
}
export = Diablo3;
