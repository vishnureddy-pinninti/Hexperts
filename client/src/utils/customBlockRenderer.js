import React from 'react';
import { genKey, EditorBlock } from 'draft-js';
import { Map } from 'immutable';

class CustomCodeBlock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <pre
                className="my-custom-block">
                { /* here, this.props.children contains a <section> container, as that was the matching element */ }
                <code>
                    { this.props.blockProps.language }
                </code>
                <EditorBlock
                    { ...this.props } />
            </pre>
        );
    }
}

export const customBlockRenderer = (block, config, editorState) => {
    const type = block.getType();

    if (type === 'customcodeblock') {
        return {
            component: CustomCodeBlock,
            props: {
                language: block.getData().get('language'),
            },
        };
    }
    return undefined;
};

export const stateToHtmlOptions = {
    blockRenderers: {
        customcodeblock: (block) => {
            const data = block.getData();
            return `<customcodeblock language=${data.get('language')} value='${data.get('value')}'>${data.get('html')}</customcodeblock>`;
        },
    },
};

export const convertFromHTMLOptions = {
    htmlToBlock: (nodeName, node) => {
        if (nodeName === 'customcodeblock') {
            const language = node.getAttribute('language');
            const value = node.getAttribute('value');
            return {
                key: genKey(),
                type: 'customcodeblock',
                text: 'value',
                data: new Map({
                    language,
                    value,
                    html: node.innerHTML,
                }),
            };
        }
    },
};
