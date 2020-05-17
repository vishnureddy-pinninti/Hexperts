const tags = [
    '<img',
    '<pre',
    '<iframe',
];

const isMediaOrCode = (html = '') => {
    return tags.some(tag => html.includes(tag));
};

const isAdmin = (user) => {
    return user.role === 'admin';
}

const buildApiUrl = (url, params) => {
    return `${url}?${Object.keys(params).map(x => `${x}=${params[x]}`).join('&')}`;
};

export {
    isMediaOrCode,
    isAdmin,
    buildApiUrl,
};