import { RECEIVE_USER_SESSION,
    RECEIVE_TOP_CREATORS,
    RECEIVE_USER_PREFERENCES,
    ADD_PREFERENCES_PENDING,
    RECEIVE_USER_BY_ID,
    RECEIVE_QUESTIONS_BY_USER_ID,
    RECEIVE_USER_ANSWERS,
    RECEIVE_FOLLOWED_USER,
    RECEIVE_NOTIFICATIONS,
    SET_IMAGE } from '../actions/auth';

const initialState = {
    isAuthenticated: false,
    user: {},
    topUsers: [],
    pending: true,
    feed: [],
    images: [],
};

export default (state = initialState, action) => {
    let followers = [];
    let index;
    switch (action.type) {
        case RECEIVE_USER_SESSION:
            return {
                ...state,
                isAuthenticated: true,
                user: action.user,
                notificationCount: action.user.notificationCount,
                interests: action.user.interests,
                expertIn: action.user.expertIn,
            };
        case RECEIVE_USER_BY_ID:
            return {
                ...state,
                userProfile: action.profile,
                interests: action.profile.interests,
                expertIn: action.profile.expertIn,
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
        case RECEIVE_FOLLOWED_USER:
            followers = [ ...state.userProfile.followers ];
            index = followers.indexOf(action.res.follower);
            if (index >= 0){
                followers.splice(index, 1);
            }
            else {
                followers.push(action.res.follower);
            }
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    followers,
                },
            };
        case SET_IMAGE: {
            const existingImages = state.images.filter((image) => image.user !== action.image.user);
            return {
                ...state,
                images: [
                    ...existingImages,
                    action.image,
                ],
            };
        }
        case RECEIVE_NOTIFICATIONS: {
            return {
                ...state,
                notifications: action.notifications,
                notificationCount: 0,
            };
        }
        default:
            return state;
    }
};
