import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from 'react-draft-wysiwyg';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

import htmlToDraft from '../../utils/html-to-draftjs';
import draftToHtml from '../../utils/draftjs-to-html';
import config from '../../utils/config';

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


const useStyles = makeStyles({
    root: {
        overflow: 'visible',
        marginTop: 10,
    },
    media: {

    },
    editorWrapper: {
        border: '1px solid #F1F1F1',
        minHeight: 300,
        padding: 10,
    },
    editor: {
        height: 300,
        overflow: 'auto',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
});

function DescriptionModal(props) {
    const classes = useStyles();
    const {
        questionText,
        handleClose,
        open,
        descriptionHTML,
        title,
        onlyDescription,
        handleSubmit,
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

    const addDescriptionToQuestion = (values) => {
        const { handleDone } = props;
        const content = description.getCurrentContent();
        const raw = convertToRaw(content);
        const html = draftToHtml(raw);

        if (handleDone){
            if (onlyDescription){
                handleDone(html);
            }
            else {
                handleDone(values.question, html);
            }
        }
    };

    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            label="Question"
            type="text"
            variant="outlined"
            required
            fullWidth />
    );

    return (
        <div>
            <Dialog
                scroll="paper"
                maxWidth="md"
                open={ open }
                onClose={ handleClose }>
                <form
                    id="editquestion"
                    onSubmit={ handleSubmit(addDescriptionToQuestion) }>
                    <DialogTitle
                        id="draggable-dialog-title">
                        { title }
                    </DialogTitle>
                    <DialogContent>
                        { onlyDescription && <DialogContentText>
                            Make sure this question has the right description:
                            { ' ' }
                            <b>
                                { questionText }
                            </b>
                        </DialogContentText> }
                        { !onlyDescription
                        && <Field
                            name="question"
                            component={ renderTextField } /> }
                        <Editor
                            spellCheck
                            editorState={ description }
                            placeholder="Add Description"
                            editorRef={ setEditorReference }
                            wrapperClassName={ classes.editorWrapper }
                            editorClassName={ `${classes.editor} editor-write-mode` }
                            onEditorStateChange={ onEditorStateChange }
                            toolbarCustomButtons={ config.editorConfig.toolbarCustomButtons }
                            customBlockRenderFunc={ config.editorConfig.customBlockRenderer }
                            toolbar={ config.editorToolbar } />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            onClick={ handleClose }
                            color="primary">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary">
                            Done
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

DescriptionModal.defaultProps = {
    title: 'Description',
    onlyDescription: true,
};

const mapStateToProps = (state, props) => {
    return {
        initialValues: {
            question: props.questionText,
        },
    };
};

export default connect(mapStateToProps)(reduxForm({
    form: 'editquestion', // a unique identifier for this form
    validate,
})(DescriptionModal));
