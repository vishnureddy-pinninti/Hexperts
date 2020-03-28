import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ExploreIcon from '@material-ui/icons/Explore';
import {
    Avatar,
    Chip,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';

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


function BlogsList(props) {
    const classes = useStyles();
    const {
        blogs,
        handleFollowTopicsModalOpen,
        activeBlogId,
    } = props;

    const renderTopics = () => blogs.map((blog) => (
        <Link
            key={ blog._id }
            className={ classes.topicLink }
            to={ `/blog/${blog._id}` }>
            <Chip
                avatar={ <Avatar
                    className={ classes.avatar }
                    alt={ blog.name }
                    src={ blog.imageUrl || '/blog-placeholder.png' } /> }
                label={ blog.name }
                variant={ activeBlogId === blog._id ? 'default' : 'outlined' }
                className={ classes.chip }
                clickable />
        </Link>
    ));

    return (
        <div
            className={ classes.root }>
            <Chip
                avatar={
                    <Avatar>
                        <ExploreIcon />
                    </Avatar>
                }
                label="Discover Blogs"
                onClick={ handleFollowTopicsModalOpen }
                style={{ marginBottom: 10 }}
                clickable
                color="primary" />
            { renderTopics() }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        blogs: state.user.blogs,
    };
};

export default connect(mapStateToProps)(BlogsList);
