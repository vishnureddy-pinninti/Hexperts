import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import List from '@material-ui/core/List';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Chip from '@material-ui/core/Chip';
import { withRouter } from 'react-router-dom';

import { addPostToBlog, addBlogPending } from '../../store/actions/blog';
import { addNewTopic, requestTopics } from '../../store/actions/topic';
import { editQuestion, editQuestionPending } from '../../store/actions/questions';

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => {
    return {
        root: {
        },
        chip: {
            margin: theme.spacing(0.5),
        },
        post: {
            height: 550,
        },
        editorWrapper: {
            border: '1px solid gray',
            padding: 10,
            marginTop: 20,
            '&:hover': {
                border: '2px solid',
                borderColor: theme.palette.primary.dark,
            },
        },
        editor: {
            height: 250,
            overflow: 'auto',
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


const BlogPostModal = (props) => {
    const classes = useStyles();

    const {
        addNewTopic,
        handleSubmit,
        handleClose,
        open,
        topicsList,
        addPostToBlog,
        pending,
        newPost,
        resetPost,
        history,
        newTopic,
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
    ] = React.useState([]);

    const [
        disableSubmit,
        setDisableSubmit,
    ] = React.useState(false);

    const [
        post,
        setPost,
    ] = React.useState(null);

    useEffect(() => {
        if (!pending && newPost && newPost._id) {
            setDisableSubmit(false);

            setPost(null);
            resetPost();
            history.push(`/post/${newPost._id}`);
        }
    }, [ newPost ]);

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

    const onEditorStateChange = (value) => {
        setPost(value);
    };

    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            id="name"
            label="Title"
            type="text"
            variant="outlined"
            required
            fullWidth />
    );

    const renderDescriptionField = ({ input }) => (
        <Editor
            { ...input }
            place
            editorState={ post }
            wrapperClassName={ classes.editorWrapper }
            editorClassName={ classes.editor }
            onEditorStateChange={ onEditorStateChange }
            toolbar={ {
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
                blockType: { inDropdown: false },
                image: {
                    defaultSize: {
                        height: '100%',
                        width: '100%',
                    },
                },
            } } />
    );

    const renderTopicsField = ({ input }) => (
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
    );

    const handleDelete = (value) => () => {
        setSelectedTopics((selectedTopics) => selectedTopics.filter((topic) => topic._id !== value._id));
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

    const renderSelectedTopics = () => (
        <List className={ classes.list }>
            { selectedTopics.map((value) => (
                <Chip
                    key={ value._id }
                    color="primary"
                    variant="outlined"
                    icon="/placeholder.png"
                    label={ value.topic || value.value }
                    onDelete={ handleDelete(value) }
                    className={ classes.chip } />
            )) }
        </List>
    );

    const addPost = (values) => {
        const { title } = values;
        setDisableSubmit(true);
        addPostToBlog(
            {
                description: draftToHtml(convertToRaw(post.getCurrentContent())),
                topics: checked,
                title,
            }
        );
    };

    return (
        <Dialog
            open={ open }
            scroll="paper"
            maxWidth="md"
            className={ classes.root }
            onClose={ handleClose }>
            <form
                id="post"
                onSubmit={ handleSubmit(addPost) }>
                <DialogTitle id="scroll-dialog-title">Post</DialogTitle>
                <DialogContent
                    dividers>
                    <DialogContentText className={ classes.post }>
                        <Field
                            name="topics"
                            component={ renderTopicsField } />
                        { renderSelectedTopics() }
                        <Field
                            name="title"
                            component={ renderTextField } />
                        <Field
                            name="description"
                            component={ renderDescriptionField } />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        size="small"
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        type="submit"
                        disabled={ disableSubmit }
                        color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        newPost: state.blog.newPost,
        newTopic: state.topic.newTopic,
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
            dispatch(editQuestionPending());
            dispatch(editQuestion(questionID, body));
        },
        addPostToBlog: (body) => {
            dispatch(addBlogPending());
            dispatch(addPostToBlog(body));
        },
        resetPost: () => {
            dispatch(reset('post'));
        },
    };
};

export default reduxForm({
    form: 'post', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(withRouter(BlogPostModal)));
