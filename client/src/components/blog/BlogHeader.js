import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Collapse from '@material-ui/core/Collapse';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import TextField from '@material-ui/core/TextField';
import { Field, reduxForm, reset } from 'redux-form';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { connect } from 'react-redux';
import RssFeedSharpIcon from '@material-ui/icons/RssFeedSharp';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { followBlog, addPostToBlog, addBlogPending } from '../../store/actions/blog';

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
            border: '1px solid #F1F1F1',
            minHeight: 300,
            padding: 10,
            marginTop: 20,
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
        question,
        addPostToBlog,
        id,
        description,
        pending,
        followBlog,
        blog,
        followers,
        handleSubmit,
        user,
    } = props;

    const handleFollowClick = () => {
        followBlog({ blogID: id });
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

    const setEditorReference = (ref) => {
        if (ref) { ref.focus(); }
    };

    useEffect(() => {
        if (!pending) {
            setOpen(pending);
            setPost(null);
        }
    }, [ pending ]);

    const addPost = (values) => {
        const { title } = values;
        addPostToBlog(
            {
                description: draftToHtml(convertToRaw(post.getCurrentContent())),
                blog: id,
                title,
            }
        );
    };

    const following = followers.indexOf(user._id) >= 0;

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
            editorClassName={ classes.root }
            onEditorStateChange={ onEditorStateChange } />
    );

    const renderPostModal = () => (
        <Dialog
            open={ open }
            onClose={ handleClose }>
            <form
                id="post"
                onSubmit={ handleSubmit(addPost) }>
                <DialogTitle id="scroll-dialog-title">Post</DialogTitle>
                <DialogContent
                    dividers
                    className={ classes.post }>
                    <CardHeader
                        avatar={
                            <Avatar
                                alt="Remy Sharp"
                                src={ blog.imageUrl || '/blog-placeholder.png' } />
                        }
                        title={
                            <Box
                                fontWeight="fontWeightBold">
                                { blog.name }
                            </Box>
                        } />
                    <CardContent>
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
                        { blog.name }
                    </Box>
                }
                subheader={ blog.description } />
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ handleFollowClick }
                    startIcon={ <RssFeedSharpIcon /> }
                    color={ following ? 'primary' : 'default' }>
                    Follow
                    { ' ' }
                    { followers.length }
                </Button>
                <Button
                    size="small"
                    onClick={ handleOpen }
                    startIcon={ <EditTwoToneIcon /> }
                    color="default">
                    Add Post
                </Button>
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
        followers: state.blog.blog.followers || [],
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        followBlog: (body) => {
            dispatch(followBlog(body));
        },
        addPostToBlog: (body) => {
            dispatch(addBlogPending());
            dispatch(addPostToBlog(body));
        },
    };
};
export default reduxForm({
    form: 'post', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(BlogHeader));
