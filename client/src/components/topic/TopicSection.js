import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardActions,
    Button,
    Box,
    Avatar,
    CardHeader } from '@material-ui/core';
import { RssFeedSharp as RssFeedSharpIcon } from '@material-ui/icons';
import ExplicitIcon from '@material-ui/icons/Explicit';
import { connect } from 'react-redux';

import { addAnswerToQuestion,
    addAnswerPending } from '../../store/actions/answer';
import { followTopic } from '../../store/actions/topic';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            overflow: 'visible',
            marginBottom: 10,
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
        id,
        followTopic,
        topic,
        followers,
        interests,
        expertTopics,
    } = props;

    const handleFollowClick = () => {
        followTopic({ interestId: id });
    };

    const handleExpertClick = () => {
        followTopic({ expertId: id });
    };

    const following = interests.map((t) => t._id).indexOf(id) >= 0;
    const expertIn = expertTopics.map((t) => t._id).indexOf(id) >= 0;

    return (
        <Card className={ classes.root }>
            <CardHeader
                avatar={
                    <Avatar
                        alt="Remy Sharp"
                        src={ topic.imageUrl || '/placeholder.png' }
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
                <Button
                    size="small"
                    onClick={ handleExpertClick }
                    startIcon={ <ExplicitIcon /> }
                    color={ expertIn ? 'primary' : 'default' }>
                    Expert
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
        followers: state.topic.topic.followers,
        interests: state.user.interests,
        expertTopics: state.user.expertIn,
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
