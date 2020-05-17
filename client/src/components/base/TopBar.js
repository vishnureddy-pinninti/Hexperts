import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import EditIcon from '@material-ui/icons/Edit';
import SubjectIcon from '@material-ui/icons/Subject';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from './Avatar';
import QuestionModal from './QuestionModal';
import DescriptionModal from './DescriptionModal';
import SearchBar from './SearchBar';
import EditTopicsModal from '../topic/EditTopicsModal';
import EditSuggestedWriters from '../question/EditSuggestedWriters';
import EditCode from './EditCode';

import getBadge from '../../utils/badge';
import { editCode } from '../../store/actions/answer';
import { addUserQuestion, addQuestionPending, toggleQuestionModal } from '../../store/actions/questions';
import { isAdmin } from '../../utils/common';

const useStyles = makeStyles((theme) => {
    return {
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            color: 'white',
        },
        activeMenuButton: {
            color: theme.palette.primary.light,
        },
        toolbar: {
            alignItems: 'center',
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        inline: {
            display: 'inline',
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        logo: {
            height: 40,
        },
        menu: {
            '& > *': {
                margin: theme.spacing(1),
            },
            paddingRight: 20,
            paddingLeft: 10,
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
            // border: '2px solid #e2e2e2',
        },
        searchIcon: {
            width: theme.spacing(7),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 7),
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: 300,
            },
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        topBar: {
            backgroundColor: '#0088ac',
            backgroundImage: 'url(/topbar.png)',
            backgroundRepeat: 'no-repeat',
            objectFit: 'cover',
            backgroundSize: '1250px 100%',
            backgroundPosition: 'center',
        },
        small: {
            width: theme.spacing(2),
            height: theme.spacing(2),
        },
    };
});

