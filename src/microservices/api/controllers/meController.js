const {
    response200WithData,
    response201WithData,
    response400WithMessage,
    response200,
} = require('../../../common/helpers/expressResHelper');
const User = require('../../../common/models/User');
const Address = require('../../../common/models/Address');

const getInfos = async (req, res) => {
    const adress = await Address.findOne(
        { _id: req.me.personal_information._address },
        ' full_name  address1 address2 zip city state country ',
    );
    const data = {
        id: req.me._id,
        type: req.me.type,
        username: req.me.username,
        email: req.me.email,
        emailStatus: req.me.email_status,
        siret: req.me.personal_information.siret,
        birthDate: req.me.personal_information.birth_date,
        phoneNumber: req.me.personal_information.phone_number,
        siren: req.me.personal_information.siren,
        provider: req.me.provider,
        fullName: adress.full_name,
        address: adress,
    };
    if (req.me._owner && req.me.type === 'Admin') {
        const owner = await User.findOne({ _id: req.me._owner }, '_id username');
        data.owner = owner ? { id: owner._id, name: owner.username } : null;
    }
    response200WithData(res, data);
};

const updateInfos = async (req, res) => {
    const { username, address, fullName } = req.body;
    if (!username && typeof address !== 'object' && address === null && !fullName) {
        return response400WithMessage(res, 'Vous devez mettre à jour au moins une information');
    }
    if (username && username !== req.me.username) {
        const isUserNameUsed = await User.findOne({ username: username, _id: { $ne: req.me } }, '_id');

        if (isUserNameUsed) {
            response400WithMessage(res, "Le nom d'utilisateur est déjà utilisé");
            return;
        }
        req.me.username = username;
    }

    if (fullName) {
        req.me.personal_information.full_name = fullName;
    }

    await req.me.save();

    if (address) {
        const adress = await Address.findOne(
            { _id: req.me.personal_information._address },
            '  address1 address2 zip city state country',
        );
        if (fullName) {
            adress.full_name = fullName;
        }
        if (address.address1) {
            adress.address1 = address.address1;
        }
        if (address.address2) {
            adress.address2 = address.address2;
        }
        if (address.zip) {
            adress.zip = address.zip;
        }
        if (address.city) {
            adress.city = address.city;
        }
        if (address.state) {
            adress.state = address.state;
        }
        if (address.country) {
            adress.country = address.country;
        }

        adress.save();
    }
    response201WithData(res, {});
};

const deleteUser = async (req, res) => {
    req.me.status = 'Inactive';
    req.me.creation_ip = req.clientIp;
    req.me.save();
    response200(res);
};

module.exports = { getInfos, updateInfos, deleteUser };
