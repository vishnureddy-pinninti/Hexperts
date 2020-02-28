import { RECEIVE_USER_QUESTIONS,
    RECEIVE_ADDED_QUESTION,
    RECEIVE_QUESTION_BY_ID,
    ADD_QUESTION_PENDING,
    RECEIVE_FOLLOWED_QUESTION,
    RECEIVE_TRENDING_QUESTIONS } from '../actions/questions';
import { RECEIVE_ADDED_ANSWER } from '../actions/answer';

const initialState = {
    questions: [],
    pending: true,
    trendingQuestions: [],
};

export default (state = initialState, action) => {
    let answers = [];
    switch (action.type) {
        case RECEIVE_USER_QUESTIONS:
            return {
                ...state,
                questions: action.questions,
            };
        case RECEIVE_TRENDING_QUESTIONS:
            return {
                ...state,
                trendingQuestions: action.questions,
            };
        case RECEIVE_ADDED_QUESTION:
            return {
                questions: [
                    action.question,
                    ...state.questions,
                ],
                pending: false,
            };
        case ADD_QUESTION_PENDING:
            return {
                ...state,
                pending: true,
            };
        case RECEIVE_QUESTION_BY_ID:
            return {
                ...state,
                question: action.question,
                pending: false,
            };
        case RECEIVE_FOLLOWED_QUESTION:
            return {
                ...state,
            };
        case RECEIVE_ADDED_ANSWER:
            if (state.question.answers){
                answers = [ ...state.question.answers.results ];
            }
            return {
                ...state,
                question: {
                    ...state.question,
                    answers: {
                        results: [
                            action.answer,
                            ...answers,
                        ],
                    },
                },
            };
        default:
            return state;
    }
};
