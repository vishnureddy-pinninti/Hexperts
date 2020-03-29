import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        margin: 10,
        backgroundColor: 'inherit',
        border: 'none',
        boxShadow: 'none',
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
    link: {
        color: '#2b6dad',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
});


const Questions = (props) => {
    const classes = useStyles();

    const { questions, openInNewWindow } = props;

    const renderQuestions = () => questions.map((question) => (
        <ListItem
            alignItems="flex-start"
            key={ question._id }>
            <Link
                to={ `/question/${question._id}` }
                target={ openInNewWindow ? '_blank' : '' }
                className={ classes.link }>
                <Typography className={ classes.link }>
                    { question.question || question.value }
                </Typography>
            </Link>
        </ListItem>
    ));

    return (
        <>
            <Typography
                component="div"
                className={ classes.heading }>
                <Box
                    fontWeight="fontWeightBold"
                    m={ 1 }>
                    { props.title }
                </Box>
            </Typography>
            { props.title && <Divider /> }
            <List>
                { questions && renderQuestions() }
            </List>
        </>
    );
};

Questions.defautlProps = {
    openInNewWindow: false,
    questions: [],
};

export default Questions;
