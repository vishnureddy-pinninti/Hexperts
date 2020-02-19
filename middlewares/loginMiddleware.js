const { decrypt } = require('../utils/crypto');
const config = require('../config/keys');
const constants = require('../utils/constants');

module.exports = (req, res, next) => {
    const COOKIEKEY = config.cookieKey;
    const unauthorize = () => {
        delete req.user;
        res
            .status(403)
            .json({
                error: true,
                response: constants.errors.UNAUTHORIZED,
            });
    };
    if (req.cookies && req.cookies[COOKIEKEY] && req.headers && req.headers.userid) {
        const user = JSON.parse(decrypt(req.cookies[COOKIEKEY]));
        if (req.headers.userid === user.userid) {
            req.user = user;
            next();
        }
        else {
            unauthorize();
        }
    }
    else {
        unauthorize();
    }
};