import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import InfiniteScroll from 'react-infinite-scroll-component';
import AnswerCard from '../answer/Card';
import PostCard from '../blog/PostCard';
import EmptyResults from '../base/EmptyResults';
import CardLoader from '../base/CardLoader';
import QuestionCard from '../question/Card';
import BlogCard from '../blog/BlogCard';
import UserCard from './UserCard';

import { requestUserQuestions, requestUserAnswers, requestUserPosts, requestUserFollowers, requestUserFollowing } from '../../store/actions/auth';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: 100,
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            marginRight: 10,
        },
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        topicLink: {
            textDecoration: 'none',
        },

        chip: {
            marginBottom: 10,
        },
    };
});

function ProfileBody(props) {
    const classes = useStyles();
    const {
        requestUserQuestions,
        requestUserAnswers,
        userFeed,
        userProfile,
        requestUserPosts,
        requestUserFollowers,
        requestUserFollowing,
    } = props;

    const [
        items,
        setItems,
    ] = React.useState([]);

    const [
        selectedTab,
        setSelectedTab,
    ] = React.useState('Answers');

    const [
        pagination,
        setPagination,
    ] = React.useState({
        index: 0,
        hasMore: true,
    });

    useEffect(() => {
        if (userFeed && userFeed.items && userFeed.items.length) {
            if (selectedTab === userFeed.type){
                if (pagination.index === 0){
                    setItems([ ...userFeed.items ]);
                }
                else {
                    setItems([
                        ...items,
                        ...userFeed.items,
                    ]);
                }
                setPagination({
                    index: pagination.index + 1,
                    hasMore: true,
                });
            }
            else {
                // setItems([ ...userFeed.items ]);
                // setPagination({
                //     index: pagination.index + 1,
                //     hasMore: true,
                // });
            }
        }
        else {
            setPagination({
                ...pagination,
                hasMore: false,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ userFeed ]);

    const requestUserBlogs = () => {
        setItems(userProfile.blogs);
        setPagination({
            ...pagination,
            hasMore: false,
        });
    };

    const loadMore = () => {
        if (pagination.index > 0){
            switch (selectedTab){
                case 'Questions':
                    requestUserQuestions(userProfile._id, { skip: pagination.index * 10 });
                    break;
                case 'Answers':
                    requestUserAnswers(userProfile._id, { skip: pagination.index * 10 });
                    break;
                case 'Blogs':
                // requestUserBlogs(userProfile._id, { skip: pagination.index * 10 });
                    break;
                case 'Posts':
                    requestUserPosts(userProfile._id, { skip: pagination.index * 10 });
                    break;
                case 'Followers':
                    setPagination({
                        ...pagination,
                        hasMore: false,
                    });
                    // requestUserFollowers(userProfile._id, { skip: pagination.index * 10 });
                    break;
                case 'Following':
                    setPagination({
                        ...pagination,
                        hasMore: false,
                    });
                    // requestUserFollowing(userProfile._id, { skip: pagination.index * 10 });
                    break;
                default:
                    requestUserQuestions(userProfile._id, { skip: pagination.index * 10 });
            }
        }
    };

    const getData = (type = 'Answers') => {
        setSelectedTab(type);
        setItems([]);
        setPagination({
            index: 0,
            hasMore: true,
        });
        switch (type){
            case 'Questions':
                requestUserQuestions(userProfile._id);
                break;
            case 'Answers':
                requestUserAnswers(userProfile._id);
                break;
            case 'Blogs':
                requestUserBlogs(userProfile._id);
                break;
            case 'Posts':
                requestUserPosts(userProfile._id);
                break;
            case 'Followers':
                requestUserFollowers(userProfile._id);
                break;
            case 'Following':
                requestUserFollowing(userProfile._id);
                break;
            default:
                requestUserQuestions(userProfile._id);
        }
    };

    useEffect(() => {
        if (userProfile._id){
            setItems([]);
            setPagination({
                index: 0,
                hasMore: true,
            });
            requestUserAnswers(userProfile._id);
        }
    }, [
        requestUserAnswers,
        userProfile,
    ]);

    const renderAnswers = (items) => items.map((item) => (
        <AnswerCard
            key={ item._id }
            questionId={ item.questionID }
            answer={ item }
            hideHeaderHelperText
            answerId={ item._id }
            upvoters={ item.upvoters }
            downvoters={ item.downvoters }
            question={ item.question }
            author={ item.author }
            topics={ item.topics }
            date={ item.postedDate } />
    ));
    const renderQuestions = (items) => items.map((item) => (
        <QuestionCard
            key={ item._id }
            id={ item._id }
            date={ item.postedDate }
            answersCount={ item.answers && item.answers.totalCount }
            question={ item } />
    ));
    const renderPosts = (items) => items.map((item) => (
        <PostCard
            key={ item._id }
            post={ item }
            hideHeaderHelperText />
    ));

    const renderUsers = (items) => items.map((item) => (
        <UserCard
            key={ item._id }
            user={ item } />
    ));

    const renderBlogs = (items) => items.map((item) => (
        <BlogCard
            key={ item._id }
            blog={ item } />
    ));

    const renderMenu = () => (
        <List>
            { /* <Chip
                label="Profile"
                className={ classes.chip }
                onClick={ () => { requestUserAnswers(userProfile._id); } }
                clickable /> */ }
            <Chip
                label={ `Answers ${userProfile.answers}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Answers' ? 'default' : 'outlined' }
                onClick={ () => { getData('Answers'); } }
                clickable />
            <Chip
                label={ `Questions ${userProfile.questions}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Questions' ? 'default' : 'outlined' }
                onClick={ () => { getData('Questions'); } }
                clickable />
            <Chip
                label={ `Blog Posts ${userProfile.posts}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Posts' ? 'default' : 'outlined' }
                onClick={ () => { getData('Posts'); } }
                clickable />
            { /* <Chip
                label={ `Blogs ${userProfile.blogs && userProfile.blogs.length}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Blogs' ? 'default' : 'outlined' }
                onClick={ () => { getData('Blogs'); } }
                clickable /> */ }
            <Chip
                label={ `Followers ${userProfile.followers && userProfile.followers.length}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Followers' ? 'default' : 'outlined' }
                onClick={ () => { getData('Followers'); } }
                clickable />
            <Chip
                label={ `Following ${userProfile.following}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Following' ? 'default' : 'outlined' }
                onClick={ () => { getData('Following'); } }
                clickable />
        </List>
    );

    const renderResults = (items) => {
        switch (selectedTab){
            case 'Questions':
                return renderQuestions(items);
            case 'Answers':
                return renderAnswers(items);
            case 'Blogs':
                return renderBlogs(items);
            case 'Posts':
                return renderPosts(items);
            case 'Followers':
                return renderUsers(items);
            case 'Following':
                return renderUsers(items);
            default:
                return renderQuestions(items);
        }
    };

    return (
        <Grid
            container
            style={ { marginTop: 10 } }
            spacing={ 3 }>
            <Grid
                item
                xs={ 2 }>
                <Typography
                    component="div"
                    className={ classes.heading }>
                    <Box
                        fontWeight="fontWeightBold"
                        m={ 1 }>
                        Feeds
                    </Box>
                </Typography>
                { renderMenu() }
            </Grid>
            <Grid
                item
                xs={ 10 }>
                <InfiniteScroll
                    style={ { overflow: 'visible' } }
                    dataLength={ items.length }
                    next={ loadMore }
                    hasMore={ pagination.hasMore }
                    loader={ <CardLoader /> }
                    endMessage={ items.length !== 0
                        && <p style={ { textAlign: 'center' } }>
                            <b>Yay! You have seen it all</b>
                        </p> }>
                    { renderResults(items) }
                </InfiniteScroll>
                { items && items.length === 0 && !pagination.hasMore && <EmptyResults
                    title={ <SentimentVeryDissatisfiedIcon /> }
                    description="No Results to display."
                    showBackButton={ false } /> }
            </Grid>
        </Grid>
    );
}

ProfileBody.defaultProps = {
    userProfile: {},
    userFeed: [],
};

const mapStateToProps = (state) => {
    return {
        topic: state.topic.topic,
        pending: state.user.pending,
        followedTopics: state.user.user.interests,
        modifiedQuestions: state.questions.modifiedQuestions,
        userProfile: state.user.userProfile,
        userFeed: state.user.feed,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestUserQuestions: (userId, params) => {
            dispatch(requestUserQuestions(userId, params));
        },
        requestUserAnswers: (userId, params) => {
            dispatch(requestUserAnswers(userId, params));
        },
        requestUserPosts: (userId, params) => {
            dispatch(requestUserPosts(userId, params));
        },
        requestUserFollowing: (userId, params) => {
            dispatch(requestUserFollowing(userId, params));
        },
        requestUserFollowers: (userId, params) => {
            dispatch(requestUserFollowers(userId, params));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBody);
