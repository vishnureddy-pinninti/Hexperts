import { RECEIVE_USER_QUESTIONS } from '../actions/questions';

const initialState = {
    questions: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_USER_QUESTIONS:
            return Object.assign({},
                state, { 
                    questions: action.questions,
                }
            );
        default:
            return state;
    }
}