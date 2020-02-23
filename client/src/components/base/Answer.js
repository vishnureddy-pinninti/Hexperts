import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import Button from '@material-ui/core/Button';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginTop: 10,
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
    };
});

const Answer = (props) => {
    const classes = useStyles();

    const {
        answer: {
            answer, author: { name, jobTitle }, postedDate,
        },
    } = props;

    return (
        <Card
            className={ classes.root }>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label="recipe"
                        className={ classes.avatar }>
                        { name.match(/\b(\w)/g).join('') }
                    </Avatar>
                }
                title={ `${name},${jobTitle}` }
                subheader={ `Answered ${postedDate}` } />
            <CardContent>
                <div
                    style={ {
                        display: 'flex',
                        flexDirection: 'column',
                    } }
                    dangerouslySetInnerHTML={ { __html: answer } } />
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

export default Answer;
