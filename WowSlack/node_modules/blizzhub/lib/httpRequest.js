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
    class HttpRequest {
    }
    /**
     * Performs a simple get request by the given URL
     *
     * @param string url
     *
     * @return Promise
     */
    HttpRequest.get = (url) => {
        return new Promise((resolve, reject) => {
            //Cache the last response and check for the URL
            if (typeof HttpRequest._last != 'undefined' &&
                url === HttpRequest._last.url)
                resolve(HttpRequest._last.data);
            //Perform the request
            request.get(url, { resolveWithFullResponse: true })
                .then(res => {
                HttpRequest._last = {
                    data: res.body,
                    url: url,
                    headers: res.headers,
                    statusCode: 200,
                    date: Date.now()
                };
                resolve(res.body);
            })
                .catch(e => {
                reject(e.error);
            });
        });
    };
    BlizzardTypo.HttpRequest = HttpRequest;
})(BlizzardTypo || (BlizzardTypo = {}));
module.exports = BlizzardTypo;
