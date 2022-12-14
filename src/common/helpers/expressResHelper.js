const logger = require('winston');

//-- 200 OK

//-- ne pas utiliser sauf exeption (ex: forest)
const response200 = (res, body) => {
    res.status(200).json(body);
};

const response200WithData = (res, data) => {
    res.status(200).json({
        data,
    });
};

const response200WithMessage = (res, message) => {
    res.status(200).json({
        message,
    });
};

const response200WithDataAndMessage = (res, data, message) => {
    res.status(200).json({
        data,
        message,
    });
};

const response200WithCsvFile = (res, data, filename) => {
    const csv = data.map((o) => o.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);

    res.status(200).end(csv);
};

//-- 201 Created

const response201WithData = (res, data) => {
    res.status(201).json({
        data,
    });
};

const response201WithMessage = (res, message) => {
    res.status(201).json({
        message,
    });
};

const response201WithDataAndMessage = (res, data, message) => {
    res.status(201).json({
        data,
        message,
    });
};

//-- 204 No Content

const response204 = (res) => {
    res.status(204).send();
};

//-- 400 Bad Request

//-- ne pas utiliser sauf exeption (ex: forest)
const response400 = (res, body) => {
    res.status(400).json(body);
};

const response400WithMessage = (res, message) => {
    res.status(400).json({
        message,
    });
};

const response400WithMessageAndCode = (res, message, code) => {
    res.status(400).json({
        message,
        code,
    });
};

const response400WithCode = (res, code) => {
    res.status(400).json({
        code,
    });
};
//-- 401 Unauthorized

const response401WithMessage = (res, message) => {
    res.status(401).json({
        message,
    });
};

//-- 403 Forbidden

const response403WithMessage = (res, message) => {
    res.status(403).json({
        message,
    });
};

const response403WithMessageAndCode = (res, message, code) => {
    res.status(403).json({
        message,
        code,
    });
};

//-- 404 Not Found

const response404WithMessage = (res, message) => {
    res.status(404).json({
        message,
    });
};

//-- 500 Internal Server Error

const response500WithMessage = (res, message) => {
    logger.error('HTTP 500 - ' + message);
    res.status(500).json({
        message,
    });
};

module.exports = {
    response200,
    response200WithData,
    response200WithMessage,
    response200WithDataAndMessage,
    response200WithCsvFile,
    response201WithData,
    response201WithMessage,
    response201WithDataAndMessage,
    response204,
    response400,
    response400WithMessage,
    response400WithMessageAndCode,
    response400WithCode,
    response401WithMessage,
    response403WithMessage,
    response403WithMessageAndCode,
    response404WithMessage,
    response500WithMessage,
};
