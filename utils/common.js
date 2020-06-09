const topicsAsString = (topics = []) => {
    return topics.join(' ');
};

const onlyUnique = (array = []) => {
    return array.filter((value, index, self) => value && self.indexOf(value) === index);
};

const inBButNotInA = (a, b) => {
    return b.filter(e => !a.includes(e));
};

module.exports = {
    inBButNotInA,
    onlyUnique,
    topicsAsString,
};