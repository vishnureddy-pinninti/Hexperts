import { RECEIVE_USER_SESSION,
    RECEIVE_TOP_CREATORS,
    RECEIVE_USER_PREFERENCES,
    ADD_PREFERENCES_PENDING,
    RECEIVE_USER_BY_ID,
    RECEIVE_QUESTIONS_BY_USER_ID,
    RECEIVE_USER_ANSWERS,
    RECEIVE_FOLLOWED_USER,
    RECEIVE_NOTIFICATIONS,
    SET_IMAGE,
    RECEIVE_USER_POSTS,
    RECEIVE_MARK_NOTIFICATION_READ,
    REQUEST_ADD_NOTIFICATION } from '../actions/auth';

import { RECEIVE_FOLLOWED_TOPIC } from '../actions/topic';
import { RECEIVE_FOLLOWED_BLOG } from '../actions/blog';

const initialState = {
    isAuthenticated: false,
    user: {},
    topUsers: [],
    pending: true,
    feed: [],
    images: [],
    userProfile: {},
    notificationCount: 0,
    notifications: [],
    blogs: [],
};

function searchBlog(blogId, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id === blogId) {
            return i;
        }
    }
    return -1;
}

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
    let userBlogs;
    switch (action.type) {
        case RECEIVE_USER_SESSION:
            return {
                ...state,
                isAuthenticated: true,
                user: action.user,
                notificationCount: action.user.notificationCount,
                interests: action.user.interests,
                expertIn: action.user.expertIn,
                blogs: action.user.blogs,
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
        case RECEIVE_FOLLOWED_BLOG:
            profile = state.userProfile;
            if (profile && profile.blogs){
                index = searchBlog(action.res.blog._id, profile.interests);
                if (index < 0) {
                    profile.blogs.push(action.res.blog);
                }
                else {
                    profile.blogs.splice(index, 1);
                }
            }
            userBlogs = state.blogs;
            index = searchBlog(action.res.blog._id, userBlogs);
            if (index < 0) {
                userBlogs.push(action.res.blog);
            }
            else {
                userBlogs.splice(index, 1);
            }
            return {
                ...state,
                blogs: [ ...userBlogs ],
                userProfile: { ...profile },
            };
        case RECEIVE_USER_PREFERENCES:
            profile = state.userProfile;
            if (profile && profile.interests){
                profile.interests = [
                    ...profile.interests,
                    ...action.user.interests,
                ];
                profile.expertIn = [
                    ...state.expertIn,
                    ...action.user.expertIn,
                ];
                profile.blogs = [
                    ...state.blogs,
                    ...action.user.blogs,
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
                blogs: [
                    ...state.blogs,
                    ...action.user.blogs,
                ],
                userProfile: { ...profile },
            };
        case RECEIVE_QUESTIONS_BY_USER_ID:
            return {
                ...state,
                feed: {
                    type: 'questions',
                    items: action.res.questions,
                },
            };
        case RECEIVE_USER_ANSWERS:
            return {
                ...state,
                feed: {
                    type: 'answers',
                    items: action.res.answers,
                },
            };
        case RECEIVE_USER_POSTS:
            return {
                ...state,
                feed: {
                    type: 'posts',
                    items: action.res.posts,
                },
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
                notifications: action.notifications.notifications,
                notificationCount: action.notifications.unread,
            };
        }
        case RECEIVE_MARK_NOTIFICATION_READ: {
            return {
                ...state,
                notificationCount: state.notificationCount - 1,
            };
        }
        case REQUEST_ADD_NOTIFICATION: {
            return {
                ...state,
                notifications: [
                    action.notification,
                    ...state.notifications,
                ],
                notificationCount: state.notificationCount + 1,
            };
        }
        default:
            return state;
    }
};
