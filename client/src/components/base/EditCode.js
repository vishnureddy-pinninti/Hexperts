import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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

function EditorModal(props) {
    const classes = useStyles();

    const {
        title,
        value,
        lang,
        open,
        handleClose,
    } = props;

    const [
        language,
        setLanguage,
    ] = React.useState();
    const [
        newValue,
        setNewValue,
    ] = React.useState();

    useEffect(() => {
        setNewValue(value);
        setLanguage(lang);
    }, [
        lang,
        value,
    ]);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleChange = (val) => {
        setNewValue(val);
    };

    const handleSave = () => {
        const {
            handleSave,
        } = props;
        const html = ReactDOMServer.renderToStaticMarkup(<SyntaxHighlighter
            language={ language }
            style={ tomorrowNightBlue }>
            { newValue }
        </SyntaxHighlighter>);

        const entityData = {
            value: newValue.replace(/"/g, '\''),
            language,
            html,
        };

        if (handleSave){
            handleSave(entityData);
        }
    };

    return (
        <>
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
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

EditorModal.defaultProps = {
    title: 'Edit Code',
};

EditorModal.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
    value: PropTypes.func,
};

export default EditorModal;
