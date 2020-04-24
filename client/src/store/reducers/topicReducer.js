import { ADD_TOPIC_PENDING,
    RECEIVE_ADDED_TOPIC,
    RECEIVE_TOPICS,
    RECEIVE_TOPIC_BY_ID,
    RECEIVE_SUGGESTED_EXPERTS,
    RECEIVE_UPLOADED_TOPIC_IMAGE,
    RECEIVE_EDITED_TOPIC,
    RECEIVE_FOLLOWED_TOPIC } from '../actions/topic';

const initialState = {
    topic: {},
    topics: [],
    pending: true,
    suggestedExperts: [],
};

export default (state = initialState, action) => {
    let index;
    let followers = [];
    let temp;
    switch (action.type) {
        case ADD_TOPIC_PENDING:
            return {
                ...state,
                pending: true,
            };
        case RECEIVE_SUGGESTED_EXPERTS:
            return {
                ...state,
                suggestedExperts: action.res,
            };
        case RECEIVE_ADDED_TOPIC:
            return {
                ...state,
                pending: false,
                topics: [
                    ...action.topic,
                    ...state.topics,
                ],
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
            if (state.topic && state.topic.followers && !action.res.expertInRemoved){
                followers = [ ...state.topic.followers ];
                index = followers.indexOf(action.res._id);
                if (index >= 0 && action.res.interestRemoved){
                    followers.splice(index, 1);
                }
                else if (index < 0) followers.push(action.res._id);
                temp = state.topic;
                temp.followers = followers;

                return {
                    ...state,
                    topic: temp,
                };
            } return state;
        case RECEIVE_UPLOADED_TOPIC_IMAGE:
            temp = state.topic;
            temp.imageUrl = action.res.imageUrl;
            return {
                ...state,
                topic: temp,
                topics: state.topics.map((topic) => {
                    if (topic._id === action.res._id) {
                        return {
                            ...topic,
                            imageUrl: action.res.imageUrl,
                        };
                    }
                    return topic;
                }),
                pending: false,
            };
        case RECEIVE_EDITED_TOPIC:
            temp = state.topic;
            temp.topic = action.topic.topic;
            return {
                ...state,
                topic: temp,
                topics: state.topics.map((topic) => {
                    if (topic._id === action.topic._id) {
                        return {
                            ...topic,
                            topic: action.topic.topic,
                        };
                    }
                    return topic;
                }),
                pending: false,
            };
        default:
            return state;
    }
};
