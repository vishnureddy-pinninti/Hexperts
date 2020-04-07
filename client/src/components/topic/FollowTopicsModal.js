import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withStyles,
    useTheme,
    makeStyles } from '@material-ui/core/styles';
import { Button,
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
    ButtonGroup,
    Checkbox } from '@material-ui/core';
import { CheckCircleRounded as CheckCircleRoundedIcon,
    CheckCircleOutlined as CheckCircleOutlinedIcon } from '@material-ui/icons';
import ExplicitIcon from '@material-ui/icons/Explicit';
import ExplicitOutlinedIcon from '@material-ui/icons/ExplicitOutlined';
import StarsOutlinedIcon from '@material-ui/icons/StarsOutlined';
import StarsRoundedIcon from '@material-ui/icons/StarsRounded';
import { addNewTopic,
    requestTopics } from '../../store/actions/topic';
import { editQuestion } from '../../store/actions/questions';
import { addPreferencesPending,
    maangeUserPreferences } from '../../store/actions/auth';


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
            color: '#bdbdbd',
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
        expertTopics,
        handleTopicsUpdate,
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

    const [
        expertChecked,
        setExpertChecked,
    ] = React.useState([]);


    useEffect(() => {
        setChecked(followedTopics.map((t) => t._id));
        setExpertChecked(expertTopics.map((t) => t._id));
    }, [
        followedTopics,
        expertTopics,
    ]);


    const selectTopic = (value) => {
        if (value){
            const currentIndex = checked.indexOf(value._id);
            const newChecked = [ ...checked ];

            if (currentIndex === -1) {
                newChecked.push(value._id);
            }
            else {
                newChecked.splice(currentIndex, 1);
            }
            setChecked(newChecked);
        }
    };

    const selectExpertTopic = (value) => {
        if (value){
            const currentIndex = expertChecked.indexOf(value._id);
            const isTopicFollowed = checked.indexOf(value._id);
            const newChecked = [ ...expertChecked ];

            if (currentIndex === -1) {
                newChecked.push(value._id);
            }
            else {
                newChecked.splice(currentIndex, 1);
            }
            setExpertChecked(newChecked);
            // Follow topic if not followed
            if (isTopicFollowed === -1 && currentIndex === -1){
                const topicChecked = [ ...checked ];
                topicChecked.push(value._id);
                setChecked(topicChecked);
            }
        }
    };

    const addTopicsToInterests = () => {
        maangeUserPreferences({
            expertIn: expertChecked,
            interests: checked,
        }, handleTopicsUpdate);
    };

    const handleClose = () => {
        setChecked(followedTopics.map((t) => t._id));
        setExpertChecked(expertTopics.map((t) => t._id));
        if (handleFollowTopicsModalClose){
            handleFollowTopicsModalClose();
        }
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
                                <ButtonGroup
                                    size="small"
                                    aria-label="small outlined button group">
                                    <IconButton
                                        aria-label={ `star ${topic.topic}` }
                                        title="Follow"
                                        onClick={ () => { selectTopic(topic); } }>
                                        <Checkbox
                                            icon={ <CheckCircleOutlinedIcon /> }
                                            checkedIcon={ <CheckCircleRoundedIcon /> }
                                            checked={ checked.indexOf(topic._id) !== -1 }
                                            className={ classes.checkbox } />
                                    </IconButton>
                                    <IconButton
                                        aria-label={ `star ${topic.topic}` }
                                        title="Expert"
                                        onClick={ () => { selectExpertTopic(topic); } }>
                                        <Checkbox
                                            icon={ <StarsOutlinedIcon /> }
                                            checkedIcon={ <StarsRoundedIcon /> }
                                            checked={ expertChecked.indexOf(topic._id) !== -1 }
                                            className={ classes.checkbox } />
                                    </IconButton>
                                </ButtonGroup>

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
            onClose={ handleClose }
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>
                Topics
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <b>Follow topics of your interest and we will give you feed when new question or answer is posted.</b>
                </DialogContentText>
                { renderTextField() }
                { renderTopics() }
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={ handleClose }
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
    expertTopics: [],
    topics: [],
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        topics: [ ...state.topic.topics ],
        expertTopics: state.user.expertIn,
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
        maangeUserPreferences: (body, cb) => {
            dispatch(addPreferencesPending());
            dispatch(maangeUserPreferences(body, cb));
        },
    };
};

export default reduxForm({
    form: 'followtopics', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(FollowTopicsModal));
