import { RECEIVE_USER_SESSION,
    RECEIVE_TOP_CREATORS,
    RECEIVE_USER_PREFERENCES,
    ADD_PREFERENCES_PENDING,
    RECEIVE_USER_BY_ID,
    RECEIVE_QUESTIONS_BY_USER_ID,
    RECEIVE_USER_ANSWERS,
    SET_IMAGE,
} from '../actions/auth';

const initialState = {
    isAuthenticated: false,
    user: {},
    topUsers: [],
    pending: true,
    feed: [],
    images: [],
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
        case RECEIVE_USER_BY_ID:
            return {
                ...state,
                userProfile: action.profile,
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
        case RECEIVE_QUESTIONS_BY_USER_ID:
            return {
                ...state,
                feed: action.res.questions,
            };
        case RECEIVE_USER_ANSWERS:
            return {
                ...state,
                feed: action.res.answers,
            };
        case SET_IMAGE:
            return {
                ...state,
                images: [ ...state.images, action.image ],
            }
        default:
            return state;
    }
};
