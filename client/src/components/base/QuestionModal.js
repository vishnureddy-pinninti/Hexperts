/* eslint-disable react-hooks/exhaustive-deps */
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
import QuestionSuggestions from './QuestionSuggestions';

import { addUserQuestion, addQuestionPending, requestQuestionSuggestions, clearQuestionSuggestions } from '../../store/actions/questions';

const useStyles = makeStyles(() => {
    return {
        root: {
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
        handleSubmit,
        handleClose,
        getQuestionSuggestions,
        handleDone,
        questionModal,
        questionForModal,
        clearQuestionSuggestions,
    } = props;

    const onChange = (event) => {
        props.change('question', event.target.value);
        getQuestionSuggestions({ question: event.target.value }, (res) => {
            props.change('questionSuggestions', res);
        });
    };

    React.useEffect(() => {
        if (questionModal) {
            clearQuestionSuggestions();
        }
    }, [ questionModal ]);

    React.useEffect(() => {
        if (questionForModal) {
            getQuestionSuggestions({ question: questionForModal }, (res) => { props.change('questionSuggestions', res); });
        }
    }, [ questionForModal ]);


    const renderTextField = ({ input }) => (
        <TextField
            autoComplete="off"
            { ...input }
            autoFocus
            margin="dense"
            id="name"
            label="Start your question with 'Why' 'What' 'How' etc."
            type="text"
            onChange={ onChange }
            required
            fullWidth />
    );

    const onSubmitQuestion = (values) => {
        const { question, questionSuggestions } = values;
        // if (values.question.slice(-1) !== '?'){
        //     question += '?';
        // }
        if (questionSuggestions){
            handleDone(question, questionSuggestions);
        }
    };

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            open={ props.open }
            scroll="paper"
            onClose={ handleClose }
            aria-labelledby="responsive-dialog-title">
            <form
                id="question"
                onSubmit={ handleSubmit(onSubmitQuestion) }>
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
                    <div style={ { maxHeight: 400 } }>
                        <QuestionSuggestions />
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
        questionModal: state.questions.questionModal,
        questionForModal: state.questions.questionForModal,
    };
};

const mapStateToPropsForForm = (state) => {
    return {
        initialValues: {
            question: state.questions.questionForModal,
        },
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addUserQuestion: (body, callback) => {
            dispatch(addQuestionPending());
            dispatch(addUserQuestion(body, callback));
            dispatch(reset('question'));
        },
        getQuestionSuggestions: (body, callback) => {
            dispatch(requestQuestionSuggestions(body, callback));
        },
        clearQuestionSuggestions: () => {
            dispatch(clearQuestionSuggestions());
        },
        resetForm: () => {
            dispatch(reset('question'));
        },
    };
};

export default connect(mapStateToPropsForForm)(reduxForm({
    form: 'question', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(QuestionModal)));
