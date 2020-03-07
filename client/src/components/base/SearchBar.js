/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link } from 'react-router-dom';
import { requestSearch } from '../../store/actions/search';
import debounce from './debounce';

const useStyles = makeStyles((theme) => {
    return {
        textField: {
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
    };
});

function SearchBar(props) {
    const classes = useStyles();
    const [
        value,
        setValue,
    ] = React.useState(null);

    const { requestSearch, results } = props;

    React.useEffect(() => {
        requestSearch({ text: '' });
    }, [ requestSearch ]);

    const handleSearch = debounce((event, text) => {
        requestSearch({ text });
    }, 250);

    const topic = (item) => (
        <Link
            className={ classes.link }
            to={ `/topic/${item._id}` }>
            <div>
                Topic:
                { ' ' }
                <span dangerouslySetInnerHTML={ { __html: item.text } } />
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
    const profile = (item) => (
        <Link
            className={ classes.link }
            to={ `/profile/${item._id}` }>
            <div>
                User:
                { ' ' }
                <span dangerouslySetInnerHTML={ { __html: item.text } } />
            </div>
        </Link>
    );

    const renderResults = (item) => {
        switch (item.type){
            case 'topics':
                return topic(item);
            case 'questions':
                return question(item);
            case 'answers':
                return answer(item);
            case 'users':
                return profile(item);
            default:
                return question(item);
        }
    };

    return (
        <Autocomplete
            value={ value }
            onInputChange={ handleSearch }
            freeSolo
            id="free-solo-with-text-demo"
            options={ results }
            renderOption={ renderResults }
            style={ { width: 300 } }
            renderInput={ (params) => (
                <TextField
                    ref={ params.InputProps.ref }
                    placeholder="Search…"
                    variant="outlined"
                    fullWidth
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
