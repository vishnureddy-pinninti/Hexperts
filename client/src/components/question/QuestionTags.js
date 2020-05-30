import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import EditTopicsModal from '../topic/EditTopicsModal';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 10,
        },
        chip: {
            marginRight: theme.spacing(1),
        },
        topicLink: {
            textDecoration: 'none',
        },
    };
});

const QuestionTags = (props) => {
    const classes = useStyles();

    const {
        question,
        id,
        topics,
        pending,
    } = props;

    const [
        chipData,
        setChipData,
    ] = React.useState(topics);

    useEffect(() => {
        setChipData(topics);
    }, [ topics ]);

    const [
        openEditTopicsModal,
        setOpenEditTopicsModal,
    ] = React.useState(false);

    const handleEditTopicsModalOpen = () => {
        setOpenEditTopicsModal(true);
    };

    const handleEditTopicsModalClose = () => {
        setOpenEditTopicsModal(false);
    };

    useEffect(() => {
        if (!pending) {
            setOpenEditTopicsModal(pending);
        }
    }, [ pending ]);


    return (
        <div className={ classes.root }>
            { chipData.map((data) => {
                let icon;

                return (
                    <Link
                        key={ data._id }
                        className={ classes.topicLink }
                        to={ `/topic/${data._id}` }>
                        <Chip
                            variant="outlined"
                            size="small"
                            color="primary"
                            key={ data._id }
                            icon={ icon }
                            label={ data.topic }
                            className={ classes.chip }
                            clickable />
                    </Link>

                );
            }) }
            { !chipData.length && <Chip
                avatar={
                    <Avatar>
                        <AddIcon />
                    </Avatar>
                }
                label="Add Topics"
                onClick={ handleEditTopicsModalOpen }
                clickable
                color="primary" /> }
            {
                chipData.length !== 0 && <IconButton
                    size="small"
                    color="primary"
                    onClick={ handleEditTopicsModalOpen }
                    aria-label="upload picture">
                    <EditIcon />
                                         </IconButton>
            }
            <EditTopicsModal
                open={ openEditTopicsModal }
                question={ question.question }
                topics={ topics }
                questionID={ id }
                handleClose={ handleEditTopicsModalClose } />
        </div>
    );
};

QuestionTags.defaultProps = {
    topics: [],
};

const mapStateToProps = (state) => {
    return {
        pending: state.questions.pending,
    };
};

const mapDispatchToProps = () => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionTags);
