import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';
import React from 'react';
import uploadImageCallBack from './upload';
import customBlockRenderer from './customBlockRenderer';
import Code from '../components/base/CodeEditor';

const blockRenderMap = Map({
    customcodeblock: {
        element: 'pre',
    },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export default {
    authority: 'https://login.microsoftonline.com/1b16ab3e-b8f6-4fe3-9f3e-2db7fe549f6a',
    appId: 'af415683-f04d-43f7-9c4d-d1b661963f42',
    redirectUri: window.location.origin,
    socketUri: window.location.hostname === 'localhost' ? 'http://localhost:1515' : window.location.origin,
    scopes: [
        'user.read',
        'User.ReadBasic.All',
    ],
    editorConfig: {
        extendedBlockRenderMap,
        customBlockRenderer,
        toolbarCustomButtons: [ <Code key="1" /> ],
    },
    editorToolbar: {
        options: [
            'fontSize',
            'fontFamily',
            'colorPicker',
            'blockType',
            'inline',
            'list',
            'textAlign',
            'link',
            'remove',
            'history',
            'embedded',
            'emoji',
            'image',
        ],
        blockType: {
            inDropdown: false,
            options: [
                'Normal',
                'H1',
                'H2',
                'Blockquote',
                'atomic',
            ],
        },
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        image: {
            previewImage: true,
            uploadCallback: uploadImageCallBack,
            alt: {
                present: true,
                mandatory: false,
            },
        },
    },
};
