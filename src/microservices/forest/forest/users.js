const forest = require('forest-express-mongoose');

//-- Actions

const createAction = {
    name: 'Créer',
    endpoint: 'actions/users',
    type: 'global',
    fields: [
        {
            field: 'userName',
            type: 'String',
            isRequired: false,
        },
        {
            field: 'email',
            type: 'String',
            isRequired: true,
        },
        {
            field: 'password',
            type: 'String',
            isRequired: true,
        },
        {
            field: 'type',
            type: 'Enum',
            enums: ['Admin', 'Owner', 'User'],
            isRequired: true,
        },
        {
            field: '_owner',
            reference: 'User',
            description: 'Uniquement pour le type User',
        },
        {
            field: 'send_invite_email',
            type: 'Boolean',
            description: "Cocher cette case pour envoyer un email d'invitation à la création du compte",
        },
    ],
};

const sendInviteUserEmailAction = {
    name: "Envoyer un email d'invitation",
    endpoint: 'actions/users/sendInviteUserEmail',
    type: 'single',
};

const sendResetPasswordUserEmailAction = {
    name: 'Envoyer un email de changement de mot de passe',
    endpoint: 'actions/users/sendResetPasswordUserEmail',
    type: 'single',
};

forest.collection('User', {
    actions: [createAction, sendInviteUserEmailAction, sendResetPasswordUserEmailAction],
    fields: [],
    segments: [],
});
