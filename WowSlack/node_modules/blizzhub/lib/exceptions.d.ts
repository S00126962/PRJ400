declare namespace BlizzardTypo {
    /**
     * Exception for promise rejection at http request
     */
    interface ApiException {
        code?: number;
        type?: string;
        message?: string;
    }
}
export = BlizzardTypo;
