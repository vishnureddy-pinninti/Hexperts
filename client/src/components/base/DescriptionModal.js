import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

import htmlToDraft from '../../utils/html-to-draftjs';
import draftToHtml from '../../utils/draftjs-to-html';
import Editor from './Editor';

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

function DescriptionModal(props) {
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
                            placeholder="Add Description"
                            initialValue={ description }
                            handleEditorStateChange={ onEditorStateChange } />
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
