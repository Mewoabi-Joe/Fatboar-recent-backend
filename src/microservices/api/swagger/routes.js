const { register, login, getInfo } = require('./exampleRes');
const {
    response400,
    response401,
    response404,
    response204,
    response201,
} = require('../../../common/swagger/expressRes');

module.exports = {
    '/register': {
        post: {
            tags: ['Register'],
            description:
                "Permet d'ajouter nouveaux utilisateur du type : Admin, User\n" +
                'username pattern :  entre 3 et 30 lettres\n' +
                'password pattern : entre 6 et 256 lettres  ',

            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            username: 'fatboar',
                            password: 'aze123',
                            email: 'contact@fatboar.fr',
                            fullName: 'Toto TITI',
                            type: 'Admin',
                            address: {
                                address1: '5 rue de Paris',
                                address2: 'bat 20',
                                zip: '75000',
                                city: 'Paris',
                                state: 'IDF',
                            },
                            isLegalNoticeAccepted: true,
                            newsLettre: true,
                        },
                    },
                },
            ],
            responses: {
                201: {
                    description: 'Created',
                    schema: register,
                },
                400: response400,
            },
        },
    },
    '/register/social': {
        post: {
            tags: ['Register'],
            description: "Permet d'ajouter nouveaux avec Fb et google, utilisateur du type : Admin, User\n ",
            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            email: 'contact@fatboar.fr',
                            fullName: 'Toto TITI',
                            type: 'Admin',
                            isLegalNoticeAccepted: true,
                            newsLettre: true,
                            provider: 'FACEBOOK',
                        },
                    },
                },
            ],
            responses: {
                201: {
                    description: 'Created',
                    schema: register,
                },
                400: response400,
            },
        },
    },

    '/register/verifyUsername/{username}': {
        get: {
            tags: ['Register'],
            description: 'Permet de verifier username',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'path',
                    name: 'username',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },
    '/register/verifyEmail/{email}': {
        get: {
            tags: ['Register'],
            description: 'Permet de verifier email',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'path',
                    name: 'email',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },
    '/auth/login': {
        post: {
            tags: ['Auth'],
            description: "Permet identifier l'utilisateur avec son username ou email",
            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            identifier: 'contact@fatboar.fr',
                            password: 'aze123',
                        },
                    },
                },
            ],
            responses: {
                201: {
                    description: 'Created',
                    schema: login,
                },
                400: response400,
            },
        },
    },
    '/auth/loginSocial': {
        post: {
            tags: ['Auth'],
            description: "Permet identifier l'utilisateur avec son réseaux sociaux \n provider: ['GOOGLE', 'FACEBOOK']",
            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            email: 'contact@fatboar.fr',
                            fullName: 'Titi TATA',
                            provider: 'FACEBOOK',
                        },
                    },
                },
            ],
            responses: {
                201: {
                    description: 'Created',
                    schema: login,
                },
                400: response400,
            },
        },
    },
    '/auth/refreshToken': {
        post: {
            tags: ['Auth'],
            description: 'Permet obtenir nouveau token avec le refrech token',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            refreshToken: 'XXXXXX',
                        },
                    },
                },
            ],
            responses: {
                201: response201,
                400: response400,
            },
        },
    },
    '/auth/requestResetPassword': {
        get: {
            tags: ['Auth'],
            produces: ['application/json'],
            parameters: [
                {
                    in: 'query',
                    name: 'email',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                204: response204,
                404: response404,
            },
        },
    },
    '/auth/resetPassword': {
        post: {
            tags: ['Auth'],
            description: 'Permet identifier reset son mot de passe avec le email ou username',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            verificationToken: 'XXXXXXX',
                            password: 'aze123',
                        },
                    },
                },
            ],
            responses: {
                204: response204,
                404: response404,
            },
        },
    },
    '/account/mailChimp': {
        post: {
            tags: ['account'],
            description: 'mailChimp',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            email: 'info@fatboar.fr',
                            text: 'Welcome to Mailchimp Transactional!',
                            from_email: 'contact@fatboar.fr',
                            subject: 'Hello world',
                        },
                    },
                },
            ],
            responses: {
                201: {
                    description: 'Created',
                },
                400: response400,
            },
        },
    },
    '/account/sendinblue': {
        post: {
            tags: ['account'],
            description: 'sendinblue',
            produces: ['application/json'],

            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            userId: 'XXXXX',
                        },
                    },
                },
            ],
            responses: {
                201: {
                    description: 'Created',
                },
                400: response400,
            },
        },
    },
    '/me': {
        get: {
            tags: ['Me'],
            description: 'Permet de récuper utilisateur information ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'Ok',
                    schema: getInfo,
                },
                400: response400,

                401: response401,
            },
        },
    },
    '/me/updateInfos': {
        put: {
            tags: ['Me'],
            description: 'Permet de modifier utilisateur information ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            username: 'fatboar',
                            email: 'contact@fatboar.fr',
                            fullName: 'Toto TITI',
                            address: {
                                address1: '5 rue de Paris',
                                address2: 'bat 20',
                                zip: '75000',
                                city: 'Paris',
                                state: 'IDF',
                                country: 'France',
                            },
                        },
                    },
                },
            ],
            responses: {
                201: {
                    description: 'Created',
                },
                400: response400,
            },
        },
    },
    '/me/delete': {
        delete: {
            tags: ['Me'],
            description: 'Permet de supprimer compte ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'Ok',
                },
                400: response400,
                401: response401,
            },
        },
    },
    '/owner/verifyUsername/{username}': {
        get: {
            tags: ['Owner'],
            description: 'Permet de verifier username',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'path',
                    name: 'username',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },
    '/owner/addOwner': {
        post: {
            tags: ['Owner'],
            description: "Permet d'ajouter  owner to admin with her username",
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            username: 'fatboar-burger',
                        },
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Ok',
                },
                400: response400,

                401: response401,
            },
        },
    },

    '/owner/deleteOwner': {
        delete: {
            tags: ['Owner'],
            description: 'Permet de supprimer compte ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'Ok',
                },
                400: response400,
                401: response401,
            },
        },
    },

    '/games': {
        get: {
            tags: ['Games'],
            description: 'Permet de récuper ticket ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'Ok',
                },
                400: response400,

                404: response404,

                401: response401,
            },
        },
    },
    '/games/historic': {
        get: {
            tags: ['Games'],
            description: 'Permet de récuper historique list des tickets ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'Ok',
                },
                400: response400,

                404: response404,

                401: response401,
            },
        },
    },
    '/games/checkTicket': {
        post: {
            tags: ['Games'],
            description: 'Permet de verifier le ticket ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        example: {
                            token: '5GNWV1YOMA',
                        },
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Ok',
                },
                400: response400,

                404: response404,

                401: response401,
            },
        },
    },
    '/admin/users': {
        get: {
            tags: ['Admin'],
            description: 'Permet de recuper utlisateur  ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'query',
                    name: 'offset',
                    schema: {
                        type: 'integer',
                    },
                },
                {
                    in: 'query',
                    name: 'limit',
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },
    '/admin/tickets': {
        get: {
            tags: ['Admin'],
            description: 'Permet de recuper tous les tickts \n status  Pending, Used  ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'query',
                    name: 'offset',
                    schema: {
                        type: 'integer',
                    },
                },
                {
                    in: 'query',
                    name: 'limit',
                    schema: {
                        type: 'integer',
                    },
                },
                {
                    in: 'query',
                    name: 'status',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },
    '/admin/byId/{id}': {
        get: {
            tags: ['Admin'],
            description: 'Permet de recuper utlisateur avec id ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },

    '/admin/byIdentifier/{identifier}': {
        get: {
            tags: ['Admin'],
            description: 'Permet de recuper utlisateur avec username ou email ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],
            parameters: [
                {
                    in: 'path',
                    name: 'identifier',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },
    '/admin/winner': {
        get: {
            tags: ['Admin'],
            description: 'Permet de recuper utlisateur avec username ou email ',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'OK',
                },
                401: response401,
            },
        },
    },
    '/statistic': {
        get: {
            tags: ['Admin'],
            description: ' to get ticket statistic',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'OK',
                },
                400: response400,
                401: response401,
            },
        },
    },
    '/statistic/getCarWinner': {
        get: {
            tags: ['Admin'],
            description: ' to get car winner  statistic',
            produces: ['application/json'],
            security: [
                {
                    JwtAuthorization: [],
                },
            ],

            responses: {
                200: {
                    description: 'OK',
                },
                400: response400,
                401: response401,
            },
        },
    },
};
