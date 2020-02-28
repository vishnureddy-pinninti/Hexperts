import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import { requestTopCreators } from '../../store/actions/auth';

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

function TopCreators(props) {
    const classes = useStyles();
    const { topUsers, requestTopCreators } = props;

    useEffect(() => {
        requestTopCreators();
    }, [ requestTopCreators ]);

    const renderUsers = () => topUsers.map((user) => (
        <ListItem
            alignItems="flex-start"
            key={ user._id }>
            <ListItemAvatar>
                <Avatar
                    alt={ user.name }
                    src="/static/images/avatar/1.jpg" />
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
    ));

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
                { renderUsers() }
            </List>
        </>
    );
}

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
