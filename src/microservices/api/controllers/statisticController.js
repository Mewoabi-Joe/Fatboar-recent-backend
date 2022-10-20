const { response200WithData, response400WithMessage } = require('../../../common/helpers/expressResHelper');
const Ticket = require('../../../common/models/Ticket');
const User = require('../../../common/models/User');
const getStatistic = async (req, res) => {
    try {
        let owner;
        if (req.me.type === 'Owner') {
            owner = req.me;
        } else {
            owner = await User.findOne(
                {
                    status: 'Active',
                    _id: req.me._owner,
                },
                '_id type ',
            );
        }
        if (!owner) {
            return response400WithMessage(res, 'Propriétaire introuvable');
        }
        const tickets = await Ticket.find({ status: 'Used', _owner: owner.id }).sort({ creation_date: -1 });
        const response = {
            title: 'List of used tickets, ',
            type: 'ColumnChart',
            options: {
                isStacked: true,
            },
            columns: ['Month', 'Tickets'],
            width: 500,
            height: 400,
        };
        const yearList = {};
        for (let item of tickets) {
            const month = item.creation_date.toLocaleString('default', { month: 'long' });
            const year = item.creation_date.getFullYear();

            if (!yearList[year]) {
                yearList[year] = [];
            }
            const x = yearList[year].find((o) => o[0] === month);
            if (x) {
                const number = x[1] + 1;
                const index = yearList[year].findIndex((e) => e[0] === x[0]);
                yearList[year][index] = [month, number];
            } else {
                yearList[year].push([month, 1]);
            }
        }
        response.data = Object.entries(yearList);
        response200WithData(res, response);
    } catch (e) {
        response400WithMessage(res, e.message);
    }
};
const getCarWinner = async (req, res) => {
    try {
        let owner;
        if (req.me.type === 'Owner') {
            owner = req.me;
        } else {
            owner = await User.findOne(
                {
                    status: 'Active',
                    _id: req.me._owner,
                },
                '_id type ',
            );
        }
        if (!owner) {
            return response400WithMessage(res, 'Propriétaire introuvable');
        }
        const response = {
            title: 'List of car winners, ',
            type: 'ColumnChart',
            options: {
                isStacked: true,
            },
            columns: ['Month', 'Winners'],
            width: 500,
            height: 400,
        };
        const users = await User.find({ car_winner: true }, 'car_winner car_winner_date');
        if (!users) {
            return response400WithMessage(res, 'Utilisateur non trouvé');
        }
        const yearList = {};
        for (let item of users) {
            const month = item.car_winner_date.toLocaleString('default', { month: 'long' });
            const year = item.car_winner_date.getFullYear();

            if (!yearList[year]) {
                yearList[year] = [];
            }
            const x = yearList[year].find((o) => o[0] === month);
            if (x) {
                const number = x[1] + 1;
                const index = yearList[year].findIndex((e) => e[0] === x[0]);
                yearList[year][index] = [month, number];
            } else {
                yearList[year].push([month, 1]);
            }
        }
        response.data = Object.entries(yearList);

        response200WithData(res, response);
    } catch (e) {
        response400WithMessage(res, e.message);
    }
};
module.exports = { getStatistic, getCarWinner };
