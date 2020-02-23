import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '100%',
        },
        inline: {
            display: 'inline',
        },
    };
});

export default function TopCreators() {
    const classes = useStyles();

    return (
        <>
            <Typography
                component="div"
                className={ classes.heading }>
                <Box
                    fontWeight="fontWeightBold"
                    m={ 1 }>
                    Top Creators
                </Box>
            </Typography>
            <Divider />
            <List className={ classes.root }>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar
                            alt="Remy Sharp"
                            src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Brunch this weekend?"
                        secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={ classes.inline }
                                    color="textPrimary">
                                    Ali Connors
                                </Typography>
                                { ' — I\'ll be in your neighborhood doing errands this…' }
                            </>
                        } />
                </ListItem>
                <Divider
                    variant="inset"
                    component="li" />
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar
                            alt="Travis Howard"
                            src="/static/images/avatar/2.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Summer BBQ"
                        secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={ classes.inline }
                                    color="textPrimary">
                                    to Scott, Alex, Jennifer
                                </Typography>
                                { ' — Wish I could come, but I\'m out of town this…' }
                            </>
                        } />
                </ListItem>
                <Divider
                    variant="inset"
                    component="li" />
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar
                            alt="Cindy Baker"
                            src="/static/images/avatar/3.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Oui Oui"
                        secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={ classes.inline }
                                    color="textPrimary">
                                    Sandra Adams
                                </Typography>
                                { ' — Do you have Paris recommendations? Have you ever…' }
                            </>
                        } />
                </ListItem>
            </List>
        </>
    );
}
