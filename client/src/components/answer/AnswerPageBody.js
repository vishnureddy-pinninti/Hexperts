import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import AnswerCard from './Card';
import QuestionCard from '../question/Card';
import { requestAnswerRequests, requestQuestionsForUser } from '../../store/actions/questions';

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

function AnswerPageBody(props) {
    const classes = useStyles();
    const {
        requestAnswerRequests,
        requestQuestionsForUser,
        questions,
    } = props;

    useEffect(() => {
        requestQuestionsForUser();
    }, [ requestQuestionsForUser ]);

    const renderQuestions = () => questions.map((item) => {
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
                answersCount={ item.answers.length }
                question={ item } />
        );
    });

    const renderMenu = () => (
        <List>
            <Chip
                label="Questions For You"
                className={ classes.chip }
                onClick={ () => { requestQuestionsForUser(); } }
                clickable />
            <Chip
                label="Answer Requests"
                className={ classes.chip }
                onClick={ () => { requestAnswerRequests(); } }
                clickable />
        </List>
    );


    return (
        <>
            <Grid
                item
                xs={ 2 }>
                <Typography
                    component="div"
                    className={ classes.heading }>
                    <Box
                        fontWeight="fontWeightBold"
                        m={ 1 }>
                        Questions
                    </Box>
                </Typography>
                { renderMenu() }
            </Grid>
            <Grid
                item
                xs={ 7 }>
                { questions && renderQuestions() }
            </Grid>
            <Grid
                item
                xs={ 2 } />
        </>
    );
}

AnswerPageBody.defaultProps = {
    questions: [],
};

const mapStateToProps = (state) => {
    return {
        questions: state.questions.questions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestAnswerRequests: () => {
            dispatch(requestAnswerRequests());
        },
        requestQuestionsForUser: () => {
            dispatch(requestQuestionsForUser());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnswerPageBody);
