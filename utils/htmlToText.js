const cheerio = require('cheerio');
const { onlyUnique } = require('./common');

const htmlToText = (html = '') => {
    const $ = cheerio.load(html);
    $('code').remove();
    $('pre').remove();
    const content = $('html body *').contents()
        .map(function() {
            return (this.type === 'text') ? $(this).text() + ' ' : '';
        })
        .get()
        .join('');
    const mentions = $('.wysiwyg-mention');
    const userMentions = [];
    mentions.each(function() {
        const eachMention = $(this).attr('data-value');
        userMentions.push(eachMention);
    });

    return {
        plainText: content.trim(),
        userMentions: onlyUnique(userMentions),
    };
};

module.exports = htmlToText;