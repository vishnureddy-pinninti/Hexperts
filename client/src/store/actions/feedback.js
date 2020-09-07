
export const ADD_USER_FEEDBACK = 'ADD_USER_FEEDBACK';
export const RECEIVE_ADDED_FEEDBACK = 'RECEIVE_ADDED_FEEDBACK';


const receiveAddedFeedback = (feedback) => {
    return {
        type: RECEIVE_ADDED_FEEDBACK,
        feedback,
    };
};

export const addUserFeedback = (postData, successcb) => {
    console.log(postData,successcb)
    return {
        type: ADD_USER_FEEDBACK,
        makeApiRequest: {
            url: '/api/v1/feedback.add',
            method: 'POST',
            body: postData,
            success: receiveAddedFeedback,
            successcb,
        },
    };
};