import React, { useEffect } from 'react';
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import { addNewBlog, requestBlogs } from '../../store/actions/blog';
import { editQuestion } from '../../store/actions/questions';
import { addUserPreferences, addPreferencesPending } from '../../store/actions/auth';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',

        },
        gridList: {
            width: 700,
            height: 500,
        },
        icon: {
            color: 'rgba(255, 255, 255, 0.54)',
        },
        title: {
            color: 'white',
        },
        textfield: {
            marginBottom: 30,
        },
        checkbox: {
            color: 'white',
            '&$checked': {
                color: 'red',
            },
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

const WhiteCheckbox = withStyles({
    root: {
        color: 'white',
        '&$checked': {
            color: 'white',
        },
    },
    checked: {},
})((props) => (
    <Checkbox
        color="default"
        { ...props } />
));

const FollowBlogsModal = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        addNewBlog,
        handleSubmit,
        question,
        questionID,
        blogs,
        followedBlogs,
        requestBlogs,
        editQuestion,
        addUserPreferences,
        open,
    } = props;


    useEffect(() => {
        requestBlogs();
    }, [ requestBlogs ]);

    for (let i = blogs.length - 1; i >= 0; i--){
        for (let j = 0; j < followedBlogs.length; j++){
            if (blogs[i] && (blogs[i]._id === followedBlogs[j]._id)){
                blogs.splice(i, 1);
            }
        }
    }

    const [
        filteredBlogs,
        setFilteredBlogs,
    ] = React.useState(blogs);

    useEffect(() => {
        setFilteredBlogs(blogs);
    }, [ blogs ]);

    const filterTopics = (text) => {
        const filtered = blogs.filter((blog) => blog.name.toLowerCase().startsWith(text.toLowerCase()));
        setFilteredBlogs(filtered);
    };

    const renderTextField = () => (
        <TextField
            margin="dense"
            id="name"
            label="Search Blogs"
            type="text"
            className={ classes.textfield }
            onChange={ (event) => filterTopics(event.target.value) }
            fullWidth />
    );

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    const [
        selectedBlogs,
        setSelectedBlogs,
    ] = React.useState(blogs);


    const selectBlog = (value) => {
        if (value){
            const currentIndex = checked.indexOf(value._id);
            const newChecked = [ ...checked ];

            if (currentIndex === -1) {
                newChecked.push(value._id);
                setSelectedBlogs([
                    ...selectedBlogs,
                    value,
                ]);
            }
            else {
                newChecked.splice(currentIndex, 1);
            }
            setChecked(newChecked);
        }
    };

    const addBlogsToInterests = () => {
        addUserPreferences({ blogs: checked });
    };

    const renderBlogs = () => (
        <div className={ classes.root }>
            <GridList
                className={ classes.gridList }>
                { filteredBlogs.map((blog) => (
                    <GridListTile key={ blog._id }>
                        <img
                            src={ blog.imageUrl || '/blog-placeholder.png' }
                            alt={ blog.name } />
                        <GridListTileBar
                            title={ blog.name }
                            classes={ {
                                root: classes.titleBar,
                                title: classes.title,
                            } }
                            actionIcon={
                                <IconButton
                                    aria-label={ `star ${blog.name}` }
                                    onClick={ () => { selectBlog(blog); } }>
                                    <WhiteCheckbox
                                        icon={ <CheckCircleOutlinedIcon /> }
                                        checkedIcon={ <CheckCircleRoundedIcon /> }
                                        checked={ checked.indexOf(blog._id) !== -1 }
                                        className={ classes.checkbox } />
                                </IconButton>
                            } />
                    </GridListTile>
                )) }
            </GridList>
        </div>
    );

    return (
        <Dialog
            className={ classes.root }
            fullScreen={ fullScreen }
            open={ props.open }
            onClose={ props.handleFollowTopicsModalClose }
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>
                Blogs
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Follow blogs of your interest and we will give you feed when new post is available.
                </DialogContentText>
                { renderTextField() }
                { renderBlogs() }
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={ props.handleFollowTopicsModalClose }
                    color="primary">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={ addBlogsToInterests }
                    type="submit">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

FollowBlogsModal.defaultProps = {
    followedTopics: [],
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        blogs: [ ...state.blog.blogs ],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewTopic: (body) => {
            dispatch(addNewBlog(body));
        },
        requestBlogs: () => {
            dispatch(requestBlogs());
        },
        editQuestion: (questionID, body) => {
            dispatch(editQuestion(questionID, body));
        },
        addUserPreferences: (body) => {
            dispatch(addPreferencesPending());
            dispatch(addUserPreferences(body));
        },
    };
};

export default reduxForm({
    form: 'followblogs', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(FollowBlogsModal));
