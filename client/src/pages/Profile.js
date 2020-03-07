import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ProfileHeader from '../components/profile/ProfileHeader';
import FollowTopicsModal from '../components/topic/FollowTopicsModal';
import ExpertInModal from '../components/topic/ExpertInModal';

import AnswerCard from '../components/answer/Card';
import QuestionCard from '../components/question/Card';
import { requestUserById } from '../store/actions/auth';
import ProfileBody from '../components/profile/ProfileBody';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            position: 'fixed',
            width: 100,
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
            width: 200,
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
                    src={ topic.imageUrl } /> }
                label={ topic.topic }
                className={ classes.chip }
                clickable />
        </Link>
    ));

    const renderSection = (title, items = [], handleEdit) => (
        <>
            <Typography
                component="div"
                className={ classes.heading }>
                <Box
                    fontWeight="fontWeightBold"
                    m={ 1 }>
                    { title }
                    <IconButton
                        aria-label="edit"
                        onClick={ handleEdit }
                        className={ classes.margin }>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>

            </Typography>
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
                            jobTitle={ userProfile.jobTitle }
                            id={ userId } />
                        <ProfileBody />
                    </Grid>
                    <Grid
                        item
                        xs={ 2 }>
                        { renderSection('Following', userProfile.interests, handleFollowTopicsModalOpen) }
                        <Divider />
                        { renderSection('Knows about', userProfile.expertIn, handleExpertInModalOpen) }
                    </Grid>
                </Grid>
            </Container>
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                followedTopics={ followedTopics }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
            <ExpertInModal
                open={ openExpertInModal }
                followedTopics={ followedTopics }
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
        followedTopics: state.user.user.interests,
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
