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

const updateReputation = async (users) => {
    const status = {
        success: [],
        failure: [],
    };
    for (let user of users) {
        await new Promise(async (resolve) => {
            try {
            
                const dbRecord = await User.findById(user._id);
            
                if (dbRecord) {
                    dbRecord.reputation = dbRecord.reputation - (user.posts * 3);
            
                    await dbRecord.save();
                }
            
                status.success.push(user._id);
            }
            catch (e) {
                status.failure.push(user._id);
            }

            resolve();
        });
    }

    return status;    
};

const updateVotes = async (records, Model) => {
    const results = [];
    for (let record of records) {
        await new Promise(async (resolve) => {
            try {
            
                const dbRecord = await Model.findById(record._id);
            
                if (dbRecord) {
                    dbRecord.newUpvoters = dbRecord.upvoters.map((upvote) => {
                        return {
                            _id: upvote,
                            createdDate: dbRecord.postedDate
                        }
                    });
            
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

const updateUsers = async () => {
    const results = [];
    const missed = [];
    const users = [];
    for (let user of users) {
        await new Promise(async (resolve) => {
            try {
                const dbRecord = await User.findOne({ name: user.Name.trim(),  jobTitle: user.JobTitle.trim() });
            
                if (dbRecord) {
                    dbRecord.department = user.Department;
                    dbRecord.city = user.Location;
                    await dbRecord.save();
                    results.push(user.Name);
                }
                else {
                    missed.push(user.Name.trim());
                }
            }
            catch (e) {
                console.log(e);
            }
            resolve();
        });
    }

    return {
        results,
        missed,
    };    
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

    app.post('/api/v1/property.update', async (req, res) => {
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

            const records = await Model.find();
            const status = await updateVotes(records, Model);

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

    app.get('/api/v1/update-users', async (req, res) => {
        const { results, missed } = await updateUsers();

        res
          .status(200)
          .json({
              results,
              missed,
          });
    });

    app.post('/api/v1/update-reputation', async (req, res) => {
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'posts',
                    },
                },
                {
                    $project: {
                        posts: {
                            $cond: {
                                if: { $isArray: '$posts' },
                                then: { $size: '$posts' },
                                else: 0,
                            },
                        },
                    }
                }
            ]);
            const status = await updateReputation(users);

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