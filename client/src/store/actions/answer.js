export const ADD_ANSWER_TO_QUESTION = 'ADD_ANSWER_TO_QUESTION';
export const RECEIVE_ADDED_ANSWER = 'RECEIVE_ADDED_ANSWER';
export const ADD_ANSWER_PENDING = 'ADD_ANSWER_PENDING';
export const REQUEST_UPVOTE_ANSWER = 'REQUEST_UPVOTE_ANSWER';
export const RECEIVE_UPVOTE_ANSWER = 'RECEIVE_UPVOTE_ANSWER';
export const REQUEST_DOWNVOTE_ANSWER = 'REQUEST_DOWNVOTE_ANSWER';
export const RECEIVE_DOWNVOTE_ANSWER = 'RECEIVE_DOWNVOTE_ANSWER';
export const RECEIVE_ANSWER_FOR_CACHE = 'RECEIVE_ANSWER_FOR_CACHE';
export const REQUEST_ANSWER_BY_ID = 'REQUEST_ANSWER_BY_ID';
export const RECEIVE_ANSWER_BY_ID = 'RECEIVE_ANSWER_BY_ID';
export const RECEIVE_COMMENT_ANSWER = 'RECEIVE_COMMENT_ANSWER';
export const REQUEST_COMMENT_ANSWER = 'REQUEST_COMMENT_ANSWER';
export const REQUEST_ANSWER_COMMENTS = 'REQUEST_ANSWER_COMMENTS';
export const RECEIVE_ANSWER_COMMENTS = 'RECEIVE_ANSWER_COMMENTS';
export const RECEIVE_COMMENT_BY_ID = 'RECEIVE_COMMENT_BY_ID';
export const REQUEST_COMMENT_BY_ID = 'REQUEST_COMMENT_BY_ID';
export const RECEIVE_DELTEED_ANSWER = 'RECEIVE_DELTEED_ANSWER';
export const DELETE_ANSWER = 'DELETE_ANSWER';
export const EDIT_ANSWER = 'EDIT_ANSWER';
export const RECEIVE_EDITED_ANSWER = 'RECEIVE_EDITED_ANSWER';
export const EDIT_CODE = 'EDIT_CODE';
export const RECEIVE_DELETED_COMMENT = 'RECEIVE_DELETED_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const RECEIVE_EDITED_COMMENT = 'RECEIVE_EDITED_COMMENT';
export const EDIT_COMMENT = 'EDIT_COMMENT';

export function addAnswerPending() {
    return {
        type: ADD_ANSWER_PENDING,
    };
}

const receiveAddedAnswer = (answer) => {
    return {
        type: RECEIVE_ADDED_ANSWER,
        answer,
    };
};

export const addAnswerToQuestion = (body) => {
    return {
        type: ADD_ANSWER_TO_QUESTION,
        makeApiRequest: {
            url: '/api/v1/answer.add',
            method: 'POST',
            body,
            success: (response) => receiveAddedAnswer(response),
        },
    };
};

const receiveUpvotedAnswer = (res) => {
    return {
        type: RECEIVE_UPVOTE_ANSWER,
        res,
    };
};

export const upvoteAnswer = (id) => {
    return {
        type: REQUEST_UPVOTE_ANSWER,
        makeApiRequest: {
            url: `/api/v1/answer-upvote/${id}`,
            method: 'GET',
            success: receiveUpvotedAnswer,
        },
    };
};

const receiveDeletedAnswer = (res) => {
    return {
        type: RECEIVE_DELTEED_ANSWER,
        res,
    };
};

export const deleteAnswer = (id, cb) => {
    return {
        type: DELETE_ANSWER,
        makeApiRequest: {
            url: `/api/v1/answers/${id}`,
            method: 'DELETE',
            success: receiveDeletedAnswer,
            successcb: cb,
        },
    };
};

const receiveEditedAnswer = (res) => {
    return {
        type: RECEIVE_EDITED_ANSWER,
        res,
    };
};

export const editAnswer = (id, body, cb) => {
    return {
        type: EDIT_ANSWER,
        makeApiRequest: {
            url: `/api/v1/answers/${id}`,
            method: 'PUT',
            body,
            success: receiveEditedAnswer,
            successcb: cb,
        },
    };
};

export const addAnswerToCache = (answer) => {
    return {
        type: RECEIVE_ANSWER_FOR_CACHE,
        answer,
    };
};

const receiveDownvotedAnswer = (res) => {
    return {
        type: RECEIVE_DOWNVOTE_ANSWER,
        res,
    };
};

export const downvoteAnswer = (id) => {
    return {
        type: REQUEST_DOWNVOTE_ANSWER,
        makeApiRequest: {
            url: `/api/v1/answer-downvote/${id}`,
            method: 'GET',
            success: receiveDownvotedAnswer,
        },
    };
};

const receiveCommentedAnswer = (res, targetID) => {
    return {
        type: RECEIVE_COMMENT_ANSWER,
        res,
        targetID,
    };
};

export const commentAnswer = (body, success, error) => {
    return {
        type: REQUEST_COMMENT_ANSWER,
        makeApiRequest: {
            url: '/api/v1/comment.add',
            method: 'POST',
            body,
            success: (response) => receiveCommentedAnswer(response, body.targetID),
            successcb: success,
            errorcb: error,
        },
    };
};

const receiveCommentsForAnswer = (comments, targetID) => {
    return {
        type: RECEIVE_ANSWER_COMMENTS,
        comments,
        targetID,
    };
};

export const requestCommentsForAnswer = (id, params = { skip: 0 }, success, error) => {
    return {
        type: REQUEST_ANSWER_COMMENTS,
        makeApiRequest: {
            url: `/api/v1/comments/${id}?skip=${params.skip}`,
            method: 'GET',
            success: (response) => receiveCommentsForAnswer(response, id),
            successcb: success,
            errorcb: error,
        },
    };
};

const receiveAnswerById = (answer) => {
    return {
        type: RECEIVE_ANSWER_BY_ID,
        answer,
    };
};

export const requestAnswerById = (id, successcb, errorcb) => {
    return {
        type: REQUEST_ANSWER_BY_ID,
        makeApiRequest: {
            url: `/api/v1/answers/${id}`,
            method: 'GET',
            success: receiveAnswerById,
            errorcb,
        },
    };
};

const receiveCommentById = (comment) => {
    return {
        type: RECEIVE_COMMENT_BY_ID,
        comment,
    };
};

export const requestCommentById = (id, success, error) => {
    return {
        type: REQUEST_COMMENT_BY_ID,
        makeApiRequest: {
            url: `/api/v1/comment/${id}`,
            method: 'GET',
            success: receiveCommentById,
            successcb: success,
            errorcb: error,
        },
    };
};

export function editCode(data) {
    return {
        type: EDIT_CODE,
        data,
    };
}

const receiveDeletedComment = (res) => {
    return {
        type: RECEIVE_DELETED_COMMENT,
        res,
    };
};

export const deleteComment = (id, cb, error) => {
    return {
        type: DELETE_COMMENT,
        makeApiRequest: {
            url: `/api/v1/comments/${id}`,
            method: 'DELETE',
            success: receiveDeletedComment,
            successcb: cb,
            errorcb: error,
        },
    };
};

const receiveEditedComment = (res) => {
    return {
        type: RECEIVE_EDITED_COMMENT,
        res,
    };
};

export const editComment = (id, body, cb) => {
    return {
        type: EDIT_COMMENT,
        makeApiRequest: {
            url: `/api/v1/comments/${id}`,
            method: 'PUT',
            body,
            success: receiveEditedComment,
            successcb: cb,
        },
    };
};
