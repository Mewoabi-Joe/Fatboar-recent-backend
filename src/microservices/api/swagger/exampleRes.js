const register = {
    example: {
        data: {
            id: '5f8b31f641XXXX',
            username: 'fatboar',
            status: 'Active',
        },
    },
};
const login = {
    example: {
        data: {
            user: {
                id: '5f8b31f641e81f002a415a22',
                type: 'Admin',
                username: 'fatboar',
                email: 'contact@fatboar.fr',
            },
            authToken: 'eyJhbGciOXXXXXXXXX',
            authExpiration: '2020-10-17T20:05:40.000Z',
            refreshToken: 'eyJhbGciOXXXXXXX',
            refreshExpiration: '2021-04-18T10:05:40.000Z',
        },
    },
};
const getInfo = {
    example: {
        data: {
            id: '5f8b31f6XXX',
            type: 'Admin',
            username: 'fatboar',
            email: 'contact@fatboar.fr',
            full_name: 'Toto TITI',
            adress: {
                _id: '5f8b31f641e81f002a415a21',
                address1: '5 rue de Paris',
                address2: 'bat 20',
                zip: '75000',
                city: 'Paris',
                state: 'IDF',
                country: 'France',
            },
        },
    },
};

module.exports = {
    register,
    login,
    getInfo,
};
