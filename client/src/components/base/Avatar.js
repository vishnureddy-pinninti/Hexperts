import React, { Component } from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { authService } from '../../services/authService';
import { connect } from 'react-redux';
import { setImage } from '../../store/actions/auth';

class Avatar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: props.currentUserImage,
        }
    }

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
        const { user, currentUserImage, setImage } = this.props;
        if (!currentUserImage && user) {
            const image = await authService.getImage(user);
            setImage({
                image,
                user,
            });
            this.setState({
                image,
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
