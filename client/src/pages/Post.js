import React, { useEffect } from 'react';
import {
    Grid,
    Container,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';

import PostCard from '../components/blog/PostCard';
import { requestPostById } from '../store/actions/blog';


function Post(props) {
    const {
        match: {
            params: { postId },
        },
        requestPost,
        post,
        pending,
    } = props;

    useEffect(() => {
        requestPost(postId);
    }, [
        requestPost,
        postId,
    ]);

    const renderPost = () => (
        <PostCard
            post={ post }
            hideHeaderHelperText />
    );

    if (pending) {
        return (
            <div style={{ width: 700, margin: 'auto', marginTop: 100 }}>
                <Skeleton
                    variant="rect"
                    style={ { marginTop: 70 } }
                    height={ 400 } />
            </div>
        );
    }

    return (
        <div className="App">
            <Container fixed>
                <Grid
                    container
                    justify="center"
                    style={ { marginTop: 70 } }
                    spacing={ 3 }>
                    <Grid
                        item
                        xs={ 2 } />
                    <Grid
                        item
                        xs={ 7 }>
                        { post && post.title && renderPost() }
                    </Grid>
                    <Grid
                        item
                        xs={ 3 } />
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        post: state.blog.post,
        pending: state.blog.pending,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestPost: (id) => {
            dispatch(requestPostById(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
