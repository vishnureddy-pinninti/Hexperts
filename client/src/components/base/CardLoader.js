import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
    },
});

export default function Loader(props) {
    const classes = useStyles();
    const { height = 200 } = props;
    return (
        <div className={ classes.root }>
            <br />
            <Skeleton
                variant="rect"
                height={ height } />
            <br />
            <Skeleton
                variant="rect"
                height={ height } />
            <br />
            <Skeleton
                variant="rect"
                height={ height } />
            <br />
            <Skeleton
                variant="rect"
                height={ height } />
        </div>
    );
}
