export default class Bok {
    constructor() {
        // connection variables
        this.hostUrl;
        this.host; // host will be received in base 64
        this.token = 'null'; // custom received token parameter
        this.fts = 'null';

        this.catchHostCall();
    }

    sendMessage(meshName) {
        window.open(
            this.host +
                '?token=' +
                this.token +
                '&fts=' +
                '&nlu=' +
                btoa(meshName)
        );
    }

    catchHostCall() {
        const paramsString = location.search;
        const searchParams = new URLSearchParams(paramsString);

        this.token = searchParams.get('token');
        this.host =
            searchParams.get('host') !== null
                ? atob(searchParams.get('host'))
                : window.location.origin + '/primaindustrie/';
        console.log('Host: ', this.host);
        console.log('Token: ', this.token);
    }

    checkFtsFormat(curretnFts) {
        if (curretnFts !== null) {
            this.fts = btoa(curretnFts);
        }
    }
}
