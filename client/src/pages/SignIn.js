import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

function Copyright() {
    return (
        <Typography
            variant="body2"
            style={ { color: 'white' } }
            align="center">
            { 'Copyright © ' }
            <Link
                color="inherit"
                href="https://hexagon.com/">
                Hexagon
            </Link>
            { ' ' }
            { new Date().getFullYear() }
            { '.' }
        </Typography>
    );
}

const useStyles = makeStyles((theme) => {
    return {
        root: {
            height: '100vh',
        },
        login: {
            backgroundColor: '#046080',
            // backgroundImage: 'url(/hexagon-bg.png)',
            // backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        image: {
            backgroundImage: 'url(/login-bg.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        paper: {
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        logo: {
            boxShadow: 'none',
        },
    };
});

const SignIn = (props) => {
    const classes = useStyles();

    return (
        <Grid
            container
            component="main"
            className={ classes.root }>
            <CssBaseline />
            <Grid
                item
                xs={ false }
                sm={ 4 }
                md={ 7 }
                className={ classes.image } />
            <Grid
                item
                xs={ 12 }
                sm={ 8 }
                md={ 5 }
                component={ Paper }
                className={ classes.login }
                elevation={ 6 }
                square>
                <div className={ classes.paper }>
                    <Avatar className={ classes.avatar }>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        style={ { color: 'white' } }
                        variant="h5">
                        Sign in
                    </Typography>
                    <div className={ classes.logo }>
                        <img
                            src="/logo.png"
                            width={ 200 }
                            alt="logo" />
                    </div>
                    <form
                        className={ classes.form }
                        noValidate>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={ classes.submit }
                            onClick={ props.onLoginClick }>
                            Login with Hexagon
                        </Button>
                        <Box mt={ 5 }>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

export default SignIn;
