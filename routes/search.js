const request = require('request-promise');

const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const {
    getSearchFields,
    getHighlightFields,
    getRequestUrl,
    parseResult,
} = require('../utils/search');

module.exports = (app) => {
    app.post('/api/v1/search', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            text,
            categories = [],
        } = req.body;
        const {
            pagination,
        } = req.queryParams;
        const searchFields = getSearchFields(categories);
        const highlightFields = getHighlightFields(searchFields);
        const requestUrl = getRequestUrl(categories);

        const results = await request.get(requestUrl, {
            json: true,
            body: {
                _source: {
                    excludes: searchFields,
                },
                query: {
                    multi_match: {
                        query: text,
                        fields: searchFields,
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

        const parsedResults = parseResult(results);
        res
            .status(200)
            .json(parsedResults);
    });
};
