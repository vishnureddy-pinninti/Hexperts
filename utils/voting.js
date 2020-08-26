const voting = (topic, user, voting) => {
    const main = voting === 'upvote' ? 'upvoters' : 'downvoters';
    const secondary = voting === 'upvote' ? 'downvoters' : 'upvoters';
    
    const alreadyVoted = topic[main].find((v) => v._id.equals(user));
    const secondaryVoted = topic[secondary].find((v) => v._id.equals(user));

    if (alreadyVoted) {
        topic[main] = topic[main].filter((v) => !v._id.equals(user));
    }
    else {
        const newVote = {
            _id: user
        }
        topic[main] = [
            ...topic[main],
            newVote,
        ];
        topic[secondary] = topic[secondary].filter((v) => !v._id.equals(user));
    }
    return {
        alreadyVoted: Boolean(alreadyVoted),
        secondaryVoted: Boolean(secondaryVoted),
    };
};

module.exports = voting;