import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InfiniteScroll from 'react-infinite-scroll-component';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { requestAnswerRequests, requestQuestionsForUser,
    requestQuestionsForUserByType, requestAnswerRequestsByType } from '../../store/actions/questions';
import QuestionCard from '../question/Card';
import CardLoader from '../base/CardLoader';
import AnswerCard from './Card';
import EmptyResults from '../base/EmptyResults';

const useTreeItemStyles = makeStyles((theme) => {
    return {
        root: {
            color: theme.palette.text.secondary,
            '&:hover > $content': {
                backgroundColor: theme.palette.action.hover,
            },
            '&:focus > $content, &$selected > $content': {
                backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
                color: 'var(--tree-view-color)',
            },
            '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
                backgroundColor: 'transparent',
            },
        },
        content: {
            color: theme.palette.text.secondary,
            paddingRight: theme.spacing(1),
            fontWeight: theme.typography.fontWeightMedium,
            width: 'inherit',
            '$expanded > &': {
                fontWeight: theme.typography.fontWeightRegular,
            },
        },
        group: {
            marginLeft: 0,
            '& $content': {
                paddingLeft: theme.spacing(2),
            },
        },
        expanded: {},
        selected: {},
        label: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
        labelRoot: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0.5, 0),
        },
        labelIcon: {
            marginRight: theme.spacing(1),
        },
        labelText: {
            fontWeight: 'inherit',
            flexGrow: 1,
        },
    };
});

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const {
        labelText,
        labelIcon: LabelIcon,
        labelInfo,
        color,
        bgColor,
        ...other
    } = props;

    return (
        <TreeItem
            label={
                <div className={ classes.labelRoot }>
                    <LabelIcon
                        color="inherit"
                        className={ classes.labelIcon } />
                    <Typography
                        variant="body2"
                        className={ classes.labelText }>
                        { labelText }
                    </Typography>
                </div>
            }
            style={ {
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            } }
            classes={ {
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            } }
            { ...other } />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => {
    return {
        root: {
            height: 264,
            flexGrow: 1,
            width: 200,
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            marginRight: 10,
        },
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        topicLink: {
            textDecoration: 'none',
        },
        menu: {
            position: 'fixed',
            flexDirection: 'column',
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
        },
        chip: {
            marginBottom: 10,
            width: 150,
        },
        chipLabel: {
            // padding: 10,
        },
    };
});

