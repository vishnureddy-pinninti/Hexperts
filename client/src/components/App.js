import React, { Component } from 'react';
import { UserAgentApplication } from 'msal';
import { connect } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import SignIn from '../pages/SignIn';
import { authService } from '../services/authService';
import config from '../utils/config';
import Router from '../routing/Router';


import { requestUserSession } from '../store/actions/auth';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#4ec53a',
            main: '#52B18E',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f7941e',
            contrastText: '#ffffff',
        },
    },
    typography: {
        button: {
            textTransform: 'none',
            main: '#4ec53a',
        },
    },
});


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
        };

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
        const { loading } = this.state;
        if (loading){
            return (
                <ThemeProvider theme={ theme }>
                    <LinearProgress color="secondary" />
                </ThemeProvider>
            );
        }
        return (
            <ThemeProvider theme={ theme }>
                { user.isAuthenticated
                    ? <Router handleLogout={ this.logout } />
                    : <SignIn onLoginClick={ this.login } /> }
            </ThemeProvider>
        );
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
                const user = await authService.getUserDetails(accessToken);
                this.props.requestUserSession(user, () => {
                    this.setState({ loading: false });
                });
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
        requestUserSession: (user, cb) => {
            dispatch(requestUserSession(user, cb));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
