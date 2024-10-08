import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Collapse } from '@material-ui/core';
import { ChatBubbleOutlineRounded as ChatBubbleOutlineRoundedIcon,
    ThumbUpOutlined as ThumbUpOutlinedIcon,
    ThumbUpAlt as ThumbUpAltIcon,
    ChatBubble as ChatBubbleIcon } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Comments from '../comment/comments';
import ReadMore from '../base/ReadMore';
import EditAnswerModal from './EditAnswerModal';
import Avatar from '../base/Avatar';
import { upvoteAnswer,
    addAnswerToCache,
    deleteAnswer,
    editAnswer,
    downvoteAnswer } from '../../store/actions/answer';
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

const AnswerCard = (props) => {
    const classes = useStyles();

    const {
        question,
        questionId,
        answer,
        answerId,
        hideHeader,
        history,
        author: {
            _id,
            name,
            jobTitle,
            email,
            reputation,
},
        topics,
        upvoters,
        upvoteAnswer,
        hideHeaderHelperText,
        user,
        deleteAnswer,
        editAnswer,
        collapse,
    } = props;

    const [
        open,
        setOpen,
    ] = React.useState(false);

    const [
        disabled,
        setDisabled,
    ] = React.useState(false);

    const [
        answerHTML,
        setAnswerHTML,
    ] = React.useState(answer && answer.answer);

    const [
        lastModified,
        setLastModified,
    ] = React.useState(answer.lastModified);

    const [
        commentsCount,
        setCommentsCount,
    ] = React.useState(answer.commentsCount || 0);

    const renderAnswer = (answer) => (
        <ReadMore
            initialHeight={ 300 }
            mediaExists={ isMediaOrCode(answer) }
            collapse={ collapse }
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
                dangerouslySetInnerHTML={ { __html: answer } } />
        </ReadMore>
    );

    const onProfileClick = () => {
        history.push(`/profile/${_id}`);
    };

    const renderTopics = () => topics.map((topic) => (
        <Link
            key={ topic._id }
            className={ classes.topicLink }
            to={ `/topic/${topic._id}` }>
            { topic.topic }
        </Link>
    ));

    const renderHeaderHelperText = () => (
        <Typography
            variant="body2"
            color="textSecondary"
            className={ classes.topics }
            component="p">
            Answer -
            { topics && topics.length ? renderTopics() : ' Recommended to you' }
        </Typography>
    );

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
        openEditAnswerModal,
        setOpenEditAnswerModal,
    ] = React.useState(false);

    const handleDeleteAnswer = () => {
        setAnchorEl(null);
        deleteAnswer(answerId, (res) => {
            if (res) { setDisabled(true); }
        });
    };

    const handleEditAnswer = (answer) => {
        setAnchorEl(null);
        setOpenEditAnswerModal(false);
        editAnswer(answerId, { answer }, (res) => {
            if (res) {
                setAnswerHTML(res.answer);
                setLastModified(res.lastModified);
            }
        });
    };

    const handleEditAnswerModalOpen = () => {
        setAnchorEl(null);
        setOpenEditAnswerModal(true);
    };

    const handleEditAnswerModalClose = () => {
        setOpenEditAnswerModal(false);
    };

    const isOwner = user._id === _id;

    //New Code -- After schema change
    const upvoted = upvoters.findIndex(x => x._id === user._id) >= 0;
    //const downvoted = downvoters.findIndex(x => x._id === user._id) >= 0;

    return (
        <Card
            className={ classes.root }
            elevation={ 0 }>
            <CardContent>
                {
                    !hideHeader && <>
                        { !hideHeaderHelperText && renderHeaderHelperText() }
                        <div>
                            <Link
                                disabled={ disabled }
                                to={ `/question/${questionId}` }
                                className={ classes.link }>
                                <Box
                                    fontWeight="fontWeightBold"
                                    fontSize={ 20 }>
                                    { question }
                                </Box>
                            </Link>
                        </div>
                                   </>
                }
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
                                <MenuItem onClick={ handleEditAnswerModalOpen }>
                                    <EditIcon className={ classes.menuIcon } />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={ handleDeleteAnswer }>
                                    <DeleteIcon className={ classes.menuIcon } />
                                    Delete
                                </MenuItem>
                            </Menu>
                                            </> }
                        title={
                            <Link
                                className={ classes.link }
                                to={ `/profile/${_id}` }>
                                { name }
                                ,
                                { ' ' }
                                { jobTitle }
                            </Link>
                        }
                        subheader={
                            <Link
                                className={ classes.link }
                                to={ `/answer/${answerId}` }>
                                { lastModified ? `Edited ${formatDistance(new Date(lastModified), new Date(), { addSuffix: true })}`
                                    : `Answered ${formatDistance(new Date(props.date), new Date(), { addSuffix: true })}` }
                            </Link>
                        } />
                    { renderAnswer(answerHTML) }
                </div>
            </CardContent>
            <CardActions
                className={ disabled ? classes.disabled : '' }
                disableSpacing>
                <Button
                    size="small"
                    onClick={ () => upvoteAnswer(answerId, answer) }
                    startIcon={ upvoted ? <ThumbUpAltIcon color="primary" /> : <ThumbUpOutlinedIcon /> }>
                    { upvoters.length }
                </Button>
                <Button
                    size="small"
                    onClick={ () => setOpen(!open) }
                    startIcon={ open ? <ChatBubbleIcon color="primary" /> : <ChatBubbleOutlineRoundedIcon /> }>
                    { commentsCount }
                </Button>
                { /* <Button
                    size="small"
                    style={ { marginLeft: 'auto' } }
                    onClick={ () => downvoteAnswer(answerId, answer) }
                    startIcon={ downvoted ? <ThumbDownAltIcon color="primary" /> : <ThumbDownOutlinedIcon /> } /> */ }
            </CardActions>
            <Collapse
                in={ open }
                timeout="auto"
                unmountOnExit>
                <CardContent>
                    <Divider />
                    <Comments
                        target={ answer }
                        handleNewComment={ () => { setCommentsCount(commentsCount + 1); } } />
                </CardContent>
                <CardActions />
            </Collapse>
            { openEditAnswerModal && <EditAnswerModal
                open={ openEditAnswerModal }
                answerHTML={ answerHTML }
                question={ question }
                handleClose={ handleEditAnswerModalClose }
                handleDone={ handleEditAnswer } /> }
        </Card>
    );
};

AnswerCard.defaultProps = {
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
        upvoteAnswer: (answerId, answer) => {
            dispatch(addAnswerToCache(answer));
            dispatch(upvoteAnswer(answerId));
        },
        downvoteAnswer: (answerId, answer) => {
            dispatch(addAnswerToCache(answer));
            dispatch(downvoteAnswer(answerId));
        },
        addAnswerToCache: (answer) => {
            dispatch(addAnswerToCache(answer));
        },
        deleteAnswer: (answerId, cb) => {
            dispatch(deleteAnswer(answerId, cb));
        },
        editAnswer: (answerId, body, cb) => {
            dispatch(editAnswer(answerId, body, cb));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerCard));
