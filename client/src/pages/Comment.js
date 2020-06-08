import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography,
    Container,
    Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from 'react-router-dom';
import CommentCard from '../components/comment/Card';
import EmptyResults from '../components/base/EmptyResults';
import { requestCommentById } from '../store/actions/answer';

const useStyles = makeStyles(() => {
    return {
        link: {
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        avatar: {
            cursor: 'pointer',
        },
        commentTitle: {
            padding: 10,
        },
    };
});

function Comment(props) {
    const classes = useStyles();
    const {
        match,
        requestComent,
        comment,
        postComment,
    } = props;

    const {
        params: { commentId },
    } = match;

    const [
        error,
        setError,
    ] = React.useState();

    const [
        loading,
        setLoading,
    ] = React.useState(false);

    useEffect(() => {
        if (comment.comment){
            setLoading(false);
        }
    }, [ comment ]);

    useEffect(() => {
        requestComent(commentId, () => {}, () => {
            setLoading(false);
            setError('Comment not found. It may have been deleted by the author.');
        });
    }, [
        requestComent,
        commentId,
    ]);

    const renderTitle = (comment) => (
        <Typography
            variant="body2"
            color="textSecondary"
            className={ classes.commentTitle }
            component="p">
            Comment on
            { ' ' }
            <Link
                to={ `/profile/${comment.answer.author._id}` }
                className={ classes.link }>
                { comment.answer.author.name }
            </Link>
            's
            { ' ' }
            <Link
                to={ `/answer/${comment.answer._id}` }
                className={ classes.link }>
                answer
            </Link>
            { ' ' }
            to
            { ' ' }
            <Link
                to={ `/question/${comment.question._id}` }
                className={ classes.link }>
                { comment.question.question }
            </Link>
        </Typography>
    );

    const renderPostCommentTitle = (comment) => (
        <Typography
            variant="body2"
            color="textSecondary"
            className={ classes.commentTitle }
            component="p">
            Comment on
            { ' ' }
            <Link
                to={ `/profile/${comment.post.author._id}` }
                className={ classes.link }>
                { comment.post.author.name }
            </Link>
            's post about
            { ' ' }
            <Link
                to={ `/post/${comment.post._id}` }
                className={ classes.link }>
                { comment.post.title }
            </Link>
        </Typography>
    );

    const renderComment = (comment) => (
        <CommentCard
            comment={ comment }
            collapse={ false } />
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
                        xs={ 2 } />
                    <Grid
                        item
                        xs={ 7 }>
                        { loading ? <Skeleton
                            variant="rect"
                            height={ 150 } /> : <>
                            { comment && comment.answer && renderTitle(comment) }
                            { comment && comment.answer && renderComment(comment) }
                            { postComment && postComment.post && renderPostCommentTitle(postComment) }
                            { postComment && postComment.post && renderComment(postComment) }
                        </> }
                        { error
                            && <EmptyResults
                                style={ { marginTop: 30 } }
                                title={ error }
                                showBackButton /> }
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
        comment: state.answer.comment,
        postComment: state.blog.comment,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestComent: (id, success, error) => {
            dispatch(requestCommentById(id, success, error));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
