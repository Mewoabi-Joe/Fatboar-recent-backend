const {
    response200WithData,
    response404WithMessage,
    response400WithMessage,
    response204,
} = require('../../../common/helpers/expressResHelper');
const { generateRandomInt } = require('../../../common/helpers/randomHelper');
const User = require('../../../common/models/User');
const Ticket = require('../../../common/models/Ticket');
const Counter = require('../../../common/models/Counter');
const Address = require('../../../common/models/Address');

const getWinnerTicket = async (res, ticket) => {
    if (!ticket || ticket.length === 0) {
        response400WithMessage(res, 'pas des tickets disponibles');
        return;
    }

    // remove duplicate
    const usersId = ticket.map((o) => o._user).distinct();
    const ticketList = ticket.filter((x) => usersId.includes(x._user));
    const i = generateRandomInt(ticketList.length - 1, 0);

    if (ticketList[i] && ticketList[i]._user) {
        const user = await User.findOne(
            { status: 'Active', type: 'User', _id: ticket[i]._user },
            '_id email username personal_information',
        );
        if (!user) {
            return response400WithMessage(res, 'Utilisateur introuvable , veuillez réessayer');
        }
        user.car_winner = true;
        user.car_winner_date = Date.now();
        await user.save();
        const counter = await Counter.findOne({ _id: ticket[i]._counter });
        return response200WithData(res, { ticket: ticket[i], user, counter });
    }
    return response400WithMessage(res, 'Ce ticket sans utilisateur, veuillez réessayer');
};

const winner = async (req, res) => {
    let ticket = null;
    if (!req.me._owner && req.me.type === 'Admin') {
        return response400WithMessage(res, "S'il vous plaît ajouter le propriétaire");
    }
    if (req.me.type === 'Owner') {
        ticket = await Ticket.find({ status: 'Used', _owner: req.me._id }).sort({ creation_date: -1 });
        return await getWinnerTicket(res, ticket);
    }
    ticket = await Ticket.find({ status: 'Used', _owner: req.me._owner }).sort({ creation_date: -1 });
    return await getWinnerTicket(res, ticket);
};

const tickets = async (req, res) => {
    let ticket;

    if (!req.query.status) {
        ticket = await Ticket.find().sort({ creation_date: -1 }).skip(req.query.offset).limit(req.query.limit);
        if (!ticket || ticket.length === 0) {
            response204(res);
            return;
        }
        return response200WithData(res, ticket);
    }
    ticket = await Ticket.find({ status: req.query.status })
        .sort({ creation_date: -1 })
        .skip(req.offset)
        .limit(req.limit);
    if (!ticket || ticket.length === 0) {
        response204(res);
        return;
    }
    return response200WithData(res, ticket);
};
const users = async (req, res) => {
    //         .populate('_user')
    const users = await User.find({
        status: 'Active',
        type: 'User',
    })
        .sort({ creation_date: -1 })
        .skip(req.offset)
        .limit(req.limit);
    if (!users || users.length === 0) {
        response204(res);
        return;
    }
    return response200WithData(res, users);
};
const byIdentifier = async (req, res) => {
    const { identifier } = req.params;
    let user;
    user = await User.findOne(
        { status: 'Active', username: identifier },
        '_id type email_status  email personal_information',
    );
    if (!user) {
        user = await User.findOne(
            { status: 'Active', email: identifier },
            '_id  type  email_status username personal_information',
        );
    }

    if (!user) {
        response404WithMessage(res, 'Utilisateur non trouvé');
        return;
    }
    const adress = await Address.findOne(
        { _id: user.personal_information._address },
        ' full_name  address1 address2 zip city state country ',
    );
    const data = {
        id: user._id,
        type: user.type,
        username: user.username,
        email: user.email,
        emailStatus: user.email_status,
        siret: user.personal_information.siret,
        siren: user.personal_information.siren,
        fullName: adress.full_name,
        address: adress,
    };
    if (user._owner && user.type === 'Admin') {
        const owner = await User.findOne({ _id: user._owner }, '_id username');
        data.owner = owner ? { id: owner._id, name: owner.username } : null;
    }
    response200WithData(res, data);
};
const byId = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne(
        { status: 'Active', _id: id },
        '_id  type  email_status email username personal_information',
    );
    if (!user) {
        response404WithMessage(res, 'Utilisateur non trouvé');
        return;
    }
    const adress = await Address.findOne(
        { _id: user.personal_information._address },
        ' full_name  address1 address2 zip city state country ',
    );
    const data = {
        id: user._id,
        type: user.type,
        username: user.username,
        email: user.email,
        emailStatus: user.email_status,
        siret: user.personal_information.siret,
        siren: user.personal_information.siren,
        fullName: adress.full_name,
        address: adress,
    };
    if (user._owner && user.type === 'Admin') {
        const owner = await User.findOne({ _id: user._owner }, '_id username');
        data.owner = owner ? { id: owner._id, name: owner.username } : null;
    }
    response200WithData(res, data);
};

module.exports = { byIdentifier, byId, users, tickets, winner };
