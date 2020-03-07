import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import Snackbar from '@material-ui/core/Snackbar';
import Avatar from './Avatar';
import QuestionModal from './QuestionModal';
import SearchBar from './SearchBar';

const useStyles = makeStyles((theme) => {
    return {
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
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
            display: 'inline-block',
            fontWeight: 'bold',
            color: theme.palette.primary.dark,
        },
        menu: {
            '& > *': {
                margin: theme.spacing(1),
            },
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
        openQModal,
        setOpenQModal,
    ] = React.useState(false);

    const handleClickQuestionModalOpen = () => {
        setOpenQModal(true);
    };

    const handleQuestionModalClose = () => {
        setOpenQModal(false);
    };

    const {
        pending,
        location,
        history,
        newQuestion,
        answerPending,
        user,
    } = props;

    useEffect(() => {
        if (!pending) {
            setOpenQModal(pending);
        }
    }, [ pending ]);


    useEffect(() => {
        if (!pending && newQuestion && newQuestion._id) {
            history.push(`/question/${newQuestion._id}`);
        }
    }, [
        history,
        newQuestion,
        newQuestion._id,
        pending,
    ]);

    const [
        value,
        setValue,
    ] = React.useState(2);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleProfileClick = () => {
        history.push(`/profile/${user._id}`);
    };

    const menuId = 'primary-search-account-menu';

    const renderMenu = (
        <Menu
            anchorEl={ anchorEl }
            anchorOrigin={ {
                vertical: 'top',
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
            <MenuItem onClick={ handleProfileClick }>Profile</MenuItem>
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
                <p>Answert</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    aria-label="show 4 new mails"
                    color="inherit">
                    <GroupIcon />
                </IconButton>
                <p>Spaces</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    aria-label="show 11 new notifications"
                    color="inherit">
                    <Badge
                        badgeContent={ 11 }
                        color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={ handleProfileMenuOpen }>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit">
                    <Avatar />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const renderQuestionModal = (
        <QuestionModal
            open={ openQModal }
            handleClose={ handleQuestionModalClose } />
    );

    return (
        <div className={ classes.grow }>
            <AppBar
                position="fixed"
                elevation={ 1 }
                color="inherit">
                <Grid
                    container
                    justify="center">
                    <Grid
                        item>
                        <Toolbar>
                            <div className={ classes.inline }>
                                <Typography
                                    variant="h6"
                                    color="inherit"
                                    noWrap>
                                    <Link
                                        to="/"
                                        className={ classes.link }>
                                        { /* <img
                                            src="/hexagon.jpg"
                                            className={ classes.logo }
                                            width={ 180 }
                                            alt="logo" /> */ }
                                        <span className={ classes.logo }>HexagonQA</span>
                                    </Link>
                                </Typography>
                            </div>
                            <div className={ classes.menu }>
                                <Link
                                    to="/"
                                    className={ classes.link }>
                                    <Button
                                        startIcon={ <HomeIcon /> }>
                                        Home
                                    </Button>
                                </Link>
                                <Link
                                    to="/answer"
                                    className={ classes.link }>
                                    <Badge
                                        badgeContent={ 2 }
                                        color="secondary">
                                        <Button
                                            startIcon={ <EditIcon /> }>
                                            Answer
                                        </Button>
                                    </Badge>
                                </Link>
                                <Link
                                    to="/spaces"
                                    className={ classes.link }>
                                    <Button
                                        startIcon={ <GroupIcon /> }>
                                        Spaces
                                    </Button>
                                </Link>
                                <Link
                                    to="/notifications"
                                    className={ classes.link }>
                                    <Badge
                                        badgeContent={ 17 }
                                        color="secondary">
                                        <Button
                                            startIcon={ <NotificationsIcon /> }>
                                            Notifications
                                        </Button>
                                    </Badge>
                                </Link>
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
                                    onClick={ handleProfileMenuOpen }
                                    color="inherit">
                                    <Avatar />
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
            </AppBar>
            { renderMobileMenu }
            { renderMenu }
            { renderQuestionModal }
            <Snackbar
                open={ newQuestion._id }
                message="Adding Question" />
        </div>
    );
};

TopBar.propTypes = {
    handleDrawerOpen: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        pending: state.questions.pending,
        answerPending: state.answer.pending,
        newQuestion: state.questions.newQuestion,
    };
};

const mapDispatchToProps = () => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopBar));
