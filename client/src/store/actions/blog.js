export const ADD_NEW_BLOG = 'ADD_NEW_BLOG';
export const RECEIVE_ADDED_BLOG = 'RECEIVE_ADDED_BLOG';
export const ADD_BLOG_PENDING = 'ADD_BLOG_PENDING';
export const RECEIVE_BLOGS = 'RECEIVE_BLOGS';
export const REQUEST_BLOGS = 'REQUEST_BLOGS';
export const REQUEST_BLOG_BY_ID = 'REQUEST_BLOG_BY_ID';
export const RECEIVE_BLOG_BY_ID = 'RECEIVE_BLOG_BY_ID';
export const FOLLOW_BLOG = 'FOLLOW_BLOG';
export const RECEIVE_FOLLOWED_BLOG = 'RECEIVE_FOLLOWED_BLOG';
export const REQUEST_SUGGESTED_EXPERTS = 'REQUEST_SUGGESTED_EXPERTS';
export const RECEIVE_SUGGESTED_EXPERTS = 'RECEIVE_SUGGESTED_EXPERTS';
export const ADD_POST_TO_BLOG = 'ADD_POST_TO_BLOG';
export const RECEIVE_ADDED_POST = 'RECEIVE_ADDED_POST';
export const ADD_POST_PENDING = 'ADD_POST_PENDING';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const REQUEST_POSTS = 'REQUEST_POSTS';
export const REQUEST_UPVOTE_POST = 'REQUEST_UPVOTE_POST';
export const RECEIVE_UPVOTE_POST = 'RECEIVE_UPVOTE_POST';
export const REQUEST_DOWNVOTE_POST = 'REQUEST_DOWNVOTE_POST';
export const RECEIVE_DOWNVOTE_POST = 'RECEIVE_DOWNVOTE_POST';
export const RECEIVE_POST_FOR_CACHE = 'RECEIVE_POST_FOR_CACHE';
export const REQUEST_POST_BY_ID = 'REQUEST_POST_BY_ID';
export const RECEIVE_POST_BY_ID = 'RECEIVE_POST_BY_ID';

export function addBlogPending() {
    return {
        type: ADD_BLOG_PENDING,
    };
}

const receiveAddedBlog = (topic) => {
    return {
        type: RECEIVE_ADDED_BLOG,
        topic,
    };
};

export const addNewBlog = (body) => {
    return {
        type: ADD_NEW_BLOG,
        makeApiRequest: {
            url: '/api/v1/blog.add',
            method: 'POST',
            body,
            success: (response) => receiveAddedBlog(response),
        },
    };
};

const receiveBlogs = (blogs) => {
    return {
        type: RECEIVE_BLOGS,
        blogs,
    };
};

export const requestBlogs = () => {
    return {
        type: REQUEST_BLOGS,
        makeApiRequest: {
            url: '/api/v1/blogs',
            method: 'GET',
            success: receiveBlogs,
        },
    };
};

const receiveBlogById = (blog) => {
    return {
        type: RECEIVE_BLOG_BY_ID,
        blog,
    };
};

export const requestBlogById = (id) => {
    return {
        type: REQUEST_BLOG_BY_ID,
        makeApiRequest: {
            url: `/api/v1/blogs/${id}`,
            method: 'GET',
            success: receiveBlogById,
        },
    };
};

const receiveFollowedBlog = (res) => {
    return {
        type: RECEIVE_FOLLOWED_BLOG,
        res,
    };
};

export const followBlog = (postData) => {
    return {
        type: FOLLOW_BLOG,
        makeApiRequest: {
            url: '/api/v1/user-blogs.manage',
            method: 'POST',
            body: postData,
            success: receiveFollowedBlog,
        },
    };
};


export function addPostPending() {
    return {
        type: ADD_POST_PENDING,
    };
}

const receiveAddedPost = (post) => {
    return {
        type: RECEIVE_ADDED_POST,
        post,
    };
};

export const addPostToBlog = (body) => {
    return {
        type: ADD_POST_TO_BLOG,
        makeApiRequest: {
            url: '/api/v1/post.add',
            method: 'POST',
            body,
            success: (response) => receiveAddedPost(response),
        },
    };
};

const receivePosts = (posts) => {
    return {
        type: RECEIVE_POSTS,
        posts,
    };
};

export const requestPosts = () => {
    return {
        type: REQUEST_POSTS,
        makeApiRequest: {
            url: '/api/v1/posts',
            method: 'GET',
            success: receivePosts,
        },
    };
};

export const addPostToCache = (post) => {
    return {
        type: RECEIVE_POST_FOR_CACHE,
        post,
    };
};

const receiveDownvotedPost = (res) => {
    return {
        type: RECEIVE_DOWNVOTE_POST,
        res,
    };
};

export const downvotePost = (id) => {
    return {
        type: REQUEST_DOWNVOTE_POST,
        makeApiRequest: {
            url: `/api/v1/post-downvote/${id}`,
            method: 'GET',
            success: receiveDownvotedPost,
        },
    };
};

const receiveUpvotedPost = (res) => {
    return {
        type: RECEIVE_UPVOTE_POST,
        res,
    };
};

export const upvotePost = (id) => {
    return {
        type: REQUEST_UPVOTE_POST,
        makeApiRequest: {
            url: `/api/v1/post-upvote/${id}`,
            method: 'GET',
            success: receiveUpvotedPost,
        },
    };
};

const receivePostById = (post) => {
    return {
        type: RECEIVE_POST_BY_ID,
        post,
    };
};

export const requestPostById = (id) => {
    return {
        type: REQUEST_POST_BY_ID,
        makeApiRequest: {
            url: `/api/v1/post/${id}`,
            method: 'GET',
            success: receivePostById,
        },
    };
};
