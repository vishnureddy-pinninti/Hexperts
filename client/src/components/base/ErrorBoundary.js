import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null,
        };
    }

    render() {
        const {
            errorInfo,
            error,
        } = this.state;

        const { children } = this.props;

        if (errorInfo) {
            return (
                <div style={{ width: '80%', margin: 'auto', marginTop: 100 }}>
                    <h2>Something went wrong.</h2>
                    <details style={ { whiteSpace: 'pre-wrap' } }>
                        { error && error.toString() }
                        <br />
                        { errorInfo.componentStack }
                    </details>
                </div>
            );
        }

        return children;
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
        });
    }
}

export default ErrorBoundary;
