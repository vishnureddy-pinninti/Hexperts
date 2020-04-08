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
export const REQUEST_QUESTIONS_FOR_USER = 'REQUEST_QUESTIONS_FOR_USER';
export const RECEIVE_QUESTIONS_FOR_USER = 'RECEIVE_QUESTIONS_FOR_USER';
export const REQUEST_ANSWER_REQUESTS = 'REQUEST_ANSWER_REQUESTS';
export const RECEIVE_ANSWER_REQUESTS = 'RECEIVE_ANSWER_REQUESTS';
export const RECEIVE_QUESTION_SUGGESTIONS = 'RECEIVE_QUESTION_SUGGESTIONS';
export const REQUEST_QUESTION_SUGGESTIONS = 'REQUEST_QUESTION_SUGGESTIONS';
export const TOGGLE_QUESTION_MODAL = 'TOGGLE_QUESTION_MODAL';
export const CLEAR_QUESTION_SUGGESTIONS = 'CLEAR_QUESTION_SUGGESTIONS';
export const RECEIVE_DELTEED_QUESTION = 'RECEIVE_DELTEED_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';

export const toggleQuestionModal = (question) => {
    return {
        type: TOGGLE_QUESTION_MODAL,
        question,
    };
};

export const clearQuestionSuggestions = () => {
    return {
        type: CLEAR_QUESTION_SUGGESTIONS,
    };
};

const receiveUserQuestions = (questions) => {
    return {
        type: RECEIVE_USER_QUESTIONS,
        questions,
    };
};

export const requestUserQuestions = (params = { skip: 0 }) => {
    const queryString = params.ownQuestions ? '_ownQuestions=true' : '_onlyInterests=true';

    return {
        type: REQUEST_USER_QUESTIONS,
        makeApiRequest: {
            url: `/api/v1/questions?${queryString}&skip=${params.skip || 0}`,
            method: 'GET',
            success: receiveUserQuestions,
        },
    };
};

const receiveQuestionsForUser = (questions) => {
    return {
        type: RECEIVE_QUESTIONS_FOR_USER,
        questions,
    };
};

export const requestQuestionsForUser = (params = { skip: 0 }) => {
    return {
        type: REQUEST_QUESTIONS_FOR_USER,
        makeApiRequest: {
            url: `/api/v1/questions?_onlyExpertIn=true&skip=${params.skip}`,
            method: 'GET',
            success: receiveQuestionsForUser,
        },
    };
};

const receiveAnswerRequests = (questions) => {
    return {
        type: RECEIVE_ANSWER_REQUESTS,
        questions,
    };
};

export const requestAnswerRequests = (params = { skip: 0 }) => {
    return {
        type: REQUEST_ANSWER_REQUESTS,
        makeApiRequest: {
            url: `/api/v1/questions?_onlySuggested=true&skip=${params.skip}`,
            method: 'GET',
            success: receiveAnswerRequests,
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

const receiveQuestionSuggestions = (res) => {
    return {
        type: RECEIVE_QUESTION_SUGGESTIONS,
        res,
    };
};

export const requestQuestionSuggestions = (postData, successcb) => {
    return {
        type: REQUEST_QUESTION_SUGGESTIONS,
        makeApiRequest: {
            url: '/api/v1/question-suggestions',
            method: 'POST',
            body: postData,
            success: receiveQuestionSuggestions,
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

export const requestQuestionById = (id, params = { skip: 0 }) => {
    return {
        type: REQUEST_QUESTION_BY_ID,
        makeApiRequest: {
            url: `/api/v1/question/${id}?skip=${params.skip}`,
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

export const editQuestion = (id, postData, cb) => {
    return {
        type: EDIT_QUESTION,
        makeApiRequest: {
            url: `/api/v1/question/${id}`,
            method: 'PUT',
            body: postData,
            success: receiveEditedQuestion,
            successcb: cb,
        },
    };
};

export const addQuestionToCache = (question) => {
    return {
        type: RECEIVE_QUESTION_FOR_CACHE,
        question,
    };
};

const receiveDeletedQuestion = (res) => {
    return {
        type: RECEIVE_DELTEED_QUESTION,
        res,
    };
};

export const deleteQuestion = (id, cb) => {
    return {
        type: DELETE_QUESTION,
        makeApiRequest: {
            url: `/api/v1/question/${id}`,
            method: 'DELETE',
            success: receiveDeletedQuestion,
            successcb: cb,
        },
    };
};
