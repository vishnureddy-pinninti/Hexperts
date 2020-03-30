import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Collapse,
    Box } from '@material-ui/core';
import { EditTwoTone as EditTwoToneIcon,
    RssFeedSharp as RssFeedSharpIcon } from '@material-ui/icons';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

import { addAnswerToQuestion,
    addAnswerPending } from '../../store/actions/answer';
import { followQuestion,
    addQuestionToCache } from '../../store/actions/questions';


const useStyles = makeStyles({
    root: {
        overflow: 'visible',
        marginTop: 10,
    },
    media: {

    },
    editorWrapper: {
        border: '1px solid #F1F1F1',
        minHeight: 300,
        padding: 10,
    },
    editor: {
        height: 300,
        overflow: 'auto',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
});

const QuestionCard = (props) => {
    const classes = useStyles();
    const {
        question,
        addAnswerToQuestion,
        id,
        pending,
        followQuestion,
        date,
        user,
        answersCount,
    } = props;

    const [
        open,
        setOpen,
    ] = React.useState(false);

    const [
        answer,
        setAnswer,
    ] = React.useState(null);

    const [
        disableSubmit,
        setDisableSubmit,
    ] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!pending) {
            setDisableSubmit(false);
            setOpen(pending);
            setAnswer(null);
        }
    }, [ pending ]);

    const addAnswer = () => {
        setDisableSubmit(true);
        addAnswerToQuestion(
            {
                answer: draftToHtml(convertToRaw(answer.getCurrentContent())),
                questionID: question._id,
            },
            question
        );
    };

    const onEditorStateChange = (value) => {
        setAnswer(value);
    };

    const setEditorReference = (ref) => {
        if (ref) { ref.focus(); }
    };

    const handleFollowClick = () => {
        followQuestion({ questionID: question._id }, question);
    };

    const following = question.followers.indexOf(user._id) >= 0;

    return (
        <Card
            className={ classes.root }
            elevation={ 0 }>
            <CardContent>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    Question added
                    { ' ' }
                    { formatDistance(new Date(date), new Date(), { addSuffix: true }) }
                </Typography>
                <Typography>
                    <Link
                        to={ `/question/${id}` }
                        className={ classes.link }>
                        <Box
                            fontWeight="fontWeightBold"
                            fontSize={ 20 }>
                            { question.question }
                        </Box>
                    </Link>
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    <Link
                        to={ `/question/${id}` }
                        className={ classes.link }>
                        { answersCount ? `${answersCount} answers` : 'No answers yet' }
                    </Link>
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ handleOpen }
                    startIcon={ <EditTwoToneIcon /> }
                    color="default">
                    Answer
                </Button>
                <Button
                    size="small"
                    onClick={ handleFollowClick }
                    startIcon={ <RssFeedSharpIcon /> }
                    color={ following ? 'primary' : 'default' }>
                    Follow
                    { ' ' }
                    { question.followers.length }
                </Button>
            </CardActions>
            <Collapse
                in={ open }
                timeout="auto"
                unmountOnExit>
                <CardContent>
                    <Editor
                        editorState={ answer }
                        editorRef={ setEditorReference }
                        wrapperClassName={ classes.editorWrapper }
                        editorClassName={ classes.editor }
                        onEditorStateChange={ onEditorStateChange }
                        toolbar={ {
                            blockType: { inDropdown: false },
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },
                            image: {
                                defaultSize: {
                                    height: '100%',
                                    width: '100%',
                                },
                            }
                        } } />
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="contained"
                        disabled={ disableSubmit }
                        onClick={ addAnswer }
                        color="primary">
                        Submit
                    </Button>
                    <Button
                        size="small"
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button>
                </CardActions>
            </Collapse>
        </Card>
    );
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        user: state.user.user,
        modifiedQuestions: state.questions.modifiedQuestions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAnswerToQuestion: (body, question) => {
            dispatch(addQuestionToCache(question));
            dispatch(addAnswerPending());
            dispatch(addAnswerToQuestion(body));
        },
        followQuestion: (body, question) => {
            dispatch(addQuestionToCache(question));
            dispatch(followQuestion(body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCard);
