const mongoose = require('mongoose');
const User = mongoose.model('users');

const { encrypt } = require('../utils/crypto');
const config = require('../config/keys');
const loginMiddleware = require('../middlewares/loginMiddleware');
const { errors: { USER_NOT_FOUND } } = require('../utils/constants');

module.exports = (app) => {
    app.post('/api/v1/user.read', async(req, res) => {
        const {
            displayName,
            id,
            jobTitle,
            mail,
        } = req.body;

        try {
            const user = await User.findOne({ userid: id });

            if (user) {
                // Create cookie and send the response back
                const d1 = new Date();
                d1.setHours(d1.getHours() + 240);
                const cookieOptions = {
                    httpOnly: true,
                    expires: d1,
                };
                cookieOptions.path = '/';
                res
                    .cookie(config.cookieKey, encrypt(JSON.stringify(user)), cookieOptions);

                res
                    .status(200)
                    .json(user);
            }
            else {
                // Create new user
                const newUser = new User({
                    name: displayName,
                    email: mail,
                    jobTitle,
                    userid: id,
                });

                await newUser.save();
                res
                    .status(201)
                    .json(newUser);
            }
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });

    app.post('/api/v1/user.update', loginMiddleware, async(req, res) => {
        const {
            interests,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);

            if (user) {
                user.interests = interests;

                await user.save();

                res
                    .status(200)
                    .json(user);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: USER_NOT_FOUND,
                    });
            }
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });
};
