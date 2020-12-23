import React from 'react'
import { connect } from 'react-redux';
import { Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    TextField} from '@material-ui/core';
import { reduxForm, Field, reset } from 'redux-form';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { addUserFeedback } from '../../store/actions/feedback';



const useStyles = makeStyles(() => {
    return {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
        },
        gridList: {
            width: 700,
            height: 500,
        },
        icon: {
            color: 'rgba(255, 255, 255, 0.54)',
        },
        title: {
            color: 'white',
        },
        textfield: {
            marginBottom: 30,
        },
        checkbox: {
            color: '#bdbdbd',
        },
    };
});

const renderTextField = ({ input , name, multiline, label}) => (
    <TextField
        autoComplete="off"
        name={ name }
        margin="dense"
        label={ label }
        multiline={ multiline }
        { ...input }
        rows={5}
        required
        type="text"
        fullWidth />
);

const FeedbackModel = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {
        handleSubmit,
        open,
        handleClose,
    } = props;

    const submitFeedback = (values) =>{
        const { addUserFeedback } = props;
        addUserFeedback(values);
        handleClose();
    }


    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            open={ open }
            onClose={ handleClose }
            aria-labelledby="responsive-dialog-title">
            <form
                id="feedback"
                onSubmit={ handleSubmit(submitFeedback) }>
                <DialogTitle>
                    Feedback to Hexperts
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide your feedback on Hexperts. Your feedback will help us improve.
                    </DialogContentText>
                    <Field
                        name="subject"
                        component={ renderTextField }
                        label='Subject' />
                    <Field 
                        name="description"
                        component={ renderTextField }
                        multiline
                        label='Description' />
                    <div style={ { maxHeight: 400 } }>
                    </div>
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
                        Submit Feedback
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};


const mapStateToProps = (state) => {
    return {
        feedback: state.feedback,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addUserFeedback: (body) => {
            dispatch(addUserFeedback(body));
            dispatch(reset('feedback'));
        },
    };
};

export default reduxForm({
    form: 'feedback', // a unique identifier for this form
})(connect(mapStateToProps, mapDispatchToProps)(FeedbackModel));
