const CONFIG = require('../config');
const mailchimp = require('@mailchimp/mailchimp_transactional')(CONFIG.settings.mailchimpApiKey);

async function run(email, text, subject, from_email) {
    const message = {
        from_email: from_email,
        subject: subject,
        text: text,
        to: [
            {
                email: email,
                type: 'to',
            },
        ],
    };

    return await mailchimp.messages.send({
        message,
    });
}

module.exports = { run };
