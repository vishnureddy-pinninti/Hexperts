import { RECEIVE_USER_SESSION } from '../actions/auth';

const initialState = {
    isAuthenticated: false,
    user: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_USER_SESSION:
            return {
                ...state,
                isAuthenticated: true,
                user: action.user,
            };
        default:
            return state;
    }
};
