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
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { addUserQuestion } from '../../store/actions/questions';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            minWidth: 700,
        },
    };
});

const validate = (values) => {
    const errors = {};
    const requiredFields = [ 'question' ];
    requiredFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });
    return errors;
};


const EditTopicsModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addUserQuestion,
        handleSubmit,
        question,
        questionID,
    } = props;

    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            autoFocus
            margin="dense"
            id="name"
            label="Start your question with 'Why' 'What' 'How' etc."
            type="text"
            required
            fullWidth />
    );

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            style={ { minWidth: 1000 } }
            open={ props.open }
            onClose={ props.handleClose }
            aria-labelledby="responsive-dialog-title">
            <form
                id="question"
                onSubmit={ handleSubmit(addUserQuestion) }>
                <DialogTitle id="responsive-dialog-title">
                    Edit Topics
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Make sure this question has the right topics:
                        { ' ' }
                        <b>
                            { question }
                        </b>
                    </DialogContentText>
                    <Field
                        name="question"
                        component={ renderTextField } />
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={ props.handleClose }
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        type="submit">
                        Done
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addUserQuestion: (body, callback) => {
            dispatch(addUserQuestion(body, callback));
        },
    };
};

export default reduxForm({
    form: 'topic', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(EditTopicsModal));
