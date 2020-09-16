import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { requestSearch } from '../../store/actions/search';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import { Grid } from '@material-ui/core';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import DeleteIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => {
    return {
        root: {
            flexGrow: 1,
            position: "relative",
        },
        h4: {
            padding: theme.spacing(2),
            textAlign: 'center',
            //color: theme.palette.text.secondary,
            opacity: '0.9',
            color: 'white',
        },
        backdrop: {
            zIndex: 9000,
            color: '#fff',
            padding: '6%',
            backgroundColor: "rgba(48,48,48, 0.9)" //"#696969" //"rgba(0,0,0,0.9)" //rgba(64,64,64, 0.8)
        },
        nextButton: {
            top: "50%",
            right: "2%",
            color: "white",
            position: "absolute",
        },
        previousButton: {
            top: "50%",
            left: "2%",
            color: "white",
            position: "absolute",
        },
        closeButton: {
            top: "5%",
            right: "5%",
            color: "white",
            position: "absolute",
        }
    };
});

function Tour(props) {

    const {
        open,
        handleTourToggle,
    } = props;


    const classes = useStyles();

    const [
        nextPage,
        setPage,
    ] = React.useState(false);


    const loadNextPage = () => {
        setPage(true);
    }

    const loadPreviousPage = () => {
        setPage(false);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            loadNextPage();
        }
    }

    const PageOne = () => (
        <div >
            {/* <div>
                <h4 style={{ textAlign: "right", marginTop: "286px" }} className={classes.h4}>Here you can find all the top contributors</h4>
            </div>           
            <div >
                <img style={{marginTop: "120px", marginLeft: "680px"}} 
                    src="/arrowTopRight.png"
                    width={120}
                    alt="logo" />
            </div> */}

            {/* <div style={{marginTop: topContrPosition.top + "px", marginLeft: "500" + "px"}} >
                <Grid container spacing={1}>
                    <Grid item xs>
                        <h4 style={{ textAlign: "right" }} className={classes.h4}>Here you can find all the top contributors</h4>            
                    </Grid>
                    <Grid item xs>
                        <div>
                            <img  
                                src="/arrowTopRight.png"
                                width={120}
                                alt="logo" />
                        </div>
                    </Grid>
                </Grid>
            </div> */}
                
            <Grid container spacing={1} >
                <Grid item xs>
                <div style={{ textAlign: "right", marginRight: "100px" }} >
                        <img
                            src="/arrowTop.png"
                            width={150}
                            style={{ marginTop: "10px" }}
                            alt="logo" />
                    </div>
                </Grid>
                <Grid item xs>
                    <h4 style={{ textAlign: "right", marginTop: "-50px" }} className={classes.h4}>Here you can search for anything related to the blogs. You can search based on multiple factors</h4>
                </Grid>
                <Grid item xs>
                    <div>
                        <img style={{ marginTop: "-120px" }}
                            src="/arrowTopRight.png"
                            width={120}
                            alt="logo" />
                    </div>
                </Grid>
                <Grid item xs></Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid item xs style={{ display: 'inline-block' }}>
                <h4 style={{ textAlign: "left", marginTop: "-20px"}} className={classes.h4}>Here you can discover different topics. Click on any of the topics and you can find blogs related to the selected topic</h4>
                </Grid>
                <Grid item xs>
                    
                </Grid>
                <Grid item xs>
                    <h4 style={{ textAlign: "right", marginTop: "50px" }} className={classes.h4}>Here you can find all the top contributors</h4>
                </Grid>
                <Grid item xs>
                    <div >
                        <img  
                            src="/arrowTopRight.png"
                            width={120}
                            alt="logo" />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={3} >
                <Grid item xs></Grid>
                <Grid item xs></Grid>
                <Grid item xs>
                    <h4 style={{ textAlign: "right" }} className={classes.h4}>Here You can find the Trending questions</h4>
                </Grid>
                <Grid item xs>
                    <div >
                        <img
                            src="/arrowRightBottom.png"
                            width={120}
                            alt="logo" />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={3} >
                <Grid item xs></Grid>
                <Grid item xs></Grid>
                <Grid item xs></Grid>
                <Grid item xs></Grid>
            </Grid>
        </div>
    )

    const PageTwo = () => (
        <div>
            <Grid container spacing={1} >
                <Grid item xs>
                    <h4 style={{ textAlign: "right", marginTop: "-10px" }} className={classes.h4}>These are some important links which will help accessing different pages</h4>
                </Grid>
                <Grid item xs>
                    <div style={{ textAlign: "left", marginTop: "-60px" }} >
                        <img
                            src="/arrowTopRight.png"
                            width={100}
                            alt="logo" />
                    </div>
                </Grid>
                <Grid item xs>
                    <h4 style={{ textAlign: "right", marginTop: "20px" }} className={classes.h4}>You can ask a new question here</h4>
                </Grid>
                <Grid item xs>
                    <div style={{ textAlign: "left", marginTop: "-60px", marginLeft: "10px" }} >
                        <img
                            src="/arrowTopRight.png"
                            width={120}
                            alt="logo" />
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs></Grid>
                <Grid item xs></Grid>
                <Grid item xs>
                    <h4 className={classes.h4}><br /><br /><br /><br /><br /></h4>
                    {/* <h4 style={{ textAlign: "right", marginTop: "50px" }} className={classes.h4}>Here you can find all the top contributors and the Trending Questions</h4> */}
                </Grid>
                <Grid item xs>
                    {/* <div >
                        <img
                            src="/arrowTopRight.png"
                            width={120}
                            alt="logo" />
                    </div> */}
                </Grid>
            </Grid>
            <Grid container spacing={3} >
                <Grid item xs></Grid>
                <Grid item xs>
                    <div style={{ textAlign: "right", }} >
                        <img
                            src="/arrowLeftTop.png"
                            width={150}
                            alt="logo" />
                    </div>
                </Grid>
                <Grid item xs>
                    <h4 style={{ textAlign: "left" }} className={classes.h4}><br /><br />This is the area where all the blogs can be accessed.</h4>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={3} >
                <Grid item xs></Grid>
                <Grid item xs></Grid>
                <Grid item xs>
                    <h4 className={classes.h4}><br /><br /></h4>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        </div>
    )

    const NextPageBtn = () => (
        <IconButton aria-label="next" className={classes.nextButton} onClick={ loadNextPage }>
            <NavigateNext  fontSize="large"/>
        </IconButton>

    )

    const PreviousPageBtn = () => (
        <IconButton aria-label="next" className={classes.previousButton} onClick={ loadPreviousPage }>
            <NavigateBefore fontSize="large" />
        </IconButton>
    )

    const CloseHelp = () => (
        <IconButton aria-label="delete" className={classes.closeButton} onClick={ handleTourToggle }>
            <DeleteIcon />
        </IconButton>
    )


    return (
        <div onKeyDown={ handleKeyDown }>
            <Backdrop className={classes.backdrop} open={open} >
                <CloseHelp />
                {nextPage ? <PreviousPageBtn /> : <NextPageBtn />}

                <div className={classes.root}>

                    {nextPage ? <PageTwo /> : <PageOne />}

                </div>
            </Backdrop>

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