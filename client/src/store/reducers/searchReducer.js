import { RECEIVE_SEARCH, RECEIVE_ADVANCED_SEARCH, REQUEST_ADVANCED_SEARCH, RECEIVE_FAILURE_RESPONSE } from '../actions/search';

const initialState = {
    results: [],
    advancedResults: [],
    totalCount: null,
    paginationIndex: 1,
    paginationHasMore: true,
    loading: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_SEARCH:
            
            let searchResults = action.res.results.sort(function(a, b) {return (a.type > b.type) ? 1 : -1})
            return {
                ...state,
                results: searchResults,
            };
        case RECEIVE_ADVANCED_SEARCH: {
            let nextIndex = state.paginationIndex + 1;
            let nextHasMore = state.paginationHasMore;
            let searchResults = action.res.results.sort(function(a, b) {return (a.type > b.type) ? 1 : -1})
            if (action.res.results.length < action.limit) {
                nextHasMore = false;
                nextIndex = state.paginationIndex;
            }

            return {
                ...state,
                advancedResults: [ ...state.advancedResults, ...searchResults ],
                totalCount: action.res.totalCount,
                paginationIndex: nextIndex,
                paginationHasMore: nextHasMore,
                loading: false,
            };
        }
        case REQUEST_ADVANCED_SEARCH:
            if (action.skip === 0) {
                return {
                    ...state,
                    totalCount: null,
                    advancedResults: [],
                    paginationIndex: 1,
                    paginationHasMore: true,
                    loading: true,
                };
            }
            return {
                ...state,
                loading: true,
            };
        case RECEIVE_FAILURE_RESPONSE:
            return {
                ...state,
                totalCount: 0,
                loading: false,
                paginationHasMore: false,
            };
        default:
            return state;
    }
};
