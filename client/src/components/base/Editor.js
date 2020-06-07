import { Editor } from 'react-draft-wysiwyg';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { AtomicBlockUtils } from 'draft-js';
import * as triggers from './EditorComponents/triggers';
import addSuggestion from './EditorComponents/addsuggestion';
import SuggestionList from './EditorComponents/suggestions';
import { requestUsers } from '../../store/actions/search';

import { uploadImage } from '../../store/actions/auth';

import config from '../../utils/config';

const styles = () => {
    return {
        root: {
            overflow: 'visible',
            marginTop: 10,
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
    };
};


class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue,
            autocompleteState: null,
        };

        this.handleEscape = (e) => {
            const {
                onEscape,
            } = this.props;

            if (!this.getAutocompleteState(false)) {
                if (onEscape) {
                    onEscape(e);
                }
                return;
            }

            e.preventDefault();
            this.onAutocompleteChange(null);
        };

        this.handleTab = (e) => {
            this.commitSelection(e);
        };

        this.onReturn = (e) => this.commitSelection(e);

        this.onAutocompleteChange = (autocompleteState) => {
            this.setState({
                autocompleteState,
            });
        };

        this.onInsert = (state) => {
            const insertState = state;
            insertState.suggestion = {
                value: insertState.selectedItem.options.name,
                url: `/Profile/${insertState.selectedItem._id}`,
            };
            return addSuggestion(insertState);
        };
    }


    render() {
        const {
            uploadImage,
            placeholder,
            fullScreen,
            classes,
        } = this.props;

        const { value } = this.state;

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
            this.setState({ value: newEditorState });
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
            <div>
                { this.renderAutocomplete() }
                <Editor
                    spellCheck
                    placeholder={ placeholder }
                    editorState={ value }
                    editorRef={ setEditorReference }
                    wrapperClassName={ classes.editorWrapper }
                    editorClassName={ `${classes.editor} editor-write-mode ${!fullScreen && classes.modal}` }
                    onEditorStateChange={ this.handleEditorStateChange }
                    toolbarCustomButtons={ config.editorConfig.toolbarCustomButtons }
                    customBlockRenderFunc={ config.editorConfig.customBlockRenderer }
                    handlePastedFiles={ handleImageUpload }
                    handleDroppedFiles={ handleDropImageUpload }
                    handleReturn={ this.onReturn }
                    onEscape={ this.handleEscape }
                    onTab={ this.handleTab }
                    toolbar={ config.editorToolbar } />
            </div>
        );
    }


    renderAutocomplete() {
        const {
            autocompleteState,
        } = this.state;
        if (!autocompleteState) {
            return null;
        }
        return (
            <SuggestionList
                suggestionsState={ autocompleteState }
                handleSuggestionItemClick={ this.onSuggestionItemClick } />
        );
    }

    onSuggestionItemClick = (e, item) => {
        const autocompleteState = this.getAutocompleteState(false);
        if (!autocompleteState) {
            return;
        }
        autocompleteState.selectedItem = item;
        this.setState({ autocompleteState });
        this.commitSelection(e);
    };

    handleEditorStateChange = (value) => {
        const { handleEditorStateChange } = this.props;
        this.setState({ value });
        handleEditorStateChange(value);
        window.requestAnimationFrame(() => {
            this.getAutocompleteState();
        });
    };

    commitSelection(e) {
        const autocompleteState = this.getAutocompleteState(false);
        if (!autocompleteState) {
            return false;
        }
        e.preventDefault();
        if (autocompleteState.selectedItem){
            this.onMentionSelect();
        }
        this.onAutocompleteChange(null);
        return true;
    }

    onMentionSelect() {
        const autocompleteState = this.getAutocompleteState(false);
        const insertState = this.getInsertState(autocompleteState.selectedItem, autocompleteState.trigger);
        const newEditorState = this.onInsert(insertState);
        this.handleEditorStateChange(newEditorState);
    }

    getInsertState(selectedItem, trigger) {
        const {
            value: editorState,
        } = this.state;
        const currentSelectionState = editorState.getSelection();
        const end = currentSelectionState.getAnchorOffset();
        const anchorKey = currentSelectionState.getAnchorKey();
        const currentContent = editorState.getCurrentContent();
        const currentBlock = currentContent.getBlockForKey(anchorKey);
        const blockText = currentBlock.getText();
        const start = blockText.substring(0, end).lastIndexOf(trigger);
        return {
            editorState,
            start,
            end,
            trigger,
            selectedItem,
        };
    }

    hasEntityAtSelection() {
        const {
            value: editorState,
        } = this.state;

        const selection = editorState.getSelection();
        if (!selection.getHasFocus()) {
            return false;
        }

        const contentState = editorState.getCurrentContent();
        const block = contentState.getBlockForKey(selection.getStartKey());
        return !!block.getEntityAt(selection.getStartOffset() - 1);
    }

    getAutocompleteRange(trigger) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            return null;
        }

        if (this.hasEntityAtSelection()) {
            return null;
        }

        const range = selection.getRangeAt(0);
        let text = range.startContainer.textContent;
        text = text.substring(0, range.startOffset);
        const index = text.lastIndexOf(trigger);
        if (index === -1) {
            return null;
        }
        text = text.substring(index);
        return {
            text,
            start: index,
            end: range.startOffset,
        };
    }

    getAutocompleteState(invalidate = true) {
        const { autocompleteState } = this.state;
        if (!invalidate) {
            return autocompleteState;
        }

        let type = null;
        let trigger = null;
        const tagRange = this.getAutocompleteRange(triggers.TAG_TRIGGER);
        const personRange = this.getAutocompleteRange(triggers.PERSON_TRIGGER);
        if (!tagRange && !personRange) {
            return null;
        }
        let range = null;
        if (!tagRange) {
            range = personRange;
            type = triggers.PERSON;
            trigger = triggers.PERSON_TRIGGER;
        }

        if (!personRange) {
            range = tagRange;
            type = triggers.TAG;
            trigger = triggers.TAG_TRIGGER;
        }

        if (!range) {
            range = tagRange.start > personRange.start ? tagRange : personRange;
            type = tagRange.start > personRange.start ? triggers.TAG : triggers.PERSON;
            trigger = tagRange.start > personRange.start ? triggers.TAG_TRIGGER : triggers.PERSON_TRIGGER;
        }

        const tempRange = window.getSelection().getRangeAt(0)
            .cloneRange();
        tempRange.setStart(tempRange.startContainer, range.start);

        const rangeRect = tempRange.getBoundingClientRect();
        const [
            left,
            top,
        ] = [
            rangeRect.left,
            rangeRect.bottom,
        ];

        const addUsers = (res) => {
            this.onAutocompleteChange({
                trigger,
                type,
                left,
                top,
                text: range.text,
                selectedItem: res.results.length ? res.results[0] : null,
                array: res.results,
            });
        };

        const { requestUsers } = this.props;
        requestUsers({
            user: range.text.replace(triggers.regExByType(type), ''),
        }, addUsers);

        return null;
    }
}

TextEditor.defaultProps = {
    placeholder: 'Start typing...',
    fullScreen: false,
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
        requestUsers: (body, callback) => {
            dispatch(requestUsers(body, callback));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TextEditor));
