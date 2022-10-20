module.exports = {
    project_name: 'Fatboar-Burger',
    version: '1.0.0',
    //initially all envs were prod
    // env_type: 'prod',
    // env_name: 'prod',
    // node_env: 'prod',
    env_type: 'dev',
    env_name: 'dev',
    node_env: 'dev',
    authentication_credentials: {
        mongodb: {
            //initially host was mongo
            // host: 'mongo',
            host: 'localhost',
            staging_host: 'stagging_mongo',
            prod_host: 'prod_mongoDb',
            port: 27017,
            //Initially what was commented
            db: 'cluster0',
            user: 'joe',
            password: 'joepass',
            // db: 'fatbord_burger',
            // user: 'fatboar-burger',
            // password: 'fatboar123',
        },
        basic_auth: { amine: '$2y$10$9kfDSinGJYD5U41qpLHQS.Ue1UGd9JavAgx5B7vyHKNIipGZd3uhu' },

        jwt: {
            secret: 'aze123',
        },
        sendinblue: {
            api_key: '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',
        },
        forest: {
            local: {
                env_secret: '413cec6c359e0e284161b46289a027701686e117437d3538e73c29905bfc347b',
                auth_secret: '08633630be36a9da07df8a9cc5bbdb0eed4dfd5dd2aaccaa',
            },
            dev: {
                env_secret: '7820d5088d7ec6683fc401629146ca2cd7ff97fb8743c963139f84ac0adb600f',
                auth_secret: '5e474f494df62ebb022872c2059093a17c777748c8c4405b',
                DATABASE_URL: 'express_mongoose://stagging_mongo:27017/fatbord_burger',
            },
            prod: {
                env_secret: '65eb01d73db7a59970f8b51858897bb6fcf5c98f247f5d5c1c893da657f8c854',
                auth_secret: '172ab4fcdcfd1c4c2679921ca6a545308c1c659d661fa117',
                DATABASE_URL: 'express_mongoose://prod_mongoDb:27017/fatbord_burger',
            },
        },
    },
    settings: {
        user_auth_jwt_lifetime: 3600, // = 1 heure
        ticket_jwt_lifetime: 2628000, // = 1 mois
        user_refresh_jwt_lifetime: 15778800, // ~= 6 mois
        extract_data_max_limit: 10000,
        zip_number: 5,
        siret_number: 14,
        siren_number: 9,
        authorized_phone_country: ['FR', 'BE'],
        default_phone_country: 'FR',
        minimum_age_of_use: 15,
        ticket_number_max: 1500000,
        phone_verification_token_lifetime: 600, // = 10 minutes
        user_verification_token_lifetime: 259200, // sec => 72h
        email_verification_token_lifetime: 2628000, // = 1 mois
        account_type: ['Admin', 'Owner', 'User'],
        provider_type: ['GOOGLE', 'FACEBOOK'],
        mailchimpApiKey: 'OFYSvnIbBL0pjSBUKmEV9A',
        angular_app_url: 'https://staging.fatboar.fr',
    },
    logs: {
        console: true,
        file: true,
    },
    services: {
        api: {
            http: {
                //Initially /docs was protected
                // protected_routes: ['/docs'],
                protected_routes: ['/norouteisprotected'],
                max_request_body_size: '100mb',
                external_url: 'https://staging-api.fatboar.fr/',
            },
            url_base_path: '/',
        },
        forest: {
            http: {
                max_request_body_size: '100mb',
                local_external_url: 'http://localhost:3002',
                staging_external_url: 'https://forest-dev.fatboar.fr',
                prod_external_url: 'https://forest.fatboar.fr',
            },
        },
    },
};
