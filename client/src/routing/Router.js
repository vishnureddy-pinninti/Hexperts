import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import routes from './routes';

const RouteWithSubRoutes = (route) => (
    <Route
        path={ route.path }
        render={ (props) => (
            // pass the sub-routes down to keep nesting
            <route.component
                { ...props }
                onLogout={ route.handleLogout }
                routes={ route.routes } />
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
