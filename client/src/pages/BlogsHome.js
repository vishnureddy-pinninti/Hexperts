import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import BlogCard from '../components/blog/Card';
import Blogs from '../components/blog/BlogsList';
import { requestPosts } from '../store/actions/blog';
import FollowBlogsModal from '../components/blog/FollowBlogsModal';
import ExpertInModal from '../components/topic/ExpertInModal';
import BlogModal from '../components/blog/BlogModal';


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
        onLogout,
        questions,
        trendingQuestions,
        followedBlogs,
        pending,
        expertIn,
        history,
        newBlog,
        blogs,
        blogPending,
        posts,

    } = props;

    const classes = useStyles();

    useEffect(() => {
        if (!pending) {
            setOpenFollowTopicsModal(pending);
            requestPostsFeed();
        }
    }, [
        pending,
        requestPostsFeed,
    ]);

    const [
        openFollowTopicsModal,
        setOpenFollowTopicsModal,
    ] = React.useState(user.blogs.length === 0);


    const handleFollowTopicsModalOpen = () => {
        setOpenFollowTopicsModal(true);
    };

    const handleFollowTopicsModalClose = () => {
        setOpenFollowTopicsModal(false);
    };

    const [
        openExpertInModal,
        setOpenExpertInModal,
    ] = React.useState(user.interests.length && user.expertIn.length === 0);

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
        setItems([]);
        requestPostsFeed();
    }, [ requestPostsFeed ]);

    const loadMore = () => {
        requestPostsFeed({ skip: pagination.index * 10 });
    };

    const renderQuestions = (posts) => posts.map((post) => (
        <BlogCard
            key={ post._id }
            post={ post }
            hideHeaderHelperText />
    ));

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
                        <InfiniteScroll
                            dataLength={ items.length }
                            next={ loadMore }
                            hasMore={ pagination.hasMore }
                            loader={ <h4>Loading...</h4> }
                            endMessage={
                                <p style={ { textAlign: 'center' } }>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }>
                            { renderQuestions(items) }
                        </InfiniteScroll>
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
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <BlogModal
                open={ openQModal }
                handleClose={ handleQuestionModalClose } />
            <FollowBlogsModal
                open={ openFollowTopicsModal }
                followedBlogs={ followedBlogs }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
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
