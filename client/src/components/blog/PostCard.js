import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import { IconButton,
    Menu,
    MenuItem } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Link, withRouter } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Comments from '../comment/PostComments';
import ReadMore from '../base/ReadMore';
import EditPostModal from './PostModal';
import Avatar from '../base/Avatar';
import { upvotePost, addPostToCache, downvotePost, editPost, deletePost } from '../../store/actions/blog';
import getBadge from '../../utils/badge';
import { isMediaOrCode } from '../../utils/common';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginBottom: 10,
            border: '1px solid #efefef',
        },
        headerRoot: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        disabled: {
            opacity: 0.3,
            pointerEvents: 'none',
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
        },
        menuIcon: {
            paddingRight: 5,
        },
    };
});

const AnswerCard = (props) => {
    const classes = useStyles();

    const {
        post,
        hideHeader,
        history,
        upvotePost,
        downvotePost,
        deletePost,
        editPost,
        modifiedPosts,
        hideHeaderHelperText,
        user,
    } = props;

    const {
        _id: postId,
        title,
        description,
        author,
        downvoters,
        upvoters,
        blogs,
        topics,
        postedDate,
    } = post;

    const {
        _id,
        name,
        jobTitle,
        email,
        reputation,
    } = author;

    const [
        open,
        setOpen,
    ] = React.useState(false);

    const [
        postObj,
        setPostObj,
    ] = React.useState({
        topics,
        description,
        title,
    });

    let currentCommentsCount = post.commentsCount || 0;

    if (modifiedPosts && modifiedPosts[post._id] && modifiedPosts[post._id].newComments){
        currentCommentsCount = modifiedPosts[post._id].newComments.length + currentCommentsCount;
    }

    const renderAnswer = (post) => (
        <ReadMore
            initialHeight={ 300 }
            mediaExists={ isMediaOrCode(post) }
            readMore={ (props) => (
                <Link
                    className={ classes.more }
                    onClick={ props.onClick }>
                    <b>
                        { props.open ? 'Read less' : 'Read more...' }
                    </b>
                </Link>
            ) }>
            <div
                style={ {
                    display: 'flex',
                    flexDirection: 'column',
                } }
                className="editor-read-mode"
                dangerouslySetInnerHTML={ { __html: post } } />
        </ReadMore>
    );

    const onProfileClick = () => {
        history.push(`/profile/${_id}`);
    };

    const renderTopics = (blogs) => blogs.map((blog) => (
        <Link
            key={ blog._id }
            className={ classes.topicLink }
            to={ `/blog/${blog._id}` }>
            { blog.name || blog.topic }
        </Link>
    ));

    const renderHeaderHelperText = (topics) => (
        <Typography
            variant="body2"
            color="textSecondary"
            className={ classes.topics }
            component="p">
            Blog Post -
            { topics && topics.length ? renderTopics(topics) : ' Recommended to you' }
        </Typography>
    );

    const [
        disabled,
        setDisabled,
    ] = React.useState(false);

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
        openEditPostModal,
        setOpenEditPostModal,
    ] = React.useState(false);

    const handleDeletePost = () => {
        setAnchorEl(null);
        deletePost(postId, (res) => {
            if (res) { setDisabled(true); }
        });
    };

    const handleEditPost = (body) => {
        setAnchorEl(null);
        setOpenEditPostModal(false);
        editPost(postId, body, (res) => {
            if (res) {
                setPostObj(res);
            }
        });
    };

    const handleEditPostModalOpen = () => {
        setAnchorEl(null);
        setOpenEditPostModal(true);
    };

    const handleEditPostModalClose = () => {
        setOpenEditPostModal(false);
    };

    const isOwner = user._id === _id;

    const upvoted = upvoters.indexOf(user._id) >= 0;
    const downvoted = downvoters.indexOf(user._id) >= 0;

    return (
        <Card
            className={ `${classes.root}  ${disabled ? classes.disabled : ''}` }
            elevation={ 0 }>
            <CardContent>
                {
                    !hideHeader && <>
                        { !hideHeaderHelperText && renderHeaderHelperText(postObj.topics) }
                        <Typography>
                            <Link
                                to={ `/post/${postId}` }
                                className={ classes.link }>
                                <Box
                                    fontWeight="fontWeightBold"
                                    fontSize={ 20 }>
                                    { postObj.title }
                                </Box>
                            </Link>
                        </Typography>
                                   </>
                }
                <CardHeader
                    className={ classes.headerRoot }
                    avatar={
                        <Avatar
                            aria-label="recipe"
                            alt={ name }
                            user={ email }
                            badge={ getBadge(reputation) }
                            onClick={ onProfileClick }
                            className={ classes.avatar }>
                            { name.match(/\b(\w)/g).join('') }
                        </Avatar>
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
                            <MenuItem onClick={ handleEditPostModalOpen }>
                                <EditIcon className={ classes.menuIcon } />
                                Edit
                            </MenuItem>
                            <MenuItem onClick={ handleDeletePost }>
                                <DeleteIcon className={ classes.menuIcon } />
                                Delete
                            </MenuItem>
                        </Menu>
                                        </> }
                    title={
                        <Link
                            className={ classes.link }
                            onClick={ onProfileClick }>
                            { name }
                            ,
                            { ' ' }
                            { jobTitle }
                        </Link>
                    }
                    subheader={
                        <Link
                            className={ classes.link }
                            to={ `/post/${postId}` }>
                            { `Posted ${formatDistance(new Date(postedDate), new Date(), { addSuffix: true })}` }
                        </Link>
                    } />
                { postObj.description && renderAnswer(postObj.description) }
            </CardContent>
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ () => upvotePost(postId, post) }
                    startIcon={ upvoted ? <ThumbUpAltIcon color="primary" /> : <ThumbUpOutlinedIcon /> }>
                    { upvoters.length }
                </Button>
                <Button
                    size="small"
                    onClick={ () => setOpen(!open) }
                    startIcon={ open ? <ChatBubbleIcon color="primary" /> : <ChatBubbleOutlineRoundedIcon /> }>
                    { currentCommentsCount }
                </Button>
                { /* <Button
                    size="small"
                    style={ { marginLeft: 'auto' } }
                    onClick={ () => downvotePost(postId, post) }
                    startIcon={ downvoted ? <ThumbDownAltIcon color="primary" /> : <ThumbDownOutlinedIcon /> } /> */ }
            </CardActions>
            <Collapse
                in={ open }
                timeout="auto"
                unmountOnExit>
                <CardContent>
                    <Divider />
                    <Comments
                        post={ post } />
                </CardContent>
                <CardActions />
            </Collapse>
            { openEditPostModal && <EditPostModal
                open={ openEditPostModal }
                formName="post"
                descriptionHTML={ postObj.description }
                title={ postObj.title }
                topics={ postObj.topics }
                handleClose={ handleEditPostModalClose }
                handleDone={ handleEditPost } /> }
        </Card>
    );
};

AnswerCard.defaultProps = {
    hideHeader: false,
    hideHeaderHelperText: false,
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        user: state.user.user,
        modifiedPosts: state.blog.modifiedPosts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        upvotePost: (postId, post) => {
            dispatch(addPostToCache(post));
            dispatch(upvotePost(postId));
        },
        downvotePost: (postId, post) => {
            dispatch(addPostToCache(post));
            dispatch(downvotePost(postId));
        },
        addPostToCache: (post) => {
            dispatch(addPostToCache(post));
        },
        deletePost: (postId, cb) => {
            dispatch(deletePost(postId, cb));
        },
        editPost: (postId, body, cb) => {
            dispatch(editPost(postId, body, cb));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerCard));
