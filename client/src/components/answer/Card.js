import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import ReadMore from '../base/ReadMore';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginTop: 10,
        },
        headerRoot: {
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
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
        },
    };
});

const AnswerCard = (props) => {
    const classes = useStyles();

    const {
        question,
        questionId,
        answer,
        hideHeader,
        author: { name, jobTitle },
    } = props;

    const renderAnswer = (answer) => (
        <ReadMore
            initialHeight={ 600 }
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

    return (
        <Card
            className={ classes.root }
            elevation={ 3 }>
            { !hideHeader
            && <CardContent>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    Answer - Recommended for you
                </Typography>
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
            </CardContent> }
            <CardHeader
                className={ classes.headerRoot }
                avatar={
                    <Avatar
                        aria-label="recipe"
                        alt={ name }
                        className={ classes.avatar }>
                        { name.match(/\b(\w)/g).join('') }
                    </Avatar>
                }
                title={ `${name},${jobTitle}` }
                subheader={ `Answered ${formatDistance(new Date(props.date), new Date(), { addSuffix: true })}` } />
            <CardContent>
                { answer && answer.answer && renderAnswer(answer.answer) }
            </CardContent>
            <CardActions disableSpacing>
                <Button
                    size="small"
                    startIcon={ <ThumbUpOutlinedIcon /> }>
                    Upvote
                </Button>
                <Button
                    size="small"
                    startIcon={ <ChatBubbleOutlineRoundedIcon /> }>
                    Comment
                </Button>
                <Button
                    size="small"
                    style={ { marginLeft: 'auto' } }
                    endIcon={ <ThumbDownOutlinedIcon /> } />
            </CardActions>
        </Card>
    );
};

AnswerCard.defaultProps = {
    hideHeader: false,
};

export default AnswerCard;
