import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
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
import Avatar from '../base/Avatar';
import { upvotePost, addPostToCache, downvotePost } from '../../store/actions/blog';
import getBadge from '../../utils/badge';

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
            backgroundColor: red[500],
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

    let currentCommentsCount = post.commentsCount || 0;

    if (modifiedPosts && modifiedPosts[post._id] && modifiedPosts[post._id].newComments){
        currentCommentsCount = modifiedPosts[post._id].newComments.length + currentCommentsCount;
    }

    const renderAnswer = (post) => (
        <ReadMore
            initialHeight={ 300 }
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

    const renderHeaderHelperText = () => (
        <Typography
            variant="body2"
            color="textSecondary"
            className={ classes.topics }
            component="p">
            Blog Post -
            { topics && topics.length ? renderTopics(topics) : ' Recommended to you' }
        </Typography>
    );

    const upvoted = upvoters.indexOf(user._id) >= 0;
    const downvoted = downvoters.indexOf(user._id) >= 0;

    return (
        <Card
            className={ classes.root }
            elevation={ 0 }>
            <CardContent>
                {
                    !hideHeader && <>
                        { !hideHeaderHelperText && renderHeaderHelperText() }
                        <Typography>
                            <Link
                                to={ `/post/${postId}` }
                                className={ classes.link }>
                                <Box
                                    fontWeight="fontWeightBold"
                                    fontSize={ 20 }>
                                    { title }
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
                { description && renderAnswer(description) }
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerCard));
