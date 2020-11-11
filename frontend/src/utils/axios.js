import axios from 'axios';

export default axios.create({
    baseURL: 'https://twilio-call-center-server.herokuapp.com',
    responseType: "json"
})
