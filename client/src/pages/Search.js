import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { makeStyles } from '@material-ui/core/styles';
import { Grid,
    TextField,
    Container,
    Typography,
    Avatar as MuiAvatar,
    List, ListItem, ListItemText,
    ListItemAvatar, Box, Chip, Avatar,
    Divider, Tooltip, Button, CardHeader } from '@material-ui/core';
import { Help as HelpIcon, Link as LinkIcon, QuestionAnswerOutlined as QuestionAnswerOutlinedIcon } from '@material-ui/icons';
import SubjectIcon from '@material-ui/icons/Subject';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import EmptyResults from '../components/base/EmptyResults';
import CardLoader from '../components/base/CardLoader';
import { requestAdvancedSearch } from '../store/actions/search';
import { toggleQuestionModal } from '../store/actions/questions';
import UserAvatar from '../components/base/Avatar';
import getBadge from '../utils/badge';
import { requestTopics } from '../store/actions/topic';


const filter = createFilterOptions();

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
        fixed: {
            position: 'fixed',
        },
        menu: {
            display: 'flex',
            flexDirection: 'column',
        },
        chip: {
            marginBottom: 10,
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
        loading,
        topicsList,
        requestTopics,
        isConfluenceEnabled,
    } = props;

    const [
        selectedTab,
        setSelectedTab,
    ] = React.useState('all');

    const [
        showTopicSearch,
        setShowTopicSearch,
    ] = React.useState(true);

    const [
        topicsTab,
        setTopicsTab,
    ] = React.useState('all');

    const [
        checked,
        setChecked,
    ] = React.useState([]);

    const [
        selectedTopics,
        setSelectedTopics,
    ] = React.useState([]);

    const [
        value,
        setValue,
    ] = React.useState(null);

    useEffect(() => {
        requestTopics();
    }, [ requestTopics ]);

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
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
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
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> } />
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
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
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
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
        </Link>
    );

    const post = (item) => (
        <Link
            className={ classes.link }
            to={ `/post/${item._id}` }>
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <SubjectIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
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
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
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
                    primary={ <span dangerouslySetInnerHTML={ { __html: item.text } } /> }
                    secondary={ <span dangerouslySetInnerHTML={ { __html: item.subtext } } /> } />
            </ListItem>
        </a>
    );

    const confluence = (item) => (
        <a
            className={ classes.link }
            target="_blank"
            rel="noopener noreferrer"
            href={ item.options.link }>
            <ListItem>
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
            case 'confluence':
                return confluence(item);
            default:
                return question(item);
        }
    };

    const loadMore = () => {
        if (selectedTab === 'all'){
            requestSearch({
                text: query,
                topics: checked,
            }, { skip: paginationIndex * 10 });
        }
        else {
            const req = {
                text: query,
                categories: [ selectedTab ],
            };
            if ([
                'users',
                'topics',
                'externals',
            ].indexOf(selectedTab) < 0){
                req.topics = checked;
            }
            requestSearch(req, { skip: paginationIndex * 10 });
        }
    };

    const renderSearchResults = (items) => items.map((item, index) => {
        if (index > 0 && item.type === 'confluence' && items[index - 1].type !== 'confluence') {
            return (
                <div key={ index }>
                    <div style={ {
                        height: 40,
                        backgroundColor: '#f0f2f2',
                        paddingTop: 20,
                        fontWeight: 'bolder',
                    } }>
                        Geo - Confluence Results
                    </div>
                    { renderResults(item) }
                    <Divider />
                </div>
            );
        }
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

    const filterByTopics = (type, topics) => {
        const req = { text: query };
        if (selectedTab !== 'all'){
            req.categories = [ selectedTab ];
        }
        switch (type){
            case 'all':
                setChecked([]);
                setSelectedTopics([]);
                setTopicsTab('all');
                requestSearch(req, {
                    skip: 0,
                    limit: 20,
                    confluence: isConfluenceEnabled,
                });
                break;
            default:
                req.topics = topics;
                setTopicsTab('none');
                requestSearch(req, {
                    skip: 0,
                    limit: 20,
                    confluence: isConfluenceEnabled,
                });
        }
    };

    const getData = (type = 'all') => {
        const req = { text: query };
        setSelectedTab(type);
        if ([
            'users',
            'externals',
            'topics',
            'confluence',
        ].indexOf(type) >= 0){
            setShowTopicSearch(false);
        }
        else {
            setShowTopicSearch(true);
            req.topics = checked;
        }
        
        switch (type){
            case 'all':
                requestSearch(req, {
                    skip: 0,
                    limit: 20,
                    confluence: isConfluenceEnabled,
                });
                break;
            default:
                req.categories = [ type ];
                requestSearch(req, {
                    skip: 0,
                    limit: 20,
                    confluence: isConfluenceEnabled,
                });
        }
    };

    useEffect(() => {
        getData(selectedTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ query ]);

    const renderMenu = () => (
        <List className={ classes.menu }>
            <Chip
                label="All Types"
                size="small"
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'all' ? 'default' : 'outlined' }
                onClick={ () => { getData('all'); } }
                clickable
                disabled={ loading } />
            <Chip
                label="Questions"
                size="small"
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'questions' ? 'default' : 'outlined' }
                onClick={ () => { getData('questions'); } }
                clickable
                disabled={ loading } />
            <Chip
                label="Answers"
                size="small"
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'answers' ? 'default' : 'outlined' }
                onClick={ () => { getData('answers'); } }
                clickable
                disabled={ loading } />
            <Chip
                label="Topics"
                className={ classes.chip }
                size="small"
                color="primary"
                variant={ selectedTab === 'topics' ? 'default' : 'outlined' }
                onClick={ () => { getData('topics'); } }
                clickable
                disabled={ loading } />
            <Chip
                label="Blog Posts"
                className={ classes.chip }
                size="small"
                color="primary"
                variant={ selectedTab === 'posts' ? 'default' : 'outlined' }
                onClick={ () => { getData('posts'); } }
                clickable
                disabled={ loading } />
            <Chip
                label="Users"
                size="small"
                className={ classes.chip }
                color="primary"
                variant={ selectedTab === 'users' ? 'default' : 'outlined' }
                onClick={ () => { getData('users'); } }
                clickable
                disabled={ loading } />
            <Chip
                label="Externals"
                className={ classes.chip }
                color="primary"
                size="small"
                variant={ selectedTab === 'externals' ? 'default' : 'outlined' }
                onClick={ () => { getData('externals'); } }
                clickable
                disabled={ loading } />
            {isConfluenceEnabled ? <Chip
                label="Geo - Confluence"
                className={ classes.chip }
                color="primary"
                size="small"
                variant={ selectedTab === 'confluence' ? 'default' : 'outlined' }
                onClick={ () => { getData('confluence'); } }
                clickable
                disabled={ loading } />: <></>}
        </List>
    );

    const findTopicById = (id) => selectedTopics.find((x) => x._id === id);

    const onTopicSelect = (obj, value) => {
        if (value){
            const currentIndex = checked.indexOf(value._id);
            const newChecked = [ ...checked ];

            if (currentIndex === -1) {
                newChecked.push(value._id);
                if (!findTopicById(value._id)){
                    setSelectedTopics([
                        ...selectedTopics,
                        value,
                    ]);
                }
            }
            setChecked(newChecked);
            filterByTopics('topics', newChecked);
            setValue({ topic: '' });
        }
    };


    const handleToggle = ((value) => () => {
        const currentIndex = checked.indexOf(value._id);
        const newChecked = [ ...checked ];

        if (currentIndex === -1) {
            newChecked.push(value._id);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        filterByTopics('topics', newChecked);
    });

    const renderSelectedTopics = () => (
        <List>
            { selectedTopics.map((value) => {
                const labelId = `checkbox-list-label-${value._id}`;
                return (
                    <ListItem
                        key={ value._id }
                        dense
                        button
                        disabled={ loading }
                        onClick={ handleToggle(value) }>
                        <ListItemIcon style={ { minWidth: '0px' } }>
                            <Checkbox
                                edge="start"
                                checked={ checked.indexOf(value._id) !== -1 }
                                tabIndex={ -1 }
                                disableRipple
                                inputProps={ { 'aria-labelledby': labelId } } />
                        </ListItemIcon>
                        <ListItemText
                            id={ labelId }
                            primary={ value.topic || value.value } />
                    </ListItem>
                );
            }) }
        </List>
    );
    const renderTopicSearch = () => (
        <>
            <div className={ classes.menu }>
                <Chip
                    label="All Topics"
                    size="small"
                    className={ classes.topicchip }
                    color="primary"
                    variant={ topicsTab === 'all' ? 'default' : 'outlined' }
                    onClick={ () => { filterByTopics('all'); } }
                    clickable
                    disabled={ loading } />
                { renderSelectedTopics() }
                <Autocomplete
                    id="highlights-demo"
                    value={ value }
                    disabled={ loading }
                    options={ topicsList }
                    onChange={ onTopicSelect }
                    getOptionLabel={ (option) => option.topic }
                    filterOptions={ (options, params) => {
                        const filtered = filter(options, params);
                        return filtered;
                    } }

                    renderInput={ (params) => (
                        <TextField
                            { ...params }
                            label="Search"
                            variant="outlined"
                            size="small"
                            margin="none" />
                    ) }
                    renderOption={ (option, { inputValue }) => {
                        const matches = match(option.topic, inputValue);
                        const parts = parse(option.topic, matches);

                        return (
                            <div>
                                { parts.map((part, index) => (
                                    <span
                                        key={ index }
                                        style={ { fontWeight: part.highlight ? 700 : 400 } }>
                                        { part.text }
                                    </span>
                                )) }
                            </div>
                        );
                    } } />
            </div>
        </>
    );


    return (
        <div className="App">
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    style={ { marginTop: 70 } }
                    spacing={ 5 }>
                    <Grid
                        item
                        xs={ 2 }>
                        <div>
                            <Typography
                                component="div">
                                <Box
                                    fontWeight="fontWeightBold"
                                    m={ 1 }>
                                    By Type
                                </Box>
                            </Typography>
                            { renderMenu() }
                            { showTopicSearch && <>
                                <Typography
                                    component="div">
                                    <Box
                                        fontWeight="fontWeightBold"
                                        m={ 1 }>
                                        By Topic
                                    </Box>
                                </Typography>
                                { renderTopicSearch() }
                            </> }
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={ 8 }>
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

                        { totalCount === null && results === null ? <CardLoader height={ 50 } />
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
                    <Grid
                        item
                        xs={ 3 } />
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
        loading: state.search.loading,
        topicsList: state.topic.topics,
        setConfluence: state.search.setConfluence,
        isConfluenceEnabled: state.user.isConfluenceEnabled,
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
        requestTopics: (body) => {
            dispatch(requestTopics(body));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
