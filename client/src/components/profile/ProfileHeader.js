import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import RssFeedSharpIcon from '@material-ui/icons/RssFeedSharp';
import CardHeader from '@material-ui/core/CardHeader';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ConfluenceLogin from '../base/ConfluenceLogin';

import Avatar from '../base/Avatar';
import { addAnswerToQuestion, addAnswerPending } from '../../store/actions/answer';
import { requestConfluenceLogout } from '../../store/actions/auth';
import { followUser } from '../../store/actions/auth';
import { CardContent } from '@material-ui/core';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            overflow: 'visible',
        },
        media: {

        },
        large: {
            width: theme.spacing(15),
            height: theme.spacing(15),

        },
        editorWrapper: {
            border: '1px solid #F1F1F1',
            minHeight: 300,
            padding: 10,
        },
        badge: {
            textTransform: 'capitalize',
            fontWeight: 'bold',
        },
    };
});

const TopicSection = (props) => {
    const classes = useStyles();
    const {
        name,
        mail,
        jobTitle,
        id,
        followers,
        user,
        isOwner,
        badge,
        followUser,
        department,
        city,
        isConfluenceAuthorised,
        UnsubscribeConfluenceSearch,
    } = props;

    const handleFollowClick = () => {
        followUser({ _id: id });
    };

    const following = followers.indexOf(user._id) >= 0;
    
    const [
        openConfluenceModal,
        setConfluenceModal,
    ] = React.useState(false);

    const handleConfluenceModalClose = () => {
        setConfluenceModal(false);
    };

    const handleConfluenceModalOpen = () => {
        setConfluenceModal(true);
    }

    const renderTitle = () => (
        <>
            <Typography
                component="h5"
                variant="h5">
                { name }
            </Typography>
            <Typography
                variant="subtitle1"
                color="textSecondary">
                { jobTitle }
            </Typography>
            <Typography
                variant="body2"
                color="textSecondary">
                { department }
                { city && `, ${city}` }
            </Typography>
            <Typography
                variant="subtitle1"
                className={ classes.badge }
                color="textSecondary">
                { badge }
                { ' ' }
                Member
            </Typography>
            { !isOwner && <Button
                size="small"
                onClick={ handleFollowClick }
                startIcon={ <RssFeedSharpIcon /> }
                color={ following ? 'primary' : 'default' }>
                Follow
                { ' ' }
                { followers.length }
            </Button> }
        </>
    );

    return (
        <>
        <Card>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label={ name }
                        alt={ name }
                        badge={ badge }
                        variant="rounded"
                        user={ mail }
                        className={ classes.large } />
                }
                action={ <>
                    { isOwner
                    && <IconButton
                        aria-label="logout"
                        title="Logout"
                        color="secondary"
                        onClick={ props.onLogout }>
                        <ExitToAppIcon />
                    </IconButton> }
                </> }
                title={ renderTitle() } />
        </Card>
        <br/>
        <Card>
        <CardContent>
            
            <Typography>
                My Subscriptions
            </Typography>
            <Table className={classes.table} aria-label="simple table">
                <TableHead style={{fontWeight: 'bold'}}>
                    <TableRow>
                        <TableCell>Search</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Geo - Confluence Search</TableCell>
                        <TableCell>{isConfluenceAuthorised ? <span>Subscribed</span>: <span>---</span>}</TableCell>
                    <TableCell>{isConfluenceAuthorised ? 
                    <Button variant="contained" color="secondary" onClick={UnsubscribeConfluenceSearch}>Unsubscribe</Button>: 
                    <Button variant="contained" color="primary" onClick={handleConfluenceModalOpen}>Subscribe</Button>}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
        </Card>
        
        <ConfluenceLogin
                open={ openConfluenceModal }
                handleClose={ handleConfluenceModalClose } />
        </>
    );
};

TopicSection.defaultProps = {
    followers: [],
    name: '',
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        user: state.user.user,
        isConfluenceAuthorised: state.user.isConfluenceAuthorised,
        isConfluenceEnabled: state.user.isConfluenceEnabled,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAnswerToQuestion: (body) => {
            dispatch(addAnswerPending());
            dispatch(addAnswerToQuestion(body));
        },
        followUser: (body) => {
            dispatch(followUser(body));
        },
        UnsubscribeConfluenceSearch: () => {
            dispatch(requestConfluenceLogout());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicSection);
