import { RECEIVE_USER_SESSION,
    RECEIVE_TOP_CREATORS,
    RECEIVE_USER_PREFERENCES,
    ADD_PREFERENCES_PENDING,
    RECEIVE_USER_BY_ID,
    RECEIVE_QUESTIONS_BY_USER_ID,
    RECEIVE_USER_ANSWERS,
    RECEIVE_USER_FOLLOWING,
    RECEIVE_USER_FOLLOWERS,
    RECEIVE_FOLLOWED_USER,
    RECEIVE_NOTIFICATIONS,
    SET_IMAGE,
    RECEIVE_USER_POSTS,
    RECEIVE_MARK_NOTIFICATION_READ,
    REQUEST_ADD_NOTIFICATION,
    RECEIVE_MARK_ALL_NOTIFICATION_READ,
    SET_PAGE_LOADER,
    RECEIVE_EMAIL_PREFERENCES,
    RECEIVE_EDITED_EMAIL_PREFERENCES,
    RECEIVE_EMAIL_SUBSCRIPTION,
    RECEIVE_MANGE_USER_PREFERENCES } from '../actions/auth';

import { RECEIVE_FOLLOWED_TOPIC, RECEIVE_UPLOADED_TOPIC_IMAGE, RECEIVE_EDITED_TOPIC } from '../actions/topic';
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
    pageLoader: false,
    emailPreferences: [],
    emailSubscription: false,
};

export default (state = initialState, action) => {
    let followers = [];
    let index;
    let profile;
    let temp;
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
        case SET_PAGE_LOADER:
            return {
                ...state,
                pageLoader: action.loading,
            };
        case RECEIVE_USER_BY_ID:
            return {
                ...state,
                userProfile: action.profile,
                pending: false,
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
        case RECEIVE_FOLLOWED_TOPIC: {
            const {
                interest,
                interestRemoved,
                expertInRemoved,
                expertIn,
            } = action.res;

            let newExpertIn;
            let newInterests;

            if (expertInRemoved && interestRemoved){
                newExpertIn = state.expertIn.filter((i) => i._id !== expertIn._id);
                newInterests = state.interests.filter((i) => i._id !== interest._id);
                return {
                    ...state,
                    expertIn: newExpertIn,
                    interests: newInterests,
                    userProfile: {
                        ...state.userProfile,
                        expertIn: newExpertIn,
                        interests: newInterests,
                    },
                };
            }

            if (expertInRemoved){
                newExpertIn = state.expertIn.filter((i) => i._id !== expertIn._id);
                return {
                    ...state,
                    expertIn: newExpertIn,
                    userProfile: {
                        ...state.userProfile,
                        expertIn: newExpertIn,
                    },
                };
            }

            if (interestRemoved) {
                newInterests = state.interests.filter((i) => i._id !== interest._id);
                return {
                    ...state,
                    interests: newInterests,
                    userProfile: {
                        ...state.userProfile,
                        interests: newInterests,
                    },
                };
            }

            const obj = {
                expertIn: [],
                interests: [],
            };

            if (expertIn && !state.expertIn.find((o) => o._id === expertIn._id)){
                obj.expertIn.push(expertIn);
            }

            if (interest && !state.interests.find((o) => o._id === interest._id)){
                obj.interests.push(interest);
            }

            return {
                ...state,
                interests: [
                    ...state.interests,
                    ...obj.interests,
                ],
                expertIn: [
                    ...state.expertIn,
                    ...obj.expertIn,
                ],
                userProfile: {
                    ...state.userProfile,
                    interests: [
                        ...state.interests,
                        ...obj.interests,
                    ],
                    expertIn: [
                        ...state.expertIn,
                        ...obj.expertIn,
                    ],
                },
            };
        }
        case RECEIVE_FOLLOWED_BLOG: {
            const { blog, blogRemoved } = action.res;

            if (blogRemoved) {
                const newBlogs = state.blogs.filter((b) => b._id !== blog._id);
                return {
                    ...state,
                    blogs: newBlogs,
                    userProfile: {
                        ...state.userProfile,
                        blogs: newBlogs,
                    },
                };
            }
            return {
                ...state,
                blogs: [
                    ...state.blogs,
                    blog,
                ],
                userProfile: {
                    ...state.userProfile,
                    blogs: [
                        ...state.blogs,
                        blog,
                    ],
                },
            };
        }
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
        case RECEIVE_MANGE_USER_PREFERENCES:
            const updatedProfile = {};
            if (action.user.interests){
                updatedProfile.interests = action.user.interests;
            }
            if (action.user.expertIn) {
                updatedProfile.expertIn = action.user.expertIn;
            }
            if (action.user.blogs) {
                updatedProfile.blogs = action.user.blogs;
            }
            return {
                ...state,
                pending: false,
                ...updatedProfile,
                userProfile: {
                    ...state.userProfile,
                    ...updatedProfile,
                },
            };
        case RECEIVE_QUESTIONS_BY_USER_ID:
            return {
                ...state,
                feed: {
                    type: 'Questions',
                    items: action.res.questions,
                },
            };
        case RECEIVE_USER_ANSWERS:
            return {
                ...state,
                feed: {
                    type: 'Answers',
                    items: action.res.answers,
                },
            };
        case RECEIVE_USER_POSTS:
            return {
                ...state,
                feed: {
                    type: 'Posts',
                    items: action.res.posts,
                },
            };
        case RECEIVE_USER_FOLLOWERS:
            return {
                ...state,
                feed: {
                    type: 'Followers',
                    items: action.res.followers,
                },
            };
        case RECEIVE_USER_FOLLOWING:
            return {
                ...state,
                feed: {
                    type: 'Following',
                    items: action.res.following,
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
            temp = state.userProfile;
            temp.followers = followers;
            return {
                ...state,
                userProfile: temp,
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
        case RECEIVE_MARK_ALL_NOTIFICATION_READ: {
            return {
                ...state,
                notificationCount: 0,
                pageLoader: false,
            };
        }
        case RECEIVE_UPLOADED_TOPIC_IMAGE: {
            return {
                ...state,
                pageLoader: false,
                interests: state.interests.map((interest) => {
                    if (interest._id === action.res._id) {
                        return {
                            ...interest,
                            imageUrl: action.res.imageUrl,
                        };
                    }
                    return interest;
                }),
            };
        }
        case RECEIVE_EDITED_TOPIC:
            return {
                ...state,
                pageLoader: false,
                interests: state.interests.map((interest) => {
                    if (interest._id === action.topic._id) {
                        const temp = { ...interest };
                        temp.topic = action.topic.topic;
                        if (action.topic.imageUrl === ''){
                            temp.imageUrl = '';
                        }
                        return temp;
                    }
                    return interest;
                }),
            };
        case REQUEST_ADD_NOTIFICATION: {
            return {
                ...state,
                // notifications: [
                //     action.notification,
                //     ...state.notifications,
                // ],
                notificationCount: state.notificationCount + 1,
            };
        }
        case RECEIVE_EMAIL_PREFERENCES: {
            return {
                ...state,
                emailPreferences: action.res.emailPreferences,
                emailSubscription: action.res.emailSubscription,
            };
        }
        case RECEIVE_EDITED_EMAIL_PREFERENCES: {
            return {
                ...state,
                emailPreferences: action.res.emailPreferences,
            };
        }
        case RECEIVE_EMAIL_SUBSCRIPTION: {
            return {
                ...state,
                emailSubscription: action.res.emailSubscription,
            };
        }
        default:
            return state;
    }
};
