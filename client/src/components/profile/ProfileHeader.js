import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { connect } from 'react-redux';
import RssFeedSharpIcon from '@material-ui/icons/RssFeedSharp';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '../base/Avatar';
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
            width: theme.spacing(15),
            height: theme.spacing(15),
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
        name,
        mail,
        jobTitle,
        id,
        description,
        pending,
        followTopic,
        topic,
        followers,
        user,
        isOwner,
    } = props;

    const handleFollowClick = () => {
        followTopic({ interestId: id });
    };

    const renderTitle = () => (
        <>
            <Typography
                component="h5"
                variant="h5">
                { name }
            </Typography>
            <Typography
                variant="subtitle1"
                color="textSecondary">
                { jobTitle }
            </Typography>
            { !isOwner && <Button
                size="small"
                onClick={ handleFollowClick }
                startIcon={ <RssFeedSharpIcon /> }
                color={ following ? 'primary' : 'default' }>
                Follow
            </Button> }
        </>
    );

    const following = followers.indexOf(user._id) >= 0;

    return (
        <Card className={ classes.root }>
            <CardHeader
                className={ classes.headerRoot }
                avatar={
                    <Avatar
                        aria-label="recipe"
                        alt={ name }
                        user={ mail }
                        className={ classes.large } />
                }
                title={ renderTitle() } />
        </Card>
    );
};

TopicSection.defaultProps = {
    followers: [],
    name: '',
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
