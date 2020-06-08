import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardHeader,
    CardContent,
    IconButton,
    Menu,
    MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReadMore from '../base/ReadMore';
import EditAnswerModal from '../answer/EditAnswerModal';
import Avatar from '../base/Avatar';
import { deleteComment,
    editComment } from '../../store/actions/answer';
import getBadge from '../../utils/badge';
import { isMediaOrCode } from '../../utils/common';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginTop: 10,
            border: '1px solid #efefef',
        },
        disabled: {
            opacity: 0.3,
            pointerEvents: 'none',
        },
        headerRoot: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        topics: {
            display: 'flex',
            flexDirection: 'row',
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            cursor: 'pointer',
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        topicLink: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
            paddingLeft: 10,
        },
        more: {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
            cursor: 'pointer',
        },
        menuIcon: {
            paddingRight: 5,
        },
    };
});

const CommentCard = (props) => {
    const classes = useStyles();

    const {
        comment,
        history,
        user,
        deleteComment,
        editComment,
        collapse,
    } = props;

    const { _id: commentId, author } = comment;

    const {
        _id,
        name,
        jobTitle,
        email,
        reputation,
    } = author;

    const [
        disabled,
        setDisabled,
    ] = React.useState(false);

    const [
        commentHTML,
        setCommentHTML,
    ] = React.useState(comment && comment.comment);

    const [
        lastModified,
        setLastModified,
    ] = React.useState(comment.lastModified);


    const renderComment = (comment) => (
        <ReadMore
            initialHeight={ 300 }
            mediaExists={ isMediaOrCode(comment) }
            readMore={ (props) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    className={ classes.more }
                    onClick={ props.onClick }>
                    <b>
                        { props.open ? 'Read less' : 'Read more...' }
                    </b>
                </a>
            ) }>
            <div
                style={ {
                    display: 'flex',
                    flexDirection: 'column',
                } }
                className="editor-read-mode"
                dangerouslySetInnerHTML={ { __html: comment } } />
        </ReadMore>
    );

    const onProfileClick = () => {
        history.push(`/profile/${author._id}`);
    };

    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [
        openEditCommentModal,
        setOpenEditCommentModal,
    ] = React.useState(false);

    const handleDeleteComment = () => {
        setAnchorEl(null);
        deleteComment(commentId, (res) => {
            if (res) { setDisabled(true); }
        });
    };

    const handleEditComment = (comment) => {
        setAnchorEl(null);
        setOpenEditCommentModal(false);
        editComment(commentId, { comment }, (res) => {
            if (res) {
                setCommentHTML(res.comment);
                setLastModified(res.lastModified);
            }
        });
    };

    const handleEditCommentModalOpen = () => {
        setAnchorEl(null);
        setOpenEditCommentModal(true);
    };

    const handleEditCommentModalClose = () => {
        setOpenEditCommentModal(false);
    };

    const isOwner = user._id === author._id;

    return (
        <Card
            className={ classes.root }
            elevation={ 0 }>
            <CardContent>
                <div className={ disabled ? classes.disabled : '' }>
                    <CardHeader
                        className={ classes.headerRoot }
                        avatar={
                            <Avatar
                                aria-label={ name }
                                alt={ name }
                                user={ email }
                                badge={ getBadge(reputation) }
                                onClick={ onProfileClick }
                                className={ classes.avatar } />
                        }
                        action={ isOwner && <>
                            <IconButton
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={ handleClick }>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={ anchorEl }
                                keepMounted
                                open={ Boolean(anchorEl) }
                                onClose={ handleClose }>
                                <MenuItem onClick={ handleEditCommentModalOpen }>
                                    <EditIcon className={ classes.menuIcon } />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={ handleDeleteComment }>
                                    <DeleteIcon className={ classes.menuIcon } />
                                    Delete
                                </MenuItem>
                            </Menu>
                        </> }
                        title={
                            <Link
                                className={ classes.link }
                                to={ `/profile/${_id}` }
                                onClick={ () => onProfileClick(_id) }>
                                { name }
                                ,
                                { ' ' }
                                { jobTitle }
                            </Link>
                        }
                        subheader={
                            <Link
                                className={ classes.link }
                                to={ `/comment/${comment._id}` }>
                                { lastModified ? `Edited ${formatDistance(new Date(lastModified), new Date(), { addSuffix: true })}`
                                    : `Answered ${formatDistance(new Date(comment.postedDate), new Date(), { addSuffix: true })}` }
                            </Link>
                        } />
                    { collapse ? renderComment(commentHTML) : <div
                        style={ {
                            display: 'flex',
                            flexDirection: 'column',
                        } }
                        className="editor-read-mode"
                        dangerouslySetInnerHTML={ { __html: commentHTML } } /> }
                </div>
            </CardContent>
            { openEditCommentModal && <EditAnswerModal
                open={ openEditCommentModal }
                answerHTML={ commentHTML }
                title="Edit Comment"
                handleClose={ handleEditCommentModalClose }
                handleDone={ handleEditComment } /> }
        </Card>
    );
};

CommentCard.defaultProps = {
    hideHeader: false,
    hideHeaderHelperText: false,
    collapse: true,
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        user: state.user.user,
        modifiedAnswers: state.answer.modifiedAnswers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteComment: (answerId, cb) => {
            dispatch(deleteComment(answerId, cb));
        },
        editComment: (answerId, body, cb) => {
            dispatch(editComment(answerId, body, cb));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommentCard));
