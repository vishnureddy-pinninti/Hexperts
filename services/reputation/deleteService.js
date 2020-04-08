const cheerio = require('cheerio');
const {
    scores: {
        NEW_ANSWER, UPVOTE_ANSWER, NEW_POST, UPVOTE_POST,
    },
} = require('../../utils/constants');
const reputationService =  require('./reputationService');
const { deleteImage } = require('../../utils/uploads');

const deleteService = async(data) => {
    const {
        htmlContent,
        type,
        user,
        voteCount,
    } = data;

    const $ = cheerio.load(htmlContent);
    const imgs = $('img[src^=\'/\']');;
    imgs.each(function() {
        const src = $(this).attr('src');
        deleteImage(src);
    });

    if (type !== 'question') {
        let score;
    
        if (type === 'answer') {
            score = (NEW_ANSWER * -1) + (voteCount * UPVOTE_ANSWER * -1);
        }
        else if (type === 'post') {
            score = (NEW_POST * -1) + (voteCount * UPVOTE_POST * -1);
        }
    
        reputationService({
            user: { _id: user },
            score,
            voteCount: (voteCount * -1),
        });
    }

};

module.exports = deleteService;