import React from 'react';
import { Button } from '@material-ui/core';

const Landing = props => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', width: '60%', height: 500, margin: 'auto' }}>
            <Button onClick={props.onLoginClick} variant="contained">Login</Button>
        </div>
    )
};

export default Landing;