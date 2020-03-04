import { ADD_TOPIC_PENDING, RECEIVE_ADDED_TOPIC, RECEIVE_TOPICS, RECEIVE_TOPIC_BY_ID, RECEIVE_FOLLOWED_TOPIC } from '../actions/topic';

const initialState = {
    topic: {},
    topics: [],
    newTopic: {},
    pending: true,
};

export default (state = initialState, action) => {
    let index;
    let followers = [];
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
        case RECEIVE_FOLLOWED_TOPIC:
            followers = [ ...state.topic.followers ];
            index = followers.indexOf(action.res.follower);
            if (index >= 0){
                followers.splice(index, 1);
            }
            else {
                followers.push(action.res.follower);
            }
            return {
                ...state,
                topic: {
                    ...state.topic,
                    followers,
                },
            };
        default:
            return state;
    }
};
