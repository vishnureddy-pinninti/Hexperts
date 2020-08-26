import {
    RECEIVE_DASHBOARD_SUMMARY,
    RECEIVE_USER_SUMMARY,
    RECEIVE_DASHBOARD_TOPICS,
    RECEIVE_DASHBOARD_USERS,
    RECEIVE_GRANT_ADMIN_ACCESS,
    RECEIVE_REVOKE_ADMIN_ACCESS,
    RECEIVE_MONTHLY_TOP_CONTRIBUTORS,
    RECEIVE_UNIQUE_VALUES,
} from '../actions/dashboard';

const initialState = {
    summary: {},
    userSummary: {},
    topics: [],
    users: [],
    monthlyTopContributors: [],
    uniqueValues: {},
}

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_DASHBOARD_SUMMARY:
            return {
                ...state,
                summary: action.summary,
            };
        case RECEIVE_USER_SUMMARY:
            return {
                ...state,
                userSummary: action.userSummary,
            };
        case RECEIVE_DASHBOARD_TOPICS:
            return {
                ...state,
                topics: action.topics,
            }
        case RECEIVE_DASHBOARD_USERS:
            return {
                ...state,
                users: action.users,
            }
        case RECEIVE_MONTHLY_TOP_CONTRIBUTORS:
            return {
                ...state,
                monthlyTopContributors: action.monthlyTopContributors,
            }
        case RECEIVE_GRANT_ADMIN_ACCESS:
        case RECEIVE_REVOKE_ADMIN_ACCESS:
            return {
                ...state,
                users: state.users.map((user) => {
                    if (user._id === action.user._id) {
                        user.role = action.user.role;
                    }
                    return user;
                })
            }
        case RECEIVE_UNIQUE_VALUES:
            return {
                ...state,
                uniqueValues: action.uniqueValues,
            }
        default:
            return state;
    }
}