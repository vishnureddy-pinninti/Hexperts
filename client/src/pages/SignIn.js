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
            margin: theme.spacing(18, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            borderRadius: 2,
            margin: theme.spacing(6, 0, 2),
            justifyContent: 'center',
            fontSize: '1.4em',
        },
        logo: {
            boxShadow: 'none',
            marginTop: '1.5em',
        },
    };
});

const SignIn = (props) => {
    const classes = useStyles();

    return (
        <Grid
            container
            justify="center"
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
                    <Typography
                        component="h1"
                        style={ { color: 'white' } }
                        variant="h5">
                        Log In to
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
                        <Box textAlign='center'>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={ classes.submit }
                                onClick={ props.onLoginClick }>
                                <LockOutlinedIcon className={classes.avatar} /> Hexagon Single Sign On
                            </Button>   
                        </Box>
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
