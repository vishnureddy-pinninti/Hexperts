/* @flow */

/**
* Utility function to execute callback for eack key->value pair.
*/
export function forEach(obj, callback) {
    if (obj) {
        for (const key in obj) { // eslint-disable-line no-restricted-syntax
            if ({}.hasOwnProperty.call(obj, key)) {
                callback(key, obj[key]);
            }
        }
    }
}

/**
* The function returns true if the string passed to it has no content.
*/
export function isEmptyString(str) {
    if (str === undefined || str === null || str.length === 0 || str.trim().length === 0) {
        return true;
    }
    return false;
}

/**
* Mapping block-type to corresponding html tag.
*/
const blockTypesMapping = {
    unstyled: 'p',
    'header-one': 'h1',
    'header-two': 'h2',
    'header-three': 'h3',
    'header-four': 'h4',
    'header-five': 'h5',
    'header-six': 'h6',
    'unordered-list-item': 'ul',
    'ordered-list-item': 'ol',
    blockquote: 'blockquote',
    code: 'pre',
};

/**
* Function will return HTML tag for a block.
*/
export function getBlockTag(type) {
    return type && blockTypesMapping[type];
}

/**
* Function will return style string for a block.
*/
export function getBlockStyle(data) {
    let styles = '';
    forEach(data, (key, value) => {
        if (value) {
            styles += `${key}:${value};`;
        }
    });
    return styles;
}

/**
* The function returns an array of hashtag-sections in blocks.
* These will be areas in block which have hashtags applicable to them.
*/
function getHashtagRanges(blockText, hashtagConfig) {
    const sections = [];
    if (hashtagConfig) {
        let counter = 0;
        let startIndex = 0;
        let text = blockText;
        const trigger = hashtagConfig.trigger || '#';
        const separator = hashtagConfig.separator || ' ';
        for (;text.length > 0 && startIndex >= 0;) {
            if (text[0] === trigger) {
                startIndex = 0;
                counter = 0;
                text = text.substr(trigger.length);
            }
            else {
                startIndex = text.indexOf(separator + trigger);
                if (startIndex >= 0) {
                    text = text.substr(startIndex + (separator + trigger).length);
                    counter += startIndex + separator.length;
                }
            }
            if (startIndex >= 0) {
                const endIndex = text.indexOf(separator) >= 0
                    ? text.indexOf(separator)
                    : text.length;
                const hashtag = text.substr(0, endIndex);
                if (hashtag && hashtag.length > 0) {
                    sections.push({
                        offset: counter,
                        length: hashtag.length + trigger.length,
                        type: 'HASHTAG',
                    });
                }
                counter += trigger.length;
            }
        }
    }
    return sections;
}

/**
* The function returns an array of entity-sections in blocks.
* These will be areas in block which have same entity or no entity applicable to them.
*/
function getSections(
    block,
    hashtagConfig,
) {
    const sections = [];
    let lastOffset = 0;
    let sectionRanges = block.entityRanges.map((range) => {
        const {
            offset,
            length,
            key,
        } = range;
        return {
            offset,
            length,
            key,
            type: 'ENTITY',
        };
    });
    sectionRanges = sectionRanges.concat(getHashtagRanges(block.text, hashtagConfig));
    sectionRanges = sectionRanges.sort((s1, s2) => s1.offset - s2.offset);
    sectionRanges.forEach((r) => {
        if (r.offset > lastOffset) {
            sections.push({
                start: lastOffset,
                end: r.offset,
            });
        }
        sections.push({
            start: r.offset,
            end: r.offset + r.length,
            entityKey: r.key,
            type: r.type,
        });
        lastOffset = r.offset + r.length;
    });
    if (lastOffset < block.text.length) {
        sections.push({
            start: lastOffset,
            end: block.text.length,
        });
    }
    return sections;
}

/**
* Function to check if the block is an atomic entity block.
*/
function isAtomicEntityBlock(block) {
    if (block.entityRanges.length > 0 && (isEmptyString(block.text)
    || block.type === 'atomic')) {
        return true;
    }
    return false;
}

