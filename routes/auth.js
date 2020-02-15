const mongoose = require('mongoose');
const User = mongoose.model('users');

const { encrypt } = require('../utils/crypto');
const config = require('../config/keys');

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
                const cookieOptions = { httpOnly: true, expires: d1 };
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
            console.log(e);
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });
};
