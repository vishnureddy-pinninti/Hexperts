import { RECEIVE_USER_SESSION, RECEIVE_TOP_CREATORS } from '../actions/auth';

const initialState = {
    isAuthenticated: false,
    user: {},
    topUsers: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_USER_SESSION:
            return {
                ...state,
                isAuthenticated: true,
                user: action.user,
            };
        case RECEIVE_TOP_CREATORS:
            return {
                ...state,
                topUsers: action.users,
            };
        default:
            return state;
    }
};
