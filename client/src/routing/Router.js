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
                routes={ route.routes } />
        ) } />
);

const Router = () => (
    <BrowserRouter>
        <Switch>
            { routes.map((route) => (
                <RouteWithSubRoutes
                    key={ route.key }
                    { ...route } />
            )) }
        </Switch>
    </BrowserRouter>
);

export default Router;
