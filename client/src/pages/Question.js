import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import TopBar from '../components/base/TopBar';
import Drawer from '../components/base/Drawer';
import Questions from '../components/base/Questions';
import QuestionSection from '../components/question/QuestionSection';
import Answer from '../components/answer/Card';
import { requestQuestionById } from '../store/actions/questions';


function Question(props) {
    const [
        open,
        setOpen,
    ] = React.useState(false);

    const {
        match: {
            params: { questionId },
        },
        requestQuestion,
    } = props;

    useEffect(() => {
        requestQuestion(questionId);
    }, [
        questionId,
        requestQuestion,
    ]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const renderAnswers = () => question.answers.results.map((answer) => (
        <Answer
            key={ answer._id }
            hideHeader
            author={ answer.author }
            date={ answer.postedDate }
            answer={ answer } />
    ));

    const { question } = props;
    return (
        <div className="App">
            <TopBar handleDrawerOpen={ handleDrawerOpen } />
            <Drawer
                open={ open }
                handleDrawerClose={ handleDrawerClose } />
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 8 }>
                        { question && <QuestionSection
                            question={ question.question }
                            id={ question._id } /> }
                        { question && question.answers && renderAnswers() }
                    </Grid>
                    <Grid
                        item
                        xs={ 4 }>
                        <Questions title="Related Questions" />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        question: state.questions.question,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestQuestion: (questionId) => {
            dispatch(requestQuestionById(questionId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Question);
