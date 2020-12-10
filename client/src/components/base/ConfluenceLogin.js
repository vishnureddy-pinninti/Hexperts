/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { SubmissionError, Field, reduxForm, reset } from 'redux-form';
import { requestConfluenceLogin } from '../../store/actions/auth'


const useStyles = makeStyles(() => {
    return {
        root: {
        },
        avatar: {
            width: '1.5em',
            height: '1.5em',
        },
        loginTitle: {
            fontSize: '2em',
            fontWeight: 'bold',
        }
    };
});

const validate = (values) => {
    const errors = {};
    const requiredFields = [ 'Email', 'Password' ];
    requiredFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });
    return errors;
};

const renderTextField = ({ input , name, label, type }) => (
    <>
    <TextField
        autoComplete="off"
        name={ name }
        margin="dense"
        label={ label }
        type = { type }
        { ...input }
        rows={5}
        required
        fullWidth />
    </>
);

const ConfluenceLoginModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        handleSubmit,
        handleClose,
        requestConfluenceLogin,
        resetConfluenceLogin,
    } = props;

    const [
        disableLogin,
        setDisableLogin
    ] = React.useState(false);

    const [
        isAuthenticationFailed,
        setAuthenticationFailed
    ] = React.useState(false);

    const showError = () => {
        console.log("ShowError")
        setDisableLogin(false);
        setAuthenticationFailed(true);
    }

    const onSubmitConfuence = (values) => {
        setAuthenticationFailed(false);
        setDisableLogin(true);
        requestConfluenceLogin(values, closeConfluenceLoginPopup, showError);

    };

    const closeConfluenceLoginPopup = () => {
        console.log("closeConfluenceLoginPopup")
        setDisableLogin(false);
        resetConfluenceLogin();
        handleClose();
    }

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            open={ props.open }
            scroll="paper"
            onClose={ closeConfluenceLoginPopup }
            aria-labelledby="responsive-dialog-title">
            <form
                id="confluenceLogin"
                onSubmit={ handleSubmit(onSubmitConfuence) }>
                <DialogTitle>
                <ListItem style= {{padding: 0}} >
                    <ListItemAvatar style= {{minWidth: 30}}>
                        <MuiAvatar
                            alt="Confluence Icon"
                            src={ '/confluence-icon.ico' }
                            className={ classes.avatar } />
                    </ListItemAvatar>
                    <ListItemText><span style={{ paddingLeft: '0.5em',fontSize:'1.5em'}}>Geo - Confluence Login</span></ListItemText>
                </ListItem>
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        Feel free to ask any anything either technical or domain. Try to choose suggested experts to get an instant answer.
                    </DialogContentText> */}
                    <Field
                        name="Email"
                        component={ renderTextField }
                        type='text'
                        label='Email' />
                    <Field
                        name="Password"
                        component={ renderTextField }
                        type='password'
                        label='Password' />
                    {isAuthenticationFailed ? 
                    <DialogContentText style={{color: '#ff0000'}}>
                        Username/Password is Invalid!
                    </DialogContentText>: <></>}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        disabled={disableLogin}
                        onClick={ closeConfluenceLoginPopup }
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        disabled={disableLogin}
                        variant="contained"
                        type="submit">
                        Login
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const mapStateToProps = (state) => {
    return {
        confluenceLogin: state.confulenceLogin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestConfluenceLogin: (body, success, error) => {
            dispatch(requestConfluenceLogin(body, success, error));
        },
        resetConfluenceLogin: () => {
            dispatch(reset('confluenceLogin'));
        }
    };
};

export default (reduxForm({
    form: 'confluenceLogin', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(ConfluenceLoginModal)));
