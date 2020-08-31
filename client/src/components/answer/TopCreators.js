import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import Avatar from '../base/Avatar';
import getBadge from '../../utils/badge';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '100%',
        },
        inline: {
            display: 'inline',
        },
        userLink: {
            textDecoration: 'none',
            color: 'inherit',
        },
        large: {
            width: theme.spacing(6),
            height: theme.spacing(6),
        },
        small: {
            width: theme.spacing(2),
            height: theme.spacing(2),
        },
    };
});

function TopCreators(props) {
    const classes = useStyles();
    const { topUsers } = props;


    const renderUsers = () => topUsers.map((user) => (
        <Link
            key={ user._id }
            className={ classes.userLink }
            to={ `/profile/${user._id}` }>
            <ListItem
                alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar
                        alt={ user.name }
                        user={ user.email }
                        badge={ getBadge(user.reputation) } />
                </ListItemAvatar>
                <ListItemText
                    primary={ user.name }
                    secondary={
                        <>
                            <Typography
                                component="span"
                                style={{ display: 'block' }}
                                variant="body2"
                                color="textPrimary">
                                { user.jobTitle }
                            </Typography>
                            { `${user.answers} answers` }
                            { ' ' }
                            |
                            { ' ' }
                            { `${user.posts} blog posts` }
                            <br />
                            { `${user.upvotes || 0} upvotes` }
                        </>
                    } />
            </ListItem>
        </Link>
    ));

    return (
        <>
            <List className={ classes.root }>
                { topUsers && renderUsers() }
            </List>
        </>
    );
}



export default TopCreators;
