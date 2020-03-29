import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    TextField,
    Button,
    Grid,
    CardContent,
    CardHeader } from '@material-ui/core';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Field, reduxForm, reset } from 'redux-form';
import { formatDistanceToNow } from 'date-fns';

import CardLoader from '../base/CardLoader';
import Avatar from '../base/Avatar';
import {
    addPostToCache,
    commentPost,
    requestCommentsForPost,
} from '../../store/actions/blog';

const validate = (values) => {
    const errors = {};
    const requiredFields = [ 'question' ];
    requiredFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });
    return errors;
};

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        inline: {
            display: 'inline',
        },
        input: {
            marginRight: 400,
        },
        field: {
            flex: 1,
            marginRight: 400,
        },
        button: {
            width: 20,
            marginLeft: 20,
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        headerRoot: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        cartContent: {
            padding: 0,
        },
    };
});

const Comments = (props) => {
    const classes = useStyles();
    const {
        handleSubmit,
        user,
        post,
        commentPost,
        modifiedPosts,
        requestCommentsForPost,
        history,
        pending,
    } = props;

    let comments = [];

    if (modifiedPosts && modifiedPosts[post._id]){
        comments = modifiedPosts[post._id].commentsCache || [];
    }
    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            margin="dense"
            id="name"
            placeholder="Start typing your comment."
            type="text"
            required
            variant="outlined"
            className={ classes.input }
            fullWidth />
    );

    const addUserComment = (values) => {
        commentPost({
            targetID: post._id,
            target: 'posts',
            ...values,
        }, post);
    };

    React.useEffect(() => {
        requestCommentsForPost(post);
    }, [ post ]);

    const onProfileClick = (_id) => {
        history.push(`/profile/${_id}`);
    };

    const renderComments = (comments) => comments.map((comment) => (
        <React.Fragment key={ comment._id }>
            <ListItem
                alignItems="flex-start">

                <CardContent className={ classes.cartContent }>
                    <CardHeader
                        className={ classes.headerRoot }
                        avatar={
                            <Avatar
                                alt={ comment.author.name }
                                user={ comment.author.email }
                                onClick={ () => onProfileClick(comment.author._id) }
                                className={ classes.avatar } />
                        }
                        title={
                            <Link
                                className={ classes.link }
                                onClick={ () => onProfileClick(comment.author._id) }>
                                { comment.author.name }
                                ,
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
                    { comment.comment }
                </CardContent>
            </ListItem>
            <Divider />
        </React.Fragment>
    ));

    return (
        <List className={ classes.root }>
            <form
                id="comment"
                onSubmit={ handleSubmit(addUserComment) }>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar
                            aria-label="recipe"
                            className={ classes.avatar }
                            user={ user.email } />
                    </ListItemAvatar>
                    <ListItemText>
                        <Grid
                            container
                            spacing={ 1 }
                            alignItems="center">
                            <Grid
                                item
                                xs={ 10 }>
                                <Field
                                    name="comment"
                                    component={ renderTextField } />
                            </Grid>
                            <Grid
                                item
                                xs={ 2 }
                                alignItems="center">
                                <Button
                                    size="medium"
                                    variant="contained"
                                    type="submit"
                                    color="primary">
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </ListItemText>
                </ListItem>
            </form>
            { pending ? <CardLoader height={ 50 } /> : renderComments(comments) }
        </List>
    );
};

Comments.defaultProps = {
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        comments: state.blog.comments,
        modifiedPosts: state.blog.modifiedPosts,
        pending: state.blog.pending,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        commentPost: (body, post) => {
            dispatch(addPostToCache(post));
            dispatch(commentPost(body));
            dispatch(reset('comment'));
        },
        requestCommentsForPost: (post, params) => {
            dispatch(addPostToCache(post));
            dispatch(requestCommentsForPost(post._id, params));
        },
    };
};

export default reduxForm({
    form: 'comment',
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(withRouter(Comments)));
