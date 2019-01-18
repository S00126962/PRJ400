import { IBearerToken } from "./api";
import { ApiException } from "./exceptions";
/**
 * Wow API Reference
 * @link https://develop.battle.net/documentation/api-reference/
 */
export declare namespace Wow {
    /**
     * ConnectedRealm requests all the connected realms
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-game-data-api
     */
    class ConnectedRealm {
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
         * Returns an index of connected realms.
         *
         * @param string region
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getConnectedRealmIndex: (region: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a single connected realm by ID.
         *
         * @param string region
         * @param number connRealmId
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getConnectedRealm: (region: string, connRealmId: number, namespace: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Mythic requests keystones, leaderboards and modes data
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-game-data-api
     */
    class Mythic {
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
         * Returns an index of Mythic Keystone Leaderboard dungeon instances for a connected realm.
         *
         * @param string region
         * @param number connRealmid
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getMythicLeaderboardIndex: (region: string, connRealmId: number, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a weekly Mythic Keystone Leaderboard by period.
         * @param string region
         * @param number connRealmid
         * @param number dungeonId
         * @param number period
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getMythicLeaderboard: (region: string, connRealmId: number, dungeonId: number, period: number, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns the leaderboard for a given raid and faction.
         *
         * @param string region
         * @param string raid
         * @param string faction
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getMythicRaidLeaderboard: (region: string, raid: string, faction: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns current period information about the Mythic Challenge Mode relevant to Mythic Keystone Leaderboards.
         *
         * @param string region
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getMythicChallengeModeIndex: (region: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * PlayableSpecialization requests class specs data
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-game-data-api
     */
    class PlayableSpecialization {
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
         * Returns an index of playable specializations.
         *
         * @param string region
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getPlayableSpecializationIndex: (region: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a playable specialization by ID.
         *
         * @param string region
         * @param number specId
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getPlayableSpecialization: (region: string, specId: number, namespace: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Realm requests all the realm data
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-game-data-api
     */
    class Realm {
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
         * Returns an index of realms.
         *
         * @param string region
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getRealmIndex: (region: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a single realm by slug or ID.
         *
         * @param string region
         * @param string realmSlug
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getRealm: (region: string, realmSlug: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * The realm status API allows developers to retrieve realm status information.
         * This information is limited to whether or not the realm is up, the type and state of the realm, and the current population.
         * Although this endpoint has no required query string parameters, use the optional realms parameter to limit the realms returned to a specific set of realms.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getRealmStatus: (region: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Region requests all the region data
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-game-data-api
     */
    class Region {
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
         * Returns an index of regions.
         *
         * @param string region
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getRegionIndex: (region: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a single region by ID.
         *
         * @param string region
         * @param number regionId
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getRegion: (region: string, regionId: number, namespace: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Token requests all the time token data
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-game-data-api
     */
    class Token {
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
         * Returns the WoW Token index.
         *
         * @param string region
         * @param string namespace
         * @param string locale
         *
         * @return Promise
         */
        getTokenIndex: (region: string, namespace: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Achivement requests to retrieve in-game achivement id
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Achievement {
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
         * Returns data about an individual achievement.
         *
         * @param string region
         * @param string id
         * @param string locale
         *
         * @return Promise
         */
        getAchivement: (region: string, id: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Auction request all auction house listed items
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Auction {
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
         * Auction APIs currently provide rolling batches of data about current auctions. Fetching auction dumps is a two-step process that involves checking a per-realm index file to determine if a recent dump has been generated and then fetching the most recently generated dump file (if necessary).
         * This API resource provides a per-realm list of recently generated auction house data dumps.
         *
         * @param string region
         * @param string realm
         * @param string locale
         *
         * @return Promise
         */
        getAuctionData: (region: string, realm: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Boss request all the bosses data or single
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Boss {
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
         * Returns a list of all supported bosses. A "boss" in this context should be considered a boss encounter, which may include more than one NPC.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getMasterList: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * The boss API provides information about bosses. A "boss" in this context should be considered a boss encounter, which may include more than one NPC.
         *
         * @param string region
         * @param string bossId
         * @param string locale
         *
         * @return Promise
         */
        getBoss: (region: string, bossId: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Challenge request all challenge data
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Challenge {
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
         * The request returns data for all nine challenge mode maps (currently). The map field includes the current medal times for each dungeon. Each ladder provides data about each character that was part of each run. The character data includes the current cached specialization of the character while the member field includes the specialization of the character during the challenge mode run.
         *
         * @param string region
         * @param string realm
         * @param string locale
         *
         * @return Promise
         */
        getChallengeRealmLeaderboard: (region: string, realm: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * The region leaderboard has the exact same data format as the realm leaderboards except there is no realm field. Instead, the response has the top 100 results gathered for each map for all of the available realm leaderboards in a region.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getChallengeRegionLeaderboard: (region: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
    * CharacterProfile request all the character profile
    *
    * @author Enigma
    * @package Wow
    * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
    */
    class CharacterProfile {
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
         * The Character Profile API is the primary way to access character information. This API can be used to fetch a single character at a time through an HTTP GET request to a URL describing the character profile resource. By default, these requests return a basic dataset, and each request can return zero or more additional fields.
         * To access this API, craft a resource URL pointing to the desired character for which to retrieve information.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string fields
         * @param string locale
         *
         * @return Promise
         */
        getCharacterProfile: (region: string, realm: string, characterName: string, locale: string, fields?: string | undefined) => Promise<JSON | ApiException>;
        /**
         * Returns a map of achievement data including completion timestamps and criteria information.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getAchivements: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a map of a character's appearance settings, such as which face texture they've selected and whether or not a helm is visible.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getAppearance: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * The character's activity feed.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getFeed: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * A summary of the guild to which the character belongs.
         * If the character does not belong to a guild and this field is requested, this field will not be exposed.
         * When a guild is requested, this resource returns a map with key-value pairs that describe a basic set of guild information. Note that the rank of the character is not included in this block as it describes a guild and not a membership of the guild.
         * To retrieve the character's rank within the guild, make a specific, separate request to the guild profile resource.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getGuild: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of all combat pets the character has obtained.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getHunterPets: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of items equipped by the character. Use of this field will also include the average item level and average item level equipped for the character.
         * When the items field is used, this resource returns a map structure containing information about the character's equipped items as well as their average item level.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getItems: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of all mounts the character has obtained.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getMounts: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of the battle pets the character has obtained.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getPets: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Data about the character's current battle pet slots.
         * The response contains which slot a pet is in and whether the slot is empty or locked.
         * The response also includes the battlePetId, which is unique for the character and can be used to match a battlePetId in the pets field for the character.
         * The ability list is the list of three active abilities on a pet.
         * If the pet is not high enough level for multiple abilities it will always be the pet's first three abilities.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getPetSlots: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of the character's professions. Does not include class professions.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getProfessions: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of raids and bosses indicating raid progression and completeness.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getProgression: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a map of PvP information, including arena team membership and rated battlegrounds information.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getPVP: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of quests the character has completed.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getQuests: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of the factions with which the character has an associated reputation.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getReputations: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a map of character statistics.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getStatistics: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a map of character attributes and stats.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getStats: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of the character's talent structures.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getTalents: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of titles the character has obtained, including the currently selected title.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getTitles: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Raw character audit data that powers the character audit on the game site.
         *
         * @param string region
         * @param string realm
         * @param string characterName
         * @param string locale
         *
         * @return Promise
         */
        getAudit: (region: string, realm: string, characterName: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * GuildProfile request all the guild profile
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class GuildProfile {
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
        * The guild profile API is the primary way to access guild information. This API can fetch a single guild at a time through an HTTP GET request to a URL describing the guild profile resource.
        * By default, these requests return a basic dataset and each request can retrieve zero or more additional fields.
        *
        * @param string region
        * @param string realm
        * @param string guildName
        * @param string locale
        *
        * @return Promise
        */
        getProfile: (region: string, realm: string, guildName: string, locale: string) => Promise<JSON | ApiException>;
        /**
        * Returns a list of characters that are members of the guild. When the members list is requested, a list of character objects is returned.
        * Each object in the returned members list contains a character block as well as a rank field.
        *
        * @param string region
        * @param string realm
        * @param string guildName
        * @param string locale
        *
        * @return Promise
        */
        getMembers: (region: string, realm: string, guildName: string, locale: string) => Promise<JSON | ApiException>;
        /**
        * A set of data structures that describe the achievements earned by the guild. When requesting achievement data, several sets of data will be returned.
        * Read more at blizz web
        *
        * @param string region
        * @param string realm
        * @param string guildName
        * @param string locale
        *
        * @return Promise
        */
        getAchivements: (region: string, realm: string, guildName: string, locale: string) => Promise<JSON | ApiException>;
        /**
        * A set of data structures that describe the guild's news feed. When the news feed is requested, this resource returns a list of news objects.
        * Each one has a type, a timestamp, and some other data depending on the type: itemId, an achievement object, and so on.
        *
        * @param string region
        * @param string realm
        * @param string guildName
        * @param string locale
        *
        * @return Promise
        */
        getNews: (region: string, realm: string, guildName: string, locale: string) => Promise<JSON | ApiException>;
        /**
        * The top three challenge mode guild run times for each challenge mode map.
        *
        * @param string region
        * @param string realm
        * @param string guildName
        * @param string locale
        *
        * @return Promise
        */
        getChallenge: (region: string, realm: string, guildName: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Item requests all the items and specific item data
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
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
         * The item API provides detailed item information, including item set information.
         *
         * @param string region
         * @param number itemId
         * @param string locale
         *
         * @return Promise
         */
        getItem: (region: string, itemId: number, locale: string) => Promise<JSON | ApiException>;
        /**
         * The item API provides detailed item information, including item set information.
         *
         * @param string region
         * @param number setId
         * @param string locale
         *
         * @return Promise
         */
        getItemSet: (region: string, setId: number, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Mount requests all the list of mounts
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Mount {
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
         * Returns a list of all supported mounts.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getMount: (region: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Pet requests all the list of pets
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Pet {
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
         * Returns a list of all supported battle and vanity pets.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getMasterList: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns data about a individual battle pet ability ID. This resource does not provide ability tooltips.
         *
         * @param string region
         * @param string abilityId
         * @param string locale
         *
         * @return Promise
         */
        getAbilities: (region: string, abilityId: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns data about an individual pet species. Use pets as the field value in a character profile request to get species IDs.
         * Each species also has data about its six abilities.
         *
         * @param string region
         * @param string speciesID
         * @param string locale
         *
         * @return Promise
         */
        getSpecs: (region: string, speciesID: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns detailed information about a given species of pet.
         *
         * @param string region
         * @param string speciesID
         * @param number level
         * @param number breedId
         * @param number qualityId
         * @param string locale
         *
         * @return Promise
         */
        getStats: (region: string, speciesID: string, level: number, breedId: number, qualityId: number, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * PVP requests the leaderboars only
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class PvP {
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
         * The Leaderboard API endpoint provides leaderboard information for the 2v2, 3v3, 5v5, and Rated Battleground leaderboards.
         *
         * @param string region
         * @param string bracket
         * @param string locale
         *
         * @return Promise
         */
        getLeaderboards: (region: string, bracket: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Quest requests the quest by id
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Quest {
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
         * Returns metadata for a specified quest.
         *
         * @param string region
         * @param string questId
         * @param string locale
         *
         * @return Promise
         */
        getQuest: (region: string, questId: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Recipe requests single recipe only
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Recipe {
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
         * Returns basic recipe information.
         *
         * @param string region
         * @param string recipeId
         * @param string locale
         *
         * @return Promise
         */
        getRecipe: (region: string, recipeId: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Spell requests all spells information
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Spell {
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
         * Returns information about spells.
         *
         * @param string region
         * @param string spellId
         * @param string locale
         *
         * @return Promise
         */
        getSpell: (region: string, spellId: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * User request to get the user characters list
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class User {
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
         * Returns a list of characters for an account.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getCharacters: (region: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * Zone requests to get all zone details
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class Zone {
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
         * Returns a list of all supported zones and their bosses.
         * A "zone" in this context should be considered a dungeon or a raid, not a world zone.
         * A "boss" in this context should be considered a boss encounter, which may include more than one NPC.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getList: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns information about zones.
         *
         * @param string region
         * @param string zoneId
         * @param string locale
         *
         * @return Promise
         */
        getZoneById: (region: string, zoneId: string, locale: string) => Promise<JSON | ApiException>;
    }
    /**
     * DataResources handles requests for game data (Not binded to any account)
     *
     * @author Enigma
     * @package Wow
     * @link https://develop.battle.net/documentation/api-reference/world-of-warcraft-community-api
     */
    class DataResouces {
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
         * Returns a list of battlegroups for the specified region. Note the trailing / on this request path.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getBattlegrounds: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of races and their associated faction, name, unique ID, and skin.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getCharacterRaces: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of character classes.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getCharacterClasses: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of all achievements that characters can earn as well as the category structure and hierarchy.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getCharacterAchivements: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * The guild rewards data API provides a list of all guild rewards.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getGuildRewards: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of all guild perks.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getGuildPerks: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of all guild achievements as well as the category structure and hierarchy.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getGuildAchivements: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of item classes.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getItemClasses: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of talents, specs, and glyphs for each class.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getTalents: (region: string, locale: string) => Promise<JSON | ApiException>;
        /**
         * Returns a list of the different battle pet types, including what they are strong and weak against.
         *
         * @param string region
         * @param string locale
         *
         * @return Promise
         */
        getPetTypes: (region: string, locale: string) => Promise<JSON | ApiException>;
    }
}
//# sourceMappingURL=wow.d.ts.map