import { ADD_BLOG_PENDING,
    RECEIVE_ADDED_BLOG,
    RECEIVE_BLOGS,
    RECEIVE_BLOG_BY_ID,
    RECEIVE_POSTS,
    RECEIVE_UPVOTE_POST,
    RECEIVE_DOWNVOTE_POST,
    RECEIVE_POST_FOR_CACHE,
    RECEIVE_ADDED_POST,
    RECEIVE_POST_BY_ID,
    RECEIVE_FOLLOWED_BLOG } from '../actions/blog';

const initialState = {
    blog: {},
    blogs: [],
    posts: [],
    post: {},
    newTopic: {},
    pending: true,
    suggestedExperts: [],
    modifiedPosts: {},
};

export default (state = initialState, action) => {
    let index;
    let post;
    let id;
    let followers = [];
    switch (action.type) {
        case ADD_BLOG_PENDING:
            return {
                ...state,
                pending: true,
            };
        case RECEIVE_POSTS:
            return {
                ...state,
                posts: action.posts,
            };
        case RECEIVE_ADDED_POST:
            return {
                ...state,
                pending: false,
                blog: {
                    ...state.blog,
                    posts: [
                        action.post,
                        ...state.blog.posts,
                    ],
                },
                newPost: action.post,
            };
        case RECEIVE_ADDED_BLOG:
            return {
                ...state,
                pending: false,
                blogs: [
                    action.blog,
                    ...state.blogs,
                ],
                newBlog: action.blog,
            };
        case RECEIVE_BLOGS:
            return {
                ...state,
                blogs: action.blogs,
            };
        case RECEIVE_BLOG_BY_ID:
            return {
                ...state,
                newBlog: {},
                blog: action.blog,
                pending: false,
            };
        case RECEIVE_POST_BY_ID:
            return {
                ...state,
                post: action.post,
                pending: false,
            };
        case RECEIVE_FOLLOWED_BLOG:
            followers = [ ...state.blog.followers ];
            index = followers.indexOf(action.res._id);
            if (index >= 0){
                followers.splice(index, 1);
            }
            else {
                followers.push(action.res._id);
            }
            return {
                ...state,
                blog: {
                    ...state.blog,
                    followers,
                },
            };
        case RECEIVE_UPVOTE_POST:
            post = state.modifiedPosts;
            id = action.res._id;
            if (!post[id]){
                post[id] = {};
            }
            index = post[id].upvoters.indexOf(action.res.upvoter);
            if (index >= 0){
                post[id].upvoters.splice(index, 1);
            }
            else {
                index = post[id].downvoters.indexOf(action.res.upvoter);
                if (index !== -1){
                    post[id].downvoters.splice(index, 1);
                }
                post[id].upvoters.push(action.res.upvoter);
            }
            return {
                ...state,
                modifiedPosts: { ...post },
            };
        case RECEIVE_DOWNVOTE_POST:
            post = state.modifiedPosts;
            id = action.res._id;
            if (!post[id]){
                post[id] = { downvoters: [] };
            }
            index = post[id].downvoters.indexOf(action.res.downvoter);
            if (index >= 0){
                post[id].downvoters.splice(index, 1);
            }
            else {
                index = post[id].upvoters.indexOf(action.res.downvoter);
                if (index !== -1){
                    post[id].upvoters.splice(index, 1);
                }
                post[id].downvoters.push(action.res.downvoter);
            }
            return {
                ...state,
                modifiedPosts: { ...post },
            };
        case RECEIVE_POST_FOR_CACHE:
            post = state.modifiedPosts;
            id = action.post._id;
            if (!post[id]){
                post[id] = {};
            }
            post[id].upvoters = action.post.upvoters;
            post[id].downvoters = action.post.downvoters;
            return {
                ...state,
                modifiedPosts: { ...post },
            };
        default:
            return state;
    }
};
