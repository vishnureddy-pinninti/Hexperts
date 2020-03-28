import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import InfiniteScroll from 'react-infinite-scroll-component';
import AnswerCard from '../components/answer/Card';
import QuestionCard from '../components/question/Card';
import Topics from '../components/topic/TopicsList';
import CardLoader from '../components/base/CardLoader';

import { requestUserQuestions, requestTrendingQuestions, toggleQuestionModal } from '../store/actions/questions';
import TopCreators from '../components/answer/TopCreators';
import AskQuestionCard from '../components/question/AskQuestionCard';
import QuestionsList from '../components/question/QuestionsList';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import ExpertInModal from '../components/topic/ExpertInModal';
import QuestionModal from '../components/base/QuestionModal';


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
        requestUserQuestions,
        requestTrendingQuestions,
        user,
        onLogout,
        questions,
        trendingQuestions,
        followedTopics,
        pending,
        expertIn,
        topics,
        toggleQuestionModal,
    } = props;

    const classes = useStyles();

    const [
        openFollowTopicsModal,
        setOpenFollowTopicsModal,
    ] = React.useState(user.interests.length === 0);


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

    const renderQuestionModal = (
        <QuestionModal
            open={ openQModal }
            handleClose={ handleQuestionModalClose } />
    );

    useEffect(() => {
        if (!pending) {
            setOpenQModal(pending);
        }
    }, [ pending ]);

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
        if (!pending) {
            setOpenFollowTopicsModal(pending);
            if (expertIn.length) {
                setOpenExpertInModal(pending);
            }
            else {
                setOpenExpertInModal(true);
            }
        }
    }, [
        pending,
        requestUserQuestions,
        expertIn,
    ]);

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

    useEffect(() => {
        setItems([]);
        setPagination({
            index: 0,
            hasMore: true,
        });
        requestUserQuestions();
        requestTrendingQuestions();
    }, [
        requestTrendingQuestions,
        requestUserQuestions,
    ]);

    const loadMore = () => {
        requestUserQuestions({ skip: pagination.index * 10 });
    };

    const renderQuestions = (items) => items.map((question) => {
        if (question.answers && question.answers.results && question.answers.results.length){
            const answer = question.answers.results[0];
            return (
                <AnswerCard
                    key={ question._id }
                    questionId={ question._id }
                    answer={ answer }
                    answerId={ answer._id }
                    question={ question.question }
                    upvoters={ answer.upvoters }
                    downvoters={ answer.downvoters }
                    author={ answer.author }
                    answersCount={ question.answers && question.answers.totalCount }
                    topics={ question.topics } // modifiedAnswers={ modifiedAnswers }
                    date={ answer.postedDate } />
            );
        }
        return (
            <QuestionCard
                key={ question._id }
                id={ question._id }
                date={ question.postedDate }
                answersCount={ question.answers && question.answers.totalCount }
                question={ question } />
        );
    });

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
                        <Topics handleFollowTopicsModalOpen={ handleFollowTopicsModalOpen } />
                    </Grid>
                    <Grid
                        item
                        xs={ 7 }>
                        <AskQuestionCard
                            user={ user }
                            handleClickQuestionModalOpen={ toggleQuestionModal } />
                        <InfiniteScroll
                            dataLength={ items.length }
                            next={ loadMore }
                            hasMore={ pagination.hasMore }
                            loader={ <CardLoader height={ 200 } /> }
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
                        xs={ 3 }>
                        <TopCreators />
                        <QuestionsList
                            title="Trending Questions"
                            questions={ trendingQuestions } />
                    </Grid>
                </Grid>
            </Container>
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                followedTopics={ followedTopics }
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
        questions: state.questions.questions,
        user: state.user.user,
        expertIn: state.user.expertIn,
        pending: state.user.pending,
        followedTopics: state.user.interests,
        trendingQuestions: state.questions.trendingQuestions,
        modifiedQuestions: state.questions.modifiedQuestions,
        modifiedAnswers: state.answer.modifiedAnswers,
        topics: state.topic.topics,
        questionModal: state.questions.questionModal,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestUserQuestions: (params) => {
            dispatch(requestUserQuestions(params));
        },
        requestTrendingQuestions: () => {
            dispatch(requestTrendingQuestions());
        },
        toggleQuestionModal: () => {
            dispatch(toggleQuestionModal());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
