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
export const EDIT_QUESTION_PENDING = 'EDIT_QUESTION_PENDING';
export const RECEIVE_EDITED_QUESTION = 'RECEIVE_EDITED_QUESTION';
export const REQUEST_TRENDING_QUESTIONS = 'REQUEST_TRENDING_QUESTIONS';
export const RECEIVE_TRENDING_QUESTIONS = 'RECEIVE_TRENDING_QUESTIONS';
export const REQUEST_RELATED_QUESTIONS = 'REQUEST_RELATED_QUESTIONS';
export const RECEIVE_RELATED_QUESTIONS = 'RECEIVE_RELATED_QUESTIONS';
export const RECEIVE_QUESTION_FOR_CACHE = 'RECEIVE_QUESTION_FOR_CACHE';

const receiveUserQuestions = (questions) => {
    return {
        type: RECEIVE_USER_QUESTIONS,
        questions,
    };
};

export const requestUserQuestions = () => {
    return {
        type: REQUEST_USER_QUESTIONS,
        makeApiRequest: {
            url: '/api/v1/questions?_onlyInterests=true',
            method: 'GET',
            success: receiveUserQuestions,
        },
    };
};

const receiveTrendingQuestions = (questions) => {
    return {
        type: RECEIVE_TRENDING_QUESTIONS,
        questions,
    };
};

export const requestTrendingQuestions = () => {
    return {
        type: REQUEST_TRENDING_QUESTIONS,
        makeApiRequest: {
            url: '/api/v1/trending-questions',
            method: 'GET',
            success: receiveTrendingQuestions,
        },
    };
};

const receiveRelatedQuestions = (questions) => {
    return {
        type: RECEIVE_RELATED_QUESTIONS,
        questions,
    };
};

export const requestRelatedQuestions = (questionId) => {
    return {
        type: REQUEST_RELATED_QUESTIONS,
        makeApiRequest: {
            url: `/api/v1/related-questions?questionID=${questionId}`,
            method: 'GET',
            success: receiveRelatedQuestions,
        },
    };
};

export function addQuestionPending() {
    return {
        type: ADD_QUESTION_PENDING,
    };
}

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

const receiveFollowedQuestion = (res) => {
    return {
        type: RECEIVE_FOLLOWED_QUESTION,
        res,
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

export function editQuestionPending() {
    return {
        type: EDIT_QUESTION_PENDING,
    };
}

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

export const addQuestionToCache = (question) => {
    return {
        type: RECEIVE_QUESTION_FOR_CACHE,
        question,
    };
};
