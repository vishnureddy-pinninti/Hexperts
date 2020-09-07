import { RECEIVE_ADDED_FEEDBACK, } from '../actions/questions';

const initialState = {
    feedback: {},
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
        default:
            return state;
    }
};