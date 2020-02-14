export const REQUEST_USER_SESSION = 'REQUEST_USER_SESSION';
export const RECEIVE_USER_SESSION = 'RECEIVE_USER_SESSION';

const receiveUserSession = user => {
    return {
        type: RECEIVE_USER_SESSION,
        user
    }
}

export const requestUserSession = (user) => {
    return {
        type: REQUEST_USER_SESSION,
        makeApiRequest: {
            url: '/api/v1/user.read',
            method: 'POST',
            body: user,
            success: response => receiveUserSession(response),
        }
    }
}