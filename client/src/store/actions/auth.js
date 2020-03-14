export const REQUEST_USER_SESSION = 'REQUEST_USER_SESSION';
export const RECEIVE_USER_SESSION = 'RECEIVE_USER_SESSION';
export const REQUEST_TOP_CREATORS = 'REQUEST_TOP_CREATORS';
export const RECEIVE_TOP_CREATORS = 'RECEIVE_TOP_CREATORS';
export const ADD_USER_PREFERENCES = 'ADD_USER_PREFERENCES';
export const RECEIVE_USER_PREFERENCES = 'RECEIVE_USER_PREFERENCES';
export const ADD_PREFERENCES_PENDING = 'ADD_PREFERENCES_PENDING';
export const REQUEST_USER_BY_ID = 'REQUEST_USER_BY_ID';
export const RECEIVE_USER_BY_ID = 'RECEIVE_USER_BY_ID';
export const REQUEST_QUESTIONS_BY_USER_ID = 'REQUEST_QUESTIONS_BY_USER_ID';
export const RECEIVE_QUESTIONS_BY_USER_ID = 'RECEIVE_QUESTIONS_BY_USER_ID';
export const REQUEST_USER_ANSWERS = 'REQUEST_USER_ANSWERS';
export const RECEIVE_USER_ANSWERS = 'RECEIVE_USER_ANSWERS';
export const SET_IMAGE = 'SET_IMAGE';
export const FOLLOW_USER = 'FOLLOW_USER';
export const RECEIVE_FOLLOWED_USER = 'RECEIVE_FOLLOWED_USER';
export const REQUEST_NOTIFICATIONS = 'REQUEST_NOTIFICATIONS';
export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS';
export const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';
export const RECEIVE_MARK_NOTIFICATION_READ = 'RECEIVE_MARK_NOTIFICATION_READ';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const REQUEST_ADD_NOTIFICATION = 'REQUEST_ADD_NOTIFICATION';

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

const receiveUserById = (profile) => {
    return {
        type: RECEIVE_USER_BY_ID,
        profile,
    };
};

export const requestUserById = (id) => {
    return {
        type: REQUEST_USER_BY_ID,
        makeApiRequest: {
            url: `/api/v1/user-profile/${id}`,
            method: 'GET',
            success: receiveUserById,
        },
    };
};

const receiveUserQuestions = (res) => {
    return {
        type: RECEIVE_QUESTIONS_BY_USER_ID,
        res,
    };
};

export const requestUserQuestions = (userId) => {
    return {
        type: REQUEST_QUESTIONS_BY_USER_ID,
        makeApiRequest: {
            url: `/api/v1/user-questions/${userId}`,
            method: 'GET',
            success: receiveUserQuestions,
        },
    };
};

const receiveUserAnswers = (res) => {
    return {
        type: RECEIVE_USER_ANSWERS,
        res,
    };
};

export const requestUserAnswers = (userId) => {
    return {
        type: REQUEST_USER_ANSWERS,
        makeApiRequest: {
            url: `/api/v1/user-answers/${userId}`,
            method: 'GET',
            success: receiveUserAnswers,
        },
    };
};

export const setImage = (image) => {
    return {
        type: SET_IMAGE,
        image,
    };
};

const receiveFollowedUser = (res) => {
    return {
        type: RECEIVE_FOLLOWED_USER,
        res,
    };
};

export const followUser = (postData) => {
    return {
        type: FOLLOW_USER,
        makeApiRequest: {
            url: '/api/v1/user.follow',
            method: 'POST',
            body: postData,
            success: receiveFollowedUser,
        },
    };
};

const receiveNotifications = (notifications) => {
    return {
        type: RECEIVE_NOTIFICATIONS,
        notifications,
    };
};

export const requestNotifications = () => {
    return {
        type: REQUEST_NOTIFICATIONS,
        makeApiRequest: {
            url: 'api/v1/notifications',
            method: 'GET',
            success: receiveNotifications,
        },
    };
};

export const requestAddNotification = (notification) => {
    return {
        type: REQUEST_ADD_NOTIFICATION,
        notification,
    };
};

const receiveMarkNotificationRead = () => {
    return {
        type: RECEIVE_MARK_NOTIFICATION_READ,
    };
};

export const markNotificationRead = (id) => {
    return {
        type: MARK_NOTIFICATION_READ,
        makeApiRequest: {
            url: `/api/v1/notification-mark-read/${id}`,
            method: 'GET',
            success: receiveMarkNotificationRead,
        },
    };
};
