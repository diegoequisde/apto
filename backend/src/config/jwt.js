const jwt = require('jsonwebtoken');

const JWT_SECRET =
process.env.JWT_SECRET ||
'apto-secret-dev';

const JWT_EXPIRES = '7d';

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES
};