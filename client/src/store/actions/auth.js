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
export const REQUEST_USER_POSTS = 'REQUEST_USER_POSTS';
export const RECEIVE_USER_POSTS = 'RECEIVE_USER_POSTS';
export const RECEIVE_USER_FOLLOWERS = 'RECEIVE_USER_FOLLOWERS';
export const REQUEST_USER_FOLLOWERS = 'REQUEST_USER_FOLLOWERS';
export const RECEIVE_USER_FOLLOWING = 'RECEIVE_USER_FOLLOWING';
export const REQUEST_USER_FOLLOWING = 'REQUEST_USER_FOLLOWING';
export const REQUEST_MANAGE_USER_PREFERENCES = 'REQUEST_MANAGE_USER_PREFERENCES';
export const RECEIVE_MANGE_USER_PREFERENCES = 'RECEIVE_MANGE_USER_PREFERENCES';
export const RECEIVE_MARK_ALL_NOTIFICATION_READ = 'RECEIVE_MARK_ALL_NOTIFICATION_READ';
export const MARK_ALL_NOTIFICATIONS_READ = 'MARK_ALL_NOTIFICATIONS_READ';
export const SET_PAGE_LOADER = 'SET_PAGE_LOADER';
export const RECEIVE_UPLOADED_IMAGE = 'RECEIVE_UPLOADED_IMAGE';
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const REQUEST_EMAIL_PREFERENCES = 'REQUEST_EMAIL_PREFERENCES';
export const RECEIVE_EMAIL_PREFERENCES = 'RECEIVE_EMAIL_PREFERENCES';
export const EDIT_EMAIL_PREFERENCES = 'EDIT_EMAIL_PREFERENCES';
export const RECEIVE_EDITED_EMAIL_PREFERENCES = 'RECEIVE_EDITED_EMAIL_PREFERENCES';
export const REQUEST_EMAIL_SUBSCRIPTION = 'REQUEST_EMAIL_SUBSCRIPTION';
export const RECEIVE_EMAIL_SUBSCRIPTION = 'RECEIVE_EMAIL_SUBSCRIPTION';

const receiveUserSession = (user) => {
    return {
        type: RECEIVE_USER_SESSION,
        user,
    };
};

