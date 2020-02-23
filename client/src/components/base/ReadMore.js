import React from 'react';

class ReadMore extends React.Component {
    constructor({ initialHeight }) {
        super();
        this.state = {
            initialHeight,
            maxHeight: initialHeight,
        };
    }

    render() {
        const {
            children,
            readMore,
            blurStyle,
            overhangSize,
        } = this.props;
        const {
            maxHeight,
            initialHeight,
            hideReadMore,
        } = this.state;
        const open = maxHeight !== initialHeight;

        return (
            <>
                <div
                    className="readmore container"
                    style={ {
                        maxHeight: open ? maxHeight : maxHeight - overhangSize,
                        transition: 'max-height .5s ease',
                        position: 'relative',
                        overflow: 'hidden',
                    } }
                    ref={ (el) => (this.container = el) }>
                    { children }
                    { hideReadMore ? null : (
                        <div
                            className="readmore overhang"
                            style={ {
                                transition: 'opacity 0.25s',
                                opacity: open ? 0 : 1,
                                backgroundImage:
                  'linear-gradient(to bottom, rgba(255, 255, 255, 0.44), #ffffff )',
                                content: '',
                                height: `${overhangSize}px`,
                                width: '100%',
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                ...blurStyle,
                            } } />
                    ) }
                </div>

                { hideReadMore
                    ? null
                    : readMore({
                        open,
                        onClick: () => this.toggle(),
                    }) }
            </>
        );
    }

    componentDidMount() {
        if (this.calculateHeight() <= this.props.initialHeight) { this.setState({ hideReadMore: true }); }
    }

    toggle() {
        const { maxHeight, initialHeight } = this.state;

        // if expanded, close it
        if (maxHeight !== initialHeight) { return this.setState({ maxHeight: initialHeight }); }

        const height = this.calculateHeight();

        // set the full height
        this.setState({ maxHeight: height });
    }

    calculateHeight() {
        // calculate height of all the children
        const children = [ ...this.container.children ];
        let height = 0;
        children.forEach((child) => (height += child.offsetHeight));

        return height;
    }
}

ReadMore.defaultProps = {
    overhangSize: 50,
};

export default ReadMore;
