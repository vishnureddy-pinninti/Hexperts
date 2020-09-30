import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Chip, Container } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FeedbackIcon from '@material-ui/icons/Feedback';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AnswerCard from '../components/answer/Card';
import QuestionCard from '../components/question/Card';
import Topics from '../components/topic/TopicsList';
import CardLoader from '../components/base/CardLoader';
import TopCreators from '../components/answer/TopCreators';
import EmptyResults from '../components/base/EmptyResults';
import QuestionsList from '../components/question/QuestionsList';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import ExpertInModal from '../components/topic/ExpertInModal';
import FeedbackModel from '../components/feedback/FeedbackToHexperts'
import { requestUserQuestions, requestTrendingQuestions, toggleQuestionModal } from '../store/actions/questions';
import { requestTopCreators } from '../store/actions/auth';

const useStyles = makeStyles((theme) => {
    return {
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'block',
            },
        },
        chip: {
            marginBottom: 10,
            width:190,
        },
        chipIcon: {
            marginLeft: 5,
            marginRight: 0,
        },
        chipLable: {
            paddingLeft: 6,
        },
    };
});

function Home(props) {
    const {
        requestUserQuestions,
        requestTrendingQuestions,
        requestTopCreators,
        questions,
        trendingQuestions,
        expertIn,
        topUsers,
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
        openFeedbackModal,
        setFeedbackModal,
    ] = React.useState(false);

    const handleFeedbackModalOpen = () => {
        setFeedbackModal(true);
    };

    const handleFeedbackModalClose = () => {
        setFeedbackModal(false);
    };

    const [
        openExpertInModal,
        setOpenExpertInModal,
    ] = React.useState(false);

    const handleExpertInModalClose = () => {
        setOpenExpertInModal(false);
    };

    const [
        items,
        setItems,
    ] = React.useState([]);

    const [
        ownQuestions,
        setOwnQuestions,
    ] = React.useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ questions ]);

    useEffect(() => {
        setItems([]);
        window.scrollTo(0, 0);
        setPagination({
            index: 0,
            hasMore: true,
        });
        requestUserQuestions();
        requestTrendingQuestions();
        requestTopCreators();
    }, [
        requestTrendingQuestions,
        requestUserQuestions,
        requestTopCreators,
    ]);

    const loadMore = () => {
        if (pagination.index > 0){
            requestUserQuestions({
                skip: pagination.index * 10,
                ownQuestions,
            });
        }
    };

    const showOwnQuestions = () => {
        setOwnQuestions(!ownQuestions);
        setItems([]);
        setPagination({
            index: 0,
            hasMore: true,
        });
        requestUserQuestions({ ownQuestions: !ownQuestions });
    };

    const handleTopicsUpdate = () => {
        setOpenFollowTopicsModal(false);
        if (ownQuestions){
            setOwnQuestions(false);
        }
        setItems([]);
        setPagination({
            index: 0,
            hasMore: true,
        });
        requestUserQuestions({ ownQuestions: false });
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
                        <div id="Infinite-Scroll">
                            { /* <AskQuestionCard
                                user={ user }
                                handleClickQuestionModalOpen={ toggleQuestionModal } /> */ }
                            { (pagination.hasMore || items.length > 0)
                        && <InfiniteScroll
                            style={ { overflow: 'visible' } }
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
                        </InfiniteScroll> }
                            { items.length === 0 && !pagination.hasMore && <EmptyResults
                                title="No feed yet."
                                description="Feel free to follow topics to see the questions and answers."
                                showBackButton={ false } /> }
                        </div>
                    </Grid>
                    <Grid
                        item
                        className={ classes.sectionDesktop }
                        xs={ 3 }>
                        <Chip
                            icon={ <FormControlLabel
                                control={ <Switch
                                    checked={ ownQuestions }
                                    size="small" /> } /> }
                            label="Show My Questions"
                            color="primary"
                            id="top_contr"
                            clickable
                            onClick={ showOwnQuestions }
                            classes={ {
                                icon: classes.chipIcon,
                                label: classes.chipLable,
                            } }
                            className={ classes.chip } />
                            <Chip
                            id="Hexpets-Feedback"
                            icon={ <FeedbackIcon size="small" /> }
                            label="Feedback to Hexperts"
                            color="secondary"
                            clickable
                            onClick={ handleFeedbackModalOpen }
                            classes={ {
                                icon: classes.chipIcon,
                                label: classes.chipLable,
                            } }
                            className={ classes.chip } />
                        <div id="Top-Contributors">
                            <Typography
                                component="div"
                                className={ classes.heading }>
                                <Box
                                    fontWeight="fontWeightBold"
                                    m={ 1 }>
                                    Top Contributors
                                </Box>
                            </Typography>
                            <Divider />
                            <TopCreators topUsers={ topUsers } />
                        </div>
                        <div id="Trending-Questions">
                            <QuestionsList
                                title="Trending Questions"
                                questions={ trendingQuestions } />
                        </div>
                    </Grid>
                </Grid>
            </Container>
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                handleTopicsUpdate={ handleTopicsUpdate }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
            <ExpertInModal
                open={ openExpertInModal }
                expertIn={ expertIn }
                handleFollowTopicsModalClose={ handleExpertInModalClose } />
            <FeedbackModel
                open={ openFeedbackModal }
                handleClose={ handleFeedbackModalClose } />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        questions: state.questions.questions,
        user: state.user.user,
        expertIn: state.user.expertIn,
        pending: state.user.pending,
        trendingQuestions: state.questions.trendingQuestions,
        modifiedQuestions: state.questions.modifiedQuestions,
        modifiedAnswers: state.answer.modifiedAnswers,
        topics: state.topic.topics,
        questionModal: state.questions.questionModal,
        topUsers: state.user.topUsers,
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
        requestTopCreators: () => {
            dispatch(requestTopCreators());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
