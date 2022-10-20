const csv = require('csv-parser');
const fs = require('fs');

const { parseNumber } = require('./formatHelper');

const parseDataset = (dataset, filepath) => {
    const data = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('error', (error) => {
                reject(error);
            })
            .on('data', (row) => {
                const item = {
                    _dataset: dataset._id,
                    date: new Date(parseNumber(row.time)),
                    data: {},
                    dataset_name: dataset.name,
                    period_refs: {
                        ...dataset._period.refs,
                        // _dataset: dataset._id,
                        // _period: dataset._period._id,
                        // _gateway: dataset._period._gateway,
                        // _owner: dataset._period._owner,
                        // _vehicle: dataset._period._vehicle,
                        // _vehicleFleet: dataset._period._vehicleFleet,
                    },
                    creation_date: new Date(),
                };

                Object.entries(row).forEach(([key, value]) => {
                    if (value === '' || value === 'null') {
                        item.data[key] = null;
                        return;
                    }

                    if (value === 'true') {
                        item.data[key] = true;
                        return;
                    }

                    if (value === 'false') {
                        item.data[key] = false;
                        return;
                    }

                    if (parseNumber(value) !== undefined) {
                        item.data[key] = parseNumber(value);
                        return;
                    }

                    item.data[key] = value;
                });

                data.push(item);
            })
            .on('end', () => {
                resolve(data);
            });
    });
};

module.exports = {
    parseDataset,
};