function AnswerPageBody(props) {
    const classes = useStyles();
    const {
        requestAnswerRequests,
        requestQuestionsForUser,
        requestQuestionsForUserByType,
        requestAnswerRequestsByType,
        questions,
    } = props;


    const [
        items,
        setItems,
    ] = React.useState([]);

    const [
        requestType,
        setRequestType,
    ] = React.useState('answerrequests');

    const [
        pagination,
        setPagination,
    ] = React.useState({
        index: 0,
        hasMore: true,
    });

    useEffect(() => {
        if (questions.length) {
            setItems([
                ...items,
                ...questions,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ questions ]);

    const loadMore = () => {
        if (pagination.index > 0){
            switch (requestType){
                case 'questions':
                    requestQuestionsForUser({ skip: pagination.index * 10 });
                    break;
                case 'questionsunanswered':
                    requestQuestionsForUserByType({
                        skip: pagination.index * 10,
                        type: 'unanswered',
                    });
                    break;
                case 'questionsanswered':
                    requestQuestionsForUserByType({
                        skip: pagination.index * 10,
                        type: 'answered',
                    });
                    break;
                case 'questionsansweredbyme':
                    requestQuestionsForUserByType({
                        skip: pagination.index * 10,
                        type: 'answeredbyme',
                    });
                    break;
                case 'answerrequests':
                    requestAnswerRequests({
                        skip: pagination.index * 10,
                    });
                    break;
                case 'answerrequestsunanswered':
                    requestAnswerRequestsByType({
                        skip: pagination.index * 10,
                        type: 'unanswered',
                    });
                    break;
                case 'answerrequestsanswered':
                    requestAnswerRequestsByType({
                        skip: pagination.index * 10,
                        type: 'answered',
                    });
                    break;
                case 'answerrequestsansweredbyme':
                    requestAnswerRequestsByType({
                        skip: pagination.index * 10,
                        type: 'answeredbyme',
                    });
                    break;
                default:
                    requestAnswerRequests({
                        skip: pagination.index * 10,
                    });
            }
        }
    };

    useEffect(() => {
        setItems([]);
        window.scrollTo(0, 0);
        setPagination({
            index: 0,
            hasMore: true,
        });
        requestAnswerRequests({ skip: pagination.index * 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = (type = 'questions') => {
        setRequestType(type);
        setPagination({
            index: 0,
            hasMore: true,
        });
        setItems([]);
        window.scrollTo(0, 0);
        switch (type){
            case 'questions':
                requestQuestionsForUser({ skip: 0 });
                break;
            case 'questionsunanswered':
                requestQuestionsForUserByType({
                    skip: 0,
                    type: 'unanswered',
                });
                break;
            case 'questionsanswered':
                requestQuestionsForUserByType({
                    skip: 0,
                    type: 'answered',
                });
                break;
            case 'questionsansweredbyme':
                requestQuestionsForUserByType({
                    skip: 0,
                    type: 'answeredbyme',
                });
                break;
            case 'answerrequests':
                requestAnswerRequests({
                    skip: 0,
                });
                break;
            case 'answerrequestsunanswered':
                requestAnswerRequestsByType({
                    skip: 0,
                    type: 'unanswered',
                });
                break;
            case 'answerrequestsanswered':
                requestAnswerRequestsByType({
                    skip: 0,
                    type: 'answered',
                });
                break;
            case 'answerrequestsansweredbyme':
                requestAnswerRequestsByType({
                    skip: 0,
                    type: 'answeredbyme',
                });
                break;
            default:
                requestAnswerRequests({
                    skip: 0,
                });
        }
    };

    const renderQuestions = (items) => items.map((item) => {
        if (item.answer){
            return (
                <AnswerCard
                    key={ item._id }
                    questionId={ item.questionID }
                    answer={ item }
                    hideHeaderHelperText
                    answerId={ item._id }
                    upvoters={ item.upvoters }
                    downvoters={ item.downvoters }
                    question={ item.question }
                    author={ item.author }
                    topics={ item.topics }
                    date={ item.postedDate } />
            );
        }
        return (
            <QuestionCard
                key={ item._id }
                id={ item._id }
                date={ item.postedDate }
                answersCount={ item.answers.totalCount }
                question={ item } />
        );
    });

    const renderNavigation = () => (
        <TreeView
            className={ classes.root }
            defaultSelected="answerrequests"
            defaultCollapseIcon={ <ArrowDropDownIcon /> }
            defaultExpandIcon={ <ArrowRightIcon /> }
            onNodeSelect={ (e, value) => { getData(value); } }
            defaultEndIcon={ <div style={ { width: 24 } } /> }>
            <StyledTreeItem
                nodeId="answerrequests"
                labelText=" Specific Questions
                for me"
                color="#3c8039"
                bgColor="#e6f4ea"
                labelIcon={ ContactSupportIcon }>
                <StyledTreeItem
                    nodeId="answerrequestsunanswered"
                    labelText="Unanswered"
                    color="#e3742f"
                    bgColor="#fcefe3"
                    labelIcon={ SpeakerNotesOffIcon } />
                <StyledTreeItem
                    nodeId="answerrequestsanswered"
                    labelText="Answered"
                    color="#e3742f"
                    bgColor="#fcefe3"
                    labelIcon={ SpeakerNotesIcon } />
                <StyledTreeItem
                    nodeId="answerrequestsansweredbyme"
                    labelText="Answered by me"
                    color="#e3742f"
                    bgColor="#fcefe3"
                    labelIcon={ AccountCircleIcon } />
            </StyledTreeItem>
            <StyledTreeItem
                nodeId="questions"
                labelText=" Questions in my
                area of expertise"
                color="#3c8039"
                bgColor="#e6f4ea"
                labelIcon={ ContactSupportIcon }>
                <StyledTreeItem
                    nodeId="questionsunanswered"
                    labelText="Unanswered"
                    color="#e3742f"
                    bgColor="#fcefe3"
                    labelIcon={ SpeakerNotesOffIcon } />
                <StyledTreeItem
                    nodeId="questionsanswered"
                    labelText="Answered"
                    color="#e3742f"
                    bgColor="#fcefe3"
                    labelIcon={ SpeakerNotesIcon } />
                <StyledTreeItem
                    nodeId="questionsansweredbyme"
                    labelText="Answered by me"
                    color="#e3742f"
                    bgColor="#fcefe3"
                    labelIcon={ AccountCircleIcon } />
            </StyledTreeItem>
        </TreeView>
    );


    return (
        <>
            <Grid
                item
                xs={ 2 }>
                <div className={ classes.menu }>
                    <Typography
                        component="div">
                        <Box
                            fontWeight="fontWeightBold"
                            m={ 1 }>
                            Questions
                        </Box>
                    </Typography>
                    { renderNavigation() }
                </div>
            </Grid>
            <Grid
                item
                xs={ 7 }>
                { (pagination.hasMore || items.length > 0)
                    && <InfiniteScroll
                        style={ { overflow: 'visible' } }
                        dataLength={ items.length }
                        next={ loadMore }
                        hasMore={ pagination.hasMore }
                        loader={ <CardLoader /> }
                        endMessage={
                            <p style={ { textAlign: 'center' } }>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }>
                        { renderQuestions(items) }
                    </InfiniteScroll> }
                { items.length === 0 && !pagination.hasMore && <EmptyResults
                    style={ { marginTop: 30 } }
                    title="No questions for you yet."
                    description="Feel free to add yourself as expert to topics you know about to let people know what you can answer."
                    showBackButton={ false } /> }
            </Grid>
            <Grid
                item
                xs={ 3 } />
        </>
    );
}

AnswerPageBody.defaultProps = {
    questions: [],
};

const mapStateToProps = (state) => {
    return {
        questions: state.questions.answerRequests,
        modifiedQuestions: state.questions.modifiedQuestions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestAnswerRequests: (params) => {
            dispatch(requestAnswerRequests(params));
        },
        requestQuestionsForUser: (params) => {
            dispatch(requestQuestionsForUser(params));
        },
        requestQuestionsForUserByType: (params) => {
            dispatch(requestQuestionsForUserByType(params));
        },
        requestAnswerRequestsByType: (params) => {
            dispatch(requestAnswerRequestsByType(params));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnswerPageBody);
