import React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';
import AnswerPageBody from '../components/answer/AnswerPageBody';

function Answer() {
    return (
        <div>
            <Container fixed>
                <Grid
                    container
                    style={ { marginTop: 70 } }
                    justify="center">
                    <AnswerPageBody />
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = () => {
    return {
    };
};

const mapDispatchToProps = () => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Answer));
