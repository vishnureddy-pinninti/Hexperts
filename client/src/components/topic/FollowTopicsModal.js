import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import {
    withStyles,
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
    TextField,
    IconButton,
    GridList,
    GridListTile,
    GridListTileBar,
    Checkbox,
} from '@material-ui/core';
import {
    CheckCircleRounded as CheckCircleRoundedIcon,
    CheckCircleOutlined as CheckCircleOutlinedIcon,
} from '@material-ui/icons';

import {
    addNewTopic,
    requestTopics,
} from '../../store/actions/topic';
import { editQuestion } from '../../store/actions/questions';
import {
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

const FollowTopicsModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        topics,
        followedTopics,
        requestTopics,
        user,
        maangeUserPreferences,
        open,
        handleFollowTopicsModalClose,
    } = props;


    useEffect(() => {
        requestTopics();
    }, [ requestTopics ]);

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
            autoComplete="off"
            onChange={ (event) => filterTopics(event.target.value) }
            fullWidth />
    );

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    useEffect(() => {
        setChecked(followedTopics.map(t => t._id));
    }, [ followedTopics ]);

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
        maangeUserPreferences({ expertIn: user.expertIn.map(t => t._id), interests: checked });
    };

    const renderTopics = () => (
        <div className={ classes.root }>
            <GridList
                className={ classes.gridList }>
                { filteredTopics.map((topic) => (
                    <GridListTile key={ topic._id }>
                        <img
                            src={ topic.imageUrl || '/placeholder.png' }
                            alt={ topic.topic } />
                        <GridListTileBar
                            title={ topic.topic }
                            classes={ {
                                root: classes.titleBar,
                                title: classes.title,
                            } }
                            actionIcon={
                                <IconButton
                                    aria-label={ `star ${topic.topic}` }
                                    onClick={ () => { selectTopic(topic); } }>
                                    <WhiteCheckbox
                                        icon={ <CheckCircleOutlinedIcon /> }
                                        checkedIcon={ <CheckCircleRoundedIcon /> }
                                        checked={ checked.indexOf(topic._id) !== -1 }
                                        className={ classes.checkbox } />
                                </IconButton>
                            } />
                    </GridListTile>
                )) }
            </GridList>
        </div>
    );

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            open={ open }
            onClose={ handleFollowTopicsModalClose }
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>
                Topics
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Follow topics of your interest and we will give you feed when new question or answer is posted.
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

FollowTopicsModal.defaultProps = {
    followedTopics: [],
    topics: [],
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        topics: [ ...state.topic.topics ],
        followedTopics: state.user.interests,
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
        maangeUserPreferences: (body) => {
            dispatch(addPreferencesPending());
            dispatch(maangeUserPreferences(body));
        }
    };
};

export default reduxForm({
    form: 'followtopics', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(FollowTopicsModal));
