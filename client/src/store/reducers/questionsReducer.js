import { RECEIVE_USER_QUESTIONS,
    RECEIVE_ADDED_QUESTION,
    RECEIVE_QUESTION_BY_ID,
    ADD_QUESTION_PENDING,
    RECEIVE_FOLLOWED_QUESTION,
    RECEIVE_TRENDING_QUESTIONS,
    EDIT_QUESTION_PENDING,
    RECEIVE_RELATED_QUESTIONS,
    RECEIVE_EDITED_QUESTION } from '../actions/questions';
import { RECEIVE_ADDED_ANSWER } from '../actions/answer';

const initialState = {
    questions: [],
    pending: true,
    newQuestion: {},
    question: null,
    trendingQuestions: [],
    relatedQuestions: [],
};

export default (state = initialState, action) => {
    let answers = [];
    let question = {};
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
        case RECEIVE_RELATED_QUESTIONS:
            return {
                ...state,
                relatedQuestions: action.questions,
            };
        case RECEIVE_ADDED_QUESTION:
            return {
                ...state,
                newQuestion: action.question,
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
        case EDIT_QUESTION_PENDING:
            return {
                ...state,
                pending: true,
            };
        case RECEIVE_EDITED_QUESTION:
            return {
                ...state,
                pending: false,
                question: action.question,
            };
        case RECEIVE_QUESTION_BY_ID:
            return {
                ...state,
                newQuestion: {},
                question: action.question,
                pending: false,
            };
        case RECEIVE_FOLLOWED_QUESTION:
            question = { ...state.question };
            question.following = action.res.unfollow;
            question.followers = [
                ...question.followers,
                action.res.follower,
            ];
            return {
                ...state,
                question,
            };
        case RECEIVE_ADDED_ANSWER:
            if (state.question && state.question.answers && state.question.answers.results){
                answers = [ ...state.question.answers.results ];
                question = {
                    ...state.question,
                    answers: {
                        results: [
                            action.answer,
                            ...answers,
                        ],
                    },
                };
            }
            return {
                ...state,
                question,
            };
        default:
            return state;
    }
};
