import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TopBar from '../components/base/TopBar';
import AnswerCard from '../components/answer/Card';
import QuestionCard from '../components/question/Card';
import Drawer from '../components/base/Drawer';
import Topics from '../components/topic/TopicsList';
import { requestUserQuestions } from '../store/actions/questions';
import TopCreators from '../components/answer/TopCreators';
import AskQuestionCard from '../components/question/AskQuestionCard';

function Home(props) {
    const [
        open,
        setOpen,
    ] = React.useState(false);


    const {
        requestUserQuestions,
        user,
        onLogout,
        questions,
    } = props;

    useEffect(() => {
        // Update the document title using the browser API
        requestUserQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

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
        <div className="App">
            <TopBar
                handleDrawerOpen={ handleDrawerOpen }
                handleLogout={ onLogout } />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestUserQuestions: () => {
            dispatch(requestUserQuestions());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
