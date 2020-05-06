import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import EditIcon from '@material-ui/icons/Edit';
import store from '../store';
import { editCode } from '../store/actions/answer';

function useForceUpdate() {
    const [
        value,
        setValue,
    ] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

const CustomCodeBlock = (props) => {
    const {
        block,
        contentState,
        blockProps: { config },
    } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const {
        language,
        value,
    } = entity.getData();
    const forceUpdate = useForceUpdate();

    const callback = (newData) => {
        forceUpdate();
        const entityKey = block.getEntityAt(0);
        contentState.replaceEntityData(
            entityKey,
            newData
        );
        config.onChange(EditorState.push(config.getEditorState(), contentState, 'change-block-data'));
    };

    const handleClick = () => {
        store.dispatch(editCode({
            open: true,
            language,
            value,
            callback: callback.bind(this),
        }));
    };
    return (
        <>
            <pre className="custom-code-block">
                <div
                    className="rdw-emoji-wrapper"
                    aria-haspopup="true"
                    aria-label="rdw-emoji-control"
                    title="Code Editor"
                    style={ {
                        float: 'right',
                        paddingTop: 5,
                    } }
                    onClick={ handleClick }
                    aria-expanded="false">
                    <div className="rdw-option-wrapper">
                        <EditIcon />
                    </div>
                </div>
                { `<!--code language="${language}">` }
                <br />
                <br />
                { value }
                <br />
                <br />
                { '<!-- end snippet -->' }
            </pre>
        </>

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
                props: {
                    config,
                },
            };
        }
    }
};

export default customBlockRenderer;
