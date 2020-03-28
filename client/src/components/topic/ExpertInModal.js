import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import {
    useTheme,
    makeStyles,
} from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    Checkbox,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@material-ui/core';

import {
    addNewTopic,
    requestTopics,
} from '../../store/actions/topic';
import { editQuestion } from '../../store/actions/questions';
import {
    addUserPreferences,
    addPreferencesPending,
    maangeUserPreferences,
} from '../../store/actions/auth';

const useStyles = makeStyles(() => {
    return {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',

        },
        gridList: {
            width: 700,
            height: 500,
        },
        icon: {
            color: 'rgba(255, 255, 255, 0.54)',
        },
        title: {
            color: 'white',
        },
        textfield: {
            marginBottom: 30,
        },
        checkbox: {
            color: 'white',
            '&$checked': {
                color: 'red',
            },
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

const ExpertInModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        topics,
        maangeUserPreferences,
        expertIn,
        user,
        open,
        handleFollowTopicsModalClose,
    } = props;

    const [
        filteredTopics,
        setFilteredTopics,
    ] = React.useState(topics);

    useEffect(() => {
        setFilteredTopics(topics);
    }, [ topics ]);

    const filterTopics = (text) => {
        const filtered = topics.filter((topic) => topic.topic.toLowerCase().indexOf(text.toLowerCase()) > -1);
        setFilteredTopics(filtered);
    };

    const renderTextField = () => (
        <TextField
            margin="dense"
            id="name"
            label="Search Topics"
            type="text"
            className={ classes.textfield }
            onChange={ (event) => filterTopics(event.target.value) }
            autoComplete="off"
            autoFocus
            fullWidth />
    );

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    useEffect(() => {
        setChecked(expertIn.map(t => t._id));
    }, [ expertIn ]);

    const [
        selectedTopics,
        setSelectedTopics,
    ] = React.useState(topics);

    const selectTopic = (value) => {
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
            else {
                newChecked.splice(currentIndex, 1);
            }
            setChecked(newChecked);
        }
    };

    const addTopicsToInterests = () => {
        maangeUserPreferences({ expertIn: checked, interests: user.interests.map(i => i._id) });
    };

    const renderTopics = () => (
        <List className={ classes.gridList }>
            { filteredTopics.map((value) => {
                const labelId = `checkbox-list-label-${value._id}`;

                return (
                    <ListItem
                        key={ value._id }
                        role={ undefined }
                        dense
                        button
                        onClick={ () => selectTopic(value) }>
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
            open={ open }
            onClose={ handleFollowTopicsModalClose }
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>
                Add/Edit the topics you know about
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Topics are used to find the best experts to answer the question.
                </DialogContentText>
                { renderTextField() }
                { renderTopics() }
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={ handleFollowTopicsModalClose }
                    color="primary">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={ addTopicsToInterests }
                    type="submit">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ExpertInModal.defaultProps = {
    expertIn: [],
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        topics: [ ...state.topic.topics ],
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
        addUserPreferences: (body) => {
            dispatch(addPreferencesPending());
            dispatch(addUserPreferences(body));
        },
        maangeUserPreferences: (body) => {
            dispatch(addPreferencesPending());
            dispatch(maangeUserPreferences(body));
        }
    };
};

export default reduxForm({
    form: 'expertintopics', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(ExpertInModal));