/**
* The function will return array of inline styles applicable to the block.
*/
function getStyleArrayForBlock(block) {
    const { text, inlineStyleRanges } = block;
    const inlineStyles = {
        BOLD: new Array(text.length),
        ITALIC: new Array(text.length),
        UNDERLINE: new Array(text.length),
        STRIKETHROUGH: new Array(text.length),
        CODE: new Array(text.length),
        SUPERSCRIPT: new Array(text.length),
        SUBSCRIPT: new Array(text.length),
        COLOR: new Array(text.length),
        BGCOLOR: new Array(text.length),
        FONTSIZE: new Array(text.length),
        FONTFAMILY: new Array(text.length),
        length: text.length,
    };
    if (inlineStyleRanges && inlineStyleRanges.length > 0) {
        inlineStyleRanges.forEach((range) => {
            const { offset } = range;
            const length = offset + range.length;
            for (let i = offset; i < length; i += 1) {
                if (range.style.indexOf('color-') === 0) {
                    inlineStyles.COLOR[i] = range.style.substring(6);
                }
                else if (range.style.indexOf('bgcolor-') === 0) {
                    inlineStyles.BGCOLOR[i] = range.style.substring(8);
                }
                else if (range.style.indexOf('fontsize-') === 0) {
                    inlineStyles.FONTSIZE[i] = range.style.substring(9);
                }
                else if (range.style.indexOf('fontfamily-') === 0) {
                    inlineStyles.FONTFAMILY[i] = range.style.substring(11);
                }
                else if (inlineStyles[range.style]) {
                    inlineStyles[range.style][i] = true;
                }
            }
        });
    }
    return inlineStyles;
}

/**
* The function will return inline style applicable at some offset within a block.
*/
export function getStylesAtOffset(inlineStyles, offset) {
    const styles = {};
    if (inlineStyles.COLOR[offset]) {
        styles.COLOR = inlineStyles.COLOR[offset];
    }
    if (inlineStyles.BGCOLOR[offset]) {
        styles.BGCOLOR = inlineStyles.BGCOLOR[offset];
    }
    if (inlineStyles.FONTSIZE[offset]) {
        styles.FONTSIZE = inlineStyles.FONTSIZE[offset];
    }
    if (inlineStyles.FONTFAMILY[offset]) {
        styles.FONTFAMILY = inlineStyles.FONTFAMILY[offset];
    }
    if (inlineStyles.UNDERLINE[offset]) {
        styles.UNDERLINE = true;
    }
    if (inlineStyles.ITALIC[offset]) {
        styles.ITALIC = true;
    }
    if (inlineStyles.BOLD[offset]) {
        styles.BOLD = true;
    }
    if (inlineStyles.STRIKETHROUGH[offset]) {
        styles.STRIKETHROUGH = true;
    }
    if (inlineStyles.CODE[offset]) {
        styles.CODE = true;
    }
    if (inlineStyles.SUBSCRIPT[offset]) {
        styles.SUBSCRIPT = true;
    }
    if (inlineStyles.SUPERSCRIPT[offset]) {
        styles.SUPERSCRIPT = true;
    }
    return styles;
}

/**
* Function returns true for a set of styles if the value of these styles at an offset
* are same as that on the previous offset.
*/
export function sameStyleAsPrevious(
    inlineStyles,
    styles,
    index,
) {
    let sameStyled = true;
    if (index > 0 && index < inlineStyles.length) {
        styles.forEach((style) => {
            sameStyled = sameStyled && inlineStyles[style][index] === inlineStyles[style][index - 1];
        });
    }
    else {
        sameStyled = false;
    }
    return sameStyled;
}

/**
* Function returns html for text depending on inline style tags applicable to it.
*/
export function addInlineStyleMarkup(style, content) {
    if (style === 'BOLD') {
        return `<strong>${content}</strong>`;
    } if (style === 'ITALIC') {
        return `<em>${content}</em>`;
    } if (style === 'UNDERLINE') {
        return `<ins>${content}</ins>`;
    } if (style === 'STRIKETHROUGH') {
        return `<del>${content}</del>`;
    } if (style === 'CODE') {
        return `<code>${content}</code>`;
    } if (style === 'SUPERSCRIPT') {
        return `<sup>${content}</sup>`;
    } if (style === 'SUBSCRIPT') {
        return `<sub>${content}</sub>`;
    }
    return content;
}

