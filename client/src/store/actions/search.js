export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const REQUEST_ADVANCED_SEARCH = 'REQUEST_ADVANCED_SEARCH';
export const RECEIVE_ADVANCED_SEARCH = 'RECEIVE_ADVANCED_SEARCH';
export const RECEIVE_FAILURE_RESPONSE = 'RECEIVE_FAILURE_RESPONSE';
export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

const receiveSearchResults = (res) => {
    return {
        type: RECEIVE_SEARCH,
        res,
    };
};

export const requestSearch = (body, params = { skip: 0, confluence: false }) => {
    return {
        type: REQUEST_SEARCH,
        makeApiRequest: {
            url: `/api/v1/search?skip=${params.skip}&confluence=${params.confluence}`,
            method: 'POST',
            body,
            success: receiveSearchResults,
        },
    };
};

const receiveAdvancedSearchResults = (res, skip, limit) => {
    return {
        type: RECEIVE_ADVANCED_SEARCH,
        res,
        skip,
        limit,
    };
};

const receiveFailureResponse = () => {
    return {
        type: RECEIVE_FAILURE_RESPONSE,
    };
};

export const requestAdvancedSearch = (body, params) => {
    const {
        skip,
        limit = 10,
        confluence,
    } = params;

    return {
        type: REQUEST_ADVANCED_SEARCH,
        skip,
        limit,
        confluence,
        makeApiRequest: {
            url: `/api/v1/search?skip=${skip}&limit=${limit}&confluence=${confluence}`,
            method: 'POST',
            body,
            success: (res) => receiveAdvancedSearchResults(res, skip, limit),
            failure: receiveFailureResponse,
        },
    };
};

const receiveUsers = (res) => {
    return {
        type: RECEIVE_USERS,
        res,
    };
};

export const requestUsers = (body, callback, errback) => {
    return {
        type: REQUEST_USERS,
        makeApiRequest: {
            url: '/api/v1/user-suggestions',
            method: 'POST',
            body,
            success: receiveUsers,
            successcb: callback,
            errorcb: errback,
        },
    };
};
