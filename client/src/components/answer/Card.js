import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
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
import ReadMore from '../base/ReadMore';
import Avatar from '../base/Avatar';
import { upvoteAnswer, addAnswerToCache, downvoteAnswer } from '../../store/actions/answer';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginTop: 10,
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
 email 
},
        topics,
        downvoters,
        upvoters,
        upvoteAnswer,
        downvoteAnswer,
        modifiedAnswers,
        addAnswerToCache,
        hideHeaderHelperText,
        user,
    } = props;

    const renderAnswer = (answer) => (
        <ReadMore
            initialHeight={ 300 }
            readMore={ (props) => (
                <Link
                    className={ classes.more }
                    onClick={ props.onClick }>
                    { props.open ? 'Read less' : '(more)' }
                </Link>
            ) }>
            <div
                style={ {
                    display: 'flex',
                    flexDirection: 'column',
                } }
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
                                to={ `/question/${questionId}` }
                                className={ classes.link }>
                                <Box
                                    fontWeight="fontWeightBold"
                                    fontSize={ 20 }>
                                    { question }
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
                            { jobTitle }
                        </Link>
                    }
                    subheader={
                        <Link
                            className={ classes.link }
                            to={ `/answer/${answerId}` }>
                            { `Answered ${formatDistance(new Date(props.date), new Date(), { addSuffix: true })}` }
                        </Link>
                    } />
                { answer && answer.answer && renderAnswer(answer.answer) }
            </CardContent>
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ () => upvoteAnswer(answerId, answer) }
                    startIcon={ upvoted ? <ThumbUpAltIcon color="primary" /> : <ThumbUpOutlinedIcon /> }>
                    { upvoters.length }
                </Button>
                <Button
                    size="small"
                    startIcon={ <ChatBubbleOutlineRoundedIcon /> }>
                    Comment
                </Button>
                <Button
                    size="small"
                    style={ { marginLeft: 'auto' } }
                    onClick={ () => downvoteAnswer(answerId, answer) }
                    startIcon={ downvoted ? <ThumbDownAltIcon color="primary" /> : <ThumbDownOutlinedIcon /> } />
            </CardActions>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerCard));
