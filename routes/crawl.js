/* eslint-disable no-undef */
const request = require('request-promise');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const keyword_extractor = require('keyword-extractor');
const URL = require('url-parse');
const mongoose = require('mongoose');
const External = mongoose.model('externals');

require('events').EventEmitter.defaultMaxListeners = 100;

const loginMiddleware = require('../middlewares/loginMiddleware');
const { errors: { CRAWLER_NOT_FOUND } } = require('../utils/constants');

const onlyUnique = (value, index, self) => value && self.indexOf(value) === index;
const puppeteerConfig = {
    headless: false,
    args: [
        '--start-fullscreen',
    ],
    defaultViewport: null,
    ignoreDefaultArgs: [ '--disable-extensions' ],
    userDataDir: 'user_dir',
};

const crawler = async(url, only) => {
    if (only) {
        return [ url ];
    }
    let browser;
    let page;
    try {
        // const response = await request.get(url);
        browser = await puppeteer.launch(puppeteerConfig);
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        
        await page.goto(url, { waitUntil: 'networkidle0' });
        // const response = await page.content();
        const response = await page.evaluate(() => document.body.innerHTML);
        await page.close();
        await browser.close();

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
        if (page) {
            await page.close();
        }
        if (browser) {
            await browser.close();
        }
        return [];
    }
};

const crawlLinks = async (links) => {
    const results = [];
    for (let link of links) {
        await new Promise(async (resolve) => {
            let response;
            let browser;
            let page;
            try {
                browser = await puppeteer.launch(puppeteerConfig);
                page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                
                await page.goto(link, { waitUntil: 'networkidle0' });
                response = await page.evaluate(() => document.body.innerHTML);

                // const response = await page.content();
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
            
                results.push({
                    link,
                    title,
                    content: extraction_result,
                });

                await page.close();
                await browser.close();
            }
            catch (e) {
                console.log('exception', link);
                console.log(e);
                response = '';
                if (page) {
                    await page.close();
                }
                if (browser) {
                    await browser.close();
                }
            }

            resolve();
        });
    }

    return results;    
};

module.exports = (app) => {
    app.post('/api/v1/crawler', async(req, res) => {
        // Set infinite timeout for this api.
        req.setTimeout(0);
        const {
            url,
            only = true,
        } = req.body;

        const links = await crawler(url, only);

        try {
            const finalResponse = await crawlLinks(links);

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