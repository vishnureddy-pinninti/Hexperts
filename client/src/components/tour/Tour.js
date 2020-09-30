import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { requestSearch } from '../../store/actions/search';
import { makeStyles } from '@material-ui/core/styles';
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import Hotkeys from 'react-hot-keys';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            flexGrow: 1,
            position: "relative",
        },
    };
});

function Tour(props) {

    const {
        open,
        handleTourClose,
    } = props;

    const classes = useStyles();

    const onKeyUp = () => {
        console.log("Keyup");
      }

    return (
        <div>

            <Hotkeys 
                keyName="Enter" 
                onKeyUp={onKeyUp}>
            </Hotkeys>
        </div>
    );


}

Tour.defaultProps = {
    results: [],
};

const mapStateToProps = (state) => {
    return {
        results: state.search.results,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestSearch: (body) => {
            dispatch(requestSearch(body));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tour));