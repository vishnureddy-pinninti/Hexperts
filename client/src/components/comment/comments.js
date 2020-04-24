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
import InfiniteScroll from 'react-infinite-scroll-component';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import CardLoader from '../base/CardLoader';
import Avatar from '../base/Avatar';
import { commentAnswer,
    requestCommentsForAnswer } from '../../store/actions/answer';
import getBadge from '../../utils/badge';

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

const renderTextField = ({ input }) => (
    <TextField
        { ...input }
        margin="dense"
        id="name"
        placeholder="Start typing your comment..."
        type="text"
        required
        variant="outlined"
        fullWidth />
);

const Comments = (props) => {
    const classes = useStyles();
    const {
        handleSubmit,
        user,
        target,
        commentAnswer,
        requestCommentsForAnswer,
        history,
        handleNewComment,
        targetType,
    } = props;

    const [
        pagination,
        setPagination,
    ] = React.useState({
        index: 0,
        hasMore: true,
    });

    const [
        newComments,
        setNewComments,
    ] = React.useState(0);

    const [
        items,
        setItems,
    ] = React.useState([]);

    const newCommentCallback = (res) => {
        setItems([
            res,
            ...items,
        ]);
        setNewComments(newComments + 1);
        if (handleNewComment){
            handleNewComment();
        }
    };

    const addUserComment = (values) => {
        commentAnswer({
            targetID: target._id,
            target: targetType,
            ...values,
        }, newCommentCallback, () => {});
    };

    const getCommentsCallback = (res) => {
        if (res.length) {
            setItems([
                ...items,
                ...res,
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
    };

    const loadMore = () => {
        if (pagination.index > 0){
            requestCommentsForAnswer(target._id, {
                skip: pagination.index * 10 + +newComments,
            }, getCommentsCallback);
        }
    };

    React.useEffect(() => {
        requestCommentsForAnswer(target._id,
            { skip: 0 },
            getCommentsCallback,
            () => {});
    }, [ target ]);

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
                                badge={ getBadge(comment.author.reputation) }
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
                            badge={ getBadge(user.reputation) }
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
            { (pagination.hasMore || items.length > 0)
            && <InfiniteScroll
                style={ { overflow: 'visible' } }
                dataLength={ items.length }
                next={ loadMore }
                hasMore={ pagination.hasMore }
                loader={ <CardLoader height={ 50 } /> }>
                { renderComments(items) }
               </InfiniteScroll> }
            { pagination.hasMore && <ListItem
                button
                onClick={ loadMore }>
                More
                { '  ' }
                <KeyboardArrowDownIcon />
            </ListItem> }
        </List>
    );
};

Comments.defaultProps = {
    targetType: 'comments',
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        commentAnswer: (body, success, error) => {
            dispatch(commentAnswer(body, success, error));
            dispatch(reset('comment'));
        },
        requestCommentsForAnswer: (answerId, params, success, error) => {
            dispatch(requestCommentsForAnswer(answerId, params, success, error));
        },
    };
};

export default reduxForm({
    form: 'comment',
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(withRouter(Comments)));
