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
    addAnswerToCache,
    commentAnswer,
    requestCommentsForAnswer,
} from '../../store/actions/answer';

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
        answer,
        commentAnswer,
        modifiedAnswers,
        requestCommentsForAnswer,
        history,
        pending,
    } = props;

    let comments = [];

    if (modifiedAnswers && modifiedAnswers[answer._id]){
        comments = modifiedAnswers[answer._id].commentsCache || [];
    }
    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            autoFocus
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
        commentAnswer({
            targetID: answer._id,
            target: 'answers',
            ...values,
        }, answer);
    };

    React.useEffect(() => {
        requestCommentsForAnswer(answer);
    }, [ answer ]);

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
            { pending ? <CardLoader height={ 50 } />: renderComments(comments) }
        </List>
    );
};

Comments.defaultProps = {
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        comments: state.answer.comments,
        modifiedAnswers: state.answer.modifiedAnswers,
        pending: state.answer.pending,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        commentAnswer: (body, answer) => {
            dispatch(addAnswerToCache(answer));
            dispatch(commentAnswer(body));
            dispatch(reset('comment'));
        },
        requestCommentsForAnswer: (answer, params) => {
            dispatch(addAnswerToCache(answer));
            dispatch(requestCommentsForAnswer(answer._id, params));
        },
    };
};

export default reduxForm({
    form: 'comment',
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(withRouter(Comments)));
