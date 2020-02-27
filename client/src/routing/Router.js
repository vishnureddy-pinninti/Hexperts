import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import TopBar from '../components/base/TopBar';
import routes from './routes';

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
            <div style={ { backgroundColor: '#fafafa' } }>
                <div id="back-to-top-anchor" />
                <TopBar onLogout={ route.handleLogout } />

                <route.component
                    { ...props }
                    routes={ route.routes } />

                <ScrollTop { ...props }>
                    <Fab
                        color="secondary"
                        size="small"
                        aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
            </div>
        ) } />
);

const Router = (props) => (
    <BrowserRouter>
        <Switch>
            { routes.map((route) => (
                <RouteWithSubRoutes
                    key={ route.key }
                    { ...props }
                    { ...route } />
            )) }
        </Switch>
    </BrowserRouter>
);

export default Router;
