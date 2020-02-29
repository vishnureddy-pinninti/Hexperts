export const REQUEST_USER_SESSION = 'REQUEST_USER_SESSION';
export const RECEIVE_USER_SESSION = 'RECEIVE_USER_SESSION';
export const REQUEST_TOP_CREATORS = 'REQUEST_TOP_CREATORS';
export const RECEIVE_TOP_CREATORS = 'RECEIVE_TOP_CREATORS';
export const ADD_USER_PREFERENCES = 'ADD_USER_PREFERENCES';
export const RECEIVE_USER_PREFERENCES = 'RECEIVE_USER_PREFERENCES';
export const ADD_PREFERENCES_PENDING = 'ADD_PREFERENCES_PENDING';

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

export function addPreferencesPending() {
    return {
        type: ADD_PREFERENCES_PENDING,
    };
}


const receiveUserPreferences = (user) => {
    return {
        type: RECEIVE_USER_PREFERENCES,
        user,
    };
};

export const addUserPreferences = (body) => {
    return {
        type: ADD_USER_PREFERENCES,
        makeApiRequest: {
            url: '/api/v1/user-preferences.add',
            method: 'POST',
            body,
            success: receiveUserPreferences,
        },
    };
};
