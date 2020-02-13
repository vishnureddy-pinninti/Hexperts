import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import { useTheme, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            minWidth: 700,
        },
    };
});


const QuestionModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            style={ { minWidth: 1000 } }
            open={ props.open }
            onClose={ props.handleClose }
            aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">
                Question
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Feel free to ask any anything either technical or domain. Try to choose suggested experts to get an instant answer.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Start your question with 'Why' 'What' 'How' etc."
                    type="email"
                    fullWidth />
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={ props.handleClose }
                    color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={ props.handleClose }
                    color="primary"
                    autoFocus>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QuestionModal;
