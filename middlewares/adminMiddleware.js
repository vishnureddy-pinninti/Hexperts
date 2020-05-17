const { errors } = require('../utils/constants');

module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res
            .status(403)
            .json({
                error: true,
                response: errors.UNAUTHORIZED,
            });
    }
    return next();
};