import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid,
    Container,
    Button,
    Card,
    CardContent,
    Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import PostCard from '../components/blog/PostCard';
import Blogs from '../components/blog/BlogsList';
import CardLoader from '../components/base/CardLoader';
// import FollowBlogsModal from '../components/blog/FollowBlogsModal';
import BlogPostModal from '../components/blog/PostModal';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import EmptyResults from '../components/base/EmptyResults';
import ExpertInModal from '../components/topic/ExpertInModal';
import BlogModal from '../components/blog/BlogModal';
import { requestPosts } from '../store/actions/blog';

const useStyles = makeStyles((theme) => {
    return {
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'block',
            },
        },
    };
});

function Home(props) {
    const {
        requestPostsFeed,
        user,
        pending,
        expertIn,
        history,
        newBlog,
        blogPending,
        posts,
    } = props;

    const classes = useStyles();

    const [
        openFollowTopicsModal,
        setOpenFollowTopicsModal,
    ] = React.useState(false);

    const handleFollowTopicsModalOpen = () => {
        setOpenFollowTopicsModal(true);
    };

    const handleFollowTopicsModalClose = () => {
        setOpenFollowTopicsModal(false);
    };

    const [
        openExpertInModal,
        setOpenExpertInModal,
    ] = React.useState(false);

    const handleExpertInModalOpen = () => {
        setOpenExpertInModal(true);
    };

    const handleExpertInModalClose = () => {
        setOpenExpertInModal(false);
    };

    const [
        openQModal,
        setOpenQModal,
    ] = React.useState(false);

    const handleClickQuestionModalOpen = () => {
        setOpenQModal(true);
    };

    const handleQuestionModalClose = () => {
        setOpenQModal(false);
    };

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

    useEffect(() => {
        if (!blogPending && newBlog && newBlog._id) {
            setOpenQModal(blogPending);
            history.push(`/blog/${newBlog._id}`);
        }
    }, [ blogPending ]);

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

    useEffect(() => {
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
    }, [ posts ]);

    useEffect(() => {
        if (!pending && openFollowTopicsModal) {
            setOpenFollowTopicsModal(pending);
        }
    }, [
        pending,
        requestPostsFeed,
    ]);

    useEffect(() => {
        setItems([]);
        setPagination({
            index: 0,
            hasMore: true,
        });
        requestPostsFeed();
    }, [ requestPostsFeed ]);

    const loadMore = () => {
        if (pagination.index > 0){
            requestPostsFeed({ skip: pagination.index * 10 });
        }
    };

    const renderQuestions = (posts) => posts.map((post) => (
        <PostCard
            key={ post._id }
            post={ post }
            hideHeaderHelperText={ false } />
    ));

    const handleTopicsUpdate = () => {
        setItems([]);
        setPagination({
            index: 0,
            hasMore: true,
        });
        requestPostsFeed();
    };

    return (
        <div
            className="App">
            <Container>
                <Grid
                    container
                    style={ { marginTop: 70 } }
                    justify="center"
                    spacing={ 3 }>
                    <Grid
                        className={ classes.sectionDesktop }
                        item
                        xs={ 2 }>
                        <Blogs handleFollowTopicsModalOpen={ handleFollowTopicsModalOpen } />
                    </Grid>
                    <Grid
                        item
                        xs={ 7 }>
                        { (pagination.hasMore || items.length > 0)
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
                        { renderQuestions(items) }
                    </InfiniteScroll> }
                        { items.length === 0 && !pagination.hasMore && <EmptyResults
                            title="No feed yet."
                            description="Feel free to follow topics to see the blog posts."
                            showBackButton={ false } /> }
                    </Grid>
                    <Grid
                        item
                        className={ classes.sectionDesktop }
                        xs={ 2 }>
                        <Card className={ classes.root }>
                            <CardContent>
                                <Typography
                                    className={ classes.title }
                                    color="textSecondary"
                                    gutterBottom>
                                    Feel free to choose a topic and start writing a blog post.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={ handleClickPostModalOpen }
                                    className={ classes.margin }>
                                    Create Blog Post
                                </Button>
                            </CardContent>
                        </Card>
                        { /* <Card className={ classes.root }>
                            <CardContent>
                                <Typography
                                    className={ classes.title }
                                    color="textSecondary"
                                    gutterBottom>
                                    Feel free to create a blog and start contributing.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={ handleClickQuestionModalOpen }
                                    className={ classes.margin }>
                                    Create Blog
                                </Button>
                            </CardContent>
                        </Card> */ }
                    </Grid>
                </Grid>
            </Container>
            <BlogModal
                open={ openQModal }
                handleClose={ handleQuestionModalClose } />
            <BlogPostModal
                open={ openPostModal }
                formName="newpost"
                handleClose={ handlePostModalClose } />
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                handleTopicsUpdate={ handleTopicsUpdate }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
            { /* <FollowBlogsModal
                open={ openFollowTopicsModal }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } /> */ }
            <ExpertInModal
                open={ openExpertInModal }
                expertIn={ expertIn }
                handleFollowTopicsModalClose={ handleExpertInModalClose } />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        posts: state.blog.posts,
        user: state.user.user,
        pending: state.user.pending,
        blogPending: state.blog.pending,
        followedBlogs: state.user.blogs,
        newBlog: state.blog.newBlog,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestPostsFeed: (params) => {
            dispatch(requestPosts(params));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
