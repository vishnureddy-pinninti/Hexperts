export default {
    authority: 'https://login.microsoftonline.com/1b16ab3e-b8f6-4fe3-9f3e-2db7fe549f6a',
    appId: 'af415683-f04d-43f7-9c4d-d1b661963f42',
    redirectUri: process.env.NODE_ENV === 'production' ? 'https://hexpert.ingrnet.com' : 'http://localhost:3000',
    socketUri: process.env.NODE_ENV === 'production' ? 'https://hexpert.ingrnet.com' : 'http://localhost:1515',
    scopes: [
        'user.read',
        'User.ReadBasic.All',
    ],
    blockTypeOptions: ['Normal', 'H1', 'H2', 'Blockquote', 'Code'],
    toolbarOptions: ['fontSize', 'fontFamily', 'colorPicker', 'blockType', 'inline', 'list', 'textAlign', 'link', 'remove', 'history', 'embedded', 'emoji', 'image'],
};

// production https://hexpert.ingrnet.com
// QA https://192.168.116.118:1515
