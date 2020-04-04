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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '../base/Avatar';

import { addNewTopic, requestTopics, requestSuggestedExperts } from '../../store/actions/topic';
import { editQuestion, editQuestionPending } from '../../store/actions/questions';
import getBadge from '../../utils/badge';

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

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

function TabPanel(props) {
    const {
        children,
        value,
        index,
        ...other
    } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={ value !== index }
            id={ `wrapped-tabpanel-${index}` }
            aria-labelledby={ `wrapped-tab-${index}` }
            { ...other }>
            { value === index && <Box p={ 3 }>
                { children }
            </Box> }
        </Typography>
    );
}


const EditSuggestedWriters = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [
        value,
        setValue,
    ] = React.useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const {
        addNewTopic,
        handleSubmit,
        question,
        questionID,
        topics,
        requestTopics,
        editQuestion,
        suggestedExperts,
        requestSuggestedExperts,
        askedExperts,
        cancelText,
    } = props;

    for (let i = suggestedExperts.length - 1; i >= 0; i--){
        for (let j = 0; j < askedExperts.length; j++){
            if (suggestedExperts[i] && (suggestedExperts[i]._id === askedExperts[j]._id)){
                suggestedExperts.splice(i, 1);
            }
        }
    }

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    const [
        selectedTopic,
        setSelectedTopic,
    ] = React.useState('all');

    const requestAllTopicsExperts = () => {
        if (topics.length){
            const topicsString = `${topics.map((topic) => `${topic._id}`)}`;
            setSelectedTopic('all');
            requestSuggestedExperts(topicsString);
        }
    };

    useEffect(() => {
        if (topics.length){
            const topicsString = `${topics.map((topic) => `${topic._id}`)}`;
            requestSuggestedExperts(topicsString);
        }
    }, [
        requestSuggestedExperts,
        topics,
    ]);

    const getTopicExperts = (topicId) => {
        setSelectedTopic(topicId);
        requestSuggestedExperts(topicId);
    };

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
        const { handleDone } = props;
        if (handleDone){
            handleDone(checked);
        }
        else {
            editQuestion(questionID, { suggestedExperts: checked });
        }
    };

    const renderTopics = () => topics.map((topic) => (
        <ListItem
            button
            selected={ selectedTopic === topic._id }
            onClick={ () => getTopicExperts(topic._id) }
            key={ topic._id }>
            <ListItemText primary={ topic.topic || topic.value } />
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
                    onClick={ requestAllTopicsExperts }
                    selected={ selectedTopic === 'all' }
                    button>
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
                { suggestedExperts.length === 0
                && <ListItem>
                    <ListItemText
                        inset
                        primary="No results to display." />
                   </ListItem> }
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
                                    badge={ getBadge(user.reputation) }
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

    const renderAskedExperts = () => (
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
                { askedExperts.length === 0
                && <ListItem>
                    <ListItemText
                        inset
                        primary="No results to display." />
                   </ListItem> }
                { askedExperts.map((user) => (
                    <ListItem
                        key={ user._id }
                        dense>
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
                                    { `${user.reputation} points` }
                                </>
                            } />
                    </ListItem>
                )) }
            </List>
        </div>
    );

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            open={ props.open }
            onClose={ props.handleClose }
            disableBackdropClick={ props.disableBackdropClick }
            aria-labelledby="responsive-dialog-title">

            <DialogTitle id="responsive-dialog-title">
                Request Answers -
                { ' ' }
                { question }
            </DialogTitle>
            <DialogContent>
                <Tabs
                    value={ value }
                    onChange={ handleChange }
                    aria-label="wrapped label tabs example">
                    <Tab
                        value="one"
                        label="Suggested Experts"
                        { ...a11yProps('one') } />
                    <Tab
                        value="two"
                        label={ `Sent Requests (${askedExperts.length})` }
                        { ...a11yProps('two') } />
                </Tabs>
                <TabPanel
                    value={ value }
                    index="one">
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
                </TabPanel>
                <TabPanel
                    value={ value }
                    index="two">
                    <Grid
                        container
                        spacing={ 3 }>
                        { renderAskedExperts() }
                    </Grid>
                </TabPanel>
            </DialogContent>

            <DialogActions>
                <Button
                    autoFocus
                    onClick={ props.handleClose }
                    color="primary">
                    { cancelText }
                </Button>
                <Button
                    color="primary"
                    variant="contained"
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
    cancelText: 'Cancel',
    askedExperts: [],
};

const mapStateToProps = (state) => {
    return {
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
