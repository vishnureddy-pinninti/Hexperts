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
import CardLoader from './CardLoader';
import QuestionsList from '../question/QuestionsList';

import { addUserQuestion, addQuestionPending, requestQuestionSuggestions, clearQuestionSuggestions } from '../../store/actions/questions';

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
        questionSuggestions,
        handleSubmit,
        handleClose,
        question,
        getQuestionSuggestions,
        handleDone,
        questionModal,
        clearQuestionSuggestions,
    } = props;

    const [
        value,
        setValue,
    ] = React.useState(question);

    const [
        loading,
        setLoading,
    ] = React.useState(false);

    const onChange = (event) => {
        setValue(event.target.value);
        setLoading(true);
        getQuestionSuggestions({ question: event.target.value });
    };

    React.useEffect(() => {
        setLoading(false);
    }, [ questionSuggestions ]);

    React.useEffect(() => {
        if (questionModal) {
            setValue('');
            setLoading(false);
            clearQuestionSuggestions();
        }
    }, [ questionModal ]);


    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            autoFocus
            margin="dense"
            id="name"
            label="Start your question with 'Why' 'What' 'How' etc."
            type="text"
            value={ value }
            onChange={ onChange }
            required
            fullWidth />
    );

    const onSubmitQuestion = (values) => {
        let { question } = values;
        if (values.question.slice(-1) !== '?'){
            question += '?';
        }
        handleDone(question, questionSuggestions);
        setValue('');
    };

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
                    { loading ? <CardLoader height={ 10 } />
                        : <QuestionsList
                            openInNewWindow
                            questions={ questionSuggestions.questionSuggestions || [] } /> }
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
                        disabled={ loading }
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
        questionSuggestions: state.questions.questionSuggestions,
        questionModal: state.questions.questionModal,
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
    };
};

export default reduxForm({
    form: 'question', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(QuestionModal));