/**
* The function returns text for given section of block after doing required character replacements.
*/
function getSectionText(text) {
    if (text && text.length > 0) {
        const chars = text.map((ch) => {
            switch (ch) {
                case '\n':
                    return '<br>';
                case '&':
                    return '&amp;';
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                default:
                    return ch;
            }
        });
        return chars.join('');
    }
    return '';
}

/**
* Function returns html for text depending on inline style tags applicable to it.
*/
export function addStylePropertyMarkup(styles, text) {
    if (styles && (styles.COLOR || styles.BGCOLOR || styles.FONTSIZE || styles.FONTFAMILY)) {
        let styleString = 'style="';
        if (styles.COLOR) {
            styleString += `color: ${styles.COLOR};`;
        }
        if (styles.BGCOLOR) {
            styleString += `background-color: ${styles.BGCOLOR};`;
        }
        if (styles.FONTSIZE) {
            styleString += `font-size: ${styles.FONTSIZE}${/^\d+$/.test(styles.FONTSIZE) ? 'px' : ''};`;
        }
        if (styles.FONTFAMILY) {
            styleString += `font-family: ${styles.FONTFAMILY};`;
        }
        styleString += '"';
        return `<span ${styleString}>${text}</span>`;
    }
    return text;
}

/**
* Function will return markup for Entity.
*/
function getEntityMarkup(
    entityMap,
    entityKey,
    text,
    customEntityTransform,
) {
    const entity = entityMap[entityKey];
    if (typeof customEntityTransform === 'function') {
        const html = customEntityTransform(entity, text);
        if (html) {
            return html;
        }
    }
    if (entity.type === 'MENTION') {
        return `<a href="${entity.data.url}" class="wysiwyg-mention" data-mention data-value="${entity.data.value}">${text}</a>`;
    }
    if (entity.type === 'LINK') {
        const targetOption = entity.data.targetOption || '_self';
        return `<a href="${entity.data.url}" target="${targetOption}">${text}</a>`;
    }
    if (entity.type === 'IMAGE') {
        const { alignment } = entity.data;
        if (alignment && alignment.length) {
            return `<div style="text-align:${alignment};"><img src="${entity.data.src}" alt="${entity.data.alt}" style="height: ${entity.data.height};width: ${entity.data.width}"/></div>`;
        }
        return `<img src="${entity.data.src}" alt="${entity.data.alt}" style="height: ${entity.data.height};width: ${entity.data.width}"/>`;
    }
    if (entity.type === 'EMBEDDED_LINK') {
        return `<iframe width="${entity.data.width}" height="${entity.data.height}" src="${entity.data.src}" frameBorder="0"></iframe>`;
    }
    if (entity.type === 'CUSTOMCODE') {
        return `<customcodeblock language=${entity.data.language} value="${entity.data.value}">${entity.data.html}</customcodeblock>`;
    }
    return text;
}

/**
* For a given section in a block the function will return a further list of sections,
* with similar inline styles applicable to them.
*/
function getInlineStyleSections(
    block,
    styles,
    start,
    end,
) {
    const styleSections = [];
    const text = Array.from(block.text);
    if (text.length > 0) {
        const inlineStyles = getStyleArrayForBlock(block);
        let section;
        for (let i = start; i < end; i += 1) {
            if (i !== start && sameStyleAsPrevious(inlineStyles, styles, i)) {
                section.text.push(text[i]);
                section.end = i + 1;
            }
            else {
                section = {
                    styles: getStylesAtOffset(inlineStyles, i),
                    text: [ text[i] ],
                    start: i,
                    end: i + 1,
                };
                styleSections.push(section);
            }
        }
    }
    return styleSections;
}

