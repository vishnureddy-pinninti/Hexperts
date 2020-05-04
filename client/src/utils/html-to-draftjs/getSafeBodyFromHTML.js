const getSafeBodyFromHTML = (html: string): ?Element => {
    let doc;
    let root = null;
    if (
        document.implementation
    && document.implementation.createHTMLDocument
    ) {
        doc = document.implementation.createHTMLDocument('foo');
        doc.documentElement.innerHTML = html;
        root = doc.getElementsByTagName('body')[0];
    }
    return root;
};

export default getSafeBodyFromHTML;
