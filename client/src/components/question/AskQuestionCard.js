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
import getBadge from '../../utils/badge';

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
    const {
        user: {
            name, email, reputation,
        }, pending,
    } = props;
    const { handleClickQuestionModalOpen } = props;

    return (
        <Card
            className={ classes.root }
            elevation={ 0 }
            onClick={ handleClickQuestionModalOpen }>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label={ name }
                        className={ classes.avatar }
                        badge={ getBadge(reputation) }
                        badgeWidth={ 20 }
                        badgeStyle={ { paddingLeft: 16 } }
                        user={ email } />
                }
                className={ classes.title }
                color="textSecondary"
                title={ name } />
            <CardContent className={ classes.content }>
                <Link>
                    <Typography
                        color="textSecondary">
                        <Box
                            fontWeight="fontWeightBold"
                            fontSize={ 20 }>
                            What is your question?
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
