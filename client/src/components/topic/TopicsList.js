import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import FollowTopicsModal from './FollowTopicsModal';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '100%',
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            backgroundColor: green[500],
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
    };
});


function TopicList(props) {
    const classes = useStyles();
    const { topics } = props;

    const [
        openFollowTopicsModal,
        setFollowTopicsModal,
    ] = React.useState(false);


    const handleEditTopicsModalOpen = () => {
        setFollowTopicsModal(true);
    };

    const handleEditTopicsModalClose = () => {
        setFollowTopicsModal(false);
    };


    const renderTopics = () => topics.map((topic) => (
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

    return (
        <div
            className={ classes.root }>
            { renderTopics() }
            <Chip
                variant="contained"
                avatar={
                    <Avatar>
                        <AddIcon />
                    </Avatar>
                }
                label="Add More Topics"
                onClick={ handleEditTopicsModalOpen }
                clickable
                color="primary" />
            <FollowTopicsModal
                open={ openFollowTopicsModal }
                followedTopics={ topics }
                handleClose={ handleEditTopicsModalClose } />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        topics: state.user.user.interests,
    };
};

export default connect(mapStateToProps)(TopicList);
