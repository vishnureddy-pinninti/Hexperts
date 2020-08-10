import { buildApiUrl } from '../../utils/common';

export const REQUEST_DASHBOARD_SUMMARY = 'REQUEST_DASHBOARD_SUMMARY';
export const RECEIVE_DASHBOARD_SUMMARY = 'RECEIVE_DASHBOARD_SUMMARY';
export const REQUEST_DASHBOARD_TOPICS = 'REQUEST_DASHBOARD_TOPICS';
export const RECEIVE_DASHBOARD_TOPICS = 'RECEIVE_DASHBOARD_TOPICS';
export const REQUEST_DASHBOARD_USERS = 'REQUEST_DASHBOARD_USERS';
export const RECEIVE_DASHBOARD_USERS = 'RECEIVE_DASHBOARD_USERS';
export const REQUEST_USER_SUMMARY = 'REQUEST_USER_SUMMARY';
export const RECEIVE_USER_SUMMARY = 'RECEIVE_USER_SUMMARY';
export const REQUEST_REVOKE_ADMIN_ACCESS = 'REQUEST_REVOKE_ADMIN_ACCESS';
export const RECEIVE_REVOKE_ADMIN_ACCESS = 'RECEIVE_REVOKE_ADMIN_ACCESS';
export const REQUEST_GRANT_ADMIN_ACCESS = 'REQUEST_GRANT_ADMIN_ACCESS';
export const RECEIVE_GRANT_ADMIN_ACCESS = 'RECEIVE_GRANT_ADMIN_ACCESS';
export const REQUEST_UNIQUE_VALUES = 'REQUEST_UNIQUE_VALUES';
export const RECEIVE_UNIQUE_VALUES = 'RECEIVE_UNIQUE_VALUES';

const receiveDashboardSummary = (summary) => {
    return {
        type: RECEIVE_DASHBOARD_SUMMARY,
        summary,
    }
}

export const requestDashboardSummary = (params) => {
    return {
        type: REQUEST_DASHBOARD_SUMMARY,
        makeApiRequest: {
            url: buildApiUrl('/api/v1/dashbaord-summary', params),
            method: 'GET',
            success: (response) => receiveDashboardSummary(response),
        },
    };
}

const receiveDashboardTopics = (topics) => {
    return {
        type: RECEIVE_DASHBOARD_TOPICS,
        topics,
    }
}

export const requestDashboardTopics = (params) => {
    return {
        type: REQUEST_DASHBOARD_TOPICS,
        makeApiRequest: {
            url: buildApiUrl('/api/v1/dashboard-topics', params),
            method: 'GET',
            success: (response) => receiveDashboardTopics(response),
        },
    };
}

const receiveDashboardUsers = (users) => {
    return {
        type: RECEIVE_DASHBOARD_USERS,
        users,
    }
}

export const requestDashboardUsers = (params) => {
    return {
        type: REQUEST_DASHBOARD_USERS,
        makeApiRequest: {
            url: buildApiUrl('/api/v1/dashboard-users', params),
            method: 'GET',
            success: (response) => receiveDashboardUsers(response),
        },
    };
}

const receiveUserSummary = (userSummary) => {
    return {
        type: RECEIVE_USER_SUMMARY,
        userSummary,
    }
}

export const requestUserSummary = () => {
    return {
        type: REQUEST_USER_SUMMARY,
        makeApiRequest: {
            url: '/api/v1/user-summary',
            method: 'GET',
            success: (response) => receiveUserSummary(response),
        },
    };
}

const receiveGrantAdminAccess = (user) => {
    return {
        type: RECEIVE_GRANT_ADMIN_ACCESS,
        user
    }
}

export const requestGrantAdminAccess = (body) => {
    return {
        type: REQUEST_GRANT_ADMIN_ACCESS,
        makeApiRequest: {
            url: '/api/v1/grant-admin-access',
            method: 'POST',
            body,
            success: (response) => receiveGrantAdminAccess(response),
        },
    }
}

const receiveRevokeAdminAccess = (user) => {
    return {
        type: RECEIVE_REVOKE_ADMIN_ACCESS,
        user
    }
}

export const requestRevokeAdminAccess = (body) => {
    return {
        type: REQUEST_REVOKE_ADMIN_ACCESS,
        makeApiRequest: {
            url: '/api/v1/revoke-admin-access',
            method: 'POST',
            body,
            success: (response) => receiveRevokeAdminAccess(response),
        },
    }
}

const receiveUniqueValues = (uniqueValues) => {
    return {
        type: RECEIVE_UNIQUE_VALUES,
        uniqueValues,
    }
}

export const requestUniqueValues = () => {
    return {
        type: REQUEST_UNIQUE_VALUES,
        makeApiRequest: {
            url: '/api/v1/distinct-dashboard-values',
            method: 'GET',
            success: (response) => receiveUniqueValues(response),
        },
    }
}