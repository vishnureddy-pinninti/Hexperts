import React, { Component } from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { connect } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import { authService } from '../../services/authService';
import { setImage } from '../../store/actions/auth';


class Avatar extends Component {
    render() {
        const {
            currentUserImage,
            badge,
        } = this.props;
        let color = badge;

        if (badge === 'basic'){
            color = '#3BB9FF';
        }

        return (
            <MuiAvatar
                { ...this.props }
                title={ badge }
                style={ { border: `3px solid ${color}` } }
                alt="Avatar Image"
                src={ currentUserImage } />
            // <Badge
            //     overlap="circle"
            //     anchorOrigin={ {
            //         vertical: 'bottom',
            //         horizontal: 'left',
            //     } }
            //     badgeContent={ badge && <img
            //         alt={ badge }
            //         title={ badge }
            //         style={ badgeStyle }
            //         width={ badgeWidth }
            //         src={ `/${badge}.png` } /> }>
            //     <MuiAvatar
            //         { ...this.props }
            //         alt="Avatar Image"
            //         src={ currentUserImage } />
            // </Badge>
        );
    }

    async componentDidMount() {
        const {
            user,
            currentUserImage,
            setImage,
        } = this.props;
        if (!currentUserImage && user) {
            const image = await authService.getImage(user);
            setImage({
                image,
                user,
            });
        }
    }
}

Avatar.defaultProps = {
    badgeWidth: 40,
    badgeStyle: { paddingLeft: 26 },
};

const mapStateToProps = (state, ownProps) => {
    const userImage = state.user.images.find((image) => image.user === ownProps.user);
    return {
        currentUserImage: userImage ? userImage.image : null,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setImage: (image) => {
            dispatch(setImage(image));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);
