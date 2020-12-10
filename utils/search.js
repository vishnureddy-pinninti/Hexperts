const request = require('request-promise');

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
    confluence: {
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

const parseConfluenceResult = (result) => {
    const response = [];
    result.results.forEach((item) => {
        item.excerpt = item.excerpt.replace(/@@@hl@@@/gi,"<span class='highlighter'>");
        item.excerpt = item.excerpt.replace(/@@@endhl@@@/gi,"</span>");
        item.title = item.title.replace(/@@@hl@@@/gi,"<span class='highlighter'>");
        item.title = item.title.replace(/@@@endhl@@@/gi,"</span>");
        
        if(item.entityType == "content"){
            response.push({
                _id: item.content.id,
                text:item.title,
                subtext: item.excerpt,
                type:"confluence",
                options: {
                    link: "https://hxgntech.com/confluence"+item.url,
                },
                globalContainer: item.resultGlobalContainer,
                parentContainer: item.resultParentContainer,
                timestamp: item.timestamp,
            });
        }
        else{
            
        console.log(item);
        }
    });
    return response;
}

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

        singleResult.text = highlight[fields[type].text] && highlight[fields[type].text][0];

        if (highlight[fields[type].subtext]) {
            singleResult.subtext = highlight[fields[type].subtext][0];

            if (!singleResult.text) {
                singleResult.text = options.link || singleResult.subtext;
            }
        }

        return singleResult;
    });

    response.results = results;
    return response;
};

const checkConfluenceAuthentication = async(encodedData) => {
    
    result = await request.get('https://hxgntech.com/confluence/rest/api/accessmode', {
        headers: {
            Authorization: "Basic "+encodedData
        },
        json: true // Automatically parses the JSON string in the response
    });

    const response ={
        accessMode: result,
        isAccessable: true,
        enableAccess: true,
    }
        
    return response;
}

const search = async(properties) => {
    const {
        text,
        categories = [],
        pagination = {},
        exclude = true,
        sfield,
        topics = [],
    } = properties;
    const searchFields = sfield || getSearchFields(categories);
    const excludeFields = exclude ? getExcludeFields(categories) : [];
    const highlightFields = getHighlightFields(searchFields);
    const requestUrl = getRequestUrl(categories);
    
    const mustQuery = [
        {
            multi_match: {
                query: text,
                fields: searchFields,
            },
        }
    ];

    if (topics.length) {
        mustQuery.unshift({
            match: { topics }
        });
    }

    try {
        let results = await request.get(requestUrl, {
            json: true,
            body: {
                _source: {
                    excludes: excludeFields,
                },
                query: {
                    boosting: {
                        positive: {
                            bool: {
                                must: mustQuery
                            }
                        },
                        negative: {
                            terms: {
                                _index: [ 'externals' ],
                            },
                        },
                        negative_boost: 0.01,
                    },
                },
                highlight: {
                    pre_tags: [ '<span class=\'highlighter\'>' ],
                    post_tags: [ '</span>' ],
                    fields: highlightFields,
                },
                from: pagination.skip || 0,
                size: pagination.limit || 10,
            },
        });
        results = parseResult(results);
            
        let confluenceResults = {};
        console.length(pagination,categories);
        if(pagination.confluence && pagination.skip == 0 &&(categories.length == 0 || (categories.length > 0  && categories.indexOf('confulence')))){
            confluenceResults = await request.get('https://hxgntech.com/confluence/rest/api/search?cql={text~'+text+'}', {
                headers: {
                    Authorization: "Basic c3lzdXNlci1oZXhwZXJ0czpyQUVVWUVLaWlBRDBaNFg1YUROb3hHQlgzOUVjOQ=="
                },
                json: true // Automatically parses the JSON string in the response
            });
            
            const confluenceSearchResults = parseConfluenceResult(confluenceResults);
            confluenceSearchResults.forEach((item) => {
                results.results.push(item);
            } )
            results.totalCount += confluenceSearchResults.length;
            // if(categories && categories.length>0){
                
            //     let sortedResults = [];
            //     categories.forEach((category) => {
            //         let sortedResult = results.results.filter(x=> x.type == category);
            //         sortedResults = sortedResults.concat(sortedResult);
            //     })
            //     results.results = sortedResults;
            //     results.totalCount = sortedResults.length
            // }
        }
        
        return results;
    }
    catch (e) {
        return {
            totalCount: 0,
            results: [],
            error: true,
            message: e.error,
        };
    }
};

module.exports = {
    search,
    checkConfluenceAuthentication,
};
