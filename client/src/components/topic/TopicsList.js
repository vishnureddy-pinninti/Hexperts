import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExploreIcon from '@material-ui/icons/Explore';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
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
            maxWidth: 150,
        },
    };
});


function TopicList(props) {
    const classes = useStyles();
    const {
        topics,
        handleFollowTopicsModalOpen,
        activeTopicId,
    } = props;

    const renderTopics = () => topics.map((topic) => (
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
                variant={ activeTopicId === topic._id ? 'default' : 'outlined' }
                className={ classes.chip }
                clickable />
        </Link>
    ));

    return (
        <div
            id="Discover-Topics"
            className={ classes.root }>
            <Chip
                avatar={
                    <Avatar>
                        <ExploreIcon />
                    </Avatar>
                }
                label="Discover Topics"
                onClick={ handleFollowTopicsModalOpen }
                className={ classes.chip }
                clickable
                color="primary" />
            { renderTopics() }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        topics: state.user.interests,
    };
};

export default connect(mapStateToProps)(TopicList);
