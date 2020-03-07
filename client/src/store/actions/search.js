export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';

const receiveSearchResults = (res) => {
    return {
        type: RECEIVE_SEARCH,
        res,
    };
};

export const requestSearch = (body) => {
    return {
        type: REQUEST_SEARCH,
        makeApiRequest: {
            url: '/api/v1/search',
            method: 'POST',
            body,
            success: receiveSearchResults,
        },
    };
};
