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

const buildApiUrl = (url, params = {}) => {
    return `${url}?${Object.keys(params).map(x => `${x}=${params[x]}`).join('&')}`;
};

export {
    isMediaOrCode,
    isAdmin,
    buildApiUrl,
};

export const StartYear = 2020;

export const Months = [{field:"January", value:1},
                {field:"February", value:2},
                {field:"March", value:3},
                {field:"April", value:4},
                {field:"May", value:5},
                {field:"June", value:6},
                {field:"July", value:7},
                {field:"August", value:8},
                {field:"September", value:9},
                {field:"October", value:10},
                {field:"November", value:11},
                {field:"December", value:12},]