export const ADD_ANSWER_TO_QUESTION = 'ADD_ANSWER_TO_QUESTION';
export const RECEIVE_ADDED_ANSWER = 'RECEIVE_ADDED_ANSWER';
export const ADD_ANSWER_PENDING = 'ADD_ANSWER_PENDING';

export function addAnswerPending() {
    return {
        type: ADD_ANSWER_PENDING,
    };
}

const receiveAddedAnswer = (answer) => {
    return {
        type: RECEIVE_ADDED_ANSWER,
        answer,
    };
};

export const addAnswerToQuestion = (body) => {
    return {
        type: ADD_ANSWER_TO_QUESTION,
        makeApiRequest: {
            url: '/api/v1/answer.add',
            method: 'POST',
            body,
            success: (response) => receiveAddedAnswer(response),
        },
    };
};
