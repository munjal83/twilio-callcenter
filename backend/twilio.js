const twilio = require('twilio');
const dotenv = require('dotenv').config();

class Twilio {
    phoneNumber = process.env.PHONE_NUMBER;
    phoneNumberSid = process.env.PHONE_NUMBER_SID;
    tokenSid = process.env.TOKEN_SID;
    tokenSecret = process.env.TOKEN_SECRET;
    accountSid = process.env.ACCOUNT_SID;
    verify = process.env.VERIFY;
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
        console.log('verifyingCode', data)
        return data;
    }

}

const instance = new Twilio;
Object.freeze(instance)

module.exports = instance;
