export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const REQUEST_ADVANCED_SEARCH = 'REQUEST_ADVANCED_SEARCH';
export const RECEIVE_ADVANCED_SEARCH = 'RECEIVE_ADVANCED_SEARCH';
export const RECEIVE_FAILURE_RESPONSE = 'RECEIVE_FAILURE_RESPONSE';

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
        type: RECEIVE_FAILURE_RESPONSE
    }
}

export const requestAdvancedSearch = (body, params) => {
    const {
        skip,
        limit = 10,
    } = params;

    return {
        type: REQUEST_ADVANCED_SEARCH,
        skip,
        limit,
        makeApiRequest: {
            url: `/api/v1/search?skip=${skip}&limit=${limit}`,
            method: 'POST',
            body,
            success: (res) => receiveAdvancedSearchResults(res, skip, limit),
            failure: receiveFailureResponse
        },
    };
};
