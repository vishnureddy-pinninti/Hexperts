import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CodeIcon from '@material-ui/icons/Code';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-jsx';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import { EditorState, ContentState, ContentBlock, CharacterMetadata,
    genKey } from 'draft-js';
import { List, Map, Repeat } from 'immutable';

import htmlToDraft from 'html-to-draftjs';

import ReactDOMServer from 'react-dom/server';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBlue } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const languages = [
    'javascript',
    'java',
    'python',
    'xml',
    'ruby',
    'mysql',
    'json',
    'html',
    'csharp',
    'typescript',
    'css',
];

languages.forEach((lang) => {
    require(`ace-builds/src-noconflict/mode-${lang}`);
    require(`ace-builds/src-noconflict/snippets/${lang}`);
});

const useStyles = makeStyles((theme) => {
    return {
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            paddingBottom: 10,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    };
});

function testJSON(text) {
    if (typeof text !== 'string') {
        return false;
    }
    try {
        JSON.parse(text);

        return true;
    }
    catch (error) {
        return false;
    }
}

function testXML(text) {
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    try {
        if (doc.body && Array.from(doc.body.childNodes).some((node) => node.nodeName === 'parsererror')) {
            return false;
        }

        return Array.from(doc.childNodes).some((node) => node.nodeType === 1);
    }
    catch (error) {
        return false;
    }
}

function testHTML(text) {
    try {
        const doc = new DOMParser().parseFromString(text, 'text/html');

        return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
    }
    catch (error) {
        return false;
    }
}

function EditorModal(props) {
    const classes = useStyles();

    const {
        title,
        value,
    } = props;

    let languageForEditor = 'none';

    if (testJSON(value)) {
        languageForEditor = 'json';
    }

    if (testHTML(value)) {
        languageForEditor = 'html';
    }

    if (testXML(value)) {
        languageForEditor = 'xml';
    }

    const [
        language,
        setLanguage,
    ] = React.useState(languageForEditor);
    const [
        newValue,
        setNewValue,
    ] = React.useState(value);
    const [
        open,
        setOpen,
    ] = React.useState(false);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleChange = (val) => {
        setNewValue(val);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleSave = () => {
        const { editorState, onChange } = props;
        const html = ReactDOMServer.renderToStaticMarkup(<SyntaxHighlighter
            language={ language }
            style={ tomorrowNightBlue }>
            { newValue }
                                                         </SyntaxHighlighter>);

        const newBlockMap = htmlToDraft(html);
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const key = selectionState.getAnchorKey();
        const blocksAfter = contentState.getBlockMap().skipUntil((_, k) => k === key)
            .skip(1)
            .toArray();
        const blocksBefore = contentState.getBlockMap().takeUntil((_, k) => k === key)
            .toArray();
        const newBlock = new ContentBlock({
            key: genKey(),
            type: 'customcodeblock',
            characterList: new List(Repeat(CharacterMetadata.create(), newValue.length)),
            text: newValue,
            data: new Map({
                language,
                value: newValue,
                html,
            }),
        });
        blocksBefore.push(newBlock);
        newBlockMap.contentBlocks = blocksBefore
            .concat([ contentState.getBlockForKey(key) ])
            .concat(blocksAfter);
        let newEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(newBlockMap, newBlockMap.entityMap));
        newEditorState = EditorState.moveFocusToEnd(newEditorState);
        onChange(newEditorState);
        setTimeout(() => { setOpen(false); }, 1000);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div
                className="rdw-emoji-wrapper"
                aria-haspopup="true"
                aria-label="rdw-emoji-control"
                title="Code"
                onClick={ handleOpen }
                aria-expanded="false">
                <div className="rdw-option-wrapper">
                    <CodeIcon />
                </div>
            </div>
            <Dialog
                open={ open }
                onClose={ handleClose }
                scroll="body"
                fullWidth
                maxWidth="md"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description">
                <DialogTitle id="scroll-dialog-title">
                    { title }
                </DialogTitle>
                <DialogContent dividers>
                    <FormControl
                        className={ classes.formControl }>
                        <InputLabel id="demo-simple-select-outlined-label">Language</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={ language }
                            onChange={ handleLanguageChange }
                            label="Language">
                            <MenuItem value="none">
                                <em>None</em>
                            </MenuItem>
                            { languages.map((lang) => (
                                <MenuItem
                                    key={ lang }
                                    value={ lang }>
                                    { lang }
                                </MenuItem>
                            )) }
                        </Select>
                    </FormControl>
                    <AceEditor
                        placeholder="Start typing..."
                        mode={ language }
                        name="editor"
                        theme="github"
                        onChange={ handleChange }
                        fontSize={ 14 }
                        width="100%"
                        showPrintMargin
                        showGutter
                        highlightActiveLine
                        value={ newValue }
                        setOptions={ {
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: true,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
                        } } />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={ handleSave }
                        variant="contained"
                        color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

EditorModal.defaultProps = {
    title: 'Editor',
};

EditorModal.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
    value: PropTypes.func,
};

export default EditorModal;
