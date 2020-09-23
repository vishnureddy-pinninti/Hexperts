import { 
    ADD_DRAFT_PENDING,
    RECEIVE_DRAFTED_POST,
    RECEIVE_DRAFTS,
    RECEIVE_DRAFT_BY_ID,
    RECEIVE_POSTED_DRAFT,} from '../actions/draft';

const initialState = {
    drafts: [],
    pending: true,
    newDraft: {},
    newPost: {},
    draft: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_DRAFT_PENDING:
            return {
                ...state,
                pending: true,
            };
        case RECEIVE_DRAFTED_POST:
            return {
                ...state,
                pending: false,
                drafts: [
                    action.draft,
                    ...state.drafts
                ],
                newDraft: action.draft,
            };
        case RECEIVE_DRAFTS:
            return {
                ...state,
                drafts: action.drafts,
                newPost: {},
            };
        case RECEIVE_DRAFT_BY_ID:
            return {
                ...state,
                draft: action.draft,
                newDraft: {},
                newPost: {},
            };
        case RECEIVE_POSTED_DRAFT:
            return {
                ...state,
                pending: false,
                newPost: action.post
            }
        default:
            return state;
        }
    }