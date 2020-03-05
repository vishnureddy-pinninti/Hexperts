const fields = {
    answers: [ 'answer' ],
    blogs: [
        'title',
        'description',
    ],
    questions: [
        'question',
        'description',
    ],
    spaces: [
        'name',
        'description',
    ],
    topics: [
        'topic',
        'description',
    ],
    users: [
        'name',
        'email',
    ],
};

const onlyUnique = (value, index, self) => value && self.indexOf(value) === index;

const getSearchFields = (categories) => {
    let searchFields = [];
    if (categories.length) {
        searchFields = [].concat.apply([], categories.map((category) => fields[category])).filter(onlyUnique);
    }
    else {
        searchFields = [].concat.apply([], Object.keys(fields).map((key) => fields[key])).filter(onlyUnique);
    }
    return searchFields;
};

const getHighlightFields = (searchFields) => {
    const highlightMap = {
        'require_field_match': 'false',
        'fragment_size': 400,
        'number_of_fragments': 1,
        'no_match_size': 20,
    };
    const highlightFields = {};

    searchFields.forEach((field) => {
        highlightFields[field] = highlightMap;
    });

    return highlightFields;
};

const getRequestUrl = (categories) => {
    let realCategories = [];

    if (categories.length) {
        realCategories = categories.filter((category) => !!fields[category]).join(',');
    }
    else {
        realCategories = Object.keys(fields).join(',');
    }
    return `http://localhost:9200/${realCategories}/_search`;
};

const parseResult = (result) => {
    const response = {};
    response.totalCount = result.hits.total.value;

    const results = result.hits.hits.map((hit) => {
        const singleResult = {};
        const {
            _index,
            _id,
            highlight,
        } = hit;

        singleResult.type = _index;
        singleResult._id = _id;
        const highlightedKeys = Object.keys(highlight);

        if (highlightedKeys.length) {
            singleResult.text = highlight[highlightedKeys[0]][0];

            if (highlightedKeys[1]) {
                singleResult.subtext = highlight[highlightedKeys[1]][0];
            }
        }

        return singleResult;
    });

    response.results = results;
    return response;
};

module.exports = {
    fields,
    getSearchFields,
    getHighlightFields,
    getRequestUrl,
    parseResult,
};
