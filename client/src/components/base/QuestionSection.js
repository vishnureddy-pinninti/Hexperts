import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import QuestionTags from './QuestionTags';

const useStyles = makeStyles({
    root: {
        marginTop: 10,
    },
    media: {

    },
});

const QuestionSection = (props) => {
    const classes = useStyles();

    return (
        <Card className={ classes.root }>
            <CardContent>
                <QuestionTags />
                <Typography
                    variant="h5"
                    component="h2">
                    Which framework is best for Frontend development?
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary">
                    Answer
                </Button>
                <Button
                    size="small"
                    color="primary">
                    Follow
                </Button>
            </CardActions>
        </Card>
    );
};

export default QuestionSection;
