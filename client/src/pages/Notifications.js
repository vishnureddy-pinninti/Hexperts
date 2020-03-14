import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import { formatDistanceToNow } from 'date-fns';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

import { Divider } from '@material-ui/core';
import { requestNotifications, markNotificationRead } from '../store/actions/auth';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            backgroundColor: theme.palette.background.paper,
            padding: 0,
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
    };
});


function Notifications(props) {
    const {
        requestNotifications,
        markNotificationRead,
        notifications,
        user,
    } = props;

    const classes = useStyles();

    useEffect(() => {
        requestNotifications();
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.recipient.read) {
            markNotificationRead(notification._id);
        }
    };

    const renderNotifications = () => (
        <List className={ classes.root }>
            { notifications.map((notification) => (
                <Link
                    key={ notification._id }
                    className={ classes.link }
                    to={ notification.link }>
                    <ListItem
                        onClick={ () => { handleNotificationClick(notification); } }
                        key={ notification._id }
                        selected={ !notification.recipient.read }
                        button>
                        <ListItemAvatar>
                            <Avatar>
                                <NotificationsNoneIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={ <div dangerouslySetInnerHTML={ { __html: notification.message } } /> }
                            secondary={ formatDistanceToNow(new Date(notification.postedDate), { addSuffix: true }) } />
                    </ListItem>
                    <Divider />
                </Link>
            )) }
        </List>
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
                        xs={ 7 }>
                        { notifications && renderNotifications() }
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        notifications: state.user.notifications,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestNotifications: () => {
            dispatch(requestNotifications());
        },
        markNotificationRead: (id) => {
            dispatch(markNotificationRead(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
