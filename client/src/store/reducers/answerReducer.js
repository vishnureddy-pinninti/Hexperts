import { RECEIVE_ADDED_ANSWER,
    ADD_ANSWER_PENDING,
    RECEIVE_UPVOTE_ANSWER,
    RECEIVE_ANSWER_FOR_CACHE,
    RECEIVE_ANSWER_BY_ID,
    RECEIVE_ANSWER_COMMENTS,
    REQUEST_ANSWER_COMMENTS,
    RECEIVE_COMMENT_ANSWER,
    RECEIVE_COMMENT_BY_ID,
    RECEIVE_DOWNVOTE_ANSWER,
    REQUEST_ANSWER_BY_ID,
    REQUEST_COMMENT_BY_ID } from '../actions/answer';

import { RECEIVE_QUESTION_BY_ID } from '../actions/questions';

const initialState = {
    answer: {},
    newAnswer: {},
    pending: true,
    modifiedAnswers: {},
    comment: {},
};

export default (state = initialState, action) => {
    let answer;
    let index;
    let id;
    switch (action.type) {
        case ADD_ANSWER_PENDING:
            return {
                ...state,
                pending: true,
            };
        case REQUEST_ANSWER_BY_ID:
            return {
                ...state,
                answer: {},
                pending: true,
            };
        case RECEIVE_ANSWER_BY_ID:
            return {
                ...state,
                answer: action.answer,
                pending: false,
            };
        case REQUEST_COMMENT_BY_ID:
            return {
                ...state,
                comment: {},
                pending: true,
            };
        case RECEIVE_COMMENT_BY_ID:
            if (action.comment.target === 'answers'){
                return {
                    ...state,
                    comment: action.comment,
                    pending: false,
                };
            }
            return {
                ...state,
                comment: {},
                pending: false,
            };
        // case RECEIVE_COMMENT_ANSWER:
        //     answer = state.modifiedAnswers;
        //     id = action.targetID;
        //     if (!answer[id]){
        //         answer[id] = {};
        //         answer[id].commentsCache = [];
        //     }
        //     answer[id].newComments.unshift(action.res);
        //     answer[id].commentsCache.unshift(action.res);
        //     return {
        //         ...state,
        //         modifiedAnswers: { ...answer },
        //     };
        // case REQUEST_ANSWER_COMMENTS:
        //     return {
        //         ...state,
        //         modifiedAnswers: {},
        //         pending: true,
        //     };
        // case RECEIVE_ANSWER_COMMENTS:
        //     answer = state.modifiedAnswers;
        //     id = action.targetID;
        //     if (!answer[id]){
        //         answer[id] = {};
        //         answer[id].commentsCache = [];
        //         answer[id].newComments = [];
        //     }
        //     answer[id].commentsCache = [ ...action.comments ];
        //     return {
        //         ...state,
        //         modifiedAnswers: { ...answer },
        //         pending: false,
        //     };
        case RECEIVE_QUESTION_BY_ID:
            return {
                ...state,
                newAnswer: {},
            };
        case RECEIVE_ADDED_ANSWER:
            return {
                ...state,
                pending: false,
                newAnswer: action.answer,
            };
        case RECEIVE_UPVOTE_ANSWER:
            answer = state.modifiedAnswers;
            id = action.res._id;
            if (!answer[id]){
                answer[id] = {};
            }
            index = answer[id].upvoters.indexOf(action.res.upvoter);
            if (index >= 0){
                answer[id].upvoters.splice(index, 1);
            }
            else {
                index = answer[id].downvoters.indexOf(action.res.upvoter);
                if (index !== -1){
                    answer[id].downvoters.splice(index, 1);
                }
                answer[id].upvoters.push(action.res.upvoter);
            }
            return {
                ...state,
                modifiedAnswers: { ...answer },
            };
        case RECEIVE_DOWNVOTE_ANSWER:
            answer = state.modifiedAnswers;
            id = action.res._id;
            if (!answer[id]){
                answer[id] = { downvoters: [] };
            }
            index = answer[id].downvoters.indexOf(action.res.downvoter);
            if (index >= 0){
                answer[id].downvoters.splice(index, 1);
            }
            else {
                index = answer[id].upvoters.indexOf(action.res.downvoter);
                if (index !== -1){
                    answer[id].upvoters.splice(index, 1);
                }
                answer[id].downvoters.push(action.res.downvoter);
            }
            return {
                ...state,
                modifiedAnswers: { ...answer },
            };
        case RECEIVE_ANSWER_FOR_CACHE:
            answer = state.modifiedAnswers;
            id = action.answer._id;
            if (!answer[id]){
                answer[id] = {};
                answer[id].newComments = [];
            }
            answer[id].upvoters = action.answer.upvoters;
            answer[id].downvoters = action.answer.downvoters;

            return {
                ...state,
                modifiedAnswers: { ...answer },
            };
        default:
            return state;
    }
};
