const voting = (topic, user, voting) => {
    const main = voting === 'upvote' ? 'upvoters' : 'downvoters';
    const secondary = voting === 'upvote' ? 'downvoters' : 'upvoters';

    const alreadyVoted = topic[main].find((v) => v.userid === user.userid);

    if (alreadyVoted) {
        topic[main] = topic[main].filter((v) => v.userid !== user.userid);
    }
    else {
        topic[main] = [
            ...topic[main],
            user,
        ];
        topic[secondary] = topic[secondary].filter((v) => v.userid !== user.userid);
    }
};

module.exports = voting;