export const ADD_NEW_TOPIC = 'ADD_NEW_TOPIC';
export const RECEIVE_ADDED_TOPIC = 'RECEIVE_ADDED_TOPIC';
export const ADD_TOPIC_PENDING = 'ADD_TOPIC_PENDING';
export const RECEIVE_TOPICS = 'RECEIVE_TOPICS';
export const REQUEST_TOPICS = 'REQUEST_TOPICS';
export const REQUEST_TOPIC_BY_ID = 'REQUEST_TOPIC_BY_ID';
export const RECEIVE_TOPIC_BY_ID = 'RECEIVE_TOPIC_BY_ID';
export const FOLLOW_TOPIC = 'FOLLOW_TOPIC';
export const RECEIVE_FOLLOWED_TOPIC = 'RECEIVE_FOLLOWED_TOPIC';
export const REQUEST_SUGGESTED_EXPERTS = 'REQUEST_SUGGESTED_EXPERTS';
export const RECEIVE_SUGGESTED_EXPERTS = 'RECEIVE_SUGGESTED_EXPERTS';

export function addTopicPending() {
    return {
        type: ADD_TOPIC_PENDING,
    };
}

const receiveAddedTopic = (topic) => {
    return {
        type: RECEIVE_ADDED_TOPIC,
        topic,
    };
};

export const addNewTopic = (body, cb) => {
    return {
        type: ADD_NEW_TOPIC,
        makeApiRequest: {
            url: '/api/v1/topics.add',
            method: 'POST',
            body,
            success: (response) => receiveAddedTopic(response),
            successcb: cb,
        },
    };
};

const receiveTopics = (topics) => {
    return {
        type: RECEIVE_TOPICS,
        topics,
    };
};

export const requestTopics = () => {
    return {
        type: REQUEST_TOPICS,
        makeApiRequest: {
            url: '/api/v1/topics',
            method: 'GET',
            success: receiveTopics,
        },
    };
};

const receiveTopicById = (topic) => {
    return {
        type: RECEIVE_TOPIC_BY_ID,
        topic,
    };
};

export const requestTopicById = (id, params = { skip: 0 }) => {
    return {
        type: REQUEST_TOPIC_BY_ID,
        makeApiRequest: {
            url: `/api/v1/topic/${id}?skip=${params.skip}`,
            method: 'GET',
            success: receiveTopicById,
        },
    };
};

const receiveFollowedTopic = (res) => {
    return {
        type: RECEIVE_FOLLOWED_TOPIC,
        res,
    };
};

export const followTopic = (postData) => {
    return {
        type: FOLLOW_TOPIC,
        makeApiRequest: {
            url: '/api/v1/user-interests.manage',
            method: 'POST',
            body: postData,
            success: receiveFollowedTopic,
        },
    };
};

const receiveSuggestedExperts = (res) => {
    return {
        type: RECEIVE_SUGGESTED_EXPERTS,
        res,
    };
};

export const requestSuggestedExperts = (id) => {
    return {
        type: REQUEST_SUGGESTED_EXPERTS,
        makeApiRequest: {
            url: `/api/v1/suggested-experts/?_topics=${id}`,
            method: 'GET',
            success: receiveSuggestedExperts,
        },
    };
};
