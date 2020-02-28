import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AnswerCard from '../components/answer/Card';
import QuestionCard from '../components/question/Card';
import Topics from '../components/topic/TopicsList';
import { requestUserQuestions, requestTrendingQuestions } from '../store/actions/questions';
import TopCreators from '../components/answer/TopCreators';
import AskQuestionCard from '../components/question/AskQuestionCard';
import QuestionsList from '../components/question/QuestionsList';

function Home(props) {
    const {
        requestUserQuestions,
        requestTrendingQuestions,
        user,
        onLogout,
        questions,
        trendingQuestions,
    } = props;

    useEffect(() => {
        requestUserQuestions();
        requestTrendingQuestions();
    }, [
        requestTrendingQuestions,
        requestUserQuestions,
    ]);

    const renderQuestions = () => questions.map((question) => {
        if (question.answers && question.answers.length){
            const answer = question.answers[0];
            return (
                <AnswerCard
                    key={ question._id }
                    questionId={ question._id }
                    answer={ answer }
                    question={ question.question }
                    author={ question.author }
                    topics={ question.topics }
                    date={ answer.postedDate } />
            );
        }
        return (
            <QuestionCard
                key={ question._id }
                id={ question._id }
                date={ question.postedDate }
                question={ question.question } />
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
                        item
                        xs={ 2 }>
                        <Topics />
                    </Grid>
                    <Grid
                        item
                        xs={ 7 }>
                        <AskQuestionCard user={ user } />
                        { renderQuestions() }
                    </Grid>
                    <Grid
                        item
                        xs={ 3 }>
                        <TopCreators />
                        <QuestionsList
                            title="Trending Questions"
                            questions={ trendingQuestions } />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        questions: state.questions.questions,
        user: state.user.user,
        trendingQuestions: state.questions.trendingQuestions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestUserQuestions: () => {
            dispatch(requestUserQuestions());
        },
        requestTrendingQuestions: () => {
            dispatch(requestTrendingQuestions());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
