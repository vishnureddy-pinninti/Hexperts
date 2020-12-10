const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    const {
        limit,
        skip,
        confluence,
        ...rest
    } = req.query;
    
    const query = {};
    const pagination = {};
    const custom = {};

    if (rest) {
        Object.keys(rest).forEach((x) => {
            if (x.indexOf('_id') > -1) {
                const fields = rest[x].split(',');
                query[x] = { $in: fields.map((field) => mongoose.Types.ObjectId(field)) };
            }
            else if (x.indexOf('_') > -1) {
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
    }

    if (skip) {
        pagination.skip = Number(skip);
    }

    if(confluence){
        pagination.confluence = (confluence == 'true');
    }

    req.queryParams = {
        query,
        pagination,
        custom,
    };
    next();
};