/**
* Replace leading blank spaces by &nbsp;
*/
export function trimLeadingZeros(sectionText) {
    if (sectionText) {
        let replacedText = sectionText;
        for (let i = 0; i < replacedText.length; i += 1) {
            if (sectionText[i] === ' ') {
                replacedText = replacedText.replace(' ', '&nbsp;');
            }
            else {
                break;
            }
        }
        return replacedText;
    }
    return sectionText;
}

/**
* Replace trailing blank spaces by &nbsp;
*/
export function trimTrailingZeros(sectionText) {
    if (sectionText) {
        let replacedText = sectionText;
        for (let i = replacedText.length - 1; i >= 0; i -= 1) {
            if (replacedText[i] === ' ') {
                replacedText = `${replacedText.substring(0, i)}&nbsp;${replacedText.substring(i + 1)}`;
            }
            else {
                break;
            }
        }
        return replacedText;
    }
    return sectionText;
}

/**
* The method returns markup for section to which inline styles
* like BOLD, ITALIC, UNDERLINE, STRIKETHROUGH, CODE, SUPERSCRIPT, SUBSCRIPT are applicable.
*/
function getStyleTagSectionMarkup(styleSection) {
    const { styles, text } = styleSection;
    let content = getSectionText(text);
    forEach(styles, (style, value) => {
        content = addInlineStyleMarkup(style, content, value);
    });
    return content;
}


/**
* The method returns markup for section to which inline styles
like color, background-color, font-size are applicable.
*/
function getInlineStyleSectionMarkup(block, styleSection) {
    const styleTagSections = getInlineStyleSections(block, [
        'BOLD',
        'ITALIC',
        'UNDERLINE',
        'STRIKETHROUGH',
        'CODE',
        'SUPERSCRIPT',
        'SUBSCRIPT',
    ], styleSection.start, styleSection.end);
    let styleSectionText = '';
    styleTagSections.forEach((stylePropertySection) => {
        styleSectionText += getStyleTagSectionMarkup(stylePropertySection);
    });
    styleSectionText = addStylePropertyMarkup(styleSection.styles, styleSectionText);
    return styleSectionText;
}

/*
* The method returns markup for an entity section.
* An entity section is a continuous section in a block
* to which same entity or no entity is applicable.
*/
function getSectionMarkup(
    block,
    entityMap,
    section,
    customEntityTransform,
) {
    const entityInlineMarkup = [];
    const inlineStyleSections = getInlineStyleSections(
        block,
        [
            'COLOR',
            'BGCOLOR',
            'FONTSIZE',
            'FONTFAMILY',
        ],
        section.start,
        section.end,
    );
    inlineStyleSections.forEach((styleSection) => {
        entityInlineMarkup.push(getInlineStyleSectionMarkup(block, styleSection));
    });
    let sectionText = entityInlineMarkup.join('');
    if (section.type === 'ENTITY') {
        if (section.entityKey !== undefined && section.entityKey !== null) {
            sectionText = getEntityMarkup(entityMap, section.entityKey, sectionText, customEntityTransform); // eslint-disable-line max-len
        }
    }
    else if (section.type === 'HASHTAG') {
        sectionText = `<a href="${sectionText}" class="wysiwyg-hashtag">${sectionText}</a>`;
    }
    return sectionText;
}

/**
* Function will return the markup for block preserving the inline styles and
* special characters like newlines or blank spaces.
*/
export function getBlockInnerMarkup(
    block,
    entityMap,
    hashtagConfig,
    customEntityTransform,
) {
    const blockMarkup = [];
    const sections = getSections(block, hashtagConfig);
    sections.forEach((section, index) => {
        let sectionText = getSectionMarkup(block, entityMap, section, customEntityTransform);
        if (index === 0) {
            sectionText = trimLeadingZeros(sectionText);
        }
        if (index === sections.length - 1) {
            sectionText = trimTrailingZeros(sectionText);
        }
        blockMarkup.push(sectionText);
    });
    return blockMarkup.join('');
}

