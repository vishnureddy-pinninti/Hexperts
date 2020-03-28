import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Collapse,
} from '@material-ui/core';
import {
    EditTwoTone as EditTwoToneIcon,
    RssFeedSharp as RssFeedSharpIcon,
    RecordVoiceOver as RecordVoiceOverIcon,
} from '@material-ui/icons';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { connect } from 'react-redux';

import QuestionTags from './QuestionTags';
import EditSuggestedWriters from './EditSuggestedWriters';
import {
    addAnswerToQuestion,
    addAnswerPending,
} from '../../store/actions/answer';
import {
    followQuestion,
    addQuestionToCache,
} from '../../store/actions/questions';

const useStyles = makeStyles({
    root: {
        overflow: 'visible',
        marginBottom: 10,
    },
    media: {

    },
    editorWrapper: {
        border: '1px solid #F1F1F1',
        minHeight: 300,
        padding: 10,
    },
});

const QuestionSection = (props) => {
    const classes = useStyles();
    const {
        question,
        addAnswerToQuestion,
        id,
        pending,
        followQuestion,
        answers,
        topics,
        user,
        followers,
        questionPending,
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
            setOpen(pending);
            setDisableSubmit(false);
            setAnswer(null);
        }
    }, [ pending ]);

    const addAnswer = () => {
        setDisableSubmit(true);
        addAnswerToQuestion(
            {
                answer: draftToHtml(convertToRaw(answer.getCurrentContent())),
                questionID: id,
            }, question
        );
    };

    const onEditorStateChange = (value) => {
        setAnswer(value);
    };

    const setEditorReference = (ref) => {
        if (ref) { ref.focus(); }
    };

    const handleFollowClick = () => {
        followQuestion({ questionID: id });
    };

    const [
        openEditSuggestedWritersModal,
        setOpenEditSuggestedWritersModal,
    ] = React.useState(false);

    const handleEditSuggestedWriterssModalOpen = () => {
        setOpenEditSuggestedWritersModal(true);
    };

    const handleEditSuggestedWritersModalClose = () => {
        setOpenEditSuggestedWritersModal(false);
    };

    useEffect(() => {
        if (!questionPending) {
            setOpenEditSuggestedWritersModal(questionPending);
        }
    }, [ questionPending ]);

    const following = followers.indexOf(user._id) >= 0;

    return (
        <Card className={ classes.root }>
            <CardContent>
                <QuestionTags
                    question={ question }
                    topics={ topics }
                    id={ id } />
                <Typography
                    variant="h5"
                    component="h2">
                    { question.question }
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    { answers ? `${answers.totalCount} answers` : 'No answers yet' }
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
                    { followers && followers.length }
                </Button>
                <Button
                    size="small"
                    onClick={ handleEditSuggestedWriterssModalOpen }
                    startIcon={ <RecordVoiceOverIcon /> }
                    color="default">
                    Request
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
                        editorClassName={ classes.root }
                        onEditorStateChange={ onEditorStateChange }
                        toolbar={ {
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },
                            blockType: { inDropdown: false },
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
            <EditSuggestedWriters
                open={ openEditSuggestedWritersModal }
                question={ question.question }
                topics={ topics }
                questionID={ id }
                handleClose={ handleEditSuggestedWritersModalClose } />
        </Card>
    );
};

QuestionSection.defaultProps = {
    followers: [],
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        questionPending: state.questions.pending,
        user: state.user.user,
        following: state.questions.question.following,
        followers: state.questions.question.followers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAnswerToQuestion: (body, question) => {
            dispatch(addQuestionToCache(question));
            dispatch(addAnswerPending());
            dispatch(addAnswerToQuestion(body));
        },
        followQuestion: (body) => {
            dispatch(followQuestion(body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionSection);
