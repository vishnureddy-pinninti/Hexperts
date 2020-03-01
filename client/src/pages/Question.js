import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import Questions from '../components/question/QuestionsList';
import QuestionSection from '../components/question/QuestionSection';
import Answer from '../components/answer/Card';
import { requestQuestionById, requestRelatedQuestions } from '../store/actions/questions';

function Question(props) {
    const [
        open,
        setOpen,
    ] = React.useState(false);

    const {
        match: {
            params: { questionId 
},
        },
        requestQuestion,
        requestRelatedQuestions,
        question,
 relatedQuestions
    } = props;

    useEffect(() => {
        requestQuestion(questionId);
        requestRelatedQuestions(questionId);
    }, [
        questionId,
        requestQuestion,
        requestRelatedQuestions,
    ]);

    const renderAnswers = () => question.answers.results.map((answer) => (
        <Answer
            key={ answer._id }
            hideHeader
            author={ answer.author }
            date={ answer.postedDate }
            answer={ answer } />
    ));

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
                        xs={ 8 }>
                        { question && <QuestionSection
                            question={ question.question }
                            id={ question._id }
                            answers={ question.answers }
                            topics={ question.topics } /> }
                        { question && question.answers && renderAnswers() }
                    </Grid>
                    <Grid
                        item
                        xs={ 4 }>
                        <Questions
                            title="Related Questions"
                            questions={ relatedQuestions } />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        question: state.questions.question,
        relatedQuestions: state.questions.relatedQuestions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestQuestion: (questionId) => {
            dispatch(requestQuestionById(questionId));
        },
        requestRelatedQuestions: (questionId) => {
            dispatch(requestRelatedQuestions(questionId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Question);
