const fields = {
    answers: {
        searchFields: [ 'plainText' ],
        highlightFields: [ 'plainText' ],
        excludeSourceFields: [ 'plainText' ],
        text: 'plainText',
    },
    posts: {
        searchFields: [
            'title',
            'plainText',
        ],
        highlightFields: [
            'title',
            'plainText',
        ],
        excludeSourceFields: [
            'title',
            'plainText',
        ],
        text: 'title',
        subtext: 'plainText',
    },
    questions: {
        searchFields: [
            'question',
            'plainText',
        ],
        highlightFields: [
            'question',
            'plainText',
        ],
        excludeSourceFields: [
            'question',
            'plainText',
        ],
        text: 'question',
        subtext: 'plainText',
    },
    blogs: {
        searchFields: [
            'name',
            'plainText',
        ],
        highlightFields: [
            'name',
            'plainText',
        ],
        excludeSourceFields: [
            'name',
            'plainText',
        ],
        text: 'name',
        subtext: 'plainText',
    },
    topics: {
        searchFields: [
            'topic',
            'plainText',
        ],
        highlightFields: [
            'topic',
            'plainText',
        ],
        excludeSourceFields: [
            'topic',
            'plainText',
        ],
        text: 'topic',
        subtext: 'plainText',
    },
    users: {
        searchFields: [
            'name',
            'email',
        ],
        highlightFields: [
            'name',
            'email',
        ],
        excludeSourceFields: [ 'name' ],
        text: 'name',
        subtext: 'email',
    },
    externals: {
        searchFields: [
            'link',
            'title',
            'content',
        ],
        highlightFields: [
            'title',
            'content',
        ],
        excludeSourceFields: [
            'title',
            'content',
        ],
        text: 'title',
        subtext: 'content',
    },
};

const onlyUnique = (value, index, self) => value && self.indexOf(value) === index;

const getExcludeFields = (categories) => {
    let excludeFields = [];
    if (categories.length) {
        excludeFields = [].concat.apply([], categories.map((category) => fields[category].excludeSourceFields)).filter(onlyUnique);
    }
    else {
        excludeFields = [].concat.apply([], Object.keys(fields).map((key) => fields[key].excludeSourceFields)).filter(onlyUnique);
    }
    return excludeFields;
};

const getSearchFields = (categories) => {
    let searchFields = [];
    if (categories.length) {
        searchFields = [].concat.apply([], categories.map((category) => fields[category].searchFields)).filter(onlyUnique);
    }
    else {
        searchFields = [].concat.apply([], Object.keys(fields).map((key) => fields[key].searchFields)).filter(onlyUnique);
    }
    return searchFields;
};

const getHighlightFields = (searchFields) => {
    const highlightMap = {
        'require_field_match': 'false',
        'fragment_size': 256,
        'number_of_fragments': 1,
        'no_match_size': 256,
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

const externalSearchUrl = 'http://localhost:9200/externals/_search';

const parseResult = (result) => {
    const response = {};
    response.totalCount = result.hits.total.value;

    const results = result.hits.hits.map((hit) => {
        const singleResult = {};
        const {
            _index,
            _id,
            highlight,
            _source,
        } = hit;

        const type = _index.split('_')[0];
        const options = {};

        Object.keys(_source).forEach((key) => {
            options[key] = _source[key];
        });

        singleResult.options = options;

        singleResult.type = type;
        singleResult._id = _id;

        singleResult.text = highlight[fields[type].text][0];

        if (highlight[fields[type].subtext]) {
            singleResult.subtext = highlight[fields[type].subtext][0];
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
    externalSearchUrl,
    getExcludeFields,
};
