import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { addNewTopic, requestTopics } from '../../store/actions/topic';
import { editQuestion, editQuestionPending } from '../../store/actions/questions';


const filter = createFilterOptions();

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


const EditTopicsModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addNewTopic,
        question,
        questionID,
        topics,
        topicsList,
        requestTopics,
        editQuestion,
        newTopic,
        cancelText,
    } = props;

    useEffect(() => {
        requestTopics();
    }, [ requestTopics ]);

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    const [
        selectedTopics,
        setSelectedTopics,
    ] = React.useState(topics);

    useEffect(() => {
        const newChecked = [];
        topics.map((topic) => (newChecked.push(topic._id)));
        setChecked(newChecked);
        setSelectedTopics(topics);
    }, [ topics ]);

    useEffect(() => {
        const temp = [];
        const newChecked = [];

        if (newTopic && newTopic._id){
            newChecked.push(newTopic._id);
            temp.push(newTopic);
            setChecked([
                ...checked,
                ...newChecked,
            ]);
            setSelectedTopics([
                ...selectedTopics,
                ...temp,
            ]);
        }
    }, [ newTopic ]);

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

    const onTopicSelect = (obj, value) => {
        if (value && value.inputValue) {
            addNewTopic({ topics: [ value.inputValue ] });
            return;
        }

        if (value){
            const currentIndex = checked.indexOf(value._id);
            const newChecked = [ ...checked ];

            if (currentIndex === -1) {
                newChecked.push(value._id);
                setSelectedTopics([
                    ...selectedTopics,
                    value,
                ]);
            }
            setChecked(newChecked);
        }
    };

    const addTopicsToQuestion = () => {
        const { handleDone } = props;
        if (handleDone){
            handleDone(selectedTopics, checked);
        }
        else {
            editQuestion(questionID, { topics: checked });
        }
    };

    const renderSelectedTopics = () => (
        <List className={ classes.root }>
            { selectedTopics.map((value) => {
                const labelId = `checkbox-list-label-${value._id}`;

                return (
                    <ListItem
                        key={ value._id }
                        dense
                        button
                        onClick={ handleToggle(value) }>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={ checked.indexOf(value._id) !== -1 }
                                tabIndex={ -1 }
                                disableRipple
                                inputProps={ { 'aria-labelledby': labelId } } />
                        </ListItemIcon>
                        <ListItemText
                            id={ labelId }
                            primary={ value.topic || value.value } />
                    </ListItem>
                );
            }) }
        </List>
    );

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            style={ { minWidth: 1000 } }
            open={ props.open }
            disableBackdropClick={ props.disableBackdropClick }
            onClose={ props.handleClose }
            aria-labelledby="responsive-dialog-title">

            <DialogTitle id="responsive-dialog-title">
                Edit Topics
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Make sure this question has the right topics:
                    { ' ' }
                    <b>
                        { question }
                    </b>
                </DialogContentText>

                <div className={ classes.container }>
                    <Autocomplete
                        id="highlights-demo"
                        options={ topicsList }
                        onChange={ onTopicSelect }
                        // getOptionLabel={ (option) => {} }
                        filterOptions={ (options, params) => {
                            const filtered = filter(options, params);

                            if (params.inputValue !== '') {
                                filtered.push({
                                    inputValue: params.inputValue,
                                    topic: `Create "${params.inputValue}"`,
                                });
                            }

                            return filtered;
                        } }

                        renderInput={ (params) => (
                            <TextField
                                { ...params }
                                label="Choose Topics"
                                variant="outlined"
                                margin="normal" />
                        ) }
                        renderOption={ (option, { inputValue }) => {
                            const matches = match(option.topic, inputValue);
                            const parts = parse(option.topic, matches);

                            return (
                                <div>
                                    { parts.map((part, index) => (
                                        <span
                                            key={ index }
                                            style={ { fontWeight: part.highlight ? 700 : 400 } }>
                                            { part.text }
                                        </span>
                                    )) }
                                </div>
                            );
                        } } />
                </div>
                { renderSelectedTopics() }
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

EditTopicsModal.defaultProps = {
    topics: [],
    cancelText: 'Cancel',
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        newTopic: state.topic.newTopic,
        topicsList: state.topic.topics,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewTopic: (body) => {
            dispatch(addNewTopic(body));
            dispatch(reset('topic'));
        },
        requestTopics: (body) => {
            dispatch(requestTopics(body));
        },
        editQuestion: (questionID, body) => {
            dispatch(editQuestionPending());
            dispatch(editQuestion(questionID, body));
        },
    };
};

export default reduxForm({
    form: 'topic', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(EditTopicsModal));
