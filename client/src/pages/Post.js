import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
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
