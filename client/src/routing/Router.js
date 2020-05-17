import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { connect } from 'react-redux';
import TopBar from '../components/base/TopBar';
import getRoutes from './routes';
import { requestAddNotification } from '../store/actions/auth';
import config from '../utils/config';
import ErrorBoundary from '../components/base/ErrorBoundary';
import { isAdmin } from '../utils/common';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    };
});

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    };

    return (
        <Zoom in={ trigger }>
            <div
                onClick={ handleClick }
                role="presentation"
                className={ classes.root }>
                { children }
            </div>
        </Zoom>
    );
}


const RouteWithSubRoutes = (route) => (
    <Route
        path={ route.path }
        render={ (props) => (
            // pass the sub-routes down to keep nesting
            <div>
                <div id="back-to-top-anchor" />
                <TopBar onLogout={ route.handleLogout } />

                <ErrorBoundary>
                    <route.component
                        { ...props }
                        onLogout={ route.handleLogout }
                        routes={ route.routes } />

                    <ScrollTop { ...props }>
                        <Fab
                            color="secondary"
                            size="small"
                            aria-label="scroll back to top">
                            <KeyboardArrowUpIcon />
                        </Fab>
                    </ScrollTop>
                </ErrorBoundary>
            </div>
        ) } />
);

class Router extends Component {
    render() {
        const { user } = this.props;
        const routes = getRoutes(isAdmin(user));
        return (
            <ErrorBoundary>
                <BrowserRouter>
                    <Switch>
                        { routes.map((route) => (
                            <RouteWithSubRoutes
                                key={ route.key }
                                { ...this.props }
                                { ...route } />
                        )) }
                    </Switch>
                </BrowserRouter>
            </ErrorBoundary>
        );
    }

    componentDidMount() {
        const socket = socketIOClient(config.socketUri);

        socket.on('notification', (data) => {
            const { recipients, ...rest } = data;
            const recipient = recipients.find((r) => r.user === this.props.userid);

            if (recipient) {
                this.props.requestAddNotification({
                    ...rest,
                    recipient,
                });
            }
        });
    }
}

const mapStateToProps = (state) => {
    return {
        userid: state.user.user._id,
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestAddNotification: (notification) => {
            dispatch(requestAddNotification(notification));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
