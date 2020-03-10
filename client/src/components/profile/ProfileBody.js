import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import AnswerCard from '../answer/Card';
import QuestionCard from '../question/Card';
import { requestUserQuestions, requestUserAnswers } from '../../store/actions/auth';

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
    } = props;

    useEffect(() => {
        if (userProfile._id){
            requestUserAnswers(userProfile._id);
        }
    }, [
        requestUserAnswers,
        userProfile,
    ]);

    const renderQuestions = () => userFeed.map((item) => {
        if (item.answer){
            return (
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
            );
        }
        return (
            <QuestionCard
                key={ item._id }
                id={ item._id }
                date={ item.postedDate }
                answersCount={ item.answers }
                question={ item } />
        );
    });

    const renderMenu = () => (
        <List>
            <Chip
                label="Profile"
                className={ classes.chip }
                onClick={ () => { requestUserAnswers(userProfile._id); } }
                clickable />
            <Chip
                label={ `Questions ${userProfile.questions}` }
                className={ classes.chip }
                onClick={ () => { requestUserQuestions(userProfile._id); } }
                clickable />
            <Chip
                label={ `Answers ${userProfile.answers}` }
                className={ classes.chip }
                onClick={ () => { requestUserAnswers(userProfile._id); } }
                clickable />
            <Chip
                label={ `Blogs ${userProfile.blogs}` }
                className={ classes.chip }
                clickable />
            <Chip
                label={ `Followers ${userProfile.followers && userProfile.followers.length}` }
                className={ classes.chip }
                clickable />
            <Chip
                label={ `Following ${userProfile.following}` }
                className={ classes.chip }
                clickable />
        </List>
    );


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
                { userFeed && renderQuestions() }
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBody);
