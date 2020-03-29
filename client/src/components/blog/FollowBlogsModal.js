import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import {
    withStyles,
    useTheme,
    makeStyles,
} from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    TextField,
    IconButton,
    GridList,
    GridListTile,
    GridListTileBar,
    Checkbox
} from '@material-ui/core';
import {
    CheckCircleRounded as CheckCircleRoundedIcon,
    CheckCircleOutlined as CheckCircleOutlinedIcon,
} from '@material-ui/icons';

import {
    addNewBlog,
    requestBlogs,
} from '../../store/actions/blog';
import { editQuestion } from '../../store/actions/questions';
import {
    addPreferencesPending,
    maangeUserPreferences,
} from '../../store/actions/auth';

const useStyles = makeStyles(() => {
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
        blogs,
        followedBlogs,
        requestBlogs,
        maangeUserPreferences,
    } = props;


    useEffect(() => {
        requestBlogs();
    }, [ requestBlogs ]);

    const [
        filteredBlogs,
        setFilteredBlogs,
    ] = React.useState(blogs);

    useEffect(() => {
        setFilteredBlogs(blogs);
    }, [ blogs ]);

    const filterTopics = (text) => {
        const filtered = blogs.filter((blog) => blog.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
        setFilteredBlogs(filtered);
    };

    const renderTextField = () => (
        <TextField
            autoComplete="off"
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

    useEffect(() => {
        setChecked(followedBlogs.map(t => t._id));
    }, [ followedBlogs ]);

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
        maangeUserPreferences({ blogs: checked });
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
    followedBlogs: [],
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        blogs: [ ...state.blog.blogs ],
        followedBlogs: state.user.blogs,
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
        maangeUserPreferences: (body) => {
            dispatch(addPreferencesPending());
            dispatch(maangeUserPreferences(body));
        }
    };
};

export default reduxForm({
    form: 'followblogs', // a unique identifier for this form
    validate,
})(connect(mapStateToProps, mapDispatchToProps)(FollowBlogsModal));
