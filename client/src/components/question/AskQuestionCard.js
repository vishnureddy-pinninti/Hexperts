import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginTop: 10,
            marginBottom: 10,
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

export default function AskQuestionCard(props) {
    const classes = useStyles();
    const { user: { name } } = props;
    return (
        <Card className={ classes.root }>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label="recipe"
                        className={ classes.avatar }>
                        { name.match(/\b(\w)/g).join('') }
                    </Avatar>
                }
                className={ classes.title }
                color="textSecondary"
                title={ name } />
            <CardContent className={ classes.content }>
                <Typography
                    variant="h7"
                    color="textSecondary"
                    component="h2">
                    What is your question or link?
                </Typography>
            </CardContent>
        </Card>
    );
}
