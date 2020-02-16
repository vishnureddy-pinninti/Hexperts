module.exports = (req, res, next) => {
    const {
        limit,
        skip,
        ...rest
    } = req.query;

    const query = {};
    const pagination = {};
    const custom = {};

    if (rest) {
        Object.keys(rest).forEach((x) => {
            if (x.indexOf('_') > -1) {
                custom[x] = rest[x];
            }
            else {
                const fields = rest[x].split(',');
                if (fields.length > 1) {
                    query[x] = { $in: fields };
                }
                else {
                    query[x] = rest[x];
                }
            }
        });
    }

    if (limit) {
        pagination.limit = Number(limit);
    };

    if (skip) {
        pagination.skip = Number(skip);
    }

    req.queryParams = { query, pagination, custom };
    next();
};