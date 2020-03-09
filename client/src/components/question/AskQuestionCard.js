import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';
import { red } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import Avatar from '../base/Avatar';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginBottom: 10,
            border: '1px solid #efefef',
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
            display: 'flex',
        },
        content: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            backgroundColor: red[500],
        },
    };
});

function AskQuestionCard(props) {
    const classes = useStyles();
    const { user: { name, email }, pending } = props;
    const { handleClickQuestionModalOpen } = props;

    return (
        <Card
            className={ classes.root }
            elevation={ 0 }
            onClick={ handleClickQuestionModalOpen }>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label="recipe"
                        className={ classes.avatar }
                        user={ email }>
                        { name.match(/\b(\w)/g).join('') }
                    </Avatar>
                }
                className={ classes.title }
                color="textSecondary"
                title={ name } />
            <CardContent className={ classes.content }>
                <Link
                    onClick={ handleClickQuestionModalOpen }>
                    <Typography
                        color="textSecondary">
                        <Box
                            fontWeight="fontWeightBold"
                            fontSize={ 20 }>
                            What is your question or link?
                        </Box>
                    </Typography>
                </Link>
            </CardContent>
        </Card>
    );
}

const mapStateToProps = (state) => {
    return {
        pending: state.questions.pending,
    };
};

const mapDispatchToProps = () => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AskQuestionCard);
