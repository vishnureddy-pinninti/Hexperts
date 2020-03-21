export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const REQUEST_ADVANCED_SEARCH = 'REQUEST_ADVANCED_SEARCH';
export const RECEIVE_ADVANCED_SEARCH = 'RECEIVE_ADVANCED_SEARCH';

const receiveSearchResults = (res) => {
    return {
        type: RECEIVE_SEARCH,
        res,
    };
};

export const requestSearch = (body, params = { skip: 0 }) => {
    return {
        type: REQUEST_SEARCH,
        makeApiRequest: {
            url: `/api/v1/search?skip=${params.skip}`,
            method: 'POST',
            body,
            success: receiveSearchResults,
        },
    };
};

const receiveAdvancedSearchResults = (res) => {
    return {
        type: RECEIVE_ADVANCED_SEARCH,
        res,
    };
};

export const requestAdvancedSearch = (body, params = {
    skip: 0,
    limit: 10,
}) => {
    return {
        type: REQUEST_ADVANCED_SEARCH,
        makeApiRequest: {
            url: `/api/v1/search?skip=${params.skip}&limit=${params.limit || 10}`,
            method: 'POST',
            body,
            success: receiveAdvancedSearchResults,
        },
    };
};
