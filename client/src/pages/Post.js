import React, { useEffect } from 'react';
import { Grid,
    Container } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';

import PostCard from '../components/blog/PostCard';
import { requestPostById } from '../store/actions/blog';


function Post(props) {
    const {
        match: {
            params: { postId 
},
        },
        requestPost,
        post,
        pending,
    } = props;

    const [
        loading,
        setLoading,
    ] = React.useState(false);

    useEffect(() => {
        if (post.title){
            setLoading(false);
        }
    }, [ post ]);

    useEffect(() => {
        setLoading(true);
        requestPost(postId);
    }, [
        requestPost,
        postId,
    ]);

    const renderPost = () => (
        <PostCard
            post={ post }
            hideHeaderHelperText={ false } />
    );

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
                        xs={ 1 } />
                    <Grid
                        item
                        xs={ 10 }>
                        { loading
                            ? <Skeleton
                                variant="rect"
                                height={ 400 } /> : post && post.title && renderPost() }
                    </Grid>
                    <Grid
                        item
                        xs={ 1 } />
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
