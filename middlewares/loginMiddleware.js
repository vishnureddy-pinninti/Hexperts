const mongoose = require('mongoose');
const User = mongoose.model('users');
const { decrypt } = require('../utils/crypto');
const config = require('../config/keys');
const constants = require('../utils/constants');

module.exports = async(req, res, next) => {
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
    if (req.cookies && req.cookies[COOKIEKEY] && req.headers && req.headers._id) {
        const user = JSON.parse(decrypt(req.cookies[COOKIEKEY]));
        try {
            const dbUser = await User.findById(user._id);
            if (mongoose.Types.ObjectId(req.headers._id).equals(dbUser._id)) {
                req.user = dbUser;
                next();
            }
            else {
                unauthorize();
            }
        }
        catch (e) {
            unauthorize();
        }
    }
    else {
        unauthorize();
    }
};