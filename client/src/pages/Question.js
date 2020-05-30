import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '@material-ui/lab/Skeleton';
import Questions from '../components/question/QuestionsList';
import QuestionSection from '../components/question/QuestionSection';
import Answer from '../components/answer/Card';
import CardLoader from '../components/base/CardLoader';

import EmptyResults from '../components/base/EmptyResults';

import { requestQuestionById, requestRelatedQuestions } from '../store/actions/questions';

function Question(props) {
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
    } = props;

    const [
        loading,
        setLoading,
    ] = React.useState(false);

    const [
        relatedQuestionsloading,
        setRelatedQuestionsloading,
    ] = React.useState(false);

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
        setLoading(false);
    }, [ question ]);

    const [
        newAnswers,
        setNewAnswers,
    ] = React.useState([]);

    const [
        error,
        setError,
    ] = React.useState();

    useEffect(() => {
        if (modifiedQuestions && modifiedQuestions[questionId] && modifiedQuestions[questionId].newAnswers){
            setNewAnswers([ ...modifiedQuestions[questionId].newAnswers ]);
        }
    }, [ modifiedQuestions ]);

    useEffect(() => {
        setItems([]);
        setNewAnswers([]);
        setPagination({
            index: 0,
            hasMore: false,
        });
        setLoading(true);
        requestQuestion(questionId, { skip: 0 }, () => {}, (res) => {
            setLoading(false);
            setError('Question not found. It may have been deleted by the author.');
        });
        setRelatedQuestionsloading(true);
        requestRelatedQuestions(questionId);
    }, [
        questionId,
        requestQuestion,
    ]);

    const loadMore = () => {
        if (pagination.index > 0){
            requestQuestion(questionId, { skip: (pagination.index * 10) + newAnswers.length });
        }
    };

    // useEffect(() => {
    //     setRelatedQuestionsloading(true);
    //     requestRelatedQuestions(questionId);
    // }, [
    //     questionId,
    //     requestRelatedQuestions,
    // ]);

    useEffect(() => {
        setRelatedQuestionsloading(false);
    }, [ relatedQuestions ]);


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

    if (error){
        return (
            <Grid
                container
                justify="center"
                style={ { marginTop: 70 } }
                spacing={ 3 }>
                <Grid
                    item
                    xs={ 8 }>
                    <EmptyResults
                        style={ { marginTop: 10 } }
                        title={ error }
                        showBackButton />
                </Grid>
            </Grid>
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
                        xs={ 8 }>
                        { loading ? <Skeleton
                            variant="rect"
                            style={ { marginBottom: 10 } }
                            height={ 200 } />
                            : <QuestionSection
                                question={ question }
                                id={ question._id }
                                author={ question.author }
                                answers={ question.answers }
                                topics={ question.topics } /> }
                        { loading ? <Skeleton
                            variant="rect"
                            height={ 700 } />
                            : <>
                                { renderAnswers(newAnswers) }
                                { items.length > 0
                                && <InfiniteScroll
                                    dataLength={ items.length }
                                    next={ loadMore }
                                    hasMore={ pagination.hasMore }
                                    loader={ <CardLoader /> }
                                    endMessage={
                                        <p style={ { textAlign: 'center' } }>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    }>
                                    { renderAnswers(items) }
                                </InfiniteScroll> }
                                { (items.length === 0 && newAnswers.length === 0) && !pagination.hasMore && <EmptyResults
                                    title="No answer posted yet."
                                    description="Feel free to add an answer to this question."
                                    showBackButton={ false } /> }
                            </> }
                    </Grid>
                    <Grid
                        item
                        xs={ 4 }>
                        { relatedQuestionsloading ? <Skeleton
                            variant="rect"
                            height={ 500 } />
                            : <Questions
                                title="Related Questions"
                                questions={ relatedQuestions || [] } /> }
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
        requestQuestion: (questionId, params, success, error) => {
            dispatch(requestQuestionById(questionId, params, success, error));
        },
        requestRelatedQuestions: (questionId) => {
            dispatch(requestRelatedQuestions(questionId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Question);
