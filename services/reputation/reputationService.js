const mongoose = require('mongoose');
const User = mongoose.model('users');

const reputationService = async(data) => {
    const {
        user: owner,
        score,
    } = data;

    const user = await User.findById(owner._id);

    if (user) {
        user.reputation = user.reputation + score;

        await user.save();
    }
};

module.exports = reputationService;