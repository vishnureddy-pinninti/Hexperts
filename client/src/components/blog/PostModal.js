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
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import List from '@material-ui/core/List';
import { Editor } from 'react-draft-wysiwyg';
import Chip from '@material-ui/core/Chip';
import { withRouter } from 'react-router-dom';

import { addPostToBlog, addBlogPending } from '../../store/actions/blog';
import { addNewTopic, requestTopics } from '../../store/actions/topic';
import { editQuestion, editQuestionPending } from '../../store/actions/questions';
import config from '../../utils/config';

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
        title: {
            marginBottom: 20,
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
        descriptionHTML,
    } = props;

    let editorState = '';

    if (descriptionHTML){
        const contentBlock = htmlToDraft(descriptionHTML);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            editorState = EditorState.createWithContent(contentState);
        }
    }

    const [
        description,
        setDescription,
    ] = React.useState(editorState);

    const onEditorStateChange = (value) => {
        setDescription(value);
    };

    const setEditorReference = (ref) => {
        if (ref) { ref.focus(); }
    };

    useEffect(() => {
        requestTopics();
    }, [ requestTopics ]);

    const [
        disableSubmit,
        setDisableSubmit,
    ] = React.useState(false);

    useEffect(() => {
        if (!pending && newPost && newPost._id) {
            setDisableSubmit(false);
            resetPost();
            history.push(`/post/${newPost._id}`);
        }
    }, [ newPost ]);

    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            className={ classes.title }
            id="name"
            label="Title"
            type="text"
            variant="outlined"
            // autoFocus
            required
            fullWidth />
    );

    const renderDescriptionField = ({ input }) => (
        <Editor
            editorState={ description }
            placeholder="Start typing.."
            // editorRef={ setEditorReference }
            onEditorStateChange={ onEditorStateChange }
            wrapperClassName={ classes.editorWrapper }
            editorClassName={ `${classes.editor} editor-write-mode` }
            toolbar={ config.editorToolbar } />
    );

    const renderTopicsField = ({ input }) => (
        <Autocomplete
            multiple
            value={ input.value || [] }
            filterSelectedOptions
            onChange={ (event, value) => {
                const last = value.slice(-1)[0];
                if (last && last.inputValue) {
                    value.pop();
                    addNewTopic({ topics: [ last.inputValue ] },
                        (res) => {
                            if (res.length){
                                value.push(res[0]);
                                input.onChange(value);
                            }
                        });
                    return;
                }
                if (value){
                    input.onChange(value);
                }
            } }
            limitTags={ 5 }
            id="multiple-limit-tags"
            options={ topicsList }
            getOptionLabel={ (option) => option.topic }
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
                    variant="outlined"
                    label="Choose Topics"
                    placeholder="Topics" />
            ) } />
    );

    const addPost = (values) => {
        const {
            title,
            topics,
        } = values;

        const { handleDone } = props;
        if (handleDone){
            handleDone(
                {
                    description: description && draftToHtml(convertToRaw(description.getCurrentContent())),
                    topics: topics && topics.map((topic) => (topic._id)),
                    title,
                }
            );
        }
        else {
            setDisableSubmit(true);
            addPostToBlog(
                {
                    description: description && draftToHtml(convertToRaw(description.getCurrentContent())),
                    topics: topics && topics.map((topic) => (topic._id)),
                    title,
                }
            );
        }
    };

    return (
        <Dialog
            open={ open }
            scroll="paper"
            maxWidth="md"
            className={ classes.root }
            onClose={ handleClose }>
            <form
                id={ props.formName }
                onSubmit={ handleSubmit(addPost) }>
                <DialogTitle id="scroll-dialog-title">Blog Post</DialogTitle>
                <DialogContent
                    dividers>
                    <DialogContentText className={ classes.post }>
                        <Field
                            name="title"
                            component={ renderTextField } />
                        <Field
                            name="topics"
                            component={ renderTopicsField } />
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
        topicsList: state.topic.topics,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewTopic: (body, callback) => {
            dispatch(addNewTopic(body, callback));
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

const mapStateToPropsForForm = (state, props) => {
    const {
        topics,
        title,
        formName,
    } = props;

    return {
        initialValues: {
            topics,
            title,
        },
        form: formName || 'post',
    };
};

export default connect(mapStateToPropsForForm)(reduxForm({
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(withRouter(BlogPostModal))));
