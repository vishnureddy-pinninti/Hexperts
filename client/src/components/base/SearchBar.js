/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import LinkIcon from '@material-ui/icons/Link';
import InputAdornment from '@material-ui/core/InputAdornment';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link, withRouter } from 'react-router-dom';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { requestSearch } from '../../store/actions/search';
import debounce from './debounce';
import Avatar from './Avatar';

const useStyles = makeStyles(() => {
    return {
        textField: {
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            width: '100%',
            padding: 10,
        },
        searchItem: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        avatar: {
            height: 25,
            width: 25,
        },
    };
});

function SearchBar(props) {
    const classes = useStyles();

    const {
        requestSearch,
        results,
        match: {
            params: { query 
},
        },
        history,
    } = props;

    const handleSearch = debounce((event, text) => {
        if (text){
            requestSearch({ text });
        }
    }, 250);

    const showSearchResults = (event, text) => {
        if (typeof text === 'string'){
            history.push(`/search/${text}`);
        }
    };

    const topic = (item) => (
        <Link
            className={ classes.link }
            to={ `/topic/${item._id}` }>
            <div className={ classes.searchItem }>
                <MuiAvatar
                    alt="Remy Sharp"
                    src={ item.options.imageUrl || '/placeholder.png' }
                    className={ classes.avatar } />
                <div style={ { marginLeft: 10 } }>
                    <span>Topic: </span>
                    <span dangerouslySetInnerHTML={ { __html: item.text } } />
                </div>
            </div>
        </Link>
    );
    const blog = (item) => (
        <Link
            className={ classes.link }
            to={ `/blog/${item._id}` }>
            <div className={ classes.searchItem }>
                <MuiAvatar
                    alt="Remy Sharp"
                    src={ item.options.imageUrl || '/blog-placeholder.png' }
                    className={ classes.avatar } />
                <div style={ { marginLeft: 10 } }>
                    <span>Blog: </span>
                    <span dangerouslySetInnerHTML={ { __html: item.text } } />
                </div>
            </div>
        </Link>
    );
    const question = (item) => (
        <Link
            className={ classes.link }
            to={ `/question/${item._id}` }>
            <div>
                Question:
                { ' ' }
                <span dangerouslySetInnerHTML={ { __html: item.text } } />
            </div>
        </Link>
    );
    const answer = (item) => (
        <Link
            className={ classes.link }
            to={ `/answer/${item._id}` }>
            <div>
                Answer:
                { ' ' }
                <span dangerouslySetInnerHTML={ { __html: item.text } } />
            </div>
        </Link>
    );
    const post = (item) => (
        <Link
            className={ classes.link }
            to={ `/post/${item._id}` }>
            <div>
                Post:
                { ' ' }
                <span dangerouslySetInnerHTML={ { __html: item.subtext } } />
            </div>
        </Link>
    );
    const profile = (item) => (
        <Link
            className={ classes.link }
            to={ `/profile/${item._id}` }>
            <div className={ classes.searchItem }>
                <Avatar
                    user={ item.options.email }
                    className={ classes.avatar } />
                <div style={ { marginLeft: 10 } }>
                    <span>Profile: </span>
                    <span dangerouslySetInnerHTML={ { __html: item.text } } />
                </div>
            </div>
        </Link>
    );

    const externals = (item) => (
        <a
            className={ classes.link }
            target="_blank"
            rel="noopener noreferrer"
            href={ item.options.link }>
            <div className={ classes.searchItem }>
                <MuiAvatar className={ classes.avatar }>
                    <LinkIcon style={ { backgroundColor: '#0097ba' } } />
                </MuiAvatar>
                <div style={ { marginLeft: 10 } }>
                    <span>External: </span>
                    <span dangerouslySetInnerHTML={ { __html: item.text } } />
                </div>
            </div>
        </a>
    );

    const renderResults = (item) => {
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

    return (
        <Autocomplete
            value={ query }
            onChange={ showSearchResults }
            onInputChange={ handleSearch }
            freeSolo
            id="free-solo-with-text-demo"
            options={ results }
            renderOption={ renderResults }
            style={ { width: 350 } }
            filterOptions={ (options) => options }
            renderInput={ (params) => (
                <TextField
                    ref={ params.InputProps.ref }
                    placeholder="Search…"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={ {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        ...params.inputProps,
                    } } />
            ) } />
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
