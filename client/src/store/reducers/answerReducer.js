import { RECEIVE_ADDED_ANSWER, ADD_ANSWER_PENDING } from '../actions/answer';

const initialState = {
    answer: {},
    pending: true,
};

export default (state = initialState, action) => {
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
        default:
            return state;
    }
};
