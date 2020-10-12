import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReadMore from '../base/ReadMore';
import Avatar from '../base/Avatar';
import getBadge from '../../utils/badge';
// import getMinutes from '../../utils/words-to-mins';
import { isMediaOrCode } from '../../utils/common';
// import htmlToText from '../base/htmlToText'

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginBottom: 10,
            border: '1px solid #efefef',
        },
        headerRoot: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        disabled: {
            opacity: 0.3,
            pointerEvents: 'none',
        },
        topics: {
            display: 'flex',
            flexDirection: 'row',
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            cursor: 'pointer',
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        topicLink: {
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
            paddingLeft: 10,
        },
        more: {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
            cursor: 'pointer',
        },
        menuIcon: {
            paddingRight: 5,
        },
    };
});

const PreviewCard = (props) => {
    const classes = useStyles();

    const {
        previewPost,
        hideHeaderHelperText,
        user,
        history,
        collapse,
    } = props;
    
    
    // const plainText= htmlToText(previewPost.description)

    const {
        _id,
        name,
        jobTitle,
        email,
        reputation,
    } = user;

    const renderAnswer = (previewPost) => (
        <ReadMore
            initialHeight={ 300 }
            mediaExists={ isMediaOrCode(previewPost) }
            collapse={ collapse }
            readMore={ (props) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    className={ classes.more }
                    onClick={ props.onClick }>
                    <b>
                        { props.open ? 'Read less' : 'Read more...' }
                    </b>
                </a>
            ) }>
            <div
                style={ {
                    display: 'flex',
                    flexDirection: 'column',
                } }
                className="editor-read-mode"
                dangerouslySetInnerHTML={ { __html: previewPost } } />
        </ReadMore>
    );

    const renderTopics = (blogs) => blogs.map((blog) => (
        <Link
            key={ blog._id }
            className={ classes.topicLink }
            to={ `/blog/${blog._id}` }>
            { blog.name || blog.topic }
        </Link>
    ));
    const onProfileClick = () => {
        history.push(`/profile/${_id}`);
    };

    const renderHeaderHelperText = (topics) => (
        <Typography
            variant="body2"
            color="textSecondary"
            className={ classes.topics }
            component="p">
            Preview -
            { topics && topics.length ? renderTopics(topics) : ' ' }
        </Typography>
    );

    return (
        <Card
            className={ `${classes.root}` }
            elevation={ 0 }>
            <CardContent>
                {
                    <>
                        { !hideHeaderHelperText && renderHeaderHelperText( previewPost.topics) }
                            <Box
                                fontWeight="fontWeightBold"
                                fontSize={ 20 }>
                                { previewPost.title }
                            </Box>
                                   </>
                }
                <CardHeader
                    className={ classes.headerRoot }
                    avatar={
                        <Avatar
                            aria-label="recipe"
                            alt={ name }
                            user={ email }
                            badge={ getBadge(reputation) }
                            onClick={ onProfileClick }
                            className={ classes.avatar }>
                            { name.match(/\b(\w)/g).join('') }
                        </Avatar>
                    }
                    title={
                        <Link
                            className={ classes.link }
                            to={ `/profile/${_id}` }>
                            { name }
                            ,
                            { ' ' }
                            { jobTitle }
                        </Link>
                    }
                    subheader={
                        <>
                            <span> Created just now </span>
                            {/* <b> - </b> */}
                            {/* <span>{ `${getMinutes(previewPost.plainText)} min read` }</span> */}
                        </>
                    }  />
                { renderAnswer(previewPost.description) }
            </CardContent>
        </Card>
    );
};

PreviewCard.defaultProps = {
    hideHeader: false,
    hideHeaderHelperText: false,
    collapse: true,
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PreviewCard));
