import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Chip,
    Container } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import Switch from '@material-ui/core/Switch';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import AnswerCard from '../components/answer/Card';
import QuestionCard from '../components/question/Card';
import Topics from '../components/topic/TopicsList';
import CardLoader from '../components/base/CardLoader';
import TopCreators from '../components/answer/TopCreators';
import EmptyResults from '../components/base/EmptyResults';
import AskQuestionCard from '../components/question/AskQuestionCard';
import QuestionsList from '../components/question/QuestionsList';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import ExpertInModal from '../components/topic/ExpertInModal';
import { requestUserQuestions, requestTrendingQuestions, toggleQuestionModal } from '../store/actions/questions';

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
        user,
        questions,
        trendingQuestions,
        pending,
        expertIn,
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
        if (!pending) {
            setOpenFollowTopicsModal(pending);
            setOpenExpertInModal(pending);
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
                        { items.length > 0
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
                    </Grid>
                    <Grid
                        item
                        className={ classes.sectionDesktop }
                        xs={ 3 }>
                        <Chip
                            icon={ <FormControlLabel
                                control={ <Switch
                                    checked={ ownQuestions }
                                    onChange={ showOwnQuestions }
                                    size="small" /> } /> }
                            label="Show My Questions"
                            color="primary"
                            clickable
                            onClick={ showOwnQuestions }
                            classes={ {
                                icon: classes.chipIcon,
                                label: classes.chipLable,
                            } }
                            className={ classes.chip } />
                        <TopCreators />
                        <QuestionsList
                            title="Trending Questions"
                            questions={ trendingQuestions } />
                    </Grid>
                </Grid>
            </Container>
            <FollowTopicsModal
                open={ openFollowTopicsModal }
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
