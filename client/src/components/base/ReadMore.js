import React from 'react';
import { withRouter } from 'react-router-dom';
import { autofill } from 'redux-form';

class ReadMore extends React.Component {
    constructor({ initialHeight }) {
        super();
        this.state = {
            initialHeight,
            maxHeight: initialHeight,
            hideReadMore: false,
        };
    }
    

    render() {
        const {
            children,
            readMore,
            blurStyle,
            overhangSize,
            location,
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
                    style={{
                        maxHeight: location.pathname.includes('/post') ? 'none': open ? maxHeight : maxHeight - overhangSize,
                        transition: 'max-height .5s ease',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    onClick={ this.handleMentionClick }
                    ref={ (el) => (this.container = el) }>
                    { children }
                    { (hideReadMore || open) ? null : (
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

    componentDidUpdate(prevProps) {
        const {
            mediaExists,
        } = this.props;

        if (prevProps.mediaExists !== mediaExists) {
            this.toggleReadMore();
        }
    }

    componentDidMount() {
        this.toggleReadMore();
    }

    toggle() {
        const { maxHeight, initialHeight } = this.state;

        // if expanded, close it
        if (maxHeight !== initialHeight) { return this.setState({ maxHeight: initialHeight }); }

        const height = this.calculateHeight();

        // set the full height
        this.setState({ maxHeight: height });
    }

    toggleReadMore = () => {
        const {
            mediaExists,
            initialHeight,
            collapse,
        } = this.props;
        let hideReadMore = false;

        if (!mediaExists && (this.calculateHeight() <= initialHeight)) {
            hideReadMore = true;
        }

        if (!collapse){
            hideReadMore = true;
            const height = this.calculateHeight();

            // set the full height
            this.setState({
                maxHeight: height,
                hideReadMore,
            });
            return;
        }

        this.setState({ hideReadMore });
    }

    calculateHeight() {
        // calculate height of all the children
        const children = [ ...this.container.children ];
        let height = 0;
        children.forEach((child) => (height += child.offsetHeight));
        return height;
    }

    handleMentionClick=(e) => {
        const { history } = this.props;
        if (e.target.classList[0] === 'wysiwyg-mention'){
            history.push(e.target.getAttribute('href'));
            e.preventDefault();
        }
    }
}

ReadMore.defaultProps = {
    overhangSize: 50,
    collapse: true,
};

export default withRouter(ReadMore);
