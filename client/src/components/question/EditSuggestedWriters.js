import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '../base/Avatar';

import { addNewTopic, requestTopics, requestSuggestedExperts } from '../../store/actions/topic';
import { editQuestion, editQuestionPending } from '../../store/actions/questions';


const useStyles = makeStyles((theme) => {
    return {
        root: {
        },
        container: {
            padding: 10,
        },
        textfield: {
            paddingBottom: 10,
        },
        userList: {
            minHeight: 500,
            minWidth: 400,
        },
    };
});

const validate = (values) => {
    const errors = {};
    const requiredFields = [ 'question' ];
    requiredFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });
    return errors;
};


const EditSuggestedWriters = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addNewTopic,
        handleSubmit,
        question,
        questionID,
        topics,
        topicsList,
        requestTopics,
        editQuestion,
        newTopic,
        suggestedExperts,
        requestSuggestedExperts,
    } = props;

    useEffect(() => {
        requestTopics();
    }, [ requestTopics ]);

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    useEffect(() => {
        const topicslist = '';
        requestSuggestedExperts(topicslist);
    }, []);

    const handleToggle = ((value) => () => {
        const currentIndex = checked.indexOf(value._id);
        const newChecked = [ ...checked ];

        if (currentIndex === -1) {
            newChecked.push(value._id);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    });

    const addTopicsToQuestion = () => {
        editQuestion(questionID, { suggestedExperts: checked });
    };

    const renderTopics = () => topics.map((topic) => (
        <ListItem
            button
            key={ topic._id }>
            <ListItemText primary={ topic.topic } />
        </ListItem>

    ));

    const renderTopicList = () => (
        <>
            <Typography
                component="div"
                className={ classes.heading }>
                <Box
                    fontWeight="fontWeightBold"
                    m={ 1 }>
                    Topics
                </Box>
            </Typography>
            <List
                component="nav"
                aria-label="main mailbox folders">
                <ListItem
                    button
                    selected>
                    <ListItemText primary="All Topics" />
                </ListItem>
                { renderTopics() }
            </List>
        </>
    );

    const renderTopicExperts = () => (
        <div className={ classes.userList }>
            <Typography
                component="div"
                className={ classes.heading }>
                <Box
                    fontWeight="fontWeightBold"
                    m={ 1 }>
                    Experts
                </Box>
            </Typography>
            <List className={ classes.list }>
                { suggestedExperts.map((user) => {
                    const labelId = `checkbox-list-label-${user._id}`;
                    return (
                        <ListItem
                            key={ user._id }
                            role={ undefined }
                            dense
                            button
                            onClick={ handleToggle(user) }>
                            <ListItemAvatar>
                                <Avatar
                                    alt={ user.name }
                                    user={ user.mail } />
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
                                        { `${user.reputation} points` }
                                    </>
                                } />
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={ checked.indexOf(user._id) !== -1 }
                                    tabIndex={ -1 }
                                    disableRipple
                                    inputProps={ { 'aria-labelledby': labelId } } />
                            </ListItemIcon>
                        </ListItem>
                    );
                }) }
            </List>
        </div>
    );

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            open={ props.open }
            onClose={ props.handleClose }
            aria-labelledby="responsive-dialog-title">

            <DialogTitle id="responsive-dialog-title">
                Request Answers -
                { ' ' }
                { question }
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 4 }>
                        { renderTopicList() }
                    </Grid>
                    <Grid
                        item
                        xs={ 8 }>
                        { renderTopicExperts() }
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button
                    autoFocus
                    onClick={ props.handleClose }
                    color="primary">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={ addTopicsToQuestion }
                    type="submit">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditSuggestedWriters.defaultProps = {
    topics: [],
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        newTopic: state.topic.newTopic,
        topicsList: state.topic.topics,
        suggestedExperts: state.topic.suggestedExperts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewTopic: (body) => {
            dispatch(addNewTopic(body));
        },
        requestTopics: (body) => {
            dispatch(requestTopics(body));
        },
        editQuestion: (questionID, body) => {
            dispatch(editQuestionPending());
            dispatch(editQuestion(questionID, body));
        },
        requestSuggestedExperts: (topics) => {
            dispatch(requestSuggestedExperts(topics));
        },
    };
};

export default reduxForm({
    form: 'topic', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(EditSuggestedWriters));
