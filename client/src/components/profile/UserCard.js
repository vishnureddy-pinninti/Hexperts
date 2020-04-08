import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';

import { red } from '@material-ui/core/colors';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '../base/Avatar';
import getBadge from '../../utils/badge';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginBottom: 10,
            border: '1px solid #efefef',
        },
        headerRoot: {

        },
        avatar: {
        },
    };
});


const AnswerCard = (props) => {
    const classes = useStyles();
    const { user, history } = props;
    const onProfileClick = (id) => {
        history.push(`/profile/${id}`);
    };

    return (
        <Card
            className={ classes.root }
            key={ user._id }>
            <CardActionArea onClick={ () => onProfileClick(user._id) }>
                <CardHeader
                    className={ classes.headerRoot }
                    avatar={
                        <Avatar
                            badge={ getBadge(user.reputation) }
                            aria-label="user"
                            alt={ user.name }
                            user={ user.email } />
                    }
                    title={ user.name }
                    subheader={ user.jobTitle } />
            </CardActionArea>
        </Card>
    );
};

AnswerCard.defaultProps = {
    user: {},
};

const mapStateToProps = () => {
    return {

    };
};

const mapDispatchToProps = () => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerCard));
