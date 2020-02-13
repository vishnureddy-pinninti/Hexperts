import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer as NativeDrawer } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create([
                'margin',
                'width',
            ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create([
                'margin',
                'width',
            ], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    };
});

const Drawer = (props) => {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={ classes.root }>
            <CssBaseline />
            <NativeDrawer
                className={ classes.drawer }
                variant="persistent"
                anchor="left"
                open={ props.open }
                classes={ {
                    paper: classes.drawerPaper,
                } }>
                <div className={ classes.drawerHeader }>
                    <IconButton onClick={ props.handleDrawerClose }>
                        { theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                    </IconButton>
                </div>
                <Divider />
                <List>
                    { [
                        'Inbox',
                        'Starred',
                        'Send email',
                        'Drafts',
                    ].map((text, index) => (
                        <ListItem
                            button
                            key={ text }>
                            <ListItemIcon>
                                { index % 2 === 0 ? <InboxIcon /> : <MailIcon /> }
                            </ListItemIcon>
                            <ListItemText primary={ text } />
                        </ListItem>
                    )) }
                </List>
                <Divider />
                <List>
                    { [
                        'All mail',
                        'Trash',
                        'Spam',
                    ].map((text, index) => (
                        <ListItem
                            button
                            key={ text }>
                            <ListItemIcon>
                                { index % 2 === 0 ? <InboxIcon /> : <MailIcon /> }
                            </ListItemIcon>
                            <ListItemText primary={ text } />
                        </ListItem>
                    )) }
                </List>
            </NativeDrawer>
        </div>
    );
};

export default Drawer;
