import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Questions from '../components/question/QuestionsList';
import QuestionSection from '../components/question/QuestionSection';
import Answer from '../components/answer/Card';
import EmptyResults from '../components/base/EmptyResults';

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
 relatedQuestions,
 modifiedQuestions,
 newAnswer,
    } = props;

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
        if (question.answers && question.answers.results){
            const { answers: { results } } = question;
            if (results.length) {
                setItems([
                    ...items,
                    ...results,
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
    }, [ question ]);

    useEffect(() => {
        setItems([]);
        setPagination({
            index: 0,
            hasMore: false,
        });
        requestQuestion(questionId);
    }, [
        questionId,
        requestQuestion,
    ]);

    const loadMore = () => {
        requestQuestion(questionId, { skip: pagination.index * 10 });
    };

    useEffect(() => {
        requestRelatedQuestions(questionId);
    }, [
        questionId,
        requestRelatedQuestions,
    ]);

    let newAnswers = [];

    if (modifiedQuestions && modifiedQuestions[questionId] && modifiedQuestions[questionId].newAnswers){
        newAnswers = [ ...modifiedQuestions[questionId].newAnswers ];
    }

    const renderAnswers = (items) => items.map((answer) => (
        <Answer
            key={ answer._id }
            answerId={ answer._id }
            hideHeader
            upvoters={ answer.upvoters }
            downvoters={ answer.downvoters }
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
                            question={ question }
                            id={ question._id }
                            answers={ question.answers }
                            topics={ question.topics } /> }
                        { renderAnswers(newAnswers) }
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
                            { renderAnswers(items) }
                        </InfiniteScroll> }
                        { items.length === 0 && <EmptyResults
                            title="No answer posted yet."
                            description="Feel free to add an answer to this question."
                            showBackButton={ false } /> }
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

Question.defaultProps = {
    question: { answers: { results: [] } },
};

const mapStateToProps = (state) => {
    return {
        question: state.questions.question,
        modifiedQuestions: state.questions.modifiedQuestions,
        relatedQuestions: state.questions.relatedQuestions,
        newAnswer: state.answer.newAnswer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestQuestion: (questionId, params) => {
            dispatch(requestQuestionById(questionId, params));
        },
        requestRelatedQuestions: (questionId) => {
            dispatch(requestRelatedQuestions(questionId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Question);
