import { RECEIVE_SEARCH, RECEIVE_ADVANCED_SEARCH } from '../actions/search';

const initialState = {
    results: [],
    advancedResults: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_SEARCH:
            return {
                ...state,
                results: action.res.results,
            };
        case RECEIVE_ADVANCED_SEARCH:
            return {
                ...state,
                advancedResults: action.res.results,
            };
        default:
            return state;
    }
};
