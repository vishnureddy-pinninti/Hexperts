

export const ADD_USER_FEEDBACK = 'ADD_USER_FEEDBACK';
export const RECEIVE_ADDED_FEEDBACK = 'RECEIVE_ADDED_FEEDBACK';
export const REQUEST_USER_FEEDBACKS = 'REQUEST_USER_FEEDBACKS';
export const RECEIVE_USER_FEEDBACKS = 'RECEIVE_USER_FEEDBACKS';


const receiveAddedFeedback = (feedback) => {
    return {
        type: RECEIVE_ADDED_FEEDBACK,
        feedback,
    };
};

export const addUserFeedback = (postData) => {
    return {
        type: ADD_USER_FEEDBACK,
        makeApiRequest: {
            url: '/api/v1/feedback.add',
            method: 'POST',
            body: postData,
            success: receiveAddedFeedback,
        },
    };
};

const receiveUserFeedbacks = (feedbacks) => {
    return {
        type: RECEIVE_USER_FEEDBACKS,
        feedbacks,
    };
};

export const requestUserFeedbacks = () => {
    return {
        type: REQUEST_USER_FEEDBACKS,
        makeApiRequest: {
            url: '/api/v1/feedbacks',
            method: 'GET',
            success: receiveUserFeedbacks,
        },
    };
};
