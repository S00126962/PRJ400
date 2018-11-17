import { ApiException } from './exceptions';
declare namespace BlizzardTypo {
    class HttpRequest {
        /**
         * Holds the last request data
         */
        private static _last;
        /**
         * Performs a simple get request by the given URL
         *
         * @param string url
         *
         * @return Promise
         */
        static get: (url: string) => Promise<JSON | ApiException>;
    }
}
export = BlizzardTypo;
