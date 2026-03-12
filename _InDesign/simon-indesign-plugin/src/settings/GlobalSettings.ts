export enum ServantesEndpointUrl {
    Login = "https://app.servantes.cz/Login/TokenLogin",
    TestServerLogin = "https://columbo-test.neatech.cz/Login/TokenLogin",
    LocalhostLogin = "https://localhost:44344/Login/TokenLogin",
    UploadEpub = "https://simon.servantes.cz/api/Upload/ExternalSource",
    TestServerUploadEpub = "https://simon-test.neatech.cz/api/Upload/ExternalSource",
    LocalhostUploadEpub = "https://localhost:7135/api/Upload/ExternalSource"
}

export const LoginEndpoint = (() => {
    switch (process.env.NODE_ENV) {
        case "test":
            return ServantesEndpointUrl.TestServerLogin;
        case "production":
            return ServantesEndpointUrl.Login;
        default:
            return ServantesEndpointUrl.LocalhostLogin;
    }
})();

export const UploadEndpoint = (() => {
    switch (process.env.NODE_ENV) {
        case "test":
            return ServantesEndpointUrl.TestServerUploadEpub;
        case "production":
            return ServantesEndpointUrl.UploadEpub;
        default:
            return ServantesEndpointUrl.LocalhostUploadEpub;
    }
})();