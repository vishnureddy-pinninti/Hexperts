import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ProfileHeader from '../components/profile/ProfileHeader';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import ExpertInModal from '../components/topic/ExpertInModal';
import { requestUserById } from '../store/actions/auth';
import ProfileBody from '../components/profile/ProfileBody';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            position: 'fixed',
            width: 100,
        },
        heading: {
            display: 'flex',
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            marginRight: 10,
        },
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        topicLink: {
            textDecoration: 'none',
        },

        chip: {
            marginBottom: 10,
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
        },
    };
});

function Profile(props) {
    const classes = useStyles();
    const {
        match: {
            params: { userId 
},
        },
        requestUser,
        onLogout,
        pending,
        userProfile,
        followedTopics,
        user,
        expertIn,
    } = props;

    useEffect(() => {
        requestUser(userId);
    }, [
        requestUser,
        userId,
    ]);

    const isOwner = user._id === userProfile._id;

    const [
        openFollowTopicsModal,
        setOpenFollowTopicsModal,
    ] = React.useState(user.interests.length === 0);


    const handleFollowTopicsModalOpen = () => {
        setOpenFollowTopicsModal(true);
    };

    const handleFollowTopicsModalClose = () => {
        setOpenFollowTopicsModal(false);
    };

    const [
        openExpertInModal,
        setOpenExpertInModal,
    ] = React.useState(user.interests.length && user.expertIn.length === 0);

    const handleExpertInModalOpen = () => {
        setOpenExpertInModal(true);
    };

    const handleExpertInModalClose = () => {
        setOpenExpertInModal(false);
    };

    useEffect(() => {
        if (!pending) {
            setOpenFollowTopicsModal(pending);
            if (expertIn.length) {
                setOpenExpertInModal(pending);
            }
            else {
                setOpenExpertInModal(true);
            }
        }
    }, [
        pending,
        expertIn,
    ]);

    const { topic, topic: { questions } } = props;

    const renderTopics = (items) => items.map((topic) => (
        <Link
            key={ topic._id }
            className={ classes.topicLink }
            to={ `/topic/${topic._id}` }>
            <Chip
                avatar={ <Avatar
                    className={ classes.avatar }
                    alt={ topic.topic }
                    src={ topic.imageUrl || '/placeholder.png' } /> }
                label={ topic.topic }
                className={ classes.chip }
                clickable />
        </Link>
    ));

    const renderSection = (title, items = [], handleEdit) => (
        <>
            <FormControlLabel
                control={
                    <IconButton
                        aria-label="edit"
                        disabled={ !isOwner }
                        onClick={ handleEdit }
                        className={ classes.margin }>
                        <EditIcon fontSize="small" />
                    </IconButton>
                }
                labelPlacement="start"
                label={ title } />
            <List className={ classes.list }>
                { renderTopics(items) }
            </List>
        </>
    );

    return (
        <div className="App">
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    style={ { marginTop: 70 } }
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 8 }>
                        <ProfileHeader
                            name={ userProfile.name }
                            mail={ userProfile.email }
                            isOwner={ isOwner }
                            jobTitle={ userProfile.jobTitle }
                            followers={ userProfile.followers }
                            id={ userProfile._id } />
                        <ProfileBody />
                    </Grid>
                    <Grid
                        item
                        xs={ 2 }>
                        { renderSection('Following', followedTopics, handleFollowTopicsModalOpen) }
                        <Divider />
                        { renderSection('Knows about', expertIn, handleExpertInModalOpen) }
                    </Grid>
                </Grid>
            </Container>
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                followedTopics={ followedTopics }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
            <ExpertInModal
                open={ openExpertInModal }
                expertIn={ expertIn }
                handleFollowTopicsModalClose={ handleExpertInModalClose } />
        </div>
    );
}

Profile.defaultProps = {
    userProfile: {},
};

const mapStateToProps = (state) => {
    return {
        topic: state.topic.topic,
        pending: state.user.pending,
        followedTopics: state.user.interests,
        userProfile: state.user.userProfile,
        questions: state.questions.questions,
        user: state.user.user,
        expertIn: state.user.expertIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestUser: (topicID) => {
            dispatch(requestUserById(topicID));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
