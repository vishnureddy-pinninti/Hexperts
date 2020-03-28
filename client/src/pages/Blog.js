import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '@material-ui/lab/Skeleton';
import BlogsList from '../components/blog/BlogsList';
import Header from '../components/blog/BlogHeader';
import FollowBlogsModal from '../components/blog/FollowBlogsModal';
import EmptyResults from '../components/base/EmptyResults';
import CardLoader from '../components/base/CardLoader';

import PostCard from '../components/blog/PostCard';
import { requestBlogById } from '../store/actions/blog';


function Topic(props) {
    const {
        match: {
            params: { blogId 
},
        },
        requestBlog,
        onLogout,
        pending,
        followedBlogs,
        newPost,
        modifiedBlogs,
    } = props;

    const [
        openFollowTopicsModal,
        setOpenFollowTopicsModal,
    ] = React.useState(false);

    const [
        loading,
        setLoading,
    ] = React.useState(false);

    useEffect(() => {
        if (!pending) {
            setOpenFollowTopicsModal(pending);
        }
    }, [ pending ]);

    const handleFollowTopicsModalOpen = () => {
        setOpenFollowTopicsModal(true);
    };

    const handleFollowTopicsModalClose = () => {
        setOpenFollowTopicsModal(false);
    };

    const [
        items,
        setItems,
    ] = React.useState([]);

    const [
        pagination,
        setPagination,
    ] = React.useState({
        index: 0,
        hasMore: true,
    });

    const { blog } = props;

    useEffect(() => {
        if (blog && blog.posts){
            const { posts } = blog;
            if (posts.length) {
                setItems([
                    ...items,
                    ...posts,
                ]);
                setPagination({
                    index: pagination.index + 1,
                    hasMore: true,
                });
            }
            else {
                setPagination({
                    ...pagination,
                    hasMore: false,
                });
            }
        }
        else {
            setPagination({
                index: 0,
                hasMore: false,
            });
        }
        setLoading(false);
    }, [ blog ]);

    const [
        newPosts,
        setNewPosts,
    ] = React.useState([]);

    useEffect(() => {
        if (modifiedBlogs && modifiedBlogs[blogId] && modifiedBlogs[blogId].newAnswers){
            setNewPosts([ ...modifiedBlogs[blogId].newPosts ]);
        }
    }, [ modifiedBlogs ]);

    useEffect(() => {
        setItems([]);
        setPagination({
            index: 0,
            hasMore: false,
        });
        setLoading(true);
        requestBlog(blogId);
    }, [
        requestBlog,
        blogId,
    ]);

    useEffect(() => {
        if (newPost && newPost._id){
            setItems([
                newPost,
                ...items,
            ]);
        }
    }, [ newPost ]);


    const loadMore = () => {
        requestBlog(blogId, { skip: pagination.index * 10 });
    };

    const renderPosts = (items) => items.map((post) => (
        <PostCard
            key={ post._id }
            post={ post }
            hideHeaderHelperText />
    ));

    return (
        <div className="App">
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    style={ { marginTop: 70 } }
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 2 }>
                        <BlogsList
                            handleFollowTopicsModalOpen={ handleFollowTopicsModalOpen }
                            activeBlogId={ blogId } />
                    </Grid>
                    <Grid
                        item
                        xs={ 7 }>
                        { loading ? <Skeleton
                            variant="rect"
                            height={ 200 } />
                            : <Header
                                blog={ blog }
                                id={ blogId } /> }
                        { loading ? <CardLoader height={ 400 } />
                            : <>
                                { renderPosts(newPosts) }
                                { items.length > 0
                        && <InfiniteScroll
                            dataLength={ items.length }
                            next={ loadMore }
                            hasMore={ pagination.hasMore }
                            loader={ <CardLoader height={ 400 } /> }
                            endMessage={
                                <p style={ { textAlign: 'center' } }>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }>
                            { renderPosts(items) }
                           </InfiniteScroll> }
                                { (items.length === 0 && newPosts.length === 0) && <EmptyResults
                                    title="No blog posts yet."
                                    description="Feel free to contribute to this blog and earn points."
                                    showBackButton={ false } /> }
                              </> }
                    </Grid>
                    <Grid
                        item
                        xs={ 2 } />
                </Grid>
            </Container>
            <FollowBlogsModal
                open={ openFollowTopicsModal }
                followedBlogs={ followedBlogs }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog.blog,
        pending: state.user.pending,
        followedBlogs: state.user.user.blogs,
        modifiedBlogs: state.blog.modifiedBlogs,
        newPost: state.blog.newPost,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestBlog: (blogId, params) => {
            dispatch(requestBlogById(blogId, params));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
