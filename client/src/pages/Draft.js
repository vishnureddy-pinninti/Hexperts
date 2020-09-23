import React, { useEffect } from 'react';
import { Grid,
    Container } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';

import DraftCard from '../components/blog/DraftCard';
import EmptyResults from '../components/base/EmptyResults';
import { requestDraftById } from '../store/actions/draft';


function Draft(props) {
    const {
        match: {
            params: { draftId 
},
        },
        requestDraft,
        draft,
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
        if (draft.title){
            setLoading(false);
        }
    }, [ draft ]);

    useEffect(() => {
        setLoading(true);
        requestDraft(draftId, () => {}, (res) => {
            setLoading(false);
            setError('Draft not found. It may have been deleted.');
        });
    }, [
        requestDraft,
        draftId,
    ]);

    const renderDraft = () => (
        <DraftCard
            draft={ draft }
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
                                height={ 400 } /> : draft && draft.title && renderDraft() }
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
        draft: state.draft.draft,
        pending: state.blog.pending,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestDraft: (id, success, error) => {
            dispatch(requestDraftById(id, success, error));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Draft);
