const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');
const Post = mongoose.model('posts');

const { topicsAsString } = require('../utils/common');

const collectionMap = {
    questions: Question,
    answers: Answer,
    users: User,
    topics: Topic,
    posts: Post,
}

const updateRecords = async (records, Model) => {
    const results = [];
    for (let record of records) {
        await new Promise(async (resolve) => {
            try {
            
                const dbRecord = await Model.findById(record._id);
            
                if (dbRecord) {
                    dbRecord.topicsAsString = topicsAsString(dbRecord.topics);
            
                    await dbRecord.save();
                }
            
                results.push(record._id);
            }
            catch (e) {
                console.log(e);
            }

            resolve();
        });
    }

    return results;    
};

module.exports = (app) => {
    app.post('/api/v1/property.add', async (req, res) => {
        try {
            const { collection } = req.body;
            const Model = collectionMap[collection];

            if (!Model) {
                return res
                    .status(400)
                    .json({
                        error: true,
                        response: 'Provided collection type not supported',
                    });
            }

            // const status = await Model.aggregate([
            //     {
            //         $project: {
            //             stringTopics: {
            //                 $map: {
            //                     input: "$topics",
            //                     as: "topic",
            //                     in: { $toString: "$$topic" }
            //                 }
            //             } 
            //         }
            //     },
            //     {
            //         $addFields: {
            //             topicsAsString: {
            //                 $reduce: {
            //                     input: "$stringTopics",
            //                     initialValue: "",
            //                     in: { $concat: [ "$$value", " ", "$$this" ] }
            //                 }
            //             } 
            //         }
            //     }
            // ]);
            const records = await Model.find();

            const status = await updateRecords(records, Model);

            res
                .status(200)
                .json(status);
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: String(e),
                    stack: e.stack,
                });
        }
    });
}