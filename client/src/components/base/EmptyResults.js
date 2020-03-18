import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

function EmptyResults(props) {
    const classes = useStyles();
    const {
        title,
        description,
        showBackButton,
        history,
    } = props;

    return (
        <Card className={ classes.root }>
            <CardContent>
                <Typography
                    className={ classes.title }
                    gutterBottom>
                    { title }
                </Typography>
                <Typography
                    className={ classes.title }
                    color="textSecondary"
                    gutterBottom>
                    { description }
                </Typography>
                { showBackButton && <Button
                    variant="contained"
                    color="primary"
                    onClick={ history.goBack }
                    className={ classes.margin }>
                    Go Back
                </Button> }
            </CardContent>
        </Card>
    );
}

EmptyResults.defaultProps = {
    showBackButton: true,
};

export default (withRouter(EmptyResults));
