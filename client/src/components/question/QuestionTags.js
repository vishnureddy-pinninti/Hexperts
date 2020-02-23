import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import EditTopicsModal from '../topic/EditTopicsModal';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: theme.spacing(0.5),
            marginBottom: 10,
        },
        chip: {
            margin: theme.spacing(0.5),
        },
    };
});

const QuestionTags = (props) => {
    const classes = useStyles();
    const [
        chipData,
        setChipData,
    ] = React.useState([
        {
            key: 0,
            label: 'Angular',
        },
        {
            key: 1,
            label: 'jQuery',
        },
        {
            key: 2,
            label: 'Polymer',
        },
        {
            key: 3,
            label: 'React',
        },
        {
            key: 4,
            label: 'Vue.js',
        },
    ]);

    const { question, id } = props;

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

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


    return (
        <div className={ classes.root }>
            { chipData.map((data) => {
                let icon;

                if (data.label === 'React') {
                    icon = <TagFacesIcon />;
                }

                return (
                    <Chip
                        variant="outlined"
                        size="small"
                        color="primary"
                        key={ data.key }
                        icon={ icon }
                        label={ data.label }
                        className={ classes.chip } />
                );
            }) }
            <IconButton
                size="small"
                color="primary"
                onClick={ handleEditTopicsModalOpen }
                aria-label="upload picture">
                <EditIcon />
            </IconButton>
            <EditTopicsModal
                open={ openEditTopicsModal }
                question={ question }
                id={ id }
                handleClose={ handleEditTopicsModalClose } />
        </div>
    );
};

export default QuestionTags;
