import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import Topics from '../components/topic/TopicsList';
import TopicSection from '../components/topic/TopicSection';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';

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
    } = props;

    useEffect(() => {
        requestTopic(topicID);
    }, [
        requestTopic,
        topicID,
    ]);

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

    const { topic, topic: { questions } } = props;

    const renderQuestions = () => questions.map((question) => {
        if (question.answers && question.answers.length){
            const answer = question.answers[0];
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
                        <Topics handleFollowTopicsModalOpen={ handleFollowTopicsModalOpen } />
                    </Grid>
                    <Grid
                        item
                        xs={ 7 }>
                        <TopicSection
                            topic={ topic }
                            id={ topicID } />
                        { questions && renderQuestions() }
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestTopic: (topicID) => {
            dispatch(requestTopicById(topicID));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
