export const REQUEST_USER_QUESTIONS = 'REQUEST_USER_QUESTIONS';
export const RECEIVE_USER_QUESTIONS = 'RECEIVE_USER_QUESTIONS';
export const ADD_USER_QUESTION = 'ADD_USER_QUESTION';
export const RECEIVE_ADDED_QUESTION = 'RECEIVE_ADDED_QUESTION';
export const REQUEST_QUESTION_BY_ID = 'REQUEST_QUESTION_BY_ID';
export const RECEIVE_QUESTION_BY_ID = 'RECEIVE_QUESTION_BY_ID';
export const ADD_QUESTION_PENDING = 'ADD_QUESTION_PENDING';
export const FOLLOW_QUESTION = 'FOLLOW_QUESTION';
export const RECEIVE_FOLLOWED_QUESTION = 'RECEIVE_FOLLOWED_QUESTION';
export const EDIT_QUESTION = 'EDIT_QUESTION';
export const RECEIVE_EDITED_QUESTION = 'RECEIVE_EDITED_QUESTION';

const receiveUserQuestions = (questions) => {
    return {
        type: RECEIVE_USER_QUESTIONS,
        questions,
    };
};

export function addQuestionPending() {
    return {
        type: ADD_QUESTION_PENDING,
    };
}

export const requestUserQuestions = () => {
    return {
        type: REQUEST_USER_QUESTIONS,
        makeApiRequest: {
            url: '/api/v1/questions?_ownQuestions=true',
            method: 'GET',
            success: receiveUserQuestions,
        },
    };
};

const receiveAddedQuestion = (question) => {
    return {
        type: RECEIVE_ADDED_QUESTION,
        question,
    };
};

export const addUserQuestion = (postData, successcb) => {
    return {
        type: ADD_USER_QUESTION,
        makeApiRequest: {
            url: '/api/v1/question.add',
            method: 'POST',
            body: postData,
            success: receiveAddedQuestion,
            successcb,
        },
    };
};

const receiveQuestionById = (question) => {
    return {
        type: RECEIVE_QUESTION_BY_ID,
        question,
    };
};

export const requestQuestionById = (id) => {
    return {
        type: REQUEST_QUESTION_BY_ID,
        makeApiRequest: {
            url: `/api/v1/question/${id}`,
            method: 'GET',
            success: receiveQuestionById,
        },
    };
};

const receiveFollowedQuestion = (question) => {
    return {
        type: RECEIVE_FOLLOWED_QUESTION,
        question,
    };
};

export const followQuestion = (postData) => {
    return {
        type: FOLLOW_QUESTION,
        makeApiRequest: {
            url: '/api/v1/question.follow',
            method: 'POST',
            body: postData,
            success: receiveFollowedQuestion,
        },
    };
};

const receiveEditedQuestion = (question) => {
    return {
        type: RECEIVE_EDITED_QUESTION,
        question,
    };
};

export const editQuestion = (id, postData) => {
    return {
        type: EDIT_QUESTION,
        makeApiRequest: {
            url: `/api/v1/question/${id}`,
            method: 'PUT',
            body: postData,
            success: receiveEditedQuestion,
        },
    };
};
