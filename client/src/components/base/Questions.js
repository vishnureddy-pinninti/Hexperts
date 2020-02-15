import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        margin: 10,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 15,
    },
    pos: {
        marginBottom: 12,
    },
});

const Questions = (props) => {
    const classes = useStyles();

    return (
        <Card className={ classes.root }>
            <CardContent>
                <Typography
                    className={ classes.title }
                    color="textSecondary"
                    gutterBottom>
                    { props.title }
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Questions;
