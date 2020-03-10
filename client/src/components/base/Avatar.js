import React, { Component } from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { authService } from '../../services/authService';
import { connect } from 'react-redux';
import { setImage } from '../../store/actions/auth';

class Avatar extends Component {
    render() {
        const { currentUserImage } = this.props;
        return (
            <MuiAvatar
                { ...this.props }
                alt="Avatar Image"
                src={ currentUserImage } />
        );
    }

    async componentDidMount() {
        const { user, currentUserImage, setImage } = this.props;
        if (!currentUserImage && user) {
            const image = await authService.getImage(user);
            setImage({
                image,
                user,
            });
        }

    }
}

const mapStateToProps = (state, ownProps) => {
    const userImage = state.user.images.find(image => image.user === ownProps.user);
    return {
        currentUserImage: userImage ? userImage.image : null,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setImage: (image) => {
            dispatch(setImage(image));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);