const TopBar = (props) => {
    const classes = useStyles();
    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);
    const [
        mobileMoreAnchorEl,
        setMobileMoreAnchorEl,
    ] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const [
        openEditTopicsModal,
        setOpenEditTopicsModal,
    ] = React.useState(false);

    const [
        openDescriptionModal,
        setOpenDescriptionModal,
    ] = React.useState(false);

    const [
        pageLoading,
        setPageLoading,
    ] = React.useState(false);

    const [
        openEditSuggestedWritersModal,
        setOpenEditSuggestedWritersModal,
    ] = React.useState(false);

    const {
        pending,
        history,
        match,
        user,
        notificationCount,
        addedQuestion,
        addUserQuestion,
        toggleQuestionModal,
        questionModal,
        pageLoader,
        codeConfig,
        editCode,
    } = props;

    const { path } = match;

    const handleClickQuestionModalOpen = () => {
        toggleQuestionModal();
    };

    const [
        newQuestion,
        setNewQuestion,
    ] = React.useState({});

    useEffect(() => {
        if (!pending && addedQuestion && addedQuestion._id) {
            setPageLoading(false);
            setNewQuestion({});
            history.push(`/question/${addedQuestion._id}`);
        }
    }, [
        history,
        addedQuestion,
        pending,
    ]);

    const handleOnAddQuestion = (question, questionSuggestions) => {
        toggleQuestionModal();
        setNewQuestion({
            question,
            questionSuggestions,
        });
        setOpenDescriptionModal(true);
    };

    const handleOnAddDescription = (description) => {
        setOpenDescriptionModal(false);
        setNewQuestion({
            ...newQuestion,
            description,
        });
        setOpenEditTopicsModal(true);
    };

    const handleEditTopicsModalSubmit = (selectedTopics, topics) => {
        setNewQuestion({
            ...newQuestion,
            selectedTopics,
            topics,
        });
        setOpenEditTopicsModal(false);
        setOpenEditSuggestedWritersModal(true);
    };

    const handleEditSuggestedWritersModalSubmit = (suggestedExperts) => {
        setPageLoading(true);
        addUserQuestion({
            question: newQuestion.question,
            topics: newQuestion.topics,
            description: newQuestion.description,
            suggestedExperts,
        });
        setOpenEditSuggestedWritersModal(false);
    };

    const handleQuestionModalClose = () => {
        setNewQuestion({});
        toggleQuestionModal();
    };

    const handleEditSuggestedWritersModalClose = () => {
        setNewQuestion({});
        setOpenEditSuggestedWritersModal(false);
    };

    const handleEditTopicsModalClose = () => {
        setNewQuestion({});
        setOpenEditTopicsModal(false);
    };

    const handleDescriptionModalClose = () => {
        setNewQuestion({});
        setOpenDescriptionModal(false);
    };


    const handleProfileClick = () => {
        history.push(`/profile/${user._id}`);
    };

    const menuId = 'primary-search-account-menu';

    const renderMenu = (
        <Menu
            anchorEl={ anchorEl }
            anchorOrigin={ {
                vertical: 'bottom',
                horizontal: 'right',
            } }
            id={ menuId }
            keepMounted
            transformOrigin={ {
                vertical: 'top',
                horizontal: 'right',
            } }
            open={ isMenuOpen }
            onClose={ handleMenuClose }>
            <MenuItem onClick={ props.onLogout }>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={ mobileMoreAnchorEl }
            anchorOrigin={ {
                vertical: 'top',
                horizontal: 'right',
            } }
            id={ mobileMenuId }
            keepMounted
            transformOrigin={ {
                vertical: 'top',
                horizontal: 'right',
            } }
            open={ isMobileMenuOpen }
            onClose={ handleMobileMenuClose }>
            <MenuItem>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <HomeIcon />
                </IconButton>
                <p>Home</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <Badge
                        badgeContent={ 11 }
                        color="secondary">
                        <EditIcon />
                    </Badge>
                </IconButton>
                <p>Answer</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <SubjectIcon />
                </IconButton>
                <p>Spaces</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    aria-label="show 11 new notifications"
                    color="inherit">
                    <Badge
                        badgeContent={ user.notificationCount }
                        color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem
                onClick={ handleProfileClick }
                onMouseHover={ handleProfileMenuOpen }>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit">
                    <Avatar user={ user.email } />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const renderQuestionModal = (
        <QuestionModal
            open={ questionModal }
            handleClose={ handleQuestionModalClose }
            handleDone={ handleOnAddQuestion } />
    );

    const [
        codeObj,
        setCodeObj,
    ] = React.useState({});

    React.useEffect(() => {
        setCodeObj(codeConfig);
    }, [ codeConfig ]);


    const handleSave = (data) => {
        if (codeObj.callback) { codeObj.callback(data); }
        editCode({});
    };

    const handleClose = () => {
        setCodeObj({ open: false });
        editCode({});
    };

    return (
        <div className={ classes.grow }>
            <AppBar
                position="fixed"
                elevation={ 1 }
                className={ classes.topBar }
                color="default">
                <Grid
                    container
                    justify="center">
                    <Grid
                        item>
                        <Toolbar>
                            <div className={ classes.inline }>
                                <Link
                                    to="/"
                                    className={ classes.link }>
                                    <img
                                        src="/logo.png"
                                        className={ classes.logo }
                                        alt="logo" />
                                </Link>
                            </div>
                            <div className={ classes.grow } />
                            <div className={ classes.menu }>
                                <Link
                                    to="/"
                                    className={ classes.link }>
                                    <Button
                                        startIcon={ <HomeIcon /> }
                                        size="large"
                                        className={ path === '/' ? classes.activeMenuButton : classes.menuButton }>
                                        Home
                                    </Button>
                                </Link>
                                <Link
                                    to="/answer"
                                    className={ classes.link }>
                                    <Badge
                                        badgeContent={ 0 }
                                        color="secondary">
                                        <Button
                                            startIcon={ <EditIcon /> }
                                            size="large"
                                            className={ path === '/Answer' ? classes.activeMenuButton : classes.menuButton }>
                                            Answer
                                        </Button>
                                    </Badge>
                                </Link>
                                <Link
                                    to="/blogs"
                                    className={ classes.link }>
                                    <Button
                                        startIcon={ <SubjectIcon /> }
                                        size="large"
                                        className={ path === '/Blogs' || path.startsWith('/Blog') || path.startsWith('/Post') ? classes.activeMenuButton : classes.menuButton }>
                                        Blogs
                                    </Button>
                                </Link>
                                <Link
                                    to="/notifications"
                                    className={ classes.link }>
                                    <Badge
                                        badgeContent={ notificationCount }
                                        color="secondary">
                                        <Button
                                            startIcon={ <NotificationsIcon /> }
                                            size="large"
                                            className={ path === '/Notifications' ? classes.activeMenuButton : classes.menuButton }>
                                            Notifications
                                        </Button>
                                    </Badge>
                                </Link>
                                {
                                    isAdmin(user) && <Link
                                        to="/dashboard"
                                        className={ classes.link }>
                                        <Badge
                                            badgeContent={ notificationCount }
                                            color="secondary">
                                            <Button
                                                startIcon={ <DashboardIcon /> }
                                                size="large"
                                                className={ path === '/dashboard' ? classes.activeMenuButton : classes.menuButton }>
                                                Dashboard
                                            </Button>
                                        </Badge>
                                    </Link>
                                }
                            </div>
                            <div className={ classes.search }>
                                <SearchBar />
                            </div>
                            <div className={ classes.inline }>
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={ handleClickQuestionModalOpen }>
                                    Ask Question
                                </Button>
                            </div>
                            <div className={ classes.sectionDesktop }>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={ menuId }
                                    aria-haspopup="true"
                                    onClick={ handleProfileClick }
                                    onMouseHover={ handleProfileMenuOpen }
                                    color="inherit">
                                    <Avatar
                                        alt={ user.name }
                                        badge={ getBadge(user.reputation) }
                                        user={ user.email } />
                                    { /* <Avatar user={ user.email } /> */ }
                                </IconButton>
                            </div>
                            <div className={ classes.sectionMobile }>
                                <IconButton
                                    aria-label="show more"
                                    aria-controls={ mobileMenuId }
                                    aria-haspopup="true"
                                    onClick={ handleMobileMenuOpen }
                                    color="inherit">
                                    <MoreIcon />
                                </IconButton>
                            </div>
                        </Toolbar>
                    </Grid>
                </Grid>
                { (pageLoading || pageLoader)
                && <LinearProgress
                    variant="query"
                    color="secondary" /> }
            </AppBar>
            { renderMobileMenu }
            { renderMenu }
            { questionModal && renderQuestionModal }
            { newQuestion.question && <EditTopicsModal
                open={ openEditTopicsModal }
                question={ newQuestion.question }
                topics={ newQuestion.questionSuggestions.topicSuggestions }
                questionID={ newQuestion._id }
                disableBackdropClick
                handleDone={ handleEditTopicsModalSubmit }
                handleClose={ handleEditTopicsModalClose } /> }
            { openEditSuggestedWritersModal && newQuestion.question && <EditSuggestedWriters
                open={ openEditSuggestedWritersModal }
                question={ newQuestion.question }
                topics={ newQuestion.selectedTopics }
                questionID={ newQuestion._id }
                disableBackdropClick
                handleDone={ handleEditSuggestedWritersModalSubmit }
                handleClose={ handleEditSuggestedWritersModalClose } /> }
            { newQuestion.question && <DescriptionModal
                open={ openDescriptionModal }
                questionText={ newQuestion.question }
                disableBackdropClick
                handleDone={ handleOnAddDescription }
                handleClose={ handleDescriptionModalClose } /> }
            <Snackbar
                open={ newQuestion.question }
                message="Adding Question" />
            { codeObj.open && <EditCode
                open={ codeObj.open }
                lang={ codeObj.language }
                handleClose={ handleClose }
                handleSave={ handleSave }
                value={ codeObj.value } /> }
        </div>
    );
};

TopBar.defaultProps = {
    codeConfig: {},
};

TopBar.propTypes = {
    codeConfig: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        pending: state.questions.pending,
        answerPending: state.answer.pending,
        addedQuestion: state.questions.newQuestion,
        notificationCount: state.user.notificationCount,
        questionModal: state.questions.questionModal,
        pageLoader: state.user.pageLoader,
        codeConfig: state.answer.codeConfig,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addUserQuestion: (body, callback) => {
            dispatch(addQuestionPending());
            dispatch(addUserQuestion(body, callback));
        },
        toggleQuestionModal: () => {
            dispatch(toggleQuestionModal());
        },
        editCode: (data) => {
            dispatch(editCode(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopBar));
