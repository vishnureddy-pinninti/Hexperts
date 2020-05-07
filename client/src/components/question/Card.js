import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Collapse,
    IconButton,
    Box } from '@material-ui/core';
import { EditTwoTone as EditTwoToneIcon,
    RssFeedSharp as RssFeedSharpIcon } from '@material-ui/icons';
import { Editor } from 'react-draft-wysiwyg';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { convertToRaw } from 'draft-js';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import draftToHtml from '../../utils/draftjs-to-html';
import EditAnswerModal from '../answer/EditAnswerModal';

import { addAnswerToQuestion,
    addAnswerPending } from '../../store/actions/answer';
import { followQuestion,
    addQuestionToCache } from '../../store/actions/questions';
import config from '../../utils/config';


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
        const contentState = answer.getCurrentContent();
        addAnswerToQuestion(
            {
                answer: draftToHtml(convertToRaw(contentState)),
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

    const [
        openFullScreenEditor,
        setOpenFullScreenEditor,
    ] = React.useState(false);

    const handleFullScreenEditorOpen = () => {
        setOpenFullScreenEditor(true);
    };

    const handleFullScreenEditorClose = (answer) => {
        setOpenFullScreenEditor(false);
        setAnswer(answer);
    };

    const handleFullScreenEditorDone = (answer) => {
        setOpenFullScreenEditor(false);
        setDisableSubmit(true);
        addAnswerToQuestion(
            {
                answer,
                questionID: question._id,
            },
            question
        );
    };

    return (
        <Card
            className={ classes.root }
            elevation={ 0 }>
            <CardContent>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    { question.lastModified ? `Question edited ${formatDistance(new Date(question.lastModified), new Date(), { addSuffix: true })}`
                        : `Question added ${formatDistance(new Date(date), new Date(), { addSuffix: true })}` }
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
                { open && <IconButton
                    aria-label="fullscreen"
                    title="Full Screen"
                    style={ {
                        marginLeft: 'auto',
                        borderRadius: 0,
                    } }
                    color="secondary"
                    onClick={ handleFullScreenEditorOpen }>
                    <FullscreenIcon />
                </IconButton> }
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
                        editorClassName={ `${classes.editor} editor-write-mode` }
                        onEditorStateChange={ onEditorStateChange }
                        toolbarCustomButtons={ config.editorConfig.toolbarCustomButtons }
                        customBlockRenderFunc={ config.editorConfig.customBlockRenderer }
                        toolbar={ config.editorToolbar } />
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
            { openFullScreenEditor && <EditAnswerModal
                open={ openFullScreenEditor }
                newAnswer
                answerEditorState={ answer }
                question={ question.question }
                fullScreen
                handleClose={ handleFullScreenEditorClose }
                handleDone={ handleFullScreenEditorDone } /> }
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
