const voting = (topic, user, voting) => {
    const main = voting === 'upvote' ? 'upvoters' : 'downvoters';
    const secondary = voting === 'upvote' ? 'downvoters' : 'upvoters';

    const alreadyVoted = topic[main].find((v) => v.equals(user));
    const secondaryVoted = topic[secondary].find((v) => v.equals(user));

    if (alreadyVoted) {
        topic[main] = topic[main].filter((v) => !v.equals(user));
    }
    else {
        topic[main] = [
            ...topic[main],
            user,
        ];
        topic[secondary] = topic[secondary].filter((v) => !v.equals(user));
    }

    return {
        alreadyVoted: Boolean(alreadyVoted),
        secondaryVoted: Boolean(secondaryVoted),
    };
};

module.exports = voting;