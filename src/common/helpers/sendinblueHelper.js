const SibApiV3Sdk = require('sib-api-v3-sdk');
const logger = require('winston');

const CONFIG = require('../config');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = CONFIG.authentication_credentials.sendinblue.api_key;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
//const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

const sendSmtpEmail = async (emailDef) => {
    try {
        await apiInstance.sendTransacEmail(emailDef);

        logger.info('SendInBlue email sent template ' + emailDef.templateId);

        return true;
    } catch (e) {
        logger.warn('SendInBlue email sending fail template ' + emailDef.templateId + ' : ', e);

        return false;
    }
};

const sendUserConfirmationEmail = async (email, name, tokenizedLink) => {
    const emailDef = {
        to: [{ email: email, name: name }],
        templateId: 4,
        params: {
            name,
            tokenizedLink,
        },
    };

    return await sendSmtpEmail(emailDef);
};

const sendUserResetPasswordEmail = async (email, name, tokenizedLink) => {
    const emailDef = {
        to: [{ email: email, name: name }],
        templateId: 1,
        params: {
            name,
            tokenizedLink,
        },
    };

    return await sendSmtpEmail(emailDef);
};
const sendUserWelcomeEmail = async (email, name, tokenizedLink) => {
    const emailDef = {
        to: [{ email: email, name: name }],
        templateId: 2,
        params: {
            name,
            tokenizedLink,
        },
    };

    return await sendSmtpEmail(emailDef);
};

module.exports = {
    sendSmtpEmail,
    sendUserConfirmationEmail,
    sendUserResetPasswordEmail,
    sendUserWelcomeEmail,
};
