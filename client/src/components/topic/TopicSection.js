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
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import StarsRoundedIcon from '@material-ui/icons/StarsRounded';
import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import FileUpload from '../base/FileUpload';
import DescriptionModal from './EditTopicDescriptionModal';
import { addAnswerToQuestion,
    addAnswerPending } from '../../store/actions/answer';
import { followTopic, uploadTopicImage, editTopic } from '../../store/actions/topic';
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
        button: {
            color: theme.palette.text.secondary,
        },
        buttonSelected: {
            color: theme.palette.secondary.main,
        },
        menuIcon: {
            paddingRight: 5,
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
        editTopic,
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

    const [
        imageUrl,
        setImageUrl,
    ] = React.useState(topic.imageUrl);

    const callback = (res) => {
        setImageUrl(res.imageUrl);
    };


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
        uploadTopicImage(id, formdata, callback);
        setOpenImageUploadModal(false);
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
    const [
        topicText,
        setTopicText,
    ] = React.useState(topic.topic);

    const [
        description,
        setDescription,
    ] = React.useState(topic.description);

    const callbackEditTopic = (res) => {
        const { topic, description } = res;
        setTopicText(topic);
        setDescription(description);
    };

    const handleOnEditQuestion = (topic, description) => {
        editTopic(id, {
            topic,
            description,
        }, callbackEditTopic);
        setOpenDescriptionModal(false);
    };


    const handleDeleteImage = () => {
        setAnchorEl(null);
        editTopic(id, {
            imageUrl: '',
            topic: topicText,
            description,
        }, () => { setImageUrl(''); });
    };

    return (
        <Card className={ classes.root }>
            <CardHeader
                avatar={
                    <Avatar
                        alt="Remy Sharp"
                        src={ imageUrl || '/placeholder.png' }
                        className={ classes.large } />
                }
                title={
                    <Box
                        fontWeight="fontWeightBold"
                        fontSize={ 20 }>
                        { topicText }
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
                        <MenuItem onClick={ handleDescriptionModalOpen }>
                            <EditIcon className={ classes.menuIcon } />
                            Edit Topic
                        </MenuItem>
                        <MenuItem onClick={ handleImageUploadModalOpen }>
                            <ImageIcon className={ classes.menuIcon } />
                            Edit Image
                        </MenuItem>
                        <MenuItem onClick={ handleDeleteImage }>
                            <DeleteIcon className={ classes.menuIcon } />
                            Delete Image
                        </MenuItem>
                    </Menu>
                         </> }
                subheader={ description } />
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
            </CardActions>
            <FileUpload
                open={ openImageUploadModal }
                handleClose={ handleImageUploadModalClose }
                handleUpload={ handleImageUpload } />
            { openDescriptionModal && <DescriptionModal
                open={ openDescriptionModal }
                topic={ topicText }
                description={ description }
                disableBackdropClick
                handleDone={ handleOnEditQuestion }
                handleClose={ handleDescriptionModalClose } /> }
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
        editTopic: (topicId, body, cb) => {
            dispatch(editTopic(topicId, body, cb));
        },
        uploadTopicImage: (id, body, cb) => {
            dispatch(setPageLoader(true));
            dispatch(uploadTopicImage(id, body, cb));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicSection);
