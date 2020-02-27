import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { connect } from 'react-redux';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import RssFeedSharpIcon from '@material-ui/icons/RssFeedSharp';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Collapse from '@material-ui/core/Collapse';

import QuestionTags from './QuestionTags';
import { addAnswerToQuestion, addAnswerPending } from '../../store/actions/answer';
import { followQuestion } from '../../store/actions/questions';


const useStyles = makeStyles({
    root: {
        overflow: 'visible',
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
        description,
        pending,
        followQuestion,
        topics,
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
        followed,
        setFollowed,
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
            setAnswer(null);
        }
    }, [ pending ]);

    const addAnswer = () => {
        addAnswerToQuestion(
            {
                answer: draftToHtml(convertToRaw(answer.getCurrentContent())),
                questionID: id,
            }
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
                    { question }
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    { description }
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ handleOpen }
                    endIcon={ <EditTwoToneIcon /> }
                    color="primary">
                    Answer
                </Button>
                <Button
                    size="small"
                    onClick={ handleFollowClick }
                    endIcon={ <RssFeedSharpIcon /> }
                    color="primary">
                    Follow
                </Button>
                <Button
                    size="small"
                    onClick={ handleOpen }
                    endIcon={ <RecordVoiceOverIcon /> }
                    color="primary">
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
                        onEditorStateChange={ onEditorStateChange } />
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="contained"
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAnswerToQuestion: (body) => {
            dispatch(addAnswerPending());
            dispatch(addAnswerToQuestion(body));
        },
        followQuestion: (body) => {
            dispatch(followQuestion(body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionSection);
