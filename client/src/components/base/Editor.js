import { Editor } from 'react-draft-wysiwyg';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AtomicBlockUtils } from 'draft-js';
import { connect } from 'react-redux';

import { uploadImage } from '../../store/actions/auth';

import config from '../../utils/config';

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


const TextEditor = (props) => {
    const classes = useStyles();

    const {
        uploadImage,
        handleEditorStateChange,
        placeholder,
        initialValue,
    } = props;

    const [
        value,
        setValue,
    ] = React.useState(initialValue);

    const onEditorStateChange = (value) => {
        setValue(value);
        handleEditorStateChange(value);
    };

    const setEditorReference = (ref) => {
        if (ref) { ref.focus(); }
    };

    const callback = (res) => {
        const entityData = {
            src: res.path,
            height: 'auto',
            width: 'auto',
        };

        const entityKey = value
            .getCurrentContent()
            .createEntity('IMAGE', 'MUTABLE', entityData)
            .getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            value,
            entityKey,
            ' '
        );
        setValue(newEditorState);
    };

    const handleImageUpload = (files) => {
        const formdata = new FormData();
        formdata.append('file', files[0]);
        uploadImage(formdata, callback);
    };

    const handleDropImageUpload = (se, files) => {
        const formdata = new FormData();
        formdata.append('file', files[0]);
        uploadImage(formdata, callback);
    };

    return (
        <Editor
            spellCheck
            placeholder={ placeholder }
            editorState={ value }
            editorRef={ setEditorReference }
            wrapperClassName={ classes.editorWrapper }
            editorClassName={ `${classes.editor} editor-write-mode` }
            onEditorStateChange={ onEditorStateChange }
            toolbarCustomButtons={ config.editorConfig.toolbarCustomButtons }
            customBlockRenderFunc={ config.editorConfig.customBlockRenderer }
            handlePastedFiles={ handleImageUpload }
            handleDroppedFiles={ handleDropImageUpload }
            toolbar={ config.editorToolbar } />
    );
};

TextEditor.defaultProps = {
    placeholder: 'Start typing...',
};

const mapStateToProps = () => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        uploadImage: (body, callback) => {
            dispatch(uploadImage(body, callback));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
