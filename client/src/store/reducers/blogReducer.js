import { ADD_BLOG_PENDING,
    RECEIVE_ADDED_BLOG,
    RECEIVE_BLOGS,
    RECEIVE_BLOG_BY_ID,
    RECEIVE_POSTS,
    RECEIVE_UPVOTE_POST,
    RECEIVE_DOWNVOTE_POST,
    RECEIVE_POST_FOR_CACHE,
    RECEIVE_ADDED_POST,
    REQUEST_POST_BY_ID,
    RECEIVE_POST_BY_ID } from '../actions/blog';

import { RECEIVE_FOLLOWED_TOPIC } from '../actions/topic';

import { RECEIVE_COMMENT_BY_ID } from '../actions/answer';

const initialState = {
    blog: {},
    blogs: [],
    posts: [],
    post: {},
    newTopic: {},
    pending: true,
    suggestedExperts: [],
    modifiedPosts: {},
    modifiedBlogs: {},
    comment: {},
};

export default (state = initialState, action) => {
    let index;
    let post;
    let id;
    let followers = [];
    let temp;
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
            // id = action.post.blog._id;
            // blogs = { ...state.modifiedBlogs };
            // if (blogs[id]){
            //     blogs[id].newPosts.unshift(action.post);
            // }
            // else {
            //     blogs[id] = { newPosts: [ action.post ] };
            // }
            return {
                ...state,
                pending: false,
                newPost: action.post,
                // modifiedBlogs: { ...blogs },
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
                newPost: {},
                blog: action.blog,
                pending: false,
            };
        case REQUEST_POST_BY_ID:
            return {
                ...state,
                post: {},
                newPost: {},
                pending: true,
            };
        case RECEIVE_POST_BY_ID:
            return {
                ...state,
                post: action.post,
                pending: false,
            };
        case RECEIVE_FOLLOWED_TOPIC:
            if (state.blog && state.blog.followers && !action.res.expertInRemoved){
                followers = [ ...state.blog.followers ];
                index = followers.indexOf(action.res._id);
                if (index >= 0){
                    followers.splice(index, 1);
                }
                else if (index < 0) followers.push(action.res._id);
                temp = state.blog;
                temp.followers = followers;
                return {
                    ...state,
                    topic: temp,
                    pending: false,
                };
            } return state;
        case RECEIVE_UPVOTE_POST:
            post = state.modifiedPosts;
            id = action.res._id;
            if (!post[id]){
                post[id] = {};
            }
            index = post[id].upvoters.findIndex(x => x._id === action.res.upvoter);
            if (index >= 0){
                post[id].upvoters.splice(index, 1);
            }
            else {
                index = post[id].downvoters.findIndex(x => x._id === action.res.upvoter);
                if (index !== -1){
                    post[id].downvoters.splice(index, 1);
                }
                post[id].upvoters.push({_id:action.res.upvoter});
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
                post[id].newComments = [];
            }
            post[id].upvoters = action.post.upvoters;
            post[id].downvoters = action.post.downvoters;
            return {
                ...state,
                modifiedPosts: { ...post },
            };
        case RECEIVE_COMMENT_BY_ID:
            if (action.comment.target === 'posts'){
                return {
                    ...state,
                    comment: action.comment,
                    pending: false,
                };
            }
            return {
                ...state,
                comment: {},
                pending: false,
            };
        default:
            return state;
    }
};
