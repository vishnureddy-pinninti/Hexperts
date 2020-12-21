import { RECEIVE_ADDED_FEEDBACK, RECEIVE_USER_FEEDBACKS, } from '../actions/feedback';

const initialState = {
    feedback: {},
    feedbacks: [],
    pending: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_ADDED_FEEDBACK:
            return {
                ...state,
                feedback: action.feedback,
                pending: false,
            };
        case RECEIVE_USER_FEEDBACKS:{
            return {
                ...state,
                feedbacks: action.feedbacks,
            };
        }
            
        default:
            return state;
    }
};