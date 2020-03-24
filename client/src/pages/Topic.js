import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Topics from '../components/topic/TopicsList';
import TopicSection from '../components/topic/TopicSection';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import EmptyResults from '../components/base/EmptyResults';

import AnswerCard from '../components/answer/Card';
import QuestionCard from '../components/question/Card';
import { requestTopicById } from '../store/actions/topic';


function Topic(props) {
    const {
        match: {
            params: { topicID 
},
        },
        requestTopic,
        onLogout,
        pending,
        followedTopics,
        topic,
    } = props;

    const [
        openFollowTopicsModal,
        setOpenFollowTopicsModal,
    ] = React.useState(false);


    useEffect(() => {
        if (!pending) {
            setOpenFollowTopicsModal(pending);
        }
    }, [ pending ]);

    const handleFollowTopicsModalOpen = () => {
        setOpenFollowTopicsModal(true);
    };

    const handleFollowTopicsModalClose = () => {
        setOpenFollowTopicsModal(false);
    };

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
        if (topic && topic.questions){
            const { questions } = topic;
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
        }
        else {
            setPagination({
                index: 0,
                hasMore: false,
            });
        }
    }, [ topic ]);

    useEffect(() => {
        setItems([]);
        setPagination({
            index: 0,
            hasMore: false,
        });
        requestTopic(topicID);
    }, [
        requestTopic,
        topicID,
    ]);

    const loadMore = () => {
        requestTopic(topicID, { skip: pagination.index * 10 });
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
                    upvoters={ answer.upvoters }
                    downvoters={ answer.downvoters }
                    question={ question.question }
                    author={ answer.author }
                    topics={ question.topics }
                    date={ answer.postedDate } />
            );
        }
        return (
            <QuestionCard
                key={ question._id }
                id={ question._id }
                date={ question.postedDate }
                answersCount={ question.answers.totalCount }
                question={ question } />
        );
    });


    return (
        <div className="App">
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    style={ { marginTop: 70 } }
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 2 }>
                        <Topics
                            handleFollowTopicsModalOpen={ handleFollowTopicsModalOpen }
                            activeTopicId={ topicID } />
                    </Grid>
                    <Grid
                        item
                        xs={ 7 }>
                        <TopicSection
                            topic={ topic }
                            id={ topicID } />
                        { items.length > 0
                        && <InfiniteScroll
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
                        </InfiniteScroll> }
                        { items.length === 0 && <EmptyResults
                            title="No questions posted yet."
                            description="Feel free to ask a question to this topic." /> }
                    </Grid>
                    <Grid
                        item
                        xs={ 3 } />
                </Grid>
            </Container>
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                followedTopics={ followedTopics }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        topic: state.topic.topic,
        pending: state.user.pending,
        followedTopics: state.user.user.interests,
        modifiedQuestions: state.questions.modifiedQuestions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestTopic: (topicID, params) => {
            dispatch(requestTopicById(topicID, params));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
