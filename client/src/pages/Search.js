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
import { Avatar as MuiAvatar, Divider, Tooltip } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import InfiniteScroll from 'react-infinite-scroll-component';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import EmptyResults from '../components/base/EmptyResults';

import { requestAdvancedSearch } from '../store/actions/search';


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
            <ListItem>
                <Tooltip title="External Source">
                    <ListItemAvatar>
                        <MuiAvatar className={ classes.avatar }>
                            <LinkIcon />
                        </MuiAvatar>
                    </ListItemAvatar>
                </Tooltip>
                <ListItemText
                    primary={ <div dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <div dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
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

    const [
        items,
        setItems,
    ] = React.useState([]);

    const [
        pagination,
        setPagination,
    ] = React.useState({
        index: 1,
        hasMore: true,
    });

    useEffect(() => {
        if (results.length) {
            setItems([
                ...items,
                ...results,
            ]);
            setPagination({
                index: pagination.index + 1,
                hasMore: true,
            });
        }
        else {
            setPagination({
                ...pagination,
                hasMore: false,
            });
        }
    }, [ results ]);

    useEffect(() => {
        setItems([]);
        requestSearch({ text: query }, {
            skip: 0,
            limit: 20,
        });
    }, [
        requestSearch,
        query,
    ]);

    const loadMore = () => {
        requestSearch({ text: query }, { skip: pagination.index * 10 });
    };


    const renderSearchResults = (items) => items.map((item) => (
        <>
            { renderResults(item) }
            <Divider />
        </>
    ));


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
                        <List className={ classes.root }>
                            <InfiniteScroll
                                dataLength={ items.length }
                                next={ loadMore }
                                hasMore={ pagination.hasMore }
                                loader={ <h4>Loading...</h4> }
                                endMessage={
                                    <p style={ { textAlign: 'center' } }>
                                        <b>Yay! You have seen it all</b>
                                    </p>
                                }>
                                { renderSearchResults(items) }
                            </InfiniteScroll>
                            { items.length === 0
            && <EmptyResults
                showBackButton={ false }
                title=" Oops! No results matching with your criteria."
                description="Try different or less specific keywords and reset your filters." /> }
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        results: state.search.advancedResults,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestSearch: (body, params) => {
            dispatch(requestAdvancedSearch(body, params));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
