import React, { Fragment } from 'react';
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
            top:"8%",
            position:"relative",
        },
        h4: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            opacity: '0.9',
            color: 'white',
        },       
        backdrop: {
            zIndex: 9000,
            color: '#fff',
            padding: '6%',
            backgroundColor: "rgba(48,48,48, 0.8)" //"#696969" //"rgba(0,0,0,0.9)" //rgba(64,64,64, 0.8)
        },
        nextButton:{
            top: "50%",
            right: "2%",
            color:"white",
            position: "absolute",
        },
        previousButton:{
            top: "50%",
            left: "2%",
            color:"white",
            position: "absolute",
        },
        closeButton:{
            top: "5%",
            right: "5%",
            color:"white",
            position: "absolute",
        }
    };
});


function Tour(props) {

    const {
        open,
        handleClose,
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

   const PageOne = () => (
       <div style={{margin:"20px"}}>
           
           <Grid container spacing={1} >
                <Grid item xs></Grid>
                <Grid item xs>
                    <h4  style={{textAlign:"right"}}  className={classes.h4}>Here you can search for anything related to the blogs. You can search based on multiple factors</h4>
                </Grid>
                <Grid item xs>
                    <div alignItems={"flex-end"} >
                        <img
                            src="/arrowTopRight.png"
                            width={ 100 }
                            alt="logo" />
                    </div>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
                    
            <Grid container spacing={3}>
                <Grid item xs>
                    <div style={{textAlign:"right", marginRight:"50px"}} >
                        <img
                            src="/arrowLeft.png"
                            width={ 150 }
                            style={{marginTop:"30px"}}
                            alt="logo" />
                    </div>
                </Grid>
                <Grid item xs style={{display:'inline-block'}}>
                    <h4 style={{textAlign:"left", }} className={classes.h4}>Here you can discover different topics. Click on any ot the topics and you can find blogs related to the selected topic</h4>
                </Grid>
                <Grid item xs><h4 style={{textAlign:"right", marginTop:"50px"}}  className={classes.h4}>Here you can find all the top contributors</h4></Grid>
                <Grid item xs>
                    <div >
                        <img
                            src="/arrowTopRight.png"
                            width={ 120 }
                            alt="logo" />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={3} >
                <Grid item xs></Grid>
                <Grid item xs></Grid>
                <Grid item xs>
                <h4 style={{textAlign:"right"}}  className={classes.h4}>Here You can find the Trending questions</h4>
                </Grid>
                <Grid item xs>
                    <div >
                        <img
                            src="/arrowRightBottom.png"
                            width={ 120 }
                            alt="logo" />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={3} >
                <Grid item xs></Grid>
                <Grid item xs></Grid>
                <Grid item xs>
                <h4 style={{textAlign:"right"}}  className={classes.h4}></h4>
                </Grid>
                <Grid item xs>
                </Grid>
            </Grid>
       </div>
   )

   const PageTwo = () => (
    <div>
        <Grid container spacing={1} >
            <Grid item xs>
                <h4  style={{textAlign:"right"}}  className={classes.h4}>These are some important links which will help access different pages</h4>
            </Grid>
            <Grid item xs>
                <div style={{textAlign:"left"  }} >
                    <img
                        src="/arrowTopRight.png"
                        width={ 100 }
                        alt="logo" />
                </div>   
            </Grid>
            <Grid item xs>
            <h4  style={{textAlign:"right", marginTop:"30px"}}  className={classes.h4}>Ask a new question here</h4>
            </Grid>
            <Grid item xs>
                <div style={{textAlign:"left"}} >
                    <img
                        src="/arrowSwirlyRight.png"
                        width={ 150 }
                        height={100}
                        alt="logo" />
                </div>   
            </Grid>
        </Grid>
        
        <Grid container spacing={3}>
            <Grid item xs></Grid>
            <Grid item xs style={{display:'inline-block'}}></Grid>
            <Grid item xs><h4 style={{textAlign:"right", marginTop:"50px"}}  className={classes.h4}>Here you can find all the top contributors and the Trending Questions</h4></Grid>
            <Grid item xs>
                <div >
                    <img
                        src="/arrowTopRight.png"
                        width={ 120 }
                        alt="logo" />
                </div>
            </Grid>
        </Grid>
        <Grid container spacing={3} >
            <Grid item xs></Grid>
            <Grid item xs>
                <div style={{textAlign:"right", }} >
                    <img
                        src="/arrowLeftTop.png"
                        width={ 150 }
                        alt="logo" />
                </div>
            </Grid>
            <Grid item xs>
            <h4 style={{textAlign:"left"}} className={classes.h4}><br/><br/>This is the area where all the blogs can be accessed.</h4>
            </Grid>
            <Grid item xs></Grid>
        </Grid>
        <Grid container spacing={3} >
            <Grid item xs></Grid>
            <Grid item xs></Grid>
            <Grid item xs>
            <h4  className={classes.h4}><br/><br/></h4>
            </Grid>
            <Grid item xs></Grid>
        </Grid>
    </div>
   )

const NextPageBtn = () => (
    <IconButton aria-label="next"  className={classes.nextButton} >
        <NavigateNext onClick={loadNextPage} />                
    </IconButton>
    
)

const PreviousPageBtn = () => (
    <IconButton aria-label="next"  className={classes.previousButton} >
        <NavigateBefore onClick={loadPreviousPage} />
    </IconButton>
)

const CloseHelp = () => (
    <IconButton aria-label="delete" className={classes.closeButton}>
        <DeleteIcon  onClick={ handleClose } />
    </IconButton>
)

    
      return(
          <div >
              <Backdrop className={classes.backdrop} open={open}  >
                <CloseHelp />
                { nextPage ? <PreviousPageBtn /> : <NextPageBtn /> }

                <div className={classes.root}>
                    
                    { nextPage ? <PageTwo /> : <PageOne /> }
                    
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