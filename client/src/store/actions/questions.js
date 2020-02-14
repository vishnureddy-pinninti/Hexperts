export const REQUEST_USER_QUESTIONS = 'REQUEST_USER_QUESTIONS';
export const RECEIVE_USER_QUESTIONS = 'RECEIVE_USER_QUESTIONS';

const receiveUserQuestions = (questions) => {
    return {
        type: RECEIVE_USER_QUESTIONS,
        questions,
    }
}

export const requestUserQuestions = () => {
    return {
        type: REQUEST_USER_QUESTIONS,
        makeApiRequest: {
            url: '/api/v1/questions',
            method: 'GET',
            success: receiveUserQuestions,
        }
    }
}