import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '@material-ui/lab/Skeleton';
import { Button,
    Card,
    CardContent,
    Typography } from '@material-ui/core';
import BlogPostModal from '../components/blog/PostModal';
import BlogsList from '../components/blog/BlogsList';
// import Header from '../components/blog/BlogHeader';
import Header from '../components/topic/TopicSection';

// import FollowBlogsModal from '../components/blog/FollowBlogsModal';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import EmptyResults from '../components/base/EmptyResults';
import CardLoader from '../components/base/CardLoader';
import PostCard from '../components/blog/PostCard';
import { requestBlogById } from '../store/actions/blog';


function Topic(props) {
    const {
        match,
        requestBlog,
        pending,
        newPost,
        modifiedBlogs,
        followers,
    } = props;

    const { params: { blogId } } = match;

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
        window.scrollTo(0, 0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ blog ]);

    const [
        newPosts,
        setNewPosts,
    ] = React.useState([]);

    useEffect(() => {
        if (modifiedBlogs && modifiedBlogs[blogId] && modifiedBlogs[blogId].newAnswers){
            setNewPosts([ ...modifiedBlogs[blogId].newPosts ]);
        }
    }, [
        blogId,
        modifiedBlogs,
    ]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ newPost ]);


    const loadMore = () => {
        if (pagination.index > 0){
            requestBlog(blogId, { skip: pagination.index * 10 });
        }
    };

    const renderPosts = (items) => items.map((post) => (
        <PostCard
            key={ post._id }
            post={ post }
            hideHeaderHelperText />
    ));

    const [
        openPostModal,
        setOpenPostModal,
    ] = React.useState(false);

    const handleClickPostModalOpen = () => {
        setOpenPostModal(true);
    };

    const handlePostModalClose = () => {
        setOpenPostModal(false);
    };

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
                                topic={ blog }
                                followers={ followers }
                                id={ blogId } /> }
                        { loading ? <CardLoader height={ 400 } />
                            : <>
                                { renderPosts(newPosts) }
                                { items.length > 0 && <InfiniteScroll
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
                        xs={ 2 }>
                        <Card>
                            <CardContent>
                                <Typography

                                    color="textSecondary"
                                    gutterBottom>
                                    Feel free to choose a topic and start writing a blog post.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={ handleClickPostModalOpen }>
                                    Create Blog Post
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <BlogPostModal
                open={ openPostModal }
                formName="newpost"
                handleClose={ handlePostModalClose } />
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
            { /* <FollowBlogsModal
                open={ openFollowTopicsModal }
                followedBlogs={ followedBlogs }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } /> */ }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog.blog,
        pending: state.user.pending,
        followedBlogs: state.user.user.blogs,
        modifiedBlogs: state.blog.modifiedBlogs,
        followers: state.blog.blog.followers,
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
