import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import BlogsList from '../components/blog/BlogsList';
import Header from '../components/blog/BlogHeader';
import FollowBlogsModal from '../components/blog/FollowBlogsModal';
import EmptyResults from '../components/base/EmptyResults';

import PostCard from '../components/blog/PostCard';
import { requestBlogById } from '../store/actions/blog';


function Topic(props) {
    const {
        match: {
            params: { blogId 
},
        },
        requestBlog,
        onLogout,
        pending,
        followedBlogs,
    } = props;

    useEffect(() => {
        requestBlog(blogId);
    }, [
        requestBlog,
        blogId,
    ]);

    const [
        openFollowTopicsModal,
        setOpenFollowTopicsModal,
    ] = React.useState(false);


    useEffect(() => {
        if (!pending) {
            setOpenFollowTopicsModal(pending);
        }
    }, [ pending ]);

    const handleFollowTopicsModalOpen = () => {
        setOpenFollowTopicsModal(true);
    };

    const handleFollowTopicsModalClose = () => {
        setOpenFollowTopicsModal(false);
    };


    const renderPosts = () => posts.map((post) => (
        <PostCard
            key={ post._id }
            post={ post }
            hideHeaderHelperText />
    ));

    const { blog, blog: { posts } } = props;

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
                        xs={ 2 }>
                        <BlogsList handleFollowTopicsModalOpen={ handleFollowTopicsModalOpen } />
                    </Grid>
                    <Grid
                        item
                        xs={ 7 }>
                        <Header
                            blog={ blog }
                            id={ blogId } />
                        { posts && renderPosts() }
                        { posts && posts.length === 0 && <EmptyResults
                            title="No blog posts yet."
                            description="Feel free to contribute to this blog and earn points." /> }
                    </Grid>
                    <Grid
                        item
                        xs={ 2 } />
                </Grid>
            </Container>
            <FollowBlogsModal
                open={ openFollowTopicsModal }
                followedBlogs={ followedBlogs }
                handleFollowTopicsModalClose={ handleFollowTopicsModalClose } />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog.blog,
        pending: state.user.pending,
        followedBlogs: state.user.user.blogs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestBlog: (blogId) => {
            dispatch(requestBlogById(blogId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
