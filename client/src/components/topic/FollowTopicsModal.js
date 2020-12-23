import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { SubmissionError, reduxForm, Field, reset } from 'redux-form';
import { useTheme, makeStyles } from '@material-ui/core/styles';
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
import StarsOutlinedIcon from '@material-ui/icons/StarsOutlined';
import StarsRoundedIcon from '@material-ui/icons/StarsRounded';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { addNewTopic,
    requestTopics } from '../../store/actions/topic';
import { editQuestion } from '../../store/actions/questions';
import { addPreferencesPending,
    maangeUserPreferences } from '../../store/actions/auth';
import Autocomplete from '@material-ui/lab/Autocomplete';


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
        },
        addTopic: {
            float: 'right',
        }
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

const FollowTopicsModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        topics,
        followedTopics,
        requestTopics,
        maangeUserPreferences,
        open,
        handleFollowTopicsModalClose,
        expertTopics,
        handleTopicsUpdate,
        handleSubmit,
        addNewTopic,
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

    const [
        value,
        setValue,
    ] = React.useState(null);

    const addTopicsToInterests = () => {
        maangeUserPreferences({
            expertIn: expertChecked,
            interests: checked,
        }, handleTopicsUpdate);
    };

    const handleClose = () => {
        setChecked(followedTopics.map((t) => t._id));
        setExpertChecked(expertTopics.map((t) => t._id));
        filterTopics("");
        if (handleFollowTopicsModalClose){
            handleFollowTopicsModalClose();
        }
    };

    const topicsList = [];

    const onTopicSelect = (obj, value) => {
        console.log("OnTopicSelect")
        if (value && value.inputValue) {
            addNewTopic({ topics: [ value.inputValue ] });
            setValue({ topic: '' });
            return;
        }
    }

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
        <>
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
                    <div className={ classes.container }>
                        <Autocomplete
                            id="highlights-demo"
                            value={ value }
                            options={ topicsList }
                            onChange={ onTopicSelect }
                            getOptionLabel={ (option) => option.topic }
                            noOptionsText='Enter Text'
                            filterOptions={ (options, params) => {
                                const filtered = [];
                                if (params.inputValue && params.inputValue !== '') {
                                    if(topicsList.findIndex(x => x.topic.toLowerCase() != params.inputValue.toLowerCase()) == -1){
                                        filtered.push({
                                            inputValue: params.inputValue,
                                            topic: `Create "${params.inputValue}"`,
                                        });
                                    }
                                }

                                return filtered;
                            } }

                            renderInput={ (params) => (
                                <TextField
                                    { ...params }
                                    onChange= { (event) => filterTopics(event.target.value) }
                                    label="Search / Create Topics"
                                    margin="normal" />
                            ) }
                            />
                    </div>
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
        </>
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
            dispatch(reset('createTopic'));
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
    form: 'createTopic', // a unique identifier for this form
    // validate,
})(connect(mapStateToProps, mapDispatchToProps)(FollowTopicsModal));
