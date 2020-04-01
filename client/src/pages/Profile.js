import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid,
    Container,
    Chip,
    Avatar,
    Divider,
    List,
    IconButton,
    FormControlLabel } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProfileHeader from '../components/profile/ProfileHeader';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import ExpertInModal from '../components/topic/ExpertInModal';
import ProfileBody from '../components/profile/ProfileBody';
import { requestUserById } from '../store/actions/auth';
import getBadge from '../utils/badge';

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
        pending,
        userProfile,
        user,
    } = props;

    const [
        loading,
        setLoading,
    ] = React.useState(false);

    const { expertIn, interests: followedTopics } = userProfile;

    useEffect(() => {
        setLoading(true);
        requestUser(userId);
    }, [
        requestUser,
        userId,
    ]);

    useEffect(() => {
        if (userProfile._id) { setLoading(false); }
    }, [ userProfile ]);


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
            if (expertIn && expertIn.length) {
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
            { loading ? <Skeleton
                variant="rect"
                style={ { marginBottom: 10 } }
                height={ 300 } />
                : <List className={ classes.list }>
                    { renderTopics(items) }
                </List> }
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
                        { loading ? <Skeleton
                            variant="rect"
                            height={ 200 } />
                            : <ProfileHeader
                                name={ userProfile.name }
                                mail={ userProfile.email }
                                isOwner={ isOwner }
                                jobTitle={ userProfile.jobTitle }
                                followers={ userProfile.followers }
                                id={ userProfile._id }
                                badge={ getBadge(userProfile.reputation) }
                                onLogout={ props.onLogout } /> }
                        { loading ? <Skeleton
                            variant="rect"
                            style={ { marginTop: 20 } }
                            height={ 500 } />
                            : <ProfileBody /> }
                    </Grid>
                    <Grid
                        item
                        xs={ 2 }>
                        { renderSection('Following', followedTopics, handleFollowTopicsModalOpen) }
                        <Divider />
                        { renderSection((isOwner ? 'My Expertise' : 'Expertise'), expertIn, handleExpertInModalOpen) }
                    </Grid>
                </Grid>
            </Container>
            <FollowTopicsModal
                open={ openFollowTopicsModal }
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
        userProfile: state.user.userProfile,
        questions: state.questions.questions,
        user: state.user.user,
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
