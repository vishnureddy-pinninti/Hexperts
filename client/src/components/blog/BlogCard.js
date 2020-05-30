import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(() => {
    return {
        root: {
            marginBottom: 10,
            border: '1px solid #efefef',
        },
        headerRoot: {

        },
        avatar: {
        },
    };
});


const AnswerCard = (props) => {
    const classes = useStyles();
    const { blog, history } = props;
    const onBlogClick = (id) => {
        history.push(`/blog/${id}`);
    };

    return (
        <Card
            className={ classes.root }
            key={ blog._id }>
            <CardActionArea onClick={ () => onBlogClick(blog._id) }>
                <CardHeader
                    className={ classes.headerRoot }
                    avatar={
                        <Avatar
                            className={ classes.avatar }
                            alt={ blog.name }
                            src={ blog.imageUrl || '/blog-placeholder.png' } />
                    }
                    title={ blog.name }
                    subheader={ blog.description } />
            </CardActionArea>
        </Card>
    );
};

AnswerCard.defaultProps = {
    blog: {},
};

const mapStateToProps = () => {
    return {

    };
};

const mapDispatchToProps = () => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerCard));
