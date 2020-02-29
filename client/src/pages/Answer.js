import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import { requestUserQuestions } from '../store/actions/questions';
import QuestionCard from '../components/question/Card';
import AnswerCard from '../components/answer/Card';

const useStyles = makeStyles({
    root: {
        width: 1000,
    },
    media: {
        height: 550,
    },
});


function Home(props) {
    const {
        requestUserQuestions,
        user,
        onLogout,
        questions,
    } = props;

    const classes = useStyles();

    useEffect(() => {
        requestUserQuestions();
    }, [ requestUserQuestions ]);

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
        <div>
            <Container>
                <Grid
                    container
                    style={ { marginTop: 90 } }
                    justify="center">
                    <Card className={ classes.root }>
                        <CardActionArea>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="h2">
                                    Answer
                                </Typography>
                                <CardMedia
                                    className={ classes.media }
                                    image="/underconstruction.gif"
                                    title="Contemplative Reptile" />
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                onClick={ props.history.goBack }>
                                Go Back
                            </Button>
                        </CardActions>
                    </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
