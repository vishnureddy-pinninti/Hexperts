const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');
const Post = mongoose.model('posts');

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
                    dbRecord.topics = dbRecord.topics;
            
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

const updateAnswers = async (answers, questionID) => {
    const results = [];

    let globalQuestion;
    if (questionID) {
        globalQuestion = await Question.findById(questionID);
    }
    for (let answer of answers) {
        await new Promise(async (resolve) => {
            try {
                const dbAnswer = await Answer.findById(answer._id);
            
                if (dbAnswer) {
                    const question = globalQuestion || await Question.findById(dbAnswer.questionID);

                    if (question) {
                        dbAnswer.topics = question.topics;
                        await dbAnswer.save();
                    }
                }
            
                results.push(answer._id);
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

    app.post('/api/v1/synchronize', async (req, res) => {
        try {
            const { collection } = req.body;
            const Model = collectionMap[collection];

            await Model.synchronize();

            res
                .status(200)
                .send('success');
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

    app.post('/api/v1/answer-topics.add', async (req, res) => {
        try {
            const { questionID } = req.body;
            const query = {};

            if (questionID) {
                query.questionID = questionID;
            }

            const answers = await Answer.find(query);

            const status = await updateAnswers(answers, questionID);

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