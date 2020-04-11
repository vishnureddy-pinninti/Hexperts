const cheerio = require('cheerio');
const {
    scores: {
        NEW_ANSWER, UPVOTE_ANSWER, NEW_POST, UPVOTE_POST,
    },
} = require('../utils/constants');
const reputationService =  require('./reputation/reputationService');
const { deleteImage } = require('../utils/uploads');

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

const updateService = (oldHtml = '', newHtml = '') => {
    const $old = cheerio.load(oldHtml);
    const $new = cheerio.load(newHtml);
    const oldImgs = $old('img[src^=\'/\']');
    const newImgs = $new('img[src^=\'/\']');
    const oldImgUrls = [];
    oldImgs.each(function() {
        const src = $old(this).attr('src');
        oldImgUrls.push(src);
    });
    const newImgUrls = [];
    newImgs.each(function() {
        const src = $new(this).attr('src');
        newImgUrls.push(src);
    });
    const imagesToDelete = oldImgUrls.filter(img => !newImgUrls.includes(img));

    imagesToDelete.forEach(src => deleteImage(src));
}

module.exports = {
    deleteService,
    updateService,
};