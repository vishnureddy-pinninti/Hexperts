import { RECEIVE_USER_QUESTIONS,
    RECEIVE_ADDED_QUESTION,
    RECEIVE_QUESTION_BY_ID,
    ADD_QUESTION_PENDING,
    RECEIVE_FOLLOWED_QUESTION,
    RECEIVE_TRENDING_QUESTIONS,
    EDIT_QUESTION_PENDING,
    RECEIVE_RELATED_QUESTIONS,
    RECEIVE_QUESTION_FOR_CACHE,
    RECEIVE_QUESTIONS_FOR_USER,
    RECEIVE_ANSWER_REQUESTS,
    RECEIVE_EDITED_QUESTION,
    REQUEST_RELATED_QUESTIONS,
    RECEIVE_QUESTION_SUGGESTIONS,
    CLEAR_QUESTION_SUGGESTIONS,
    TOGGLE_QUESTION_MODAL } from '../actions/questions';
import { RECEIVE_ADDED_ANSWER } from '../actions/answer';

const initialState = {
    questions: [],
    answerRequests: [],
    pending: true,
    newQuestion: {},
    question: { answers: { results: [] } },
    trendingQuestions: [],
    modifiedQuestions: {},
    relatedQuestions: [],
    questionSuggestions: {},
    questionModal: false,
};

export default (state = initialState, action) => {
    let modifiedQuestions = {};
    let question = {};
    let index;
    let followers = [];
    let id;
    let temp;
    switch (action.type) {
        case RECEIVE_USER_QUESTIONS:
            return {
                ...state,
                questions: action.questions,
            };
        case TOGGLE_QUESTION_MODAL:
            return {
                ...state,
                questionModal: !state.questionModal,
                questionSuggestions: state.questionModal ? {} : state.questionSuggestions,
                questionForModal: state.questionModal ? '' : action.question,
            };
        case CLEAR_QUESTION_SUGGESTIONS:
            return {
                ...state,
                questionSuggestions: {},
            };
        case RECEIVE_QUESTION_SUGGESTIONS:
            return {
                ...state,
                questionSuggestions: action.res,
            };
        case RECEIVE_QUESTIONS_FOR_USER:
            return {
                ...state,
                answerRequests: action.questions,
            };
        case RECEIVE_ANSWER_REQUESTS:
            return {
                ...state,
                answerRequests: action.questions,
            };
        case RECEIVE_TRENDING_QUESTIONS:
            return {
                ...state,
                trendingQuestions: action.questions,
            };
        case REQUEST_RELATED_QUESTIONS:
            return {
                ...state,
                relatedQuestions: [],
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
            temp = state.question;

            if (action.question.suggestedExperts){
                temp.suggestedExperts = action.question.suggestedExperts;
            }

            if (action.question.question){
                temp.question = action.question.question;
            }

            if (action.question.hasOwnProperty('description')){
                temp.description = action.question.description;
            }

            if (action.question.hasOwnProperty('plainText')){
                temp.plainText = action.question.plainText;
            }

            if (action.question.topics){
                temp.topics = action.question.topics;
            }

            return {
                ...state,
                pending: false,
                question: temp,
            };
        case RECEIVE_QUESTION_BY_ID:
            return {
                ...state,
                newQuestion: {},
                question: action.question,
                pending: false,
                modifiedQuestions: {},
            };
        case RECEIVE_FOLLOWED_QUESTION:
            if (state.question && state.question.followers){
                followers = [ ...state.question.followers ];
                index = followers.indexOf(action.res.follower);
                if (index >= 0){
                    followers.splice(index, 1);
                }
                else {
                    followers.push(action.res.follower);
                }
            }
            temp = state.question;
            temp.followers = followers;
            question = state.modifiedQuestions;
            id = action.res._id;
            if (question[id]){
                index = question[id].followers.indexOf(action.res.follower);
                if (index >= 0){
                    question[id].followers.splice(index, 1);
                }
                else {
                    question[id].followers.push(action.res.follower);
                }
            }
            return {
                ...state,
                question: temp,
                modifiedQuestions: { ...question },
            };
        case RECEIVE_QUESTION_FOR_CACHE:
            question = state.modifiedQuestions;
            id = action.question._id;
            if (!question[id]){
                question[id] = {};
            }
            question[id].followers = action.question.followers;
            if (!question[id].newAnswers){
                question[id].newAnswers = [];
            }
            if (action.question.answers && action.question.answers.results
                && action.question.answers.results.length >= 0) { question[id].answers = action.question.answers; }
            return {
                ...state,
                modifiedQuestions: { ...question },
            };
        case RECEIVE_ADDED_ANSWER:
            modifiedQuestions = { ...state.modifiedQuestions };
            id = action.answer.questionID;
            if (modifiedQuestions[id]){
                modifiedQuestions[id].newAnswers.unshift(action.answer);
                modifiedQuestions[id].answers.totalCount += 1;
            }
            return {
                ...state,
                modifiedQuestions: { ...modifiedQuestions },
            };
        default:
            return state;
    }
};
