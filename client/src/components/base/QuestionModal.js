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
import { Field, reduxForm, reset } from 'redux-form';
import { addUserQuestion, addQuestionPending } from '../../store/actions/questions';


const useStyles = makeStyles(() => {
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


const QuestionModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addUserQuestion,
        handleSubmit,
        handleClose,
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
            onClose={ handleClose }
            aria-labelledby="responsive-dialog-title">
            <form
                id="question"
                onSubmit={ handleSubmit(addUserQuestion) }>
                <DialogTitle>
                    Question
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Feel free to ask any anything either technical or domain. Try to choose suggested experts to get an instant answer.
                    </DialogContentText>
                    <Field
                        name="question"
                        component={ renderTextField } />
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit">
                        Add
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
            dispatch(addQuestionPending());
            dispatch(addUserQuestion(body, callback));
            dispatch(reset('question'));
        },
    };
};

export default reduxForm({
    form: 'question', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(QuestionModal));
