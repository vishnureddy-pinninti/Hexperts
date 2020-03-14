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
import { addNewBlog, addBlogPending } from '../../store/actions/blog';


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


const BlogModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addBlog,
        handleSubmit,
        handleClose,
    } = props;

    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            autoFocus
            margin="dense"
            id="name"
            label="New Blog"
            type="text"
            required
            fullWidth />
    );

    const renderDescriptionField = ({ input }) => (
        <TextField
            { ...input }
            margin="dense"
            id="name"
            label="Add a little description about the blog"
            type="text"
            variant="outlined"
            multiline
            rows="4"
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
                onSubmit={ handleSubmit(addBlog) }>
                <DialogTitle>
                    Blog
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Feel free to create a new blog and start contributing.
                    </DialogContentText>
                    <Field
                        name="name"
                        component={ renderTextField } />
                    <Field
                        name="description"
                        component={ renderDescriptionField } />
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
        addBlog: (body, callback) => {
            dispatch(addBlogPending());
            dispatch(addNewBlog(body, callback));
            dispatch(reset('blog'));
        },
    };
};

export default reduxForm({
    form: 'blog', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(BlogModal));
