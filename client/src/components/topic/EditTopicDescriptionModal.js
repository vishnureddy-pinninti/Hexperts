import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

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

const renderTextField = ({ input }) => (
    <TextField
        { ...input }
        label="Topic"
        type="text"
        variant="outlined"
        required
        fullWidth />
);

const renderDescriptionField = ({ input }) => (
    <TextField
        { ...input }
        margin="dense"
        id="name"
        label="Add a little description about the topic"
        type="text"
        variant="outlined"
        multiline
        rows="4"
        fullWidth />
);

function DescriptionModal(props) {
    const {
        handleClose,
        open,
        title,
        handleSubmit,
    } = props;

    const addDescriptionToTopic = (values) => {
        const { handleDone } = props;
        const { topic, description } = values;

        if (handleDone){
            handleDone(topic, description);
        }
    };

    return (
        <div>
            <Dialog
                scroll="paper"
                maxWidth="md"
                open={ open }
                onClose={ handleClose }>
                <form
                    id="editquestion"
                    onSubmit={ handleSubmit(addDescriptionToTopic) }>
                    <DialogTitle
                        id="draggable-dialog-title">
                        { title }
                    </DialogTitle>
                    <DialogContent>
                        <Field
                            name="topic"
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
                            variant="contained"
                            type="submit"
                            color="primary">
                            Done
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

DescriptionModal.defaultProps = {
    title: 'Edit Topics',
};

const mapStateToProps = (state, props) => {
    return {
        initialValues: {
            topic: props.topic,
            description: props.description,
        },
    };
};

export default connect(mapStateToProps)(reduxForm({
    form: 'edittopic', // a unique identifier for this form
    validate,
})(DescriptionModal));
