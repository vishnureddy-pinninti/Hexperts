import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Button,
    Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm, reset } from 'redux-form';
import InfiniteScroll from 'react-infinite-scroll-component';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { convertToRaw } from 'draft-js';
import Editor from '../base/Editor';
import CardLoader from '../base/CardLoader';
import CommentCard from './Card';
import Avatar from '../base/Avatar';
import { commentAnswer,
    requestCommentsForAnswer } from '../../store/actions/answer';
import draftToHtml from '../../utils/draftjs-to-html';

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
        more: {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
            cursor: 'pointer',
        },
        headerRoot: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        cartContent: {
        },
        menuIcon: {
            paddingRight: 5,
        },
    };
});


const Comments = (props) => {
    const classes = useStyles();
    const {
        handleSubmit,
        user,
        target,
        commentAnswer,
        requestCommentsForAnswer,
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

    const [
        description,
        setDescription,
    ] = React.useState('');

    const onEditorStateChange = (value) => {
        setDescription(value);
    };

    const renderTextField = () => (
        <Editor
            toolbarHidden
            initialValue={ description }
            placeholder="Type @ to mention someone in the comment"
            handleEditorStateChange={ onEditorStateChange } />
    );

    const newCommentCallback = (res) => {
        setItems([
            res,
            ...items,
        ]);
        setDescription('');
        setNewComments(newComments + 1);
        if (handleNewComment){
            handleNewComment();
        }
    };

    const addUserComment = () => {
        commentAnswer({
            targetID: target._id,
            target: targetType,
            comment: description && draftToHtml(convertToRaw(description.getCurrentContent())),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ target ]);

    const renderComments = (comments) => comments.map((comment) => (
        <CommentCard
            key={ comment._id }
            comment={ comment } />
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
                                { renderTextField() }
                            </Grid>
                            <Grid
                                item
                                xs={ 2 }>
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
    targetType: 'answers',
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
