const cheerio = require('cheerio');

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
    return content.trim();
};

module.exports = htmlToText;