import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { requestTopCreators } from '../../store/actions/auth';
import Avatar from '../base/Avatar';

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
    };
});

function TopCreators(props) {
    const classes = useStyles();
    const { topUsers, requestTopCreators } = props;

    useEffect(() => {
        requestTopCreators();
    }, [ requestTopCreators ]);

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
                        user={ user.email } />
                </ListItemAvatar>
                <ListItemText
                    primary={ user.name }
                    secondary={
                        <>
                            <Typography
                                component="div"
                                variant="body2"
                                color="textPrimary">
                                { user.jobTitle }
                            </Typography>
                            { `${user.answers} answers` }
                        </>
                    } />
            </ListItem>
        </Link>
    ));

    return (
        <>
            <Typography
                component="div"
                className={ classes.heading }>
                <Box
                    fontWeight="fontWeightBold"
                    m={ 1 }>
                    Top Contributors
                </Box>
            </Typography>
            <Divider />
            <List className={ classes.root }>
                { topUsers && renderUsers() }
            </List>
        </>
    );
}

TopCreators.defaultProps = {
    topUsers: [],
};

const mapStateToProps = (state) => {
    return {
        topUsers: state.user.topUsers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestTopCreators: () => {
            dispatch(requestTopCreators());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopCreators);
