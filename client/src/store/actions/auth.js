export const REQUEST_USER_SESSION = 'REQUEST_USER_SESSION';
export const RECEIVE_USER_SESSION = 'RECEIVE_USER_SESSION';
export const REQUEST_TOP_CREATORS = 'REQUEST_TOP_CREATORS';
export const RECEIVE_TOP_CREATORS = 'RECEIVE_TOP_CREATORS';

const receiveUserSession = (user) => {
    return {
        type: RECEIVE_USER_SESSION,
        user,
    };
};

export const requestUserSession = (user) => {
    return {
        type: REQUEST_USER_SESSION,
        makeApiRequest: {
            url: '/api/v1/user.read',
            method: 'POST',
            body: user,
            success: (response) => receiveUserSession(response),
        },
    };
};

const receiveTopCreators = (users) => {
    return {
        type: RECEIVE_TOP_CREATORS,
        users,
    };
};

export const requestTopCreators = () => {
    return {
        type: REQUEST_TOP_CREATORS,
        makeApiRequest: {
            url: '/api/v1/top-contributors',
            method: 'GET',
            success: receiveTopCreators,
        },
    };
};
