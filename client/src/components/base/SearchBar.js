import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import LinkIcon from '@material-ui/icons/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import HelpIcon from '@material-ui/icons/Help';
import { Avatar as MuiAvatar, Divider, Fab, Tooltip } from '@material-ui/core';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import SubjectIcon from '@material-ui/icons/Subject';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Avatar from './Avatar';
import { requestSearch } from '../../store/actions/search';
import { enableConfluenceSearch, disableConfluenceSearch } from '../../store/actions/auth';
import getBadge from '../../utils/badge';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ConfluenceLogin from './ConfluenceLogin';

const useStyles = makeStyles((theme) => {
    return {
        backdrop: {
            marginTop: 70,
        },
        paper: {
            width: 500,
            maxHeight: '80vh',
            overflow: 'scroll',
            marginTop: 15,
        },
        root: {
            backgroundColor: theme.palette.background.paper,
            padding: 0,
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        inputInput: {
            transition: theme.transitions.create('width'),
            borderRadius: 0,
            width: 'auto',
            [theme.breakpoints.up('md')]: {
                minWidth: '10em',
                maxWidth: '12em',
            },
            [theme.breakpoints.up('lg')]: {
                
                minWidth: '10em',
                maxWidth: '15.5em',
            },
        },
        searchFilter: {
            borderRadius: 0,
            backgroundColor: '#ffffff',
            boxShadow:"none",
        }
    };
});

function SearchBar(props) {
    
    const {
        match: {
            params: { query 
},
        },
        results,
        requestSearch,
        history,
        enableConfluenceSearch,
        disableConfluenceSearch,
        isConfluenceAuthorised,
        isConfluenceEnabled,
    } = props;

    const classes = useStyles();

    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);
    
    const [
        searchFilterAnchorEl,
        setSearchFilterAnchorEl,
    ] = React.useState(null);

    const [
        value,
        setValue,
    ] = React.useState(query);
    
    const [
        openConfluenceModal,
        setConfluenceModal,
    ] = React.useState(false);

    
    const handleConfluenceModalOpen = () => {
        setConfluenceModal(true);
    };

    const handleConfluenceModalClose = () => {
        setConfluenceModal(false);
    };

    const handleClick = (event) => {

        requestSearch({ text: event.target.value }, isConfluenceEnabled);
        setValue(event.target.value);
        if(event.target.value)
            setAnchorEl(event.currentTarget);
        else
            setAnchorEl(null);
    };

    const handleSearchFilter = (event) => {
        event.preventDefault();
        if(!isConfluenceEnabled){
            if(isConfluenceAuthorised){
                enableConfluenceSearch();
            }
            else{
                handleConfluenceModalOpen();
            }
        }
        else{
            disableConfluenceSearch();
        }
    }

    const handleClose = (event) => {
        if (event && event.relatedTarget && event.relatedTarget.parentElement.id === 'search-results') { return; }

        if (anchorEl) {
            anchorEl.focus();
        }
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const openFilter = Boolean(searchFilterAnchorEl);

    const topic = (item) => (
        <Link
            className={ classes.link }
            to={ `/topic/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <MuiAvatar
                        alt="Remy Sharp"
                        src={ item.options.imageUrl || '/placeholder.png' }
                        className={ classes.avatar } />
                </ListItemAvatar>
                <ListItemText
                    primary="Topic"
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const blog = (item) => (
        <Link
            className={ classes.link }
            to={ `/blog/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <MuiAvatar
                        alt="Remy Sharp"
                        src={ item.options.imageUrl || '/blog-placeholder.png' }
                        className={ classes.avatar } />
                </ListItemAvatar>
                <ListItemText
                    primary="Blog"
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const question = (item) => (
        <Link
            className={ classes.link }
            to={ `/question/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <MuiAvatar>
                        <HelpIcon />
                    </MuiAvatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const answer = (item) => (
        <Link
            className={ classes.link }
            to={ `/answer/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <MuiAvatar>
                        <QuestionAnswerOutlinedIcon />
                    </MuiAvatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const post = (item) => (
        <Link
            className={ classes.link }
            to={ `/post/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <MuiAvatar>
                        <SubjectIcon />
                    </MuiAvatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const profile = (item) => (
        <Link
            className={ classes.link }
            to={ `/profile/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <Avatar
                        badge={ getBadge(item.options.reputation) }
                        user={ item.options.email }
                        className={ classes.avatar } />
                </ListItemAvatar>
                <ListItemText
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const externals = (item) => (
        <a
            className={ classes.link }
            target="_blank"
            rel="noopener noreferrer"
            href={ item.options.link }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <Tooltip title="External Source">
                    <ListItemAvatar>
                        <MuiAvatar className={ classes.avatar }>
                            <LinkIcon />
                        </MuiAvatar>
                    </ListItemAvatar>
                </Tooltip>
                <ListItemText
                    primary="External Source"
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </a>
    );

    const confluence = (item) => (
        <a
            className={ classes.link }
            target="_blank"
            rel="noopener noreferrer"
            href={ item.options.link }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <MuiAvatar
                        alt="Confluence Icon"
                        src={ '/confluence-icon.png' }
                        className={ classes.avatar } />
                </ListItemAvatar>
                <ListItemText
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
        </a>
    );

    const renderResult = (item) => {
        switch (item.type){
            case 'topics':
                return topic(item);
            case 'questions':
                return question(item);
            case 'answers':
                return answer(item);
            case 'blogs':
                return blog(item);
            case 'posts':
                return post(item);
            case 'users':
                return profile(item);
            case 'externals':
                return externals(item);
            case 'confluence':
                return confluence(item);
            default:
                return question(item);
        }
    };

    
    const handleFilterClick = (event) => {
        setSearchFilterAnchorEl(event.currentTarget);
      };
    
      const handleFilterClose = () => {
        setSearchFilterAnchorEl(null);
      };

    const renderSearchResults = () => (
        <List
            className={ classes.root }
            id="search-results">
            { results.map((item) => (
                <Fragment key={ item._id }>
                    { renderResult(item) }
                    <Divider />
                </Fragment>
            )) }
        </List>
    );

    const id = open ? 'simple-popper' : undefined;

    return (
        <>
            <div className={ classes.root }>
                <TextField
                    aria-describedby={ id }
                    placeholder="Search…"
                    variant="outlined"
                    fullWidth
                    className={ classes.inputInput }
                    required
                    onBlur={ handleClose }
                    onClick={ handleClick }
                    onChange={ handleClick }
                    value={ value }
                    size="small"
                    onKeyPress={ (ev) => {
                        if (ev.key === 'Enter') {
                            if (typeof ev.target.value === 'string'){
                                if (anchorEl) {
                                    anchorEl.focus();
                                }
                                setAnchorEl(null);
                                history.push(`/search/${ev.target.value}`);
                            }
                        }
                    } }
                    InputProps={ {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    } } />
                    
                    <Fab size="small" className={classes.searchFilter} aria-label="filter" onClick={handleFilterClick}>
                        <ArrowDropDownIcon />
                    </Fab>
            </div>
            <ConfluenceLogin
                open={ openConfluenceModal }
                handleClose={ handleConfluenceModalClose } />
            <Popper
                id={ id }
                open={ open }
                style={ { zIndex: 20 } }
                placement="bottom-end"
                modifiers={ {
                    flip: {
                        enabled: true,
                    },
                    preventOverflow: {
                        enabled: false,
                        boundariesElement: 'scrollParent',
                    },
                    arrow: {
                        enabled: true,
                    },
                } }
                anchorEl={ anchorEl }>
                <Paper
                    elevation={ 10 }
                    className={ classes.paper }>
                    { results && renderSearchResults() }
                </Paper>
            </Popper>
            
            <Popper open={openFilter} anchorEl={searchFilterAnchorEl} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleFilterClose}>
                                <MenuList autoFocusItem={openFilter} id="menu-list-grow">
                                    <MenuItem>
                                    <FormControlLabel onClick={handleSearchFilter}
                                        control={<Checkbox
                                            checked={ isConfluenceEnabled }
                                            size="small" name="confluenceSearch" />}
                                        label="Geo - Confluence Search"/>
                                    </MenuItem>
                                </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                    </Popper>
        </>
    );
}

SearchBar.defaultProps = {
    results: [],
};

const mapStateToProps = (state) => {
    return {
        results: state.search.results,
        user: state.user.user,
        isConfluenceAuthorised: state.user.isConfluenceAuthorised,
        isConfluenceEnabled: state.user.isConfluenceEnabled,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestSearch: (body, isConfluenceEnabled) => {
            const params = { skip: 0, confluence: isConfluenceEnabled};
            dispatch(requestSearch(body, params));
        },
        enableConfluenceSearch: () => {
            dispatch(enableConfluenceSearch());
        },
        disableConfluenceSearch: () => {
            dispatch(disableConfluenceSearch());
        }
    };
};

export default (connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchBar)));
