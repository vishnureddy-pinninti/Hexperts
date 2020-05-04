import React from 'react';

const CustomCodeBlock = ({ block, contentState }) => {
    const entity = contentState.getEntity(block.getEntityAt(0));
    const {
        language,
        value,
    } = entity.getData();
    return (
        <pre className="custom-code-block">
            { `<!--code language="${language}">` }
            <br />
            <br />
            { value }
            <br />
            <br />
            { '<!-- end snippet -->' }
        </pre>
    );
};

const customBlockRenderer = (block, config) => {
    if (block.getType() === 'atomic') {
        const contentState = config.getEditorState().getCurrentContent();
        const entity = contentState.getEntity(block.getEntityAt(0));
        if (entity && entity.type === 'CUSTOMCODE') {
            return {
                component: CustomCodeBlock,
                editable: false,
            };
        }
    }
};

export default customBlockRenderer;
