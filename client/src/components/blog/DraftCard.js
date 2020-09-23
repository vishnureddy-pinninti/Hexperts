import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { IconButton,
    Menu,
    MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Box from '@material-ui/core/Box';
import { Link, withRouter } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import ReadMore from '../base/ReadMore';
import EditPostModal from './PostModal';
import Avatar from '../base/Avatar';
import { addDraftToCache, postDraft, editDraft, deleteDraft } from '../../store/actions/draft';
import getBadge from '../../utils/badge';
import getMinutes from '../../utils/words-to-mins';
import { isMediaOrCode } from '../../utils/common';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginBottom: 10,
            border: '1px solid #efefef',
            backgroundColor: 'lightGray',
        },
        headerRoot: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        disabled: {
            opacity: 0.3,
            pointerEvents: 'none',
        },
        topics: {
            display: 'flex',
            flexDirection: 'row',
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            cursor: 'pointer',
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        topicLink: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
            paddingLeft: 10,
        },
        more: {
            textDecoration: 'none',
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

const AnswerCard = (props) => {
    const classes = useStyles();

    const {
        draft,
        hideHeader,
        history,
        deleteDraft,
        editDraft,
        pending,
        newPost,
        postDraft,
        hideHeaderHelperText,
        user,
        collapse,
    } = props;

    const {
        _id: draftId,
        title,
        description,
        author,
        topics,
        postedDate,
        lastModified,
        plainText,
    } = draft;

    const {
        _id,
        name,
        jobTitle,
        email,
        reputation,
    } = author;
    
    const [
        draftObj,
        setDraftObj,
    ] = React.useState({
        topics,
        description,
        title,
        lastModified,
        plainText,
    });

    const renderAnswer = (draft) => (
        <ReadMore
            initialHeight={ 300 }
            mediaExists={ isMediaOrCode(draft) }
            collapse={ collapse }
            readMore={ (props) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    className={ classes.more }
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
                dangerouslySetInnerHTML={ { __html: draft } } />
        </ReadMore>
    );

    const onProfileClick = () => {
        history.push(`/profile/${_id}`);
    };

    const renderTopics = (blogs) => blogs.map((blog) => (
        <Link
            key={ blog._id }
            className={ classes.topicLink }
            to={ `/blog/${blog._id}` }>
            { blog.name || blog.topic }
        </Link>
    ));

    const renderHeaderHelperText = (topics) => (
        <Typography
            variant="body2"
            color="textSecondary"
            className={ classes.topics }
            component="p">
            Draft -
            { topics && topics.length ? renderTopics(topics) : ' Recommended to you' }
        </Typography>
    );

    const [
        disabled,
        setDisabled,
    ] = React.useState(false);

    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [
        openEditDraftModal,
        setOpenEditDraftModal,
    ] = React.useState(false);

    const handlePostDraft = (body) => {
        setAnchorEl(null);
        setOpenEditDraftModal(false);
        postDraft(draftId, body);
    };

    const handleDeleteDraft = () => {
        setAnchorEl(null);
        deleteDraft(draftId, (res) => {
            if (res) { setDisabled(true); }
        });
    };

    useEffect(() => {
        if (!pending && newPost && newPost._id) {
            history.push(`/post/${newPost._id}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ newPost ]);

    const handleEditDraft = (body) => {
        setAnchorEl(null);
        setOpenEditDraftModal(false);
        editDraft(draftId, body, (res) => {
            if (res) {
                setDraftObj(res);
            }
        });
    };

    const handleEditDraftModalOpen = () => {
        setAnchorEl(null);
        setOpenEditDraftModal(true);
    };

    const handleEditDraftModalClose = () => {
        setOpenEditDraftModal(false);
    };

    const isOwner = user._id === _id;


    return (
        <Card
            className={ `${classes.root}  ${disabled ? classes.disabled : ''}` }
            elevation={ 0 }>
            <CardContent>
                {
                    !hideHeader && <>
                        { !hideHeaderHelperText && renderHeaderHelperText( draftObj.topics) }
                        <Link
                            to={ `/draft/${draftId}` }
                            className={ classes.link }>
                            <Box
                                fontWeight="fontWeightBold"
                                fontSize={ 20 }>
                                { draftObj.title }
                            </Box>
                        </Link>
                                   </>
                }
                <CardHeader
                    className={ classes.headerRoot }
                    avatar={
                        <Avatar
                            aria-label="recipe"
                            alt={ name }
                            user={ email }
                            badge={ getBadge(reputation) }
                            onClick={ onProfileClick }
                            className={ classes.avatar }>
                            { name.match(/\b(\w)/g).join('') }
                        </Avatar>
                    }
                    action={ isOwner && <>
                        <IconButton
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={ handleClick }>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={ anchorEl }
                            keepMounted
                            open={ Boolean(anchorEl) }
                            onClose={ handleClose }>
                            <MenuItem onClick={ handleEditDraftModalOpen }>
                                <EditIcon className={ classes.menuIcon } />
                                Edit
                            </MenuItem>
                            <MenuItem onClick={ () => handlePostDraft({
                                description,
                                topics: topics && topics.map((topic) => (topic._id)),
                                title,}) 
                                } >
                                <PostAddIcon className={ classes.menuIcon } />
                                Post
                            </MenuItem>
                            <MenuItem onClick={ handleDeleteDraft }>
                                <DeleteIcon className={ classes.menuIcon } />
                                Delete
                            </MenuItem>
                        </Menu>
                                        </> }
                    title={
                        <Link
                            className={ classes.link }
                            to={ `/profile/${_id}` }>
                            { name }
                            ,
                            { ' ' }
                            { jobTitle }
                        </Link>
                    }
                    subheader={
                        <>
                            <Link
                                className={ classes.link }
                                to={ `/draft/${draftId}` }>
                                { draftObj.lastModified ? `Edited ${formatDistance(new Date(draftObj.lastModified), new Date(), { addSuffix: true })}` : `Created ${formatDistance(new Date(postedDate), new Date(), { addSuffix: true })}` }

                            </Link>
                            <b> - </b>
                            { `${getMinutes(draftObj.plainText)} min read` }
                        </>
                    } />
                { renderAnswer(draftObj.description) }
            </CardContent>
            { openEditDraftModal && <EditPostModal
                open={ openEditDraftModal }
                formName="post"
                draftId
                descriptionHTML={ draftObj.description }
                title={ draftObj.title }
                topics={ draftObj.topics }
                handleClose={ handleEditDraftModalClose }
                handleDone={ handleEditDraft }
                handlePostDraft={ handlePostDraft } /> }
        </Card>
    );
};

AnswerCard.defaultProps = {
    hideHeader: false,
    hideHeaderHelperText: false,
    collapse: true,
};

const mapStateToProps = (state) => {
    return {
        pending: state.draft.pending,
        user: state.user.user,
        modifiedPosts: state.blog.modifiedPosts,
        newPost: state.draft.newPost,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addDraftToCache: (draft) => {
            dispatch(addDraftToCache(draft));
        },
        deleteDraft: (draftId, cb) => {
            dispatch(deleteDraft(draftId, cb));
        },
        editDraft: (draftId, body, cb) => {
            dispatch(editDraft(draftId, body, cb));
        },
        postDraft: (draftId, body) => {
            dispatch(postDraft(draftId, body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerCard));
