import React from 'react';
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
import HelpIcon from '@material-ui/icons/Help';
import { Avatar as MuiAvatar, Divider, Tooltip } from '@material-ui/core';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Avatar from './Avatar';
import { requestSearch } from '../../store/actions/search';
import getBadge from '../../utils/badge';

const useStyles = makeStyles((theme) => {
    return {
        backdrop: {
            marginTop: 70,
        },
        paper: {
            width: 500,
            maxHeight: 700,
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
            width: 'auto',
            [theme.breakpoints.up('md')]: {
                width: 400,
            },
        },
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
    } = props;

    const classes = useStyles();

    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);

    const [
        value,
        setValue,
    ] = React.useState(query);

    const handleClick = (event) => {
        requestSearch({ text: event.target.value });
        setValue(event.target.value);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        if (event && event.relatedTarget && event.relatedTarget.parentElement.id === 'search-results') { return; }

        if (anchorEl) {
            anchorEl.focus();
        }
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

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
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const blog = (item) => (
        <Link
            className={ classes.link }
            to={ `/blog/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <Avatar
                        alt="Remy Sharp"
                        src={ item.options.imageUrl || '/blog-placeholder.png' }
                        className={ classes.avatar } />
                </ListItemAvatar>
                <ListItemText
                    primary="Blog"
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const question = (item) => (
        <Link
            className={ classes.link }
            to={ `/question/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <Avatar>
                        <HelpIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const answer = (item) => (
        <Link
            className={ classes.link }
            to={ `/answer/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    <Avatar>
                        <QuestionAnswerOutlinedIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> } />
            </ListItem>
        </Link>
    );

    const post = (item) => (
        <Link
            className={ classes.link }
            to={ `/post/${item._id}` }>
            <ListItem onClick={ () => { setAnchorEl(null); } }>
                <ListItemAvatar>
                    Post:
                </ListItemAvatar>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> } />
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
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> } />
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
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> } />
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
            default:
                return question(item);
        }
    };

    const renderSearchResults = () => (
        <List
            className={ classes.root }
            id="search-results">
            { results.map((item) => (
                <>
                    { renderResult(item) }
                    <Divider />
                </>
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
            </div>
            <Popper
                id={ id }
                open={ open }
                style={ { zIndex: 2 } }
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
        </>
    );
}

SearchBar.defaultProps = {
    results: [],
};

const mapStateToProps = (state) => {
    return {
        results: state.search.results,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestSearch: (body) => {
            dispatch(requestSearch(body));
        },
    };
};

export default (connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchBar)));
