import React, { useEffect } from 'react';
import {
    Grid,
    Container,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';

import AnswerCard from '../components/answer/Card';
import { requestAnswerById } from '../store/actions/answer';

function Answer(props) {
    const {
        match: {
            params: { answerId },
        },
        requestAnswer,
        answer,
        pending,
    } = props;

    useEffect(() => {
        requestAnswer(answerId);
    }, [
        requestAnswer,
        answerId,
    ]);

    const renderAnswer = (answer) => (
        <AnswerCard
            questionId={ answer.question._id }
            answer={ answer }
            answerId={ answer._id }
            upvoters={ answer.upvoters }
            downvoters={ answer.downvoters }
            question={ answer.question.question }
            author={ answer.author }
            topics={ answer.question.topics }
            hideHelperText
            date={ answer.postedDate } />
    );

    if (pending) {
        return (
            <div style={{ width: 700, margin: 'auto', marginTop: 100 }}>
                <Skeleton
                    variant="rect"
                    style={ { marginTop: 70 } }
                    height={ 400 } />
            </div>
        );
    }


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
                        xs={ 2 } />
                    <Grid
                        item
                        xs={ 7 }>
                        { answer && answer.question && renderAnswer(answer) }
                    </Grid>
                    <Grid
                        item
                        xs={ 3 } />
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        answer: state.answer.answer,
        pending: state.answer.pending,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestAnswer: (id) => {
            dispatch(requestAnswerById(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Answer);
