import React, { useEffect } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardActions,
    CardContent,
    Button,
    Collapse,
    TextField,
    Box,
    Avatar,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle } from '@material-ui/core';
import { EditTwoTone as EditTwoToneIcon,
    RssFeedSharp as RssFeedSharpIcon } from '@material-ui/icons';
import StarsRoundedIcon from '@material-ui/icons/StarsRounded';

import { followBlog,
    addPostToBlog,
    addBlogPending } from '../../store/actions/blog';

import { followTopic } from '../../store/actions/topic';
import config from '../../utils/config';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            overflow: 'visible',
            marginBottom: 10,
        },
        margin: {
            marginBottom: 10,
        },
        large: {
            width: theme.spacing(10),
            height: theme.spacing(10),
            borderRadius: 0,
        },
        post: {
            height: 500,
        },
        editorWrapper: {
            border: '1px solid gray',
            minHeight: 400,
            padding: 10,
            marginTop: 20,
            '&:hover': {
                border: '2px solid',
                borderColor: theme.palette.primary.dark,
            },
        },
        editor: {
            height: 300,
            overflow: 'auto',
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        button: {
            color: theme.palette.text.secondary,
        },
        buttonSelected: {
            color: theme.palette.secondary.main,
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

const BlogHeader = (props) => {
    const classes = useStyles();
    const {
        addPostToBlog,
        id,
        pending,
        followBlog,
        blog,
        followers,
        handleSubmit,
        interests,
        resetPost,
        followTopic,
        expertTopics,
    } = props;

    const handleFollowClick = () => {
        followTopic({ interestId: id });
    };

    const handleExpertClick = () => {
        followTopic({ expertId: id });
    };

    const [
        open,
        setOpen,
    ] = React.useState(false);

    const [
        post,
        setPost,
    ] = React.useState(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onEditorStateChange = (value) => {
        setPost(value);
    };

    const [
        disableSubmit,
        setDisableSubmit,
    ] = React.useState(false);

    useEffect(() => {
        if (!pending) {
            setDisableSubmit(false);
            setOpen(pending);
            setPost(null);
            resetPost();
        }
    }, [ pending ]);

    const addPost = (values) => {
        const { title } = values;
        setDisableSubmit(true);
        addPostToBlog(
            {
                description: draftToHtml(convertToRaw(post.getCurrentContent())),
                blog: id,
                title,
            }
        );
    };

    const following = interests.map((t) => t._id).indexOf(id) >= 0;
    const expertIn = expertTopics.map((t) => t._id).indexOf(id) >= 0;

    const renderTextField = ({ input }) => (
        <TextField
            { ...input }
            autoFocus
            id="name"
            label="Title"
            type="text"
            variant="outlined"
            required
            fullWidth />
    );

    const renderDescriptionField = ({ input }) => (
        <Editor
            { ...input }
            place
            editorState={ post }
            wrapperClassName={ classes.editorWrapper }
            editorClassName={ classes.editor }
            onEditorStateChange={ onEditorStateChange }
            toolbar={ {
                options: config.toolbarOptions,
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
                blockType: {
                    inDropdown: false,
                    options: config.blockTypeOptions,
                },
            } } />
    );

    const renderPostModal = () => (
        <Dialog
            open={ open }
            scroll="paper"
            maxWidth="md"
            onClose={ handleClose }>
            <form
                id="post"
                onSubmit={ handleSubmit(addPost) }>
                <DialogTitle id="scroll-dialog-title">Post</DialogTitle>
                <DialogContent
                    dividers>
                    <CardHeader
                        avatar={
                            <Avatar
                                alt="Remy Sharp"
                                className={ classes.small }
                                src={ blog.imageUrl || '/blog-placeholder.png' } />
                        }
                        title={
                            <Box
                                fontWeight="fontWeightBold">
                                { blog.name }
                            </Box>
                        } />
                    <CardContent className={ classes.post }>
                        <Field
                            name="title"
                            component={ renderTextField } />
                        <Field
                            name="description"
                            component={ renderDescriptionField } />
                    </CardContent>
                </DialogContent>
                <DialogActions>
                    <Button
                        size="small"
                        onClick={ handleClose }
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        type="submit"
                        disabled={ disableSubmit }
                        color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );

    return (
        <Card className={ classes.root }>
            <CardHeader
                avatar={
                    <Avatar
                        alt="Remy Sharp"
                        src={ blog.imageUrl || '/blog-placeholder.png' }
                        className={ classes.large } />
                }
                title={
                    <Box
                        fontWeight="fontWeightBold"
                        fontSize={ 20 }>
                        { blog.name || blog.topic }
                    </Box>
                }
                subheader={ blog.description } />
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ handleFollowClick }
                    startIcon={ <RssFeedSharpIcon /> }
                    className={ following ? classes.buttonSelected : classes.button }>
                    Follow
                    { ' ' }
                    { followers.length }
                </Button>
                <Button
                    size="small"
                    onClick={ handleExpertClick }
                    startIcon={ <StarsRoundedIcon /> }
                    className={ expertIn ? classes.buttonSelected : classes.button }>
                    Expert
                </Button>
                { /* <Button
                    size="small"
                    onClick={ handleOpen }
                    startIcon={ <EditTwoToneIcon /> }
                    color="default">
                    Add Post
                </Button> */ }
            </CardActions>
            <Collapse
                in={ open }
                timeout="auto"
                unmountOnExit />
            { renderPostModal() }
        </Card>
    );
};

BlogHeader.defaultProps = {
    followers: [],
};

const mapStateToProps = (state) => {
    return {
        pending: state.blog.pending,
        followers: state.topic.topic.followers,
        interests: state.user.interests,
        expertTopics: state.user.expertIn,
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        followBlog: (body) => {
            dispatch(followBlog(body));
        },
        followTopic: (body) => {
            dispatch(followTopic(body));
        },
        addPostToBlog: (body) => {
            dispatch(addBlogPending());
            dispatch(addPostToBlog(body));
        },
        resetPost: () => {
            dispatch(reset('post'));
        },
    };
};
export default reduxForm({
    form: 'post', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(BlogHeader));
