import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import InfiniteScroll from 'react-infinite-scroll-component';
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


    const [
        items,
        setItems,
    ] = React.useState([]);

    const [
        requestType,
        setRequestType,
    ] = React.useState('answerRequests');

    const [
        pagination,
        setPagination,
    ] = React.useState({
        index: 0,
        hasMore: true,
    });

    useEffect(() => {
        if (questions.length) {
            setItems([
                ...items,
                ...questions,
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
    }, [ questions ]);

    const loadMore = () => {
        if (requestType === 'questions') {
            requestQuestionsForUser({ skip: pagination.index * 10 });
        }
        else {
            requestAnswerRequests({ skip: pagination.index * 10 });
        }
    };

    useEffect(() => {
        setItems([]);
        loadMore();
    }, []);

    const getData = (type = 'questions') => {
        setRequestType(type);
        setPagination({
            index: 0,
            hasMore: true,
        });
        setItems([]);
        if (type === 'questions') {
            requestQuestionsForUser({ skip: 0 });
        }
        else {
            requestAnswerRequests({ skip: 0 });
        }
    };

    const renderQuestions = (items) => items.map((item) => {
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
                answersCount={ item.answers && item.answers.length }
                question={ item } />
        );
    });

    const renderMenu = () => (
        <List>
            <Chip
                label="Answer Requests"
                className={ classes.chip }
                onClick={ () => { getData('answerRequests'); } }
                clickable />
            <Chip
                label="Questions For You"
                className={ classes.chip }
                onClick={ () => { getData(); } }
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
        requestAnswerRequests: (params) => {
            dispatch(requestAnswerRequests(params));
        },
        requestQuestionsForUser: (params) => {
            dispatch(requestQuestionsForUser(params));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnswerPageBody);
