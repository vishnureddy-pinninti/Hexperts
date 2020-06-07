import { Entity, Modifier, EditorState } from 'draft-js';

const addSuggestion = (obj) => {
    const {
        editorState,
        start,
        end,
        trigger,
        suggestion,
    } = obj;
    const { value, url, text } = suggestion;

    const entityKey = Entity.create('MENTION', 'IMMUTABLE', {
        text: `${trigger}${text}`,
        value,
        url,
    });
    const currentSelectionState = editorState.getSelection();
    const mentionTextSelection = currentSelectionState.merge({
        anchorOffset: start,
        focusOffset: end,
    });

    let insertingContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        mentionTextSelection,
        `${trigger}${text}`, [ 'link' ],
        entityKey
    );

    const blockKey = mentionTextSelection.getAnchorKey();
    const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey)
        .getLength();
    if (blockSize === end) {
        insertingContent = Modifier.insertText(
            insertingContent,
            insertingContent.getSelectionAfter(),
            ' '
        );
    }

    const newEditorState = EditorState.push(
        editorState,
        insertingContent,
        'insert-mention'
    );

    return EditorState.forceSelection(newEditorState, insertingContent.getSelectionAfter());
};

export default addSuggestion;
