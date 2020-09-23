
export const CREATE_POST_DRAFT = 'CREATE_POST_DRAFT';
export const RECEIVE_DRAFTED_POST = 'RECEIVE_DRAFTED_POST';
export const ADD_DRAFT_PENDING = 'ADD_DRAFT_PENDING';
export const RECEIVE_DRAFTS = 'RECEIVE_DRAFTS';
export const REQUEST_DRAFTS = 'REQUEST_DRAFTS';
export const REQUEST_DRAFT_BY_ID = 'REQUEST_DRAFT_BY_ID';
export const RECEIVE_DRAFT_BY_ID = 'RECEIVE_DRAFT_BY_ID';
export const RECEIVE_DRAFT_FOR_CACHE = 'RECEIVE_DRAFT_FOR_CACHE';
export const EDIT_DRAFT = 'EDIT_DRAFT';
export const RECEIVE_EDITED_DRAFT = 'RECEIVE_EDITED_DRAFT';
export const DELETE_DRAFT = 'DELETE_DRAFT';
export const RECEIVE_DELETED_DRAFT = 'RECEIVE_DELETED_DRAFT';
export const POST_DRAFT = 'POST_DRAFT';
export const RECEIVE_POSTED_DRAFT = 'RECEIVE_POSTED_DRAFT';
export const CLEAR_POST_IN_DRAFT = 'CLEAR_POST_IN_DRAFT';


export function addDraftPending() {
    return {
        type: ADD_DRAFT_PENDING,
    };
}

const receiveCreatedDraft = (draft) => {
    return {
        type: RECEIVE_DRAFTED_POST,
        draft,
    };
};

export const createDraft = (body) => {
    return {
        type: CREATE_POST_DRAFT,
        makeApiRequest: {
            url: '/api/v1/draft.add',
            method: 'POST',
            body,
            success: (response) => receiveCreatedDraft(response),
        },
    };
};

const receiveDrafts = (drafts) => {
    return {
        type: RECEIVE_DRAFTS,
        drafts,
    };
};

export const requestDrafts = () => {
    return {
        type: REQUEST_DRAFTS,
        makeApiRequest: {
            url: `/api/v1/drafts`,
            method: 'GET',
            success: receiveDrafts,
        },
    };
};

const receiveDraftById = (draft) => {
    return {
        type: RECEIVE_DRAFT_BY_ID,
        draft,
    };
};

export const requestDraftById = (id, success, error) => {
    return {
        type: REQUEST_DRAFT_BY_ID,
        makeApiRequest: {
            url: `/api/v1/draft/${id}`,
            method: 'GET',
            success: receiveDraftById,
            errorcb: error,
        },
    };
};

const receiveEditedDraft = (res) => {
    return {
        type: RECEIVE_EDITED_DRAFT,
        res,
    };
};


export const addDraftToCache = (draft) => {
    return {
        type: RECEIVE_DRAFT_FOR_CACHE,
        draft,
    };
};

export const editDraft = (id, body, cb) => {
    return {
        type: EDIT_DRAFT,
        makeApiRequest: {
            url: `/api/v1/draft/${id}`,
            method: 'PUT',
            body,
            success: receiveEditedDraft,
            successcb: cb,
        },
    };
};

const receiveDeletedDraft= (res) => {
    return {
        type: RECEIVE_DELETED_DRAFT,
        res,
    };
};

export const deleteDraft = (id, cb) => {
    return {
        type: DELETE_DRAFT,
        makeApiRequest: {
            url: `/api/v1/draft/${id}`,
            method: 'DELETE',
            success: receiveDeletedDraft,
            successcb: cb,
        },
    };
};

const receivePostedDraft= (post) => {
    return {
        type: RECEIVE_POSTED_DRAFT,
        post,
    };
};

export const postDraft = (id, body) => {
    return {
        type: POST_DRAFT,
        makeApiRequest: {
            url: `/api/v1/postDraft.add/${id}`,
            method: 'POST',
            body,
            success: receivePostedDraft,
        },
    }
}