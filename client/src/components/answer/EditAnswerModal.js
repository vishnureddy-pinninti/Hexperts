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
import { IconButton } from '@material-ui/core';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
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
        height: '100%',
    },
    content: {
        height: 'calc(100% - 180px)',
    },
    media: {

    },
    editorWrapper: {
        border: '1px solid #F1F1F1',
        padding: 10,
        height: 'calc(100% - 70px)',
        overflow: 'auto',
    },
    editor: {
        height: 'inherit',
    },

    modal: {
        height: 300,
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
        open,
        answerHTML,
        title,
        handleSubmit,
        answerEditorState,
        newAnswer,
        fullScreen,
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


    React.useEffect(() => {
        if (answerEditorState){
            setAnswer(answerEditorState);
        }
    }, [ answerEditorState ]);

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

    const handleClose = () => {
        const { handleClose } = props;
        if (handleClose){
            handleClose(answer);
        }
    };

    return (

        <Dialog
            scroll="paper"
            fullScreen={ fullScreen }
            maxWidth="md"
            style={ { height: '100vh' } }
            open={ open }
            onClose={ handleClose }>
            <form
                id="editquestion"
                className={ classes.root }
                onSubmit={ handleSubmit(addDescriptionToQuestion) }>
                <DialogTitle
                    id="draggable-dialog-title">
                    { newAnswer
                        ? <DialogActions>
                            Add Answer
                            <IconButton
                                aria-label="fullscreen"
                                title="Full Screen"
                                edge="end"
                                style={ {
                                    marginLeft: 'auto',
                                    borderRadius: 0,
                                } }
                                color="secondary"
                                fontSize="large"
                                onClick={ handleClose }>
                                <FullscreenExitIcon />
                            </IconButton>
                        </DialogActions>
                        : title }
                </DialogTitle>
                <DialogContent className={ classes.content }>
                    <DialogContentText>
                        <b>
                            { question }
                        </b>
                    </DialogContentText>
                    <Editor
                        spellCheck
                        editorState={ answer }
                        placeholder="Add Answer"
                        editorRef={ setEditorReference }
                        wrapperClassName={ classes.editorWrapper }
                        editorClassName={ `${classes.editor} editor-write-mode ${!fullScreen && classes.modal}` }
                        onEditorStateChange={ onEditorStateChange }
                        toolbarCustomButtons={ config.editorConfig.toolbarCustomButtons }
                        customBlockRenderFunc={ config.editorConfig.customBlockRenderer }
                        toolbar={ config.editorToolbar } />
                </DialogContent>
                <DialogActions>
                    { !fullScreen && <Button
                        autoFocus
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button> }
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>

    );
}

DescriptionModal.defaultProps = {
    title: 'Edit Answer',
    newAnswer: false,
    fullScreen: false,
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
