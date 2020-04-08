import React, { useEffect } from 'react';
import { Grid,
    Container } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';

import AnswerCard from '../components/answer/Card';
import EmptyResults from '../components/base/EmptyResults';
import { requestAnswerById } from '../store/actions/answer';

function Answer(props) {
    const {
        match: {
            params: { answerId 
},
        },
        requestAnswer,
        answer,
        pending,
    } = props;

    const [
        loading,
        setLoading,
    ] = React.useState(false);

    const [
        error,
        setError,
    ] = React.useState();

    useEffect(() => {
        if (answer.question){
            setLoading(false);
        }
    }, [ answer ]);

    useEffect(() => {
        setLoading(true);
        requestAnswer(answerId, () => {}, (res) => {
            setLoading(false);
            setError(res.response);
        });
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
                        xs={ 1 } />
                    <Grid
                        item
                        xs={ 10 }>
                        { loading ? <Skeleton
                            variant="rect"
                            height={ 400 } />
                            : (answer && answer.question && renderAnswer(answer)) }
                        { error
                            && <EmptyResults
                                style={ { marginTop: 30 } }
                                title={ error }
                                showBackButton /> }
                    </Grid>
                    <Grid
                        item
                        xs={ 1 } />
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
        requestAnswer: (id, success, error) => {
            dispatch(requestAnswerById(id, success, error));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Answer);
