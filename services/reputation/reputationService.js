const mongoose = require('mongoose');
const User = mongoose.model('users');

const reputationService = async(data) => {
    const {
        user: owner,
        score,
        voteCount,
    } = data;

    const user = await User.findById(owner._id);

    if (user) {
        user.reputation = user.reputation + score;
        
        if (voteCount) {
            if (user.upvotes) {
                user.upvotes = user.upvotes + voteCount;
            }
            else {
                user.upvotes = voteCount === -1 ? 0: 1;
            }
        }

        await user.save();
    }
};

module.exports = reputationService;