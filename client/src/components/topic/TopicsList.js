import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import StarIcon from '@material-ui/icons/Star';
import Avatar from '@material-ui/core/Avatar';
import { green, pink } from '@material-ui/core/colors';

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

        },
    };
});

export default function TopicList() {
    const classes = useStyles();

    return (
        <List
            component="nav"
            className={ classes.root }
            aria-label="contacts">
            <ListItem
                button>
                <Avatar
                    alt="Feed"
                    variant="rounded"
                    src="/static/images/avatar/1.jpg"
                    className={ classes.small } />
                <ListItemText primary="Feed" />
            </ListItem>
            <ListItem
                button>
                <Avatar
                    alt="Xalt Edge"
                    variant="rounded"
                    src="/static/images/avatar/1.jpg"
                    className={ classes.small } />
                <ListItemText primary="Xalt Edge" />
            </ListItem>
            <ListItem
                button>
                <Avatar
                    alt="Mobility"
                    variant="rounded"
                    src="/static/images/avatar/1.jpg"
                    className={ classes.small } />
                <ListItemText primary="Mobility" />
            </ListItem>
            <ListItem
                button>
                <Avatar
                    alt="Climate"
                    variant="rounded"
                    src="/static/images/avatar/1.jpg"
                    className={ classes.small } />
                <ListItemText primary="Climate" />
            </ListItem>
        </List>
    );
}
