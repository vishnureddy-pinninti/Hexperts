import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import AnswerCard from '../answer/Card';
import PostCard from '../blog/PostCard';
import EmptyResults from '../base/EmptyResults';
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
        topic,
        requestUserQuestions,
        requestUserAnswers,
        topic: { questions },
        userFeed,
        userProfile,
        followedTopics,
        requestUserPosts,
        requestUserFollowers,
        requestUserFollowing,
    } = props;

    useEffect(() => {
        if (userProfile._id){
            requestUserAnswers(userProfile._id);
        }
    }, [
        requestUserAnswers,
        userProfile,
    ]);

    const [
        feed,
        setFeed,
    ] = React.useState([]);

    const [
        selectedTab,
        setSelectedTab,
    ] = React.useState('Answers');

    useEffect(() => {
        setFeed(userFeed);
    }, [ userFeed ]);

    const requestUserBlogs = () => {
        setFeed({
            type: 'blogs',
            items: userProfile.blogs,
        });
    };

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
            answersCount={ item.answers.totalCount }
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
                onClick={ () => { requestUserAnswers(userProfile._id); setSelectedTab('Answers'); } }
                clickable />
            <Chip
                label={ `Questions ${userProfile.questions}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Questions' ? 'default' : 'outlined' }
                onClick={ () => { requestUserQuestions(userProfile._id); setSelectedTab('Questions'); } }
                clickable />
            <Chip
                label={ `Posts ${userProfile.posts}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Posts' ? 'default' : 'outlined' }
                onClick={ () => { requestUserPosts(userProfile._id); setSelectedTab('Posts'); } }
                clickable />
            <Chip
                label={ `Blogs ${userProfile.blogs && userProfile.blogs.length}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Blogs' ? 'default' : 'outlined' }
                onClick={ () => { requestUserBlogs(userProfile._id); setSelectedTab('Blogs'); } }
                clickable />
            <Chip
                label={ `Followers ${userProfile.followers && userProfile.followers.length}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Followers' ? 'default' : 'outlined' }
                onClick={ () => { requestUserFollowers(userProfile._id); setSelectedTab('Followers'); } }
                clickable />
            <Chip
                label={ `Following ${userProfile.following}` }
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'Following' ? 'default' : 'outlined' }
                onClick={ () => { requestUserFollowing(userProfile._id); setSelectedTab('Following'); } }
                clickable />
        </List>
    );

    const { type, items } = feed;

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
                { type === 'questions' && renderQuestions(items) }
                { type === 'answers' && renderAnswers(items) }
                { type === 'posts' && renderPosts(items) }
                { type === 'users' && renderUsers(items) }
                { type === 'blogs' && renderBlogs(items) }
                { items && items.length === 0 && <EmptyResults
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
        requestUserQuestions: (userId) => {
            dispatch(requestUserQuestions(userId));
        },
        requestUserAnswers: (userId) => {
            dispatch(requestUserAnswers(userId));
        },
        requestUserPosts: (userId) => {
            dispatch(requestUserPosts(userId));
        },
        requestUserFollowing: (userId) => {
            dispatch(requestUserFollowing(userId));
        },
        requestUserFollowers: (userId) => {
            dispatch(requestUserFollowers(userId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBody);
