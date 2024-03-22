import to from 'await-to-js';
import axios from 'axios';

export default class Server {
    constructor() {
        this.addHtmlInterceptor();
    }

    addHtmlInterceptor = () => {
        axios.interceptors.response.use(
            response => {
                // Check the Content-Type of the response
                const contentType = response.headers['content-type'];

                // If the Content-Type is not application/json, throw an error or handle as needed
                if (!contentType.includes('application/json')) {
                    // Example: Reject the promise with a custom error
                    return Promise.reject(
                        new Error('Unexpected content type: ' + contentType)
                    );
                }

                return response;
            },
            error => {
                // Handle error
                return Promise.reject(error);
            }
        );
    };

    axiosCall = async allData => {
        const { url, config } = allData;

        const [err, res] = await to(axios(url, config));

        return [err, res];
    };
}
