import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';
import { Editor } from 'react-draft-wysiwyg';
import { reduxForm } from 'redux-form';
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
        question,
        handleClose,
        open,
        answerHTML,
        title,
        onlyDescription,
        handleSubmit,
    } = props;

    const [
        answer,
        setAnswer,
    ] = React.useState('');

    React.useEffect(() => {
        let editorState = '';

        if (answerHTML){
            const contentBlock = htmlToDraft(answerHTML);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(contentState);
                setAnswer(editorState);
            }
        }
    }, [ answerHTML ]);

    const onEditorStateChange = (value) => {
        setAnswer(value);
    };

    const setEditorReference = (ref) => {
        if (ref) { ref.focus(); }
    };

    const addDescriptionToQuestion = () => {
        const { handleDone } = props;
        const contentState = answer.getCurrentContent();

        if (handleDone){
            handleDone(draftToHtml(convertToRaw(contentState)));
        }
    };

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
                        <DialogContentText>
                            <b>
                                { question }
                            </b>
                        </DialogContentText>
                        <Editor
                            editorState={ answer }
                            placeholder="Add Answer"
                            editorRef={ setEditorReference }
                            wrapperClassName={ classes.editorWrapper }
                            editorClassName={ `${classes.editor} editor-write-mode` }
                            onEditorStateChange={ onEditorStateChange }
                            blockRenderMap={ config.editorConfig.extendedBlockRenderMap }
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
    title: 'Edit Answer',
};

const mapStateToProps = (state, props) => {
    return {
        initialValues: {
        },
    };
};

export default connect(mapStateToProps)(reduxForm({
    form: 'editanswer', // a unique identifier for this form
    validate,
})(DescriptionModal));
