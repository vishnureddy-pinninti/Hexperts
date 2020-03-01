import { RECEIVE_USER_SESSION, RECEIVE_TOP_CREATORS, RECEIVE_USER_PREFERENCES, ADD_PREFERENCES_PENDING } from '../actions/auth';

const initialState = {
    isAuthenticated: false,
    user: {},
    topUsers: [],
    pending: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_USER_SESSION:
            return {
                ...state,
                isAuthenticated: true,
                user: action.user,
                interests: action.user.interests,
                expertIn: action.user.expertIn,
            };
        case RECEIVE_TOP_CREATORS:
            return {
                ...state,
                topUsers: action.users,
            };
        case ADD_PREFERENCES_PENDING:
            return {
                ...state,
                pending: true,
            };
        case RECEIVE_USER_PREFERENCES:
            return {
                ...state,
                pending: false,
                interests: [
                    ...state.interests,
                    ...action.user.interests,
                ],
                expertIn: [
                    ...state.expertIn,
                    ...action.user.expertIn,
                ],
            };
        default:
            return state;
    }
};
