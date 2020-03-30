import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

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

export default function DescriptionModal(props) {
    const classes = useStyles();
    const {
        question,
        handleClose,
        open,
    } = props;

    const [
        description,
        setDescription,
    ] = React.useState(null);

    const onEditorStateChange = (value) => {
        setDescription(value);
    };

    const setEditorReference = (ref) => {
        if (ref) { ref.focus(); }
    };

    const addDescriptionToQuestion = () => {
        const { handleDone } = props;
        if (handleDone){
            handleDone(draftToHtml(convertToRaw(description.getCurrentContent())));
        }
    };

    return (
        <div>
            <Dialog
                scroll="paper"
                maxWidth="md"
                open={ open }
                onClose={ handleClose }>
                <DialogTitle
                    id="draggable-dialog-title">
                    Description
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Make sure this question has the right description:
                        { ' ' }
                        <b>
                            { question }
                        </b>
                    </DialogContentText>
                    <Editor
                        editorState={ description }
                        editorRef={ setEditorReference }
                        wrapperClassName={ classes.editorWrapper }
                        editorClassName={ classes.editor }
                        onEditorStateChange={ onEditorStateChange }
                        toolbar={ {
                            blockType: { inDropdown: false },
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },
                            image: {
                                defaultSize: {
                                    height: '100%',
                                    width: '100%',
                                },
                            },
                        } } />

                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        varaint="contained"
                        onClick={ addDescriptionToQuestion }
                        color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
