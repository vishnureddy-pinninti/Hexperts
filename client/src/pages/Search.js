import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container, Typography, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Avatar, Divider, Tooltip, Button, CardHeader } from '@material-ui/core';
import { Help as HelpIcon, Link as LinkIcon, QuestionAnswerOutlined as QuestionAnswerOutlinedIcon } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import EmptyResults from '../components/base/EmptyResults';
import CardLoader from '../components/base/CardLoader';
import { requestAdvancedSearch } from '../store/actions/search';
import { toggleQuestionModal } from '../store/actions/questions';
import UserAvatar from '../components/base/Avatar';
import getBadge from '../utils/badge';

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
            position: 'sticky',
            top: 60,
            paddingTop: 10,
            paddingBottom: 10,
            zIndex: 1,
            backgroundColor: '#f0f2f2',
        },
    };
});

const Search = (props) => {
    const {
        match: {
            params: { query 
},
        },
        paginationHasMore,
        paginationIndex,
        results,
        requestSearch,
        totalCount,
        toggleQuestionModal,
    } = props;

    useEffect(() => {
        requestSearch({ text: query }, {
            skip: 0,
            limit: 20,
        });
    }, [ query ]);

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
                    <UserAvatar
                        badge={ getBadge(item.options.reputation) }
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
                        <Avatar className={ classes.avatar }>
                            <LinkIcon />
                        </Avatar>
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

    const loadMore = () => {
        requestSearch({ text: query }, { skip: paginationIndex * 10 });
    };

    const renderSearchResults = (items) => items.map((item, index) => {
        if (index > 0 && item.type === 'externals' && items[index - 1].type !== 'externals') {
            return (
                <div key={ index }>
                    <div style={ {
                        height: 40,
                        backgroundColor: '#f0f2f2',
                        paddingTop: 20,
                        fontWeight: 'bolder',
                    } }>
                        External Sources
                    </div>
                    { renderResults(item) }
                    <Divider />
                </div>
            );
        }
        return (
            <Fragment key={ index }>
                { renderResults(item) }
                <Divider />
            </Fragment>
        );
    });

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
                        <CardHeader
                            className={ classes.heading }
                            action={ <Button
                                variant="contained"
                                size="small"
                                style={ {
                                    marginTop: 20,
                                    marginLeft: 20,
                                } }
                                onClick={ () => { toggleQuestionModal(query); } }
                                startIcon={ <AddIcon /> }
                                color="primary">
                                Add Question
                                     </Button> }
                            title={ <Typography
                                component="div"
                                className={ classes.heading }>
                                Showing
                                { ' ' }
                                <b>
                                    { totalCount }
                                </b>
                                { ' ' }
                                Results for
                                { ' ' }
                                <b>
                                    { query }
                                </b>
                            </Typography> } />

                        { totalCount === null ? <CardLoader height={ 50 } />
                            : <List className={ classes.root }>
                                <InfiniteScroll
                                    dataLength={ results.length }
                                    next={ loadMore }
                                    hasMore={ paginationHasMore }
                                    loader={ <CardLoader height={ 50 } /> }>
                                    { renderSearchResults(results) }
                                </InfiniteScroll>
                                { results.length === 0 && !paginationHasMore
                                    && <EmptyResults
                                        showBackButton={ false }
                                        title=" Oops! No results matching with your criteria."
                                        description="Try different or less specific keywords and reset your filters." /> }
                            </List> }
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        results: state.search.advancedResults,
        totalCount: state.search.totalCount,
        paginationIndex: state.search.paginationIndex,
        paginationHasMore: state.search.paginationHasMore,
        newResults: state.search.newResults,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestSearch: (body, params) => {
            dispatch(requestAdvancedSearch(body, params));
        },
        toggleQuestionModal: (question) => {
            dispatch(toggleQuestionModal(question));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
