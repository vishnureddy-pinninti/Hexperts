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

const FollowTopicsModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addNewTopic,
        handleSubmit,
        question,
        questionID,
        topics,
        followedTopics,
        requestTopics,
        editQuestion,
        addUserPreferences,
        open,
    } = props;


    useEffect(() => {
        requestTopics();
    }, [ requestTopics ]);

    for (let i = topics.length - 1; i >= 0; i--){
        for (let j = 0; j < followedTopics.length; j++){
            if (topics[i] && (topics[i]._id === followedTopics[j]._id)){
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
        console.log(checked);
        addUserPreferences({ interests: checked });
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
            open={ props.open }
            onClose={ props.handleFollowTopicsModalClose }
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

FollowTopicsModal.defaultProps = {
    followedTopics: [],
    topics: [],
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
    };
};

export default reduxForm({
    form: 'followtopics', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(FollowTopicsModal));
