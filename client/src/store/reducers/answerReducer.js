import { RECEIVE_ADDED_ANSWER, ADD_ANSWER_PENDING, RECEIVE_UPVOTE_ANSWER, RECEIVE_ANSWER_FOR_CACHE, RECEIVE_DOWNVOTE_ANSWER } from '../actions/answer';

const initialState = {
    answer: {},
    pending: true,
    modifiedAnswers: {},
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
        case RECEIVE_ADDED_ANSWER:
            return {
                ...state,
                pending: false,
                answer: action.answer,
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
