import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import RssFeedSharpIcon from '@material-ui/icons/RssFeedSharp';
import CardHeader from '@material-ui/core/CardHeader';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';

import Avatar from '../base/Avatar';
import { addAnswerToQuestion, addAnswerPending } from '../../store/actions/answer';
import { followUser } from '../../store/actions/auth';


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

        },
        editorWrapper: {
            border: '1px solid #F1F1F1',
            minHeight: 300,
            padding: 10,
        },
        badge: {
            textTransform: 'capitalize',
            fontWeight: 'bold',
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
        followers,
        user,
        isOwner,
        badge,
        followUser,
    } = props;

    const handleFollowClick = () => {
        followUser({ _id: id });
    };

    const following = followers.indexOf(user._id) >= 0;

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
            <Typography
                variant="subtitle1"
                className={ classes.badge }
                color="textSecondary">
                { badge }
                { ' ' }
                Member
            </Typography>
            { !isOwner && <Button
                size="small"
                onClick={ handleFollowClick }
                startIcon={ <RssFeedSharpIcon /> }
                color={ following ? 'primary' : 'default' }>
                Follow
                { ' ' }
                { followers.length }
            </Button> }
        </>
    );

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label={ name }
                        alt={ name }
                        badge={ badge }
                        variant="rounded"
                        user={ mail }
                        className={ classes.large } />
                }
                action={ <>
                    { isOwner
                    && <IconButton
                        aria-label="logout"
                        title="Logout"
                        color="secondary"
                        onClick={ props.onLogout }>
                        <ExitToAppIcon />
                    </IconButton> }
                </> }
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
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAnswerToQuestion: (body) => {
            dispatch(addAnswerPending());
            dispatch(addAnswerToQuestion(body));
        },
        followUser: (body) => {
            dispatch(followUser(body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicSection);
