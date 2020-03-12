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

import { RECEIVE_FOLLOWED_TOPIC } from '../actions/topic';

const initialState = {
    isAuthenticated: false,
    user: {},
    topUsers: [],
    pending: true,
    feed: [],
    images: [],
    userProfile: {},
};

function searchTopic(topicId, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id === topicId) {
            return i;
        }
    }
    return -1;
}

export default (state = initialState, action) => {
    let followers = [];
    let index;
    let profile;
    let userInterests;
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
        case RECEIVE_FOLLOWED_TOPIC:
            profile = state.userProfile;
            if (profile && !profile.interests){
                profile.interests = [];
            }
            index = searchTopic(action.res.interest._id, profile.interests);
            if (index < 0) {
                profile.interests.push(action.res.interest);
            }
            else {
                profile.interests.splice(index, 1);
            }
            userInterests = state.interests;
            index = searchTopic(action.res.interest._id, userInterests);
            if (index < 0) {
                userInterests.push(action.res.interest);
            }
            else {
                userInterests.splice(index, 1);
            }
            return {
                ...state,
                interests: [ ...userInterests ],
                userProfile: { ...profile },
            };

        case RECEIVE_USER_PREFERENCES:
            profile = state.userProfile;
            if (profile){
                profile.interests = [
                    ...profile.interests,
                    ...action.user.interests,
                ];
                profile.expertIn = [
                    ...state.expertIn,
                    ...action.user.expertIn,
                ];
            }
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
                userProfile: { ...profile },
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
