import io from 'socket.io-client'

class Socket {
    url = 'https://twilio-call-center-server.herokuapp.com';
    client = null;

    constructor() {
        this.client = io.connect(this.url);
    }

    addToken = (token) => {
        this.client = io.connect(this.url, {
            query: { token }
        });
    }

    removeToken = () => {
        this.client = io.connect(this.url)
    }
}

const instance = new Socket();

export default instance;
