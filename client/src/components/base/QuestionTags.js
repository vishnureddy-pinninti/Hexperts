import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import TagFacesIcon from '@material-ui/icons/TagFaces';

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

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
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
                        key={ data.key }
                        icon={ icon }
                        label={ data.label }
                        onDelete={ data.label === 'React' ? undefined : handleDelete(data) }
                        className={ classes.chip } />
                );
            }) }
        </div>
    );
};

export default QuestionTags;
