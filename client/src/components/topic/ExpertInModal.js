import React, { useEffect } from 'react';
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { addNewTopic, requestTopics } from '../../store/actions/topic';
import { editQuestion } from '../../store/actions/questions';
import { addUserPreferences, addPreferencesPending } from '../../store/actions/auth';


const useStyles = makeStyles((theme) => {
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

const WhiteCheckbox = withStyles({
    root: {
        color: 'white',
        '&$checked': {
            color: 'white',
        },
    },
    checked: {},
})((props) => (
    <Checkbox
        color="default"
        { ...props } />
));

const ExpertInModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addNewTopic,
        handleSubmit,
        question,
        questionID,
        topics,
        requestTopics,
        editQuestion,
        addUserPreferences,
        expertIn,
        open,
    } = props;


    for (let i = topics.length - 1; i >= 0; i--){
        for (let j = 0; j < expertIn.length; j++){
            if (topics[i] && (topics[i]._id === expertIn[j]._id)){
                topics.splice(i, 1);
            }
        }
    }

    const [
        filteredTopics,
        setFilteredTopics,
    ] = React.useState(topics);

    useEffect(() => {
        setFilteredTopics(topics);
    }, [ topics ]);

    const filterTopics = (text) => {
        const filtered = topics.filter((topic) => topic.topic.toLowerCase().startsWith(text.toLowerCase()));
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
            autoFocus
            fullWidth />
    );

    const [
        checked,
        setChecked,
    ] = React.useState([]);

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
        addUserPreferences({ expertIn: checked });
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
            open={ props.open }
            onClose={ props.handleFollowTopicsModalClose }
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
                    onClick={ props.handleFollowTopicsModalClose }
                    color="primary">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={ addTopicsToInterests }
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
        topics: state.topic.topics,
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
    };
};

export default reduxForm({
    form: 'followtopics', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(ExpertInModal));
