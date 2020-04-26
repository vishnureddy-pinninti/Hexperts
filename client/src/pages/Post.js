import React, { useEffect } from 'react';
import { Grid,
    Container } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';

import PostCard from '../components/blog/PostCard';
import EmptyResults from '../components/base/EmptyResults';
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

    const [
        error,
        setError,
    ] = React.useState();

    useEffect(() => {
        if (post.title){
            setLoading(false);
        }
    }, [ post ]);

    useEffect(() => {
        setLoading(true);
        requestPost(postId, () => {}, (res) => {
            setLoading(false);
            setError('Post not found. It may have been deleted by the author.');
        });
    }, [
        requestPost,
        postId,
    ]);

    const renderPost = () => (
        <PostCard
            post={ post }
            collapse={ false }
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
                        { error
                            && <EmptyResults
                                style={ { marginTop: 30 } }
                                title={ error }
                                showBackButton /> }
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
        requestPost: (id, success, error) => {
            dispatch(requestPostById(id, success, error));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
