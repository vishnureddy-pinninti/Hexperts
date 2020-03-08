const fields = {
    answers: {
        searchFields: [ 'answer' ],
        highlightFields: [ 'answer' ],
        excludeSourceFields: [ 'answer' ],
        text: 'answer',
    },
    blogs: {
        searchFields: [
            'title',
            'description',
        ],
        highlightFields: [
            'title',
            'description',
        ],
        excludeSourceFields: [
            'title',
            'description',
        ],
        text: 'title',
        subtext: 'description',
    },
    questions: {
        searchFields: [
            'question',
            'description',
        ],
        highlightFields: [
            'question',
            'description',
        ],
        excludeSourceFields: [
            'question',
            'description',
        ],
        text: 'question',
        subtext: 'description',
    },
    spaces: {
        searchFields: [
            'name',
            'description',
        ],
        highlightFields: [
            'name',
            'description',
        ],
        excludeSourceFields: [
            'name',
            'description',
        ],
        text: 'name',
        subtext: 'description',
    },
    topics: {
        searchFields: [
            'topic',
            'description',
        ],
        highlightFields: [
            'topic',
            'description',
        ],
        excludeSourceFields: [
            'topic',
            'description',
        ],
        text: 'topic',
        subtext: 'description',
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
    // externals: {
    //     searchFields: [
    //         'link',
    //         'title',
    //         'content',
    //     ],
    //     highlightFields: [
    //         'title',
    //         'content',
    //     ],
    //     excludeSourceFields: [
    //         'title',
    //         'content',
    //     ],
    //     text: 'title',
    //     subtext: 'content',
    // },
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
        'fragment_size': 512,
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
