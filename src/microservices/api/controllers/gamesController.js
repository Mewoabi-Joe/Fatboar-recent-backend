const {
    response200WithData,
    response404WithMessage,
    response400WithMessage,
    response201WithData,
    response204,
} = require('../../../common/helpers/expressResHelper');
const { generateTicketToken, generateRandomInt } = require('../../../common/helpers/randomHelper');
const moment = require('moment');
const Ticket = require('../../../common/models/Ticket');
const Counter = require('../../../common/models/Counter');
const CONFIG = require('../../../common/config');

const getCounter = async (id) => {
    const counter = await Counter.findOne(
        {
            status: 'Started',
            _owner: id,
        },
        '_id  creation_date number ',
    );
    if (!counter) {
        return new Counter({
            number: 0,
            _owner: id,
            status: 'Started',
        });
    }
    return counter;
};
const generatorTicket = async (owner, res) => {
    const counter = await getCounter(owner._id);
    if (!counter) {
        return response400WithMessage(res, 'Compteur introuvable');
    }
    if (counter.number > CONFIG.settings.ticket_number_max) {
        return response400WithMessage(res, 'Nous obtenons le nombre maximum de tickets');
    }
    const date = moment(counter.creation_date).add(1, 'month');
    if (moment(counter.creation_date).isAfter(date)) {
        return response400WithMessage(res, `Le jeu est fini ${moment(counter.creation_date).format('LLL')}`);
    }
    counter.number = counter.number + 1;
    await counter.save();
    let ticket = await generateTicketToken(owner);
    const newticket = new Ticket({
        token: ticket.text,
        expiration: ticket.expiration,
        number: counter.number,
        _owner: owner._id,
        _counter: counter._id,
        status: 'Pending',
    });
    await newticket.save();
    return response200WithData(res, { ticket: ticket.text, expiration: newticket.expiration });
};
const getTicket = async (req, res) => {
    if (req.me.type === 'Admin' && !req.me._owner) {
        return response404WithMessage(res, "Le propriétaire n'a pas trouvé s'il vous plaît ajouter un");
    }
    if (req.me.type === 'Owner') {
        return await generatorTicket(req.me, res);
    }

    return await generatorTicket(req.me._owner, res);
};
const checkTicket = async (req, res) => {
    const { token } = req.body;

    const ticket = await Ticket.findOne(
        {
            token: token,
        },
        'expiration number status creation_date award update_date',
    )
        .populate('_owner', '_id  username  email personal_information ')
        .populate('_user', '_id  username  email personal_information ');

    if (!ticket) {
        return response400WithMessage(res, 'Ticket non trouvé ou utilisé');
    }
    if (ticket.status === 'Pending' && req.me.type === 'User') {
        const currentDate = new Date();
        if (moment(currentDate).isAfter(ticket.expiration)) {
            return response400WithMessage(
                res,
                `La date du billet est expirée ${moment(ticket.expiration).format('LLL')}`,
            );
        }
        const i = generateRandomInt(5, 0);

        let text;
        switch (i) {
            case 0:
                text = 60;
                break;
            case 1:
                text = 20;
                break;
            case 2:
                text = 10;
                break;
            case 3:
                text = 6;
                break;
            default:
                text = 4;
        }
        ticket.status = 'Used';
        ticket.update_date = currentDate;
        ticket._user = req.me._id;
        ticket.award = text;
        await ticket.save();
        const data = {
            expiration: ticket.expiration,
            number: ticket.number,
            owner: !ticket._owner
                ? null
                : {
                      fullName: ticket._owner.personal_information.full_name,
                      username: ticket._owner.username,
                      email: ticket._owner.email,
                  },
            status: ticket.status,
            creationDate: ticket.creation_date,
            updateDate: ticket.update_date,
            award: ticket.award,
        };
        response200WithData(res, data);
    }
    const data = {
        expiration: ticket.expiration,
        number: ticket.number,
        owner: !ticket._owner
            ? null
            : {
                  fullName: ticket._owner.personal_information.full_name,
                  username: ticket._owner.username,
                  email: ticket._owner.email,
              },
        status: ticket.status,
        creationDate: ticket.creation_date,
        user: !ticket._user
            ? null
            : {
                  fullName: ticket._user.personal_information.full_name,
                  username: ticket._user.username,
                  email: ticket._user.email,
              },
        award: ticket.award,
        updateDate: ticket.update_date,
    };
    return response201WithData(res, data);
};

const getHistoric = async (req, res) => {
    const filtre = {
        status: 'Used',
    };
    if (req.me.type === 'User') {
        filtre._user = req.me.id;
    }
    if (req.me.type === 'Owner') {
        filtre._owner = req.me.id;
    }
    if (req.me.type === 'Admin') {
        if (!req.me._owner) {
            return response400WithMessage(res, 'Propriétaire introuvable');
        }
        filtre._owner = req.me._owner;
    }
    const tickets = await Ticket.find(filtre).populate('_owner', '_id  username  email personal_information ');
    if (!tickets || tickets.length === 0) {
        return response204(res);
    }
    const ticketsList = [];
    for (const element of tickets) {
        const ticket = {};
        ticket.creation_date = element.creation_date;
        ticket.update_date = element.update_date;
        ticket.expiration = element.expiration;
        ticket.owner = element._owner;
        ticket.award = element.award;
        ticket.counter = await Counter.findOne(
            {
                _owner: ticket.owner._id,
            },
            '_id  number creation_date status update_date ',
        );
        ticketsList.push(ticket);
    }
    response200WithData(res, { ticketsList });
};

module.exports = { getTicket, checkTicket, getHistoric };
