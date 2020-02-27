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
import { Field, reduxForm } from 'redux-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { addNewTopic, requestTopics } from '../../store/actions/topic';
import { editQuestion } from '../../store/actions/questions';


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
        handleSubmit,
        question,
        questionID,
        topics,
        topicsList,
        requestTopics,
        editQuestion,
    } = props;

    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            margin="dense"
            id="name"
            label="Topic"
            type="text"
            className={ classes.textfield }
            required
            fullWidth />
    );

    const onAddNewTopic = (values) => {
        addNewTopic({ topics: [ values.topic ] });
    };

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


    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value._id);
        const newChecked = [ ...checked ];

        if (currentIndex === -1) {
            newChecked.push(value._id);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const onTopicSelect = (obj, value) => {
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
        editQuestion(questionID, { topics: checked });
    };

    const renderSelectedTopics = () => (
        <List className={ classes.root }>
            { selectedTopics.map((value) => {
                const labelId = `checkbox-list-label-${value._id}`;

                return (
                    <ListItem
                        key={ value._id }
                        role={ undefined }
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
                            primary={ value.topic } />
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
                <form
                    id="topic"
                    onSubmit={ handleSubmit(onAddNewTopic) }>
                    <div className={ classes.container }>
                        <Field
                            name="topic"
                            component={ renderTextField } />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={ classes.submit }
                            type="submit">
                            Add New Topic
                        </Button>
                    </div>
                </form>
                <Typography component="div">
                    <Box
                        textAlign="center"
                        m={ 1 }>
                        or
                    </Box>
                </Typography>
                <div className={ classes.container }>
                    <Autocomplete
                        id="highlights-demo"
                        options={ topicsList }
                        onChange={ onTopicSelect }
                        getOptionLabel={ (option) => option.topic }
                        noOptionsText="Oops! That topic can not be found. Feel free to create new topic."
                        renderInput={ (params) => (
                            <TextField
                                { ...params }
                                label="Choose existing Topics"
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

const mapStateToProps = (state) => {
    return {
        user: state.user,
        topicsList: state.topic.topics,
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
            dispatch(editQuestion(questionID, body));
        },
    };
};

export default reduxForm({
    form: 'topic', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(EditTopicsModal));
