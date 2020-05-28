const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const { search } = require('../utils/search');
const { topicsAsString } = require('../utils/common');

module.exports = (app) => {
    app.post('/api/v1/search', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            text,
            categories = [],
            topics = [],
        } = req.body;
        const {
            pagination,
        } = req.queryParams;

        const results = await search({
            text,
            categories,
            pagination,
            topics: topicsAsString(topics),
        });

        res
            .status(200)
            .json(results);
    });
};
