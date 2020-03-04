import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { connect } from 'react-redux';
import RssFeedSharpIcon from '@material-ui/icons/RssFeedSharp';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';


import { addAnswerToQuestion, addAnswerPending } from '../../store/actions/answer';
import { followTopic } from '../../store/actions/topic';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            overflow: 'visible',
        },
        media: {

        },
        large: {
            width: theme.spacing(10),
            height: theme.spacing(10),
            borderRadius: 0,
        },
        editorWrapper: {
            border: '1px solid #F1F1F1',
            minHeight: 300,
            padding: 10,
        },
    };
});

const TopicSection = (props) => {
    const classes = useStyles();
    const {
        question,
        addAnswerToQuestion,
        id,
        description,
        pending,
        followTopic,
        topic,
        followers,
        user,
    } = props;

    const handleFollowClick = () => {
        followTopic({ interestId: id });
    };

    const following = followers.indexOf(user._id) >= 0;

    return (
        <Card className={ classes.root }>
            <CardHeader
                avatar={
                    <Avatar
                        alt="Remy Sharp"
                        src={ topic.imageUrl }
                        className={ classes.large } />
                }
                title={
                    <Box
                        fontWeight="fontWeightBold"
                        fontSize={ 20 }>
                        { topic.topic }
                    </Box>
                }
                subheader={ `${followers.length} followers` } />
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ handleFollowClick }
                    startIcon={ <RssFeedSharpIcon /> }
                    color={ following ? 'primary' : 'default' }>
                    Follow
                </Button>
            </CardActions>
        </Card>
    );
};

TopicSection.defaultProps = {
    followers: [],
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        followers: state.topic.topic.followers || [],
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAnswerToQuestion: (body) => {
            dispatch(addAnswerPending());
            dispatch(addAnswerToQuestion(body));
        },
        followTopic: (body) => {
            dispatch(followTopic(body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicSection);
