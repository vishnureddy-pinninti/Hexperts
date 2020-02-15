import React, { Component } from 'react';
import { UserAgentApplication } from 'msal';
import { connect } from 'react-redux';

import Router from '../routing/Router';
import config from '../utils/config';
import { getUserDetails } from '../services/authService';
import SignIn from '../pages/SignIn';
import { requestUserSession } from '../store/actions/auth';

class App extends Component {
    constructor(props) {
        super(props);

        this.userAgentApplication = new UserAgentApplication({
            auth: {
                clientId: config.appId,
                redirectUri: config.redirectUri,
                authority: config.authority,
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true,
            },
        });

        const user = this.userAgentApplication.getAccount();

        if (user) {
            // Enhance user object with data from Graph
            this.getUserProfile();
        }
    }

    render() {
        const { user } = this.props;
        if (user.isAuthenticated) {
            return (
                <Router handleLogout={ this.logout } />
            );
        }
        return <SignIn onLoginClick={ this.login } />;
    }

    login = async() => {
        try {
            await this.userAgentApplication.loginPopup(
                {
                    scopes: config.scopes,
                }
            );
            await this.getUserProfile();
        }
        catch (e) {
            return e;
        }
    }

    logout = () => {
        this.userAgentApplication.logout();
    }

    getUserProfile = async() => {
        try {
            const accessToken = await this.userAgentApplication.acquireTokenSilent({
                scopes: config.scopes,
            });

            if (accessToken) {
            // Get the user's profile from Graph
                const user = await getUserDetails(accessToken);
                this.props.requestUserSession(user);
            }
        }
        catch (err) {
            return err;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestUserSession: (user) => {
            dispatch(requestUserSession(user));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
