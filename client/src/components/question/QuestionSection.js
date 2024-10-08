import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardActions,
    CardContent,
    Button,
    IconButton,
    Typography,
    Collapse,
    Menu,
    MenuItem,
    CardHeader } from '@material-ui/core';
import { EditTwoTone as EditTwoToneIcon,
    RssFeedSharp as RssFeedSharpIcon,
    RecordVoiceOver as RecordVoiceOverIcon } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import { convertToRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Editor from '../base/Editor';

import ReadMore from '../base/ReadMore';
import Avatar from '../base/Avatar';
import getBadge from '../../utils/badge';
import QuestionTags from './QuestionTags';
import EditSuggestedWriters from './EditSuggestedWriters';
import DescriptionModal from '../base/DescriptionModal';
import EditAnswerModal from '../answer/EditAnswerModal';
import { addAnswerToQuestion,
    addAnswerPending } from '../../store/actions/answer';
import { followQuestion,
    addQuestionToCache, editQuestion, editQuestionPending, deleteQuestion } from '../../store/actions/questions';
import draftToHtml from '../../utils/draftjs-to-html';
import { isMediaOrCode } from '../../utils/common';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            overflow: 'visible',
            marginBottom: 10,
        },
        header: {
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
        },
        italic: {
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
        },
        disabled: {
            opacity: 0.3,
            pointerEvents: 'none',
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
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
            cursor: 'pointer',
        },
        menuIcon: {
            paddingRight: 5,
        },
    };
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
        user,
        followers,
        questionPending,
        askedExperts,
        editQuestion,
        author,
        history,
        deleteQuestion,
        updatedQuestion,
    } = props;

    const [
        topics,
        setTopics,
    ] = React.useState(question.topics);

    const [
        open,
        setOpen,
    ] = React.useState(false);

    const [
        answer,
        setAnswer,
    ] = React.useState(null);

    const [
        questionText,
        setQuestionText,
    ] = React.useState(question.question);

    const [ setDescription ] = React.useState(question.description);

    const [
        disableSubmit,
        setDisableSubmit,
    ] = React.useState(false);

    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [
        disabled,
        setDisabled,
    ] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const {
        _id,
        name,
        email,
        reputation,
    } = author;

    const isOwner = user._id === author._id;

    useEffect(() => {
        setTopics(question.topics);
    }, [ question.topics ]);

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

    const [
        lastModified,
        setLastModified,
    ] = React.useState(question.lastModified);

    const onEditorStateChange = (value) => {
        setAnswer(value);
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

    const [
        openDescriptionModal,
        setOpenDescriptionModal,
    ] = React.useState(false);

    const handleDescriptionModalOpen = () => {
        setAnchorEl(null);
        setOpenDescriptionModal(true);
    };

    const handleDescriptionModalClose = () => {
        setOpenDescriptionModal(false);
    };

    const handleDeleteQuestion = () => {
        setAnchorEl(null);
        deleteQuestion(id, (res) => {
            if (res) { setDisabled(true); }
        });
    };

    const callback = (res) => {
        const {
            question,
            description,
            lastModified,
        } = res;
        setQuestionText(question);
        setDescription(description);
        setLastModified(lastModified);
    };

    const handleOnEditQuestion = (question, description) => {
        editQuestion(id, {
            question,
            description,
        }, callback);
        setOpenDescriptionModal(false);
    };

    useEffect(() => {
        if (!questionPending) {
            setOpenEditSuggestedWritersModal(questionPending);
        }
    }, [ questionPending ]);

    const renderDescription = (description) => (
        <ReadMore
            initialHeight={ 300 }
            mediaExists={ isMediaOrCode(description) }
            readMore={ (props) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    className={ classes.link }
                    onClick={ props.onClick }>
                    <b>
                        { props.open ? 'Read less' : 'Read more...' }
                    </b>
                </a>
            ) }>
            <div
                style={ {
                    display: 'flex',
                    flexDirection: 'column',
                } }
                className="editor-read-mode"
                dangerouslySetInnerHTML={ { __html: description } } />
        </ReadMore>
    );

    const onProfileClick = () => {
        history.push(`/profile/${_id}`);
    };

    const following = followers.indexOf(user._id) >= 0;

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
            className={ `${classes.root}  ${disabled ? classes.disabled : ''}` }>
            <CardContent>
                <CardHeader
                    className={ classes.header }
                    avatar={
                        <Avatar
                            aria-label={ name }
                            alt={ name }
                            user={ email }
                            size="small"
                            badge={ getBadge(reputation) }
                            onClick={ onProfileClick }
                            className={ classes.small } />
                    }
                    title={
                        <Link
                            className={ classes.link }
                            to={ `/profile/${_id}` }>
                            Asked by
                            { '  ' }
                            { isOwner ? 'me' : name }
                        </Link>
                    }
                    subheader={ lastModified ? `Edited ${formatDistanceToNow(new Date(lastModified || Date.now()), { addSuffix: true })}`
                        : formatDistanceToNow(new Date(question.postedDate || Date.now()), { addSuffix: true }) }
                    action={ isOwner && <>
                        <IconButton
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={ handleMenuClick }>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={ anchorEl }
                            keepMounted
                            open={ Boolean(anchorEl) }
                            onClose={ handleMenuClose }>
                            <MenuItem onClick={ handleDescriptionModalOpen }>
                                <EditIcon className={ classes.menuIcon } />
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={ handleDeleteQuestion }
                                disabled={ question.answers.totalCount > 0 }>
                                <DeleteIcon className={ classes.menuIcon } />
                                Delete
                            </MenuItem>
                        </Menu>
                    </> } />
                <QuestionTags
                    question={ question }
                    topics={ topics }
                    id={ id } />

                <Typography
                    variant="h5"
                    component="h2">
                    { questionText }
                </Typography>
                { (updatedQuestion.plainText || isMediaOrCode(updatedQuestion.description))
                 && <CardContent>
                     { /* <Typography
                         className={ classes.italic }
                         component="p">
                         Description:
                     </Typography> */ }
                     { renderDescription(updatedQuestion.description) }
                 </CardContent> }
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
                        initialValue={ answer }
                        handleEditorStateChange={ onEditorStateChange } />
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
            <CardContent>
                <Typography
                    color="textSecondary"
                    component="p">
                    { answers ? `${answers.totalCount} answers` : 'No answers yet' }
                </Typography>
            </CardContent>
            { openEditSuggestedWritersModal
            && <EditSuggestedWriters
                open={ openEditSuggestedWritersModal }
                question={ question.question }
                topics={ topics }
                questionID={ id }
                askedExperts={ askedExperts }
                handleClose={ handleEditSuggestedWritersModalClose } /> }
            { openDescriptionModal && <DescriptionModal
                open={ openDescriptionModal }
                questionText={ question.question }
                descriptionHTML={ question.description }
                title="Edit Question"
                onlyDescription={ false }
                disableBackdropClick
                handleDone={ handleOnEditQuestion }
                handleClose={ handleDescriptionModalClose } /> }
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

QuestionSection.defaultProps = {
    followers: [],
    author: {},
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        questionPending: state.questions.pending,
        user: state.user.user,
        updatedQuestion: state.questions.question,
        following: state.questions.question.following,
        followers: state.questions.question.followers,
        askedExperts: state.questions.question.suggestedExperts || [],
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
        editQuestion: (questionID, body, cb) => {
            dispatch(editQuestionPending());
            dispatch(editQuestion(questionID, body, cb));
        },
        deleteQuestion: (questionID, cb) => {
            dispatch(deleteQuestion(questionID, cb));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionSection));
