const tags = [
    '<img',
    '<pre',
    '<iframe',
];

const isMediaOrCode = (html = '') => {
    return tags.some(tag => html.includes(tag));
};

export {
    isMediaOrCode,
};