/**
* Function will return html for the block.
*/
export function getBlockMarkup(
    block,
    entityMap,
    hashtagConfig,
    directional,
    customEntityTransform,
) {
    const blockHtml = [];
    if (isAtomicEntityBlock(block)) {
        blockHtml.push(getEntityMarkup(
            entityMap,
            block.entityRanges[0].key,
            undefined,
            customEntityTransform,
        ));
    }
    else {
        const blockTag = getBlockTag(block.type);
        if (blockTag){
            blockHtml.push(`<${blockTag}`);
            const blockStyle = getBlockStyle(block.data);
            if (blockStyle) {
                blockHtml.push(` style="${blockStyle}"`);
            }
            if (directional) {
                blockHtml.push(' dir = "auto"');
            }
            blockHtml.push('>');
            blockHtml.push(getBlockInnerMarkup(block, entityMap, hashtagConfig, customEntityTransform));
            blockHtml.push(`</${blockTag}>`);
        }
    }
    blockHtml.push('\n');
    return blockHtml.join('');
}

/**
* Function to check if a block is of type list.
*/
export function isList(blockType) {
    return (
        blockType === 'unordered-list-item'
    || blockType === 'ordered-list-item'
    );
}

/**
* Function will return html markup for a list block.
*/
export function getListMarkup(
    listBlocks,
    entityMap,
    hashtagConfig,
    directional,
    customEntityTransform,
) {
    const listHtml = [];
    let nestedListBlock = [];
    let previousBlock;
    listBlocks.forEach((block) => {
        let nestedBlock = false;
        if (!previousBlock) {
            listHtml.push(`<${getBlockTag(block.type)}>\n`);
        }
        else if (previousBlock.type !== block.type) {
            listHtml.push(`</${getBlockTag(previousBlock.type)}>\n`);
            listHtml.push(`<${getBlockTag(block.type)}>\n`);
        }
        else if (previousBlock.depth === block.depth) {
            if (nestedListBlock && nestedListBlock.length > 0) {
                listHtml.push(getListMarkup(
                    nestedListBlock,
                    entityMap,
                    hashtagConfig,
                    directional,
                    customEntityTransform,
                ));
                nestedListBlock = [];
            }
        }
        else {
            nestedBlock = true;
            nestedListBlock.push(block);
        }
        if (!nestedBlock) {
            listHtml.push('<li');
            const blockStyle = getBlockStyle(block.data);
            if (blockStyle) {
                listHtml.push(` style="${blockStyle}"`);
            }
            if (directional) {
                listHtml.push(' dir = "auto"');
            }
            listHtml.push('>');
            listHtml.push(getBlockInnerMarkup(
                block,
                entityMap,
                hashtagConfig,
                customEntityTransform,
            ));
            listHtml.push('</li>\n');
            previousBlock = block;
        }
    });
    if (nestedListBlock && nestedListBlock.length > 0) {
        listHtml.push(getListMarkup(
            nestedListBlock,
            entityMap,
            hashtagConfig,
            directional,
            customEntityTransform,
        ));
    }
    listHtml.push(`</${getBlockTag(previousBlock.type)}>\n`);
    return listHtml.join('');
}

/**
* The function will generate html markup for given draftjs editorContent.
*/
export default function draftToHtml(
    editorContent,
    hashtagConfig,
    directional,
    customEntityTransform,
) {
    const html = [];
    if (editorContent) {
        const { blocks, entityMap } = editorContent;
        if (blocks && blocks.length > 0) {
            let listBlocks = [];
            blocks.forEach((block) => {
                if (isList(block.type)) {
                    listBlocks.push(block);
                }
                else {
                    if (listBlocks.length > 0) {
                        const listHtml = getListMarkup(listBlocks, entityMap, hashtagConfig, customEntityTransform); // eslint-disable-line max-len
                        html.push(listHtml);
                        listBlocks = [];
                    }
                    const blockHtml = getBlockMarkup(
                        block,
                        entityMap,
                        hashtagConfig,
                        directional,
                        customEntityTransform,
                    );
                    html.push(blockHtml);
                }
            });
            if (listBlocks.length > 0) {
                const listHtml = getListMarkup(listBlocks, entityMap, hashtagConfig, directional, customEntityTransform); // eslint-disable-line max-len
                html.push(listHtml);
                listBlocks = [];
            }
        }
    }
    return html.join('');
}
