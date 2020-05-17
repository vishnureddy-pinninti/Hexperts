import React from 'react';
import { Card as MUiCard, CardContent, Tooltip, Icon, Typography } from '@material-ui/core';

const Card = (props) => {
    const {
        title,
        borderColor,
        tooltip,
        value,
        last,
    } = props;

    return (
        <MUiCard
            key={ title }
            style={ {
                    borderTop: `4px solid ${borderColor}`,
                    flex: 1, marginRight: last ? 0: 10,
                    textAlign: 'center'
                } }>
            <CardContent style={ { position: 'relative' } }>
                {
                    tooltip && (
                        <Tooltip title={ tooltip }>
                            <Icon style={ { fontSize: '1rem', position: 'absolute', top: 2, right: 2, color: 'gray' } }>help</Icon>
                        </Tooltip>
                    )
                }
                <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>
                    { title }
                </Typography>
                <Typography variant="h5" component="h2">
                    { value }
                </Typography>
            </CardContent>
        </MUiCard>
    );
}

export default Card;