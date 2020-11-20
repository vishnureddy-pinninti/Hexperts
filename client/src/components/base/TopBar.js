import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles, rgbToHex } from '@material-ui/core/styles';
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
import HelpIcon from '@material-ui/icons/Help';

import Hotkeys from 'react-hot-keys';
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import moment from 'moment';
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
            [theme.breakpoints.up('md')]:{
                margin: '2px !important',
            },
            [theme.breakpoints.up('lg')]:{
                margin: '8px !important',
            },
        },
        logo: {
            height: 40,
            [theme.breakpoints.up('md')]:{
                height: 30,
            },
            [theme.breakpoints.up('lg')]:{
                height: 40,
            }
        },
        menu: {
            '& > *': {
                margin: theme.spacing(1),
            },
            paddingRight: 10,
            paddingLeft: 10,
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                paddingRight: 0,
                paddingLeft: 0,
            },
            [theme.breakpoints.up('lg')]: {
                paddingRight: 10,
                paddingLeft: 10,
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
            [theme.breakpoints.up('md')]:{
                marginLeft: theme.spacing(0),
                marginRight: theme.spacing(1),
            },
            [theme.breakpoints.up('lg')]:{
                marginLeft: theme.spacing(3),
                marginRight: theme.spacing(2),
            }
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
        sectionUserAvatar: {
            [theme.breakpoints.up('md')]: {
                padding: 6,
            },
            [theme.breakpoints.up('lg')]: {
                padding: 12,
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
            backgroundSize: '1400px 100%',
            backgroundPosition: 'center',
        },
        adminTopBar: {
            backgroundColor: '#0088ac',
            backgroundImage: 'url(/topbar.png)',
            backgroundRepeat: 'no-repeat',
            objectFit: 'cover',
            backgroundSize: '1400px 100%',
            backgroundPosition: 'center',
        },
        small: {
            width: theme.spacing(2),
            height: theme.spacing(2),
        },
        helpButton:{
            color: '#ffffff'
        }
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

    const driver = new Driver({
        allowClose: false,
        animate: false,
        keyboardControl: true,
        closeBtnText: '&times;',
        doneBtnText:'&#10004;',
        prevBtnText: '&#x2039;',
        nextBtnText: '&#x203A;',
    });
    
    const requestTourStatus = () => {
        try {
            const timeStamp = localStorage.getItem('TourState');
            if (timeStamp === null) {
                var currentTimeStamp = moment();
                localStorage.setItem('TourState', currentTimeStamp.format('L'));
                driver.start();
            }
            else{
                var createdDate = moment(new Date(timeStamp));
                var currentDate = moment();
                if(currentDate.diff(createdDate, 'days') > 15){
                    localStorage.setItem('TourState', currentDate.format('L'));
                    driver.start();
                }
            }
        } catch (err) {
            //console.log(err);
        }
    }    

    useEffect(() => {
        driver.defineSteps([
            {
                element: '#Discover-Topics',
                popover: {
                    title: ' ',
                    description: 'Explore different topics. Subscribe to subjects of your interest.',
                    position: 'right'
                }
            },
            {
                element: '#Infinite-Scroll',
                popover: {
                    title: ' ',
                    description: 'View questions and answers in the areas of your interest.',
                    position: 'left'
                }
            },
            {
                element: '#Answer-a-question',
                popover: {
                    title: ' ',
                    description: 'Answer a question.',
                    position: 'bottom-center'
                }
            },
            {
                element: '#Read-write-blogs',
                popover: {
                    title: ' ',
                    description: 'Read blogs. You can add new blogs also.',
                    position: 'bottom-center'
                }
            },
            {
                element: '#Get-Notifications',
                popover: {
                    title: ' ',
                    description: 'View notifications.',
                    position: 'bottom-center'
                }
            },
            {
                element: '#Admin-dashboard',
                popover: {
                    title: ' ',
                    description: 'View Hexpert statistics.',
                    position: 'bottom-center'
                }
            },
            {
                element: '#Search-Bar',
                popover: {
                    title: ' ',
                    description: 'Search for any information. Hexperts will find the result from this and other relevant sites.',
                    position: 'bottom-center'
                }
            },
            {
                element: '#Ask-Question',
                popover: {
                    title: ' ',
                    description:'Post your questions here.',
                    position: 'bottom-center'
                }
            },
            {
                element: '#Hexpets-Feedback',
                popover: {
                    title: ' ',
                    description:'Suggest how we can improve Hexperts further.',
                    position: 'bottom-center'
                }
            },
            {
                element: '#Top-Contributors',
                popover: {
                    title: ' ',
                    description: 'Meet three top Hexperts contributors .',
                    position: 'left'
                }
            },
            {
                element: '#Trending-Questions',
                popover: {
                    title: ' ',
                    description: 'View questions that are trending in Hexperts.',
                    position: 'left'
                }
            },
        ]);
        requestTourStatus();
    }, [requestTourStatus, driver])

    const handleTourOpen = () => {
        document.getElementById('hexperts-tour').blur();
        driver.start();
    }

    document.onkeypress = function(e) {
        e = e || window.event;
        var code = e.code;
        if (code.toLowerCase() === 'Space'.toLowerCase() && driver.isActivated) {
            e.preventDefault();
            return false;
        }
    }

    
    const onKeyUp = () => {
        if(driver.isActivated){
            if(driver.hasNextStep()){
                driver.moveNext();
            }
            else{
                driver.reset();
            }
        }
    }

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
            <MenuItem onClick={ () => { history.push('/'); } }>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <HomeIcon />
                </IconButton>
                <p>Home</p>
            </MenuItem>
            <MenuItem onClick={ () => { history.push('/answer'); } }>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <EditIcon />
                </IconButton>
                <p>Answer</p>
            </MenuItem>
            <MenuItem onClick={ () => { history.push('/blogs'); } }>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <SubjectIcon />
                </IconButton>
                <p>Blogs</p>
            </MenuItem>
            <MenuItem onClick={ () => { history.push('/notifications'); } }>
                <IconButton
                    aria-label="show 11 new notifications"
                    color="inherit">
                    <Badge
                        badgeContent={ notificationCount }
                        color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={ () => { history.push('/dashboard'); } }>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <DashboardIcon />
                </IconButton>
                <p>Dashboard</p>
            </MenuItem>
            <MenuItem
                onClick={ handleProfileClick }>
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
            <Hotkeys 
                keyName="tab,enter,space" 
                onKeyUp={onKeyUp}>
            </Hotkeys>
            <AppBar
                position="fixed"
                elevation={ 1 }
                className={ isAdmin(user) ? classes.adminTopBar : classes.topBar }
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
                                    id="Answer-a-question"
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
                                    id="Read-write-blogs"
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
                                    id="Get-Notifications"
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
                                        id="Admin-dashboard"
                                        to="/dashboard"
                                        className={ classes.link }>
                                        <Button
                                            startIcon={ <DashboardIcon /> }
                                            size="large"
                                            className={ path === '/dashboard' ? classes.activeMenuButton : classes.menuButton }>
                                            Dashboard
                                        </Button>
                                    </Link>
                                }
                            </div>
                            <div id="Search-Bar" className={ classes.search }>
                                <SearchBar />
                            </div>
                            <div className={ classes.inline }>
                                <Button
                                    id="Ask-Question"
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={ handleClickQuestionModalOpen }>
                                    Ask Question
                                </Button>
                            </div>
                            <div className={ classes.sectionDesktop }>
                                <IconButton
                                    className= { classes.sectionUserAvatar }
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={ menuId }
                                    aria-haspopup="true"
                                    onClick={ handleProfileClick }
                                    color="inherit">
                                    <Avatar
                                        alt={ user.name }
                                        badge={ getBadge(user.reputation) }
                                        user={ user.email } />
                                    { /* <Avatar user={ user.email } /> */ }
                                </IconButton>
                            </div>
                            <div className={ classes.sectionDesktop }>
                                <IconButton
                                    id="hexperts-tour"
                                    edge="end"
                                    aria-label="hexperts tour"
                                    aria-controls={ menuId }
                                    aria-haspopup="true"
                                    onClick={ handleTourOpen }
                                    color="inherit">
                                    <HelpIcon 
                                    className={ classes.helpButton }/>
                                </IconButton>
                            </div>
                            <div className={ classes.sectionMobile }>
                                <IconButton
                                    aria-label="show more"
                                    aria-controls={ mobileMenuId }
                                    aria-haspopup="true"
                                    onClick={ handleMobileMenuOpen }
                                    style={ { color: 'white' } }>
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
                open={ !!newQuestion.question }
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
        showTour: state.showTour,
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
