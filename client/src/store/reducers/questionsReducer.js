import { RECEIVE_USER_QUESTIONS,
    RECEIVE_ADDED_QUESTION,
    RECEIVE_QUESTION_BY_ID,
    ADD_QUESTION_PENDING,
    RECEIVE_FOLLOWED_QUESTION,
    RECEIVE_TRENDING_QUESTIONS,
    EDIT_QUESTION_PENDING,
    RECEIVE_RELATED_QUESTIONS,
    RECEIVE_QUESTION_FOR_CACHE,
    RECEIVE_EDITED_QUESTION } from '../actions/questions';
import { RECEIVE_ADDED_ANSWER } from '../actions/answer';

const initialState = {
    questions: [],
    pending: true,
    newQuestion: {},
    question: null,
    trendingQuestions: [],
    modifiedQuestions: {},
    relatedQuestions: [],
};

export default (state = initialState, action) => {
    let answers = [];
    let modifiedQuestions = {};
    let question = {};
    let index;
    let followers = [];
    let id;
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
                question: {
                    ...state.question,
                    topics: action.question.topics,
                },
            };
        case RECEIVE_QUESTION_BY_ID:
            return {
                ...state,
                newQuestion: {},
                question: action.question,
                pending: false,
            };
        case RECEIVE_FOLLOWED_QUESTION:
            if (state.question){
                followers = [ ...state.question.followers ];
                index = followers.indexOf(action.res.follower);
                if (index >= 0){
                    followers.splice(index, 1);
                }
                else {
                    followers.push(action.res.follower);
                }
            }
            question = state.modifiedQuestions;
            id = action.res._id;
            if (!question[id]){
                question[id] = {};
            }
            index = question[id].followers.indexOf(action.res.follower);
            if (index >= 0){
                question[id].followers.splice(index, 1);
            }
            else {
                question[id].followers.push(action.res.follower);
            }
            return {
                ...state,
                question: {
                    ...state.question,
                    followers,
                },
                modifiedQuestions: { ...question },
            };
        case RECEIVE_QUESTION_FOR_CACHE:
            question = state.modifiedQuestions;
            id = action.question._id;
            if (!question[id]){
                question[id] = {};
            }
            question[id].followers = action.question.followers;
            if (action.question.answers && action.question.answers.length >= 0) { question[id].answers = action.question.answers; }
            return {
                ...state,
                modifiedQuestions: { ...question },
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
            else {
                question = {
                    ...state.question,
                    answers: {
                        results: [ action.answer ],
                    },
                };
            }
            modifiedQuestions = { ...state.modifiedQuestions };
            id = action.answer.questionID;
            if (modifiedQuestions[id]){
                modifiedQuestions[id].answers.push(action.answer);
            }
            return {
                ...state,
                question,
                modifiedQuestions: { ...modifiedQuestions },
                questions: [ ...state.questions ],
            };
        default:
            return state;
    }
};
