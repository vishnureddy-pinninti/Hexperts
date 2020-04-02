import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';

import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { Link, withRouter } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider } from '@material-ui/core';
import CardLoader from '../components/base/CardLoader';
import EmptyResults from '../components/base/EmptyResults';
import { requestNotifications, markNotificationRead, markAllNotificationsRead, setPageLoader } from '../store/actions/auth';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            padding: 0,
            textAlign: 'center',
        },
        listItem: {
            backgroundColor: theme.palette.background.paper,
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        heading: {
            marginBottom: 10,
            position: 'sticky',
            top: 60,
            paddingTop: 10,
            paddingBottom: 10,
            zIndex: 1,
            backgroundColor: '#f0f2f2',
        },
    };
});


function Notifications(props) {
    const {
        requestNotifications,
        markNotificationRead,
        notifications,
        markAllRead,
        notificationCount,
    } = props;

    const classes = useStyles();

    const [
        items,
        setItems,
    ] = React.useState([]);

    const [
        pagination,
        setPagination,
    ] = React.useState({
        index: 1,
        hasMore: true,
    });

    useEffect(() => {
        if (notifications.length) {
            if (pagination.index === 1){
                setItems([ ...notifications ]);
            }
            else {
                setItems([
                    ...items,
                    ...notifications,
                ]);
            }
            setPagination({
                index: pagination.index + 1,
                hasMore: true,
            });
        }
        else {
            setPagination({
                ...pagination,
                hasMore: false,
            });
        }
    }, [ notifications ]);

    useEffect(() => {
        setItems([]);
        setPagination({
            index: 1,
            hasMore: true,
        });
        requestNotifications({
            skip: 0,
            limit: 20,
        });
    }, [ 1 ]);

    const loadMore = () => {
        if (pagination.index > 1){
            requestNotifications({
                skip: pagination.index * 10,
                limit: 10,
            });
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.recipient.read) {
            markNotificationRead(notification._id);
        }
    };

    const renderNotifications = (notifications) => notifications.map((notification) => (
        <Link
            key={ notification._id }
            className={ classes.link }
            to={ notification.link }>
            <ListItem
                onClick={ () => { handleNotificationClick(notification); } }
                key={ notification._id }
                selected={ (!notification.recipient.read && notificationCount !== 0) }
                className={ classes.listItem }
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
    ));

    return (
        <div className="App">
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    style={ { marginTop: 60 } }
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 7 }>
                        <CardHeader
                            className={ classes.heading }
                            action={ <Button
                                variant="contained"
                                size="small"
                                style={ {
                                    marginTop: 10,
                                    marginLeft: 20,
                                } }
                                onClick={ markAllRead }
                                color="primary">
                                Mark All Read
                            </Button> } />
                        <List
                            className={ classes.root }
                            id="list">
                            <InfiniteScroll
                                dataLength={ items.length }
                                next={ loadMore }
                                hasMore={ pagination.hasMore }
                                loader={ <CardLoader height={ 100 } /> }
                                endMessage={ items.length !== 0
                                    && <p style={ { textAlign: 'center' } }>
                                        <b>Yay! You have seen it all</b>
                                       </p> }>
                                { renderNotifications(items) }
                            </InfiniteScroll>
                            { /* { notifications && renderNotifications(notifications) } */ }
                            { items.length === 0 && !pagination.hasMore
            && <EmptyResults
                title="You don't have any notifications right now."
                description="When someone follows you, upvotes, comments, you will see it here." /> }
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

Notifications.defaultProps = {
    notifications: [],
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        notifications: state.user.notifications,
        notificationCount: state.user.notificationCount,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestNotifications: (params) => {
            dispatch(requestNotifications(params));
        },
        markNotificationRead: (id) => {
            dispatch(markNotificationRead(id));
        },
        markAllRead: () => {
            dispatch(setPageLoader(true));
            dispatch(markAllNotificationsRead());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Notifications));
