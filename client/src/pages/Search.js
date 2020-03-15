import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import HelpIcon from '@material-ui/icons/Help';
import { Avatar as MuiAvatar, Divider } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import { requestSearch } from '../store/actions/search';


const useStyles = makeStyles((theme) => {
    return {
        root: {
            backgroundColor: theme.palette.background.paper,
            padding: 0,
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        heading: {
            marginBottom: 10,
        },
    };
});


function Search(props) {
    const {
        match: {
            params: { query 
},
        },
        requestSearch,
        results,
        user,
    } = props;

    const classes = useStyles();

    useEffect(() => {
        requestSearch({ text: query });
    }, [
        requestSearch,
        query,
    ]);

    const topic = (item) => (
        <Link
            className={ classes.link }
            to={ `/topic/${item._id}` }>
            <ListItem>
                <ListItemAvatar>
                    <Avatar
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
            <ListItem>
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
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <HelpIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
        </Link>
    );
    const answer = (item) => (
        <Link
            className={ classes.link }
            to={ `/answer/${item._id}` }>
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <QuestionAnswerOutlinedIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
        </Link>
    );
    const post = (item) => (
        <Link
            className={ classes.link }
            to={ `/post/${item._id}` }>
            <ListItem>
                <ListItemAvatar>
                    Post:
                </ListItemAvatar>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
        </Link>
    );
    const profile = (item) => (
        <Link
            className={ classes.link }
            to={ `/profile/${item._id}` }>
            <ListItem>
                <ListItemAvatar>
                    <Avatar
                        user={ item.options.email }
                        className={ classes.avatar } />
                </ListItemAvatar>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
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


    const renderSearchResults = () => (
        <List className={ classes.root }>
            { results.map((item) => (
                <>
                    { renderResults(item) }
                    <Divider />
                </>
            )) }
        </List>
    );


    return (
        <div className="App">
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    style={ { marginTop: 70 } }
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 7 }>
                        <Typography
                            component="div"
                            className={ classes.heading }>
                            Results for
                            { ' ' }
                            <b>
                                { query }
                            </b>
                        </Typography>
                        <Divider />
                        { results && renderSearchResults() }
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

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
export default connect(mapStateToProps, mapDispatchToProps)(Search);
