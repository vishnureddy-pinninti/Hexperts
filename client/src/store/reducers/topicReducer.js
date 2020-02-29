import { ADD_TOPIC_PENDING, RECEIVE_ADDED_TOPIC, RECEIVE_TOPICS, RECEIVE_TOPIC_BY_ID } from '../actions/topic';

const initialState = {
    topic: {},
    topics: [],
    newTopic: {},
    pending: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TOPIC_PENDING:
            return {
                ...state,
                pending: true,
            };
        case RECEIVE_ADDED_TOPIC:
            return {
                ...state,
                pending: false,
                topics: [
                    ...action.topic,
                    ...state.topics,
                ],
                newTopic: action.topic[0],
            };
        case RECEIVE_TOPICS:
            return {
                ...state,
                topics: action.topics,
            };
        case RECEIVE_TOPIC_BY_ID:
            return {
                ...state,
                topic: action.topic,
                pending: false,
            };
        default:
            return state;
    }
};
