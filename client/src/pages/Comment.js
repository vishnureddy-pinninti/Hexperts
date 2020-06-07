import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

import Avatar from '../components/base/Avatar';
import { requestCommentById } from '../store/actions/answer';
import getBadge from '../utils/badge';

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
        match: {
            params: { commentId 
},
        },
        requestComent,
        comment,
        postComment,
        history,
        pending,
    } = props;

    useEffect(() => {
        requestComent(commentId);
    }, [
        requestComent,
        commentId,
    ]);

    const onProfileClick = (_id) => {
        history.push(`/profile/${_id}`);
    };

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
        <Card>
            <CardContent className={ classes.cartContent }>
                <CardHeader
                    className={ classes.headerRoot }
                    avatar={
                        <Avatar
                            alt={ comment.author.name }
                            user={ comment.author.email }
                            badge={ getBadge(comment.author.reputation) }
                            onClick={ () => onProfileClick(comment.author._id) }
                            className={ classes.avatar } />
                    }
                    title={
                        <Link
                            className={ classes.link }
                            onClick={ () => onProfileClick(comment.author._id) }>
                            { comment.author.name }
                            ,
                            { ' ' }
                            { comment.author.jobTitle }
                        </Link>
                    }
                    subheader={
                        <Link
                            className={ classes.link }
                            to={ `/comment/${comment._id}` }>
                            { `Commented ${formatDistanceToNow(new Date(comment.postedDate), { addSuffix: true })}` }
                        </Link>
                    } />
                <div
                    style={ {
                        display: 'flex',
                        flexDirection: 'column',
                    } }
                    className="editor-read-mode"
                    dangerouslySetInnerHTML={ { __html: comment.comment } } />
            </CardContent>
        </Card>
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
                        { pending ? <Skeleton
                            variant="rect"
                            height={ 150 } /> : <>
                                { comment && comment.answer && renderTitle(comment) }
                                { comment && comment.answer && renderComment(comment) }
                                { postComment && postComment.post && renderPostCommentTitle(postComment) }
                                { postComment && postComment.post && renderComment(postComment) }
                            </> }
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
        pending: state.answer.pending,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestComent: (id) => {
            dispatch(requestCommentById(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
