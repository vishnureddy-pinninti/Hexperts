import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card,
    CardActions,
    Button,
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    CardHeader } from '@material-ui/core';
import { RssFeedSharp as RssFeedSharpIcon } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExplicitIcon from '@material-ui/icons/Explicit';
import ImageIcon from '@material-ui/icons/Image';
import { connect } from 'react-redux';

import FileUpload from '../base/FileUpload';
import { addAnswerToQuestion,
    addAnswerPending } from '../../store/actions/answer';
import { followTopic, uploadTopicImage } from '../../store/actions/topic';
import { setPageLoader } from '../../store/actions/auth';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            overflow: 'visible',
            marginBottom: 10,
        },
        media: {

        },
        large: {
            width: theme.spacing(10),
            height: theme.spacing(10),
            borderRadius: 0,
        },
        editorWrapper: {
            border: '1px solid #F1F1F1',
            minHeight: 300,
            padding: 10,
        },
    };
});

const TopicSection = (props) => {
    const classes = useStyles();
    const {
        id,
        followTopic,
        topic,
        followers,
        interests,
        expertTopics,
        uploadTopicImage,
    } = props;

    const handleFollowClick = () => {
        followTopic({ interestId: id });
    };

    const handleExpertClick = () => {
        followTopic({ expertId: id });
    };

    const following = interests.map((t) => t._id).indexOf(id) >= 0;
    const expertIn = expertTopics.map((t) => t._id).indexOf(id) >= 0;

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
        openImageUploadModal,
        setOpenImageUploadModal,
    ] = React.useState(false);


    const handleImageUploadModalOpen = () => {
        setAnchorEl(null);
        setOpenImageUploadModal(true);
    };

    const handleImageUploadModalClose = () => {
        setOpenImageUploadModal(false);
    };

    const handleImageUpload = (files) => {
        const formdata = new FormData();
        formdata.append('file', files[0]);
        uploadTopicImage(id, formdata);
        setOpenImageUploadModal(false);
    };

    return (
        <Card className={ classes.root }>
            <CardHeader
                avatar={
                    <Avatar
                        alt="Remy Sharp"
                        src={ topic.imageUrl || '/placeholder.png' }
                        className={ classes.large } />
                }
                title={
                    <Box
                        fontWeight="fontWeightBold"
                        fontSize={ 20 }>
                        { topic.topic }
                    </Box>
                }
                action={ <>
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
                        <MenuItem onClick={ handleImageUploadModalOpen }>
                            <ImageIcon />
                            { ' ' }
                            Edit Image
                        </MenuItem>
                    </Menu>
                </> }
                subheader={ `${followers.length} followers` } />
            <CardActions disableSpacing>
                <Button
                    size="small"
                    onClick={ handleFollowClick }
                    startIcon={ <RssFeedSharpIcon /> }
                    color={ following ? 'primary' : 'default' }>
                    Follow
                </Button>
                <Button
                    size="small"
                    onClick={ handleExpertClick }
                    startIcon={ <ExplicitIcon /> }
                    color={ expertIn ? 'secondary' : 'default' }>
                    Expert
                </Button>
            </CardActions>
            <FileUpload
                open={ openImageUploadModal }
                handleClose={ handleImageUploadModalClose }
                handleUpload={ handleImageUpload } />
        </Card>
    );
};

TopicSection.defaultProps = {
    followers: [],
};

const mapStateToProps = (state) => {
    return {
        pending: state.answer.pending,
        followers: state.topic.topic.followers,
        interests: state.user.interests,
        expertTopics: state.user.expertIn,
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAnswerToQuestion: (body) => {
            dispatch(addAnswerPending());
            dispatch(addAnswerToQuestion(body));
        },
        followTopic: (body) => {
            dispatch(followTopic(body));
        },
        uploadTopicImage: (id, body) => {
            dispatch(setPageLoader(true));
            dispatch(uploadTopicImage(id, body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicSection);
