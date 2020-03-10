/* eslint-disable no-undef */
const request = require('request-promise');
const cheerio = require('cheerio');
const keyword_extractor = require('keyword-extractor');
const URL = require('url-parse');
const mongoose = require('mongoose');
const External = mongoose.model('externals');

const loginMiddleware = require('../middlewares/loginMiddleware');
const { errors: { CRAWLER_NOT_FOUND } } = require('../utils/constants');

const onlyUnique = (value, index, self) => value && self.indexOf(value) === index;

const crawler = async(url) => {
    try {
        const response = await request.get(url);
        const $ = cheerio.load(response);
        const allRelativeLinks = [];
        const localUrl = new URL(url);
        const baseUrl = localUrl.protocol + '//' + localUrl.hostname;
        const relativeLinks = $('a[href^=\'/\']');

        allRelativeLinks.push(url.endsWith('/') ? url : `${url}/`);
        relativeLinks.each(function() {
            const childUrl = $(this).attr('href');
            const modifiedUrl = childUrl.endsWith('/') ? childUrl : `${childUrl}/`;
            allRelativeLinks.push(`${baseUrl}${modifiedUrl}`);
        });

        const absoluteLinks = $('a[href^=\'http\']');
        absoluteLinks.each(function() {
            const link = $(this).attr('href');
            const modifiedUrl = link.endsWith('/') ? link : `${link}/`;
            const localLink = new URL(modifiedUrl);
            if (localUrl.hostname === localLink.hostname) {
                allRelativeLinks.push(modifiedUrl);
            }
        });

        return allRelativeLinks.filter(onlyUnique);
    }
    catch (e) {
        return [];
    }
};

module.exports = (app) => {
    app.post('/api/v1/crawler', loginMiddleware, async(req, res) => {
        const {
            url,
        } = req.body;

        const links = await crawler(url);

        try {
            const finalResponse = await Promise.all(links.map(async(link) => {
                const response = await request.get(link);
                const $ = cheerio.load(response);
                const title = $('title').text();
                $('header').remove();
                $('footer').remove();
                $('script').remove();
                $('iframe').remove();
                $('noscript').remove();
                const content = $('html body *').contents()
                    .map(function() {
                        return (this.type === 'text') ? $(this).text() + ' ' : '';
                    })
                    .get()
                    .join('');
                const extraction_result = keyword_extractor.extract(content.replace(/\s+/g, ' '), {
                    language: 'english',
                    remove_digits: true,
                    return_changed_case: true,
                    remove_duplicates: true,
                }).join(' ');

                const dbLink = await External.findOne({ link });

                if (dbLink) {
                    dbLink.title = title;
                    dbLink.content = extraction_result;
                    dbLink.lastModified = Date.now();

                    await dbLink.save();
                }
                else {
                    const newExternal = new External({
                        link,
                        title,
                        content: extraction_result,
                    });

                    await newExternal.save();
                }

                return {
                    link,
                    title,
                    content: extraction_result,
                };
            }));

            res
                .status(200)
                .json(finalResponse.map((response) => {
                    return {
                        link: response.link,
                    };
                }));
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

    app.get('/api/v1/crawlers', loginMiddleware, async(req, res) => {
        try {
            const crawlers = await External.find({}, {
                title: 0,
                content: 0,
            });

            res
                .status(200)
                .json(crawlers);
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

    // Re crawl existing site
    app.put('/api/v1/crawler/:id', loginMiddleware, async(req, res) => {
        const { id } = req.params;
        try {
            const crawler = await External.findById(id);

            if (crawler) {
                const response = await request.get(crawler.link);
                const $ = cheerio.load(response);
                const title = $('title').text();
                $('header').remove();
                $('footer').remove();
                $('script').remove();
                $('iframe').remove();
                $('noscript').remove();
                const content = $('html body *').contents()
                    .map(function() {
                        return (this.type === 'text') ? $(this).text() + ' ' : '';
                    })
                    .get()
                    .join('');
                const extraction_result = keyword_extractor.extract(content.replace(/\s+/g, ' '), {
                    language: 'english',
                    remove_digits: true,
                    return_changed_case: true,
                    remove_duplicates: true,
                }).join(' ');

                crawler.title = title;
                crawler.content = extraction_result;
                crawler.lastModified = Date.now();

                await crawler.save();

                res
                    .json(200)
                    .json(crawler);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: CRAWLER_NOT_FOUND,
                    });
            }
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

    // Delete crawled  site
    app.delete('/api/v1/crawler/:id', loginMiddleware, async(req, res) => {
        try {
            const { id } = req.params;
            const crawler = await External.findById(id);

            if (crawler) {
                await crawler.remove();
                res
                    .status(200)
                    .json({ id });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: CRAWLER_NOT_FOUND,
                    });
            }
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
};