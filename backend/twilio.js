const twilio = require('twilio');
const VoiceResponse = require('twilio/lib/twiml/VoiceResponse');
const dotenv = require('dotenv').config();

class Twilio {
    phoneNumber = process.env.PHONE_NUMBER;
    phoneNumberSid = process.env.PHONE_NUMBER_SID;
    tokenSid = process.env.TOKEN_SID;
    tokenSecret = process.env.TOKEN_SECRET;
    accountSid = process.env.ACCOUNT_SID;
    verify = process.env.VERIFY;
    clientAppSid = process.env.CLIENT_APP_SID;
    client;
    constructor() {
        this.client = twilio(this.tokenSid, this.tokenSecret, { accountSid: this.accountSid })
    }

    getTwilio = () => this.client

    sendVerifyAsync = async (to, channel) => {
        const data = await this.client.verify.services(this.verify).verifications.create({
            to,
            channel
        })
        return data;
    }

    verifyCodeAsync = async (to, code) => {
        const data = await this.client.verify.services(this.verify).verificationChecks.create({
            to,
            code
        })
        return data;
    }

    voiceResponse = (message) => {
        const twiml = new VoiceResponse();
        twiml.say(
            {
                voice: 'Polly.Amy',
            },
            message
        );
        twiml.redirect('https://twilio-call-center-server.herokuapp.com/enqueue')
        return twiml;
    }

    enqueueCall = (queueName) => {
        const twim = new VoiceResponse();
        twim.enqueue(queueName);
        return twim;
    }

    getAccessTokenForVoice = (identity) => {
        console.log(`Access token for ${identity}`)
        const AccessToken = twilio.jwt.AccessToken;
        const VoiceGrant = AccessToken.VoiceGrant;

        const clientAppSid = this.clientAppSid;

        const voiceGrant = new VoiceGrant({
            clientAppSid,
            incomingAllow: true,
        });
        const token = new AccessToken(
            this.accountSid,
            this.tokenSid,
            this.tokenSecret,
            {identity}
        );
        token.addGrant(voiceGrant);
        console.log('Access granted with JWT')
        return (token.toJwt());
    }

}

const instance = new Twilio();
Object.freeze(instance)

module.exports = instance;
