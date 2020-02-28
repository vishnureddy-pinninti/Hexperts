import React, { Component } from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { authService } from '../../services/authService';

class Avatar extends Component {
    state = {
        image: null,
    };

    render() {
        const { image } = this.state;
        return (
            <MuiAvatar
                { ...this.props }
                alt="Avatar Image"
                src={ image } />
        );
    }

    async componentDidMount() {
        const { user } = this.props;
        const image = await authService.getImage(user);
        this.setState({
            image,
        });
    }
}

export default Avatar;
