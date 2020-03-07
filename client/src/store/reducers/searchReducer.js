import { RECEIVE_SEARCH } from '../actions/search';

const initialState = {
    results: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_SEARCH:
            return {
                ...state,
                results: action.res.results,
            };
        default:
            return state;
    }
};