export const requestUserSession = (user, cb) => {
    return {
        type: REQUEST_USER_SESSION,
        makeApiRequest: {
            url: '/api/v1/user.read',
            method: 'POST',
            body: user,
            success: (response) => receiveUserSession(response),
            successcb: cb,
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

const receivemaangeUserPreferences = (user) => {
    return {
        type: RECEIVE_MANGE_USER_PREFERENCES,
        user,
    };
};

export const maangeUserPreferences = (body, cb) => {
    return {
        type: REQUEST_MANAGE_USER_PREFERENCES,
        makeApiRequest: {
            url: '/api/v1/user-preferences.manage',
            method: 'POST',
            body,
            success: receivemaangeUserPreferences,
            successcb: cb,
        },
    };
};

const receiveUserById = (profile) => {
    return {
        type: RECEIVE_USER_BY_ID,
        profile,
    };
};

export const requestUserById = (id, callback) => {
    return {
        type: REQUEST_USER_BY_ID,
        makeApiRequest: {
            url: `/api/v1/user-profile/${id}`,
            method: 'GET',
            success: receiveUserById,
            successcb: callback,
        },
    };
};

const receiveUserQuestions = (res) => {
    return {
        type: RECEIVE_QUESTIONS_BY_USER_ID,
        res,
    };
};

export const requestUserQuestions = (userId, params = { skip: 0 }) => {
    return {
        type: REQUEST_QUESTIONS_BY_USER_ID,
        makeApiRequest: {
            url: `/api/v1/user-questions/${userId}?skip=${params.skip}`,
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

export const requestUserAnswers = (userId, params = { skip: 0 }) => {
    return {
        type: REQUEST_USER_ANSWERS,
        makeApiRequest: {
            url: `/api/v1/user-answers/${userId}?skip=${params.skip}`,
            method: 'GET',
            success: receiveUserAnswers,
        },
    };
};

const receiveUserPosts = (res) => {
    return {
        type: RECEIVE_USER_POSTS,
        res,
    };
};

export const requestUserPosts = (userId, params = { skip: 0 }) => {
    return {
        type: REQUEST_USER_POSTS,
        makeApiRequest: {
            url: `/api/v1/user-posts/${userId}?skip=${params.skip}`,
            method: 'GET',
            success: receiveUserPosts,
        },
    };
};

const receiveUserFollowers = (res) => {
    return {
        type: RECEIVE_USER_FOLLOWERS,
        res,
    };
};

export const requestUserFollowers = (userId, params = { skip: 0 }) => {
    return {
        type: REQUEST_USER_FOLLOWERS,
        makeApiRequest: {
            url: `/api/v1/user-followers/${userId}?skip=${params.skip}`,
            method: 'GET',
            success: receiveUserFollowers,
        },
    };
};

const receiveUserFollowing = (res) => {
    return {
        type: RECEIVE_USER_FOLLOWING,
        res,
    };
};

export const requestUserFollowing = (userId, params = { skip: 0 }) => {
    return {
        type: REQUEST_USER_FOLLOWING,
        makeApiRequest: {
            url: `/api/v1/user-following/${userId}?skip=${params.skip}`,
            method: 'GET',
            success: receiveUserFollowing,
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

export const requestNotifications = (params = {
    skip: 0,
    limit: 10,
}) => {
    return {
        type: REQUEST_NOTIFICATIONS,
        makeApiRequest: {
            url: `api/v1/notifications?skip=${params.skip}&limit=${params.limit || 10}`,
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

export const setPageLoader = (loading) => {
    return {
        type: SET_PAGE_LOADER,
        loading,
    };
};

const receiveMarkAllNotificationsRead = (res) => {
    return {
        type: RECEIVE_MARK_ALL_NOTIFICATION_READ,
        res,
    };
};

export const markAllNotificationsRead = () => {
    return {
        type: MARK_ALL_NOTIFICATIONS_READ,
        makeApiRequest: {
            url: '/api/v1/notifications-mark-all-read/',
            method: 'GET',
            success: receiveMarkAllNotificationsRead,
        },
    };
};

const receiveUploadedImage = (res) => {
    return {
        type: RECEIVE_UPLOADED_IMAGE,
        res,
    };
};

export const uploadImage = (body, callback) => {
    return {
        type: UPLOAD_IMAGE,
        makeApiRequest: {
            url: '/api/v1/image.upload',
            method: 'POST',
            body,
            file: true,
            success: receiveUploadedImage,
            successcb: callback,
        },
    };
};

const receiveEmailPreferences = (res) => {
    return {
        type: RECEIVE_EMAIL_PREFERENCES,
        res,
    };
};

export const requestEmailPreferences = () => {
    return {
        type: REQUEST_EMAIL_PREFERENCES,
        makeApiRequest: {
            url: '/api/v1/email-preferences',
            method: 'GET',
            success: receiveEmailPreferences,
        },
    };
};

const receiveEditedEmailPreferences = (res) => {
    return {
        type: RECEIVE_EDITED_EMAIL_PREFERENCES,
        res,
    };
};

export const editEmailPreferences = (body, cb) => {
    return {
        type: EDIT_EMAIL_PREFERENCES,
        makeApiRequest: {
            url: '/api/v1/email-preferences.manage',
            method: 'POST',
            body,
            success: receiveEditedEmailPreferences,
            successcb: cb,
        },
    };
};

const receiveEmailSubscription = (res) => {
    return {
        type: RECEIVE_EMAIL_SUBSCRIPTION,
        res,
    };
};

export const requestEmailSubscription = () => {
    return {
        type: REQUEST_EMAIL_SUBSCRIPTION,
        makeApiRequest: {
            url: '/api/v1/email/subscription',
            method: 'GET',
            success: receiveEmailSubscription,
        },
    };
};
