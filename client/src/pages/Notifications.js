import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';

import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider, Typography, Box, Switch } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import EmptyResults from '../components/base/EmptyResults';
import CardLoader from '../components/base/CardLoader';
import { requestNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    requestEmailPreferences,
    editEmailPreferences,
    requestEmailSubscription,
    setPageLoader } from '../store/actions/auth';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            padding: 0,
            textAlign: 'center',
        },
        email: {
            marginTop: 30,
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
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'block',
            },
        },
    };
});


function Notifications(props) {
    const {
        requestNotifications,
        editEmailPreferences,
        requestEmailSubscription,
        requestEmailPreferences,
        markNotificationRead,
        notifications,
        markAllRead,
        notificationCount,
        emailPreferences,
        emailSubscription,
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
        requestEmailPreferences();
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

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    useEffect(() => {
        setChecked(emailPreferences);
    }, [ emailPreferences ]);

    const handleToggle = (value) => () => {
        editEmailPreferences({ category: value });
    };

    const enableEmailSubscription = () => {
        requestEmailSubscription();
    };

    const emailOptions = [
        {
            id: 'suggestedExpert',
            name: 'Request Answer',
            description: 'Email me when someone requests me to answer a question.',
        },
        {
            id: 'newQuestion',
            name: 'New Question',
            description: 'Email me when someone adds a new question.',
        },
        {
            id: 'editQuestion',
            name: 'Question Edits/Updates',
            description: 'Email me when someone updates/edits a question that I am following.',
        },
        {
            id: 'followQuestion',
            name: 'Follow Question',
            description: 'Email me when someone follows my question.',
        },
        {
            id: 'newAnswer',
            name: 'New Answer',
            description: 'Email me when there are new answers to questions I asked or follow.',
        },
        {
            id: 'editAnswer',
            name: 'Answer Edits/Updates',
            description: 'Email me when someone updates/edits answer that I am following.',
        },
        {
            id: 'upvoteAnswer',
            name: 'Answer Upvotes',
            description: 'Email me when someone upvotes my answer.',
        },
        {
            id: 'newPost',
            name: 'New Blog Post',
            description: 'Email me when user whom I am following adds a new blogpost or if it is created in my area of interest.',
        },
        {
            id: 'editPost',
            name: 'Blog Post Edits/Updates',
            description: 'Email me when someone updates/edits blog posts that I am following.',
        },
        {
            id: 'upvotePost',
            name: 'Blog Post Upvotes',
            description: 'Email me when someone upvotes my blog post.',
        },
        {
            id: 'followUser',
            name: 'New Followers',
            description: 'Email me when someone follows me.',
        },
        {
            id: 'newComment',
            name: 'Comments and Replies',
            description: 'Email me of comments on my blog posts or answers.',
        },
    ];

    const renderEmailPreferences = () => (
        <List>
            { emailOptions.map((item) => {
                const labelId = `checkbox-list-label-${item.id}`;

                return (
                    <ListItem
                        key={ item.display }
                        role={ undefined }
                        disabled={ !emailSubscription }
                        dense
                        button
                        onClick={ handleToggle(item.id) }>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={ checked.indexOf(item.id) !== -1 }
                                tabIndex={ -1 }
                                disableRipple
                                inputProps={ { 'aria-labelledby': labelId } } />
                        </ListItemIcon>
                        <ListItemText
                            id={ labelId }
                            primary={ item.name }
                            secondary={ item.description } />
                    </ListItem>
                );
            }) }
        </List>
    );

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
                    primary={ <span dangerouslySetInnerHTML={ { __html: notification.message } } /> }
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
                    <Grid
                        item
                        className={ classes.sectionDesktop }
                        xs={ 3 }>
                        <div className={ classes.email }>
                            <Typography
                                component="div">
                                <Box
                                    fontWeight="fontWeightBold"
                                    m={ 1 }>
                                    Email Notifications
                                    { ' ' }
                                    <Switch
                                        checked={ emailSubscription }
                                        onChange={ enableEmailSubscription }
                                        name="checkedB" />
                                </Box>
                                <Box
                                    fontWeight="fontWeightBold"
                                    m={ 1 }>
                                    Preferences
                                </Box>
                            </Typography>
                            <Divider />
                            { renderEmailPreferences() }
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

Notifications.defaultProps = {
    notifications: [],
    emailPreferences: [],
    emailSubscription: false,
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        notifications: state.user.notifications,
        notificationCount: state.user.notificationCount,
        emailPreferences: state.user.emailPreferences,
        emailSubscription: state.user.emailSubscription,
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
        requestEmailPreferences: () => {
            dispatch(requestEmailPreferences());
        },
        editEmailPreferences: (body, cb) => {
            dispatch(editEmailPreferences(body, cb));
        },
        requestEmailSubscription: () => {
            dispatch(requestEmailSubscription());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Notifications));
