import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { withRouter } from 'react-router-dom';
import Editor from '../base/Editor';

import PreviewCard from '../blog/PreviewCard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { addPostToBlog, addBlogPending } from '../../store/actions/blog';
import { addDraftPending, createDraft } from '../../store/actions/draft';
import { addNewTopic, requestTopics } from '../../store/actions/topic';
import { editQuestion, editQuestionPending } from '../../store/actions/questions';
import htmlToDraft from '../../utils/html-to-draftjs';
import draftToHtml from '../../utils/draftjs-to-html';

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => {
    return {
        root: {
        },
        chip: {
            margin: theme.spacing(0.5),
        },
        post: {
        },
        
        previewPost: {
            minHeight: '60vh',
            maxHeight:'70vh',
        },
        previewButton: {
            float: 'right',
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

const renderTextField = ({ input }) => (
    <TextField
        { ...input }
        style= {{ marginBottom: 20, }}
        id="name"
        label="Title"
        type="text"
        variant="outlined"
        autoComplete="off"
        autoFocus
        required
        fullWidth />
);

const BlogPostModal = (props) => {
    const classes = useStyles();

    const {
        addNewTopic,
        handleSubmit,
        handleClose,
        open,
        topicsList,
        addPostToBlog,
        createDraft,
        pending,
        newPost,
        newDraft,
        resetPost,
        history,
        descriptionHTML,
    } = props;

    const [
        description,
        setDescription,
    ] = React.useState('');

    const [
        title,
        setTitle
    ]   = React.useState('');

    const [
        topics,
        setTopics
    ]   = React.useState(null);

    const [
        variant,
        setVariant
    ] = React.useState('outlined');

    const [
        preview,
        setPreview,
    ] = React.useState(false); 

    const createPreview = () => {
        variant === 'outlined'? setVariant('contained'): setVariant('outlined')
        setPreview(!preview);
    }

    useEffect(() => {
        let editorState = '';

        if (descriptionHTML){
            const contentBlock = htmlToDraft(descriptionHTML);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(contentState);
                setDescription(editorState);
            }
        }
    }, [ descriptionHTML ]);

    const onEditorStateChange = (value) => {
        setDescription(value);
    };

    useEffect(() => {
        requestTopics();
    }, []);

    const [
        disableSubmit,
        setDisableSubmit,
    ] = React.useState(false);

    useEffect(() => {
        if (!pending && newDraft && newDraft._id) {
            setDisableSubmit(false);
            resetPost();
            history.push(`/draft/${newDraft._id}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ newDraft ]);

    useEffect(() => {
        if (!pending && newPost && newPost._id) {
            setDisableSubmit(false);
            resetPost();
            history.push(`/post/${newPost._id}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ newPost ]);

    const renderDescriptionField = () => (
        <Editor
            initialValue={ description }
            handleEditorStateChange={ onEditorStateChange } />
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

    const renderPostActions = () => {
        const { postId, draftId } = props;
        if (postId){
            return (
                <Button
                    size="small"
                    variant="contained"
                    onClick={handleSubmit( values => addPost(values)) }
                    disabled={ disableSubmit }
                    color="primary">
                    Submit
                </Button>
            )
        }
        else if (draftId) {
            return (
                <>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={ handleSubmit( values => draftPost(values)) }
                        disabled={ disableSubmit }
                        color="primary">
                        Save to Draft
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={ handleSubmit( values => postDraft(values)) }
                        disabled={ disableSubmit }
                        color="primary">
                        Submit
                    </Button>
                </>
            )
        }
        else {
            return (
                <>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleSubmit( values => draftPost(values)) }
                        disabled={ disableSubmit }
                        color="primary">
                        Save to Draft
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleSubmit( values => addPost(values)) }
                        disabled={ disableSubmit }
                        color="primary">
                        Submit
                    </Button>
                </>
            )
        }
    }

    const draftPost = (values) => {
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
            createDraft(
                {
                    description: description && draftToHtml(convertToRaw(description.getCurrentContent())),
                    topics: topics && topics.map((topic) => (topic._id)),
                    title,
                }
            );
        }
    }

    const postDraft = (values) => {
        const {
            title,
            topics,
        } = values;

        const { handlePostDraft } = props;
        if (handlePostDraft){
            handlePostDraft(
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
            fullWidth={true}
            maxWidth="md"
            className={ classes.root }
            onClose={ handleClose }
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description">
            <form
                id={ props.formName }
                onSubmit={ handleSubmit(addPost) }>
                <DialogTitle id="scroll-dialog-title">Blog Post
                
                <Button
                        className ={ classes.previewButton }
                        size="small"
                        variant={variant}
                        onClick={ createPreview }
                        disabled={!title && !topics && !description}
                        color="primary">
                        Preview
                        <VisibilityIcon />
                </Button>
                </DialogTitle>
                {!preview && <DialogContent
                    className={ classes.post }
                    dividers>
                    <DialogContentText component="div">
                        <Field
                            onChange={(e, newValue) => setTitle(newValue)}
                            name="title"
                            component={ renderTextField } />
                        <Field
                            onChange={(e, newValue) => setTopics(newValue)}
                            name="topics"
                            component={ renderTopicsField } />
                    </DialogContentText>
                    { renderDescriptionField() }
                </DialogContent>}
                {preview && <DialogContent
                    className={ classes.previewPost }
                    dividers>
                        <DialogContentText component="div"
                        id="scroll-dialog-description">
                            <PreviewCard
                                previewPost={{
                                    description: description && draftToHtml(convertToRaw(description.getCurrentContent())),
                                    topics,
                                    title,
                                }}
                                collapse={ false }
                                hideHeaderHelperText={ false } />
                        </DialogContentText>
                    </DialogContent>}
                <DialogActions>
                    <Button
                        size="small"
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button>
                    { renderPostActions() }
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
        newDraft: state.draft.newDraft,
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
        createDraft: (body) => {
            dispatch(addDraftPending());
            dispatch(createDraft(body))
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
