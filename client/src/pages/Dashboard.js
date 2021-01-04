import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Topics from '../components/dashboard/Topics';
import Summary from '../components/dashboard/Summary';
import UserSummary from '../components/dashboard/UserSummary';
import Users from '../components/dashboard/Users';
import MonthlyTopContributors from '../components/dashboard/MonthlyTopContributors';
import RangeSelection from '../components/dashboard/RangeSelection';
import MonthSelection from '../components/dashboard/MonthSelection';
import Feedbacks from '../components/feedback/Feedbacks';
import { requestDashboardSummary, requestUserSummary, requestDashboardTopics, requestDashboardUsers, requestMonthlyTopContributors, requestUniqueValues } from '../store/actions/dashboard';
import { requestUserFeedbacks } from '../store/actions/feedback';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'none',
    display: 'flex',
    width: '90%',
    margin: 'auto',
    marginTop: 100,
    overflow:'unset'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabpanel: {
      [theme.breakpoints.up('md')]:{
        width: '85%'
    },
    [theme.breakpoints.up('lg')]:{
        width: '88%'
    }
  }
}));

function Dashboard(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);    
    const {
        summary,
        topics,
        userSummary,
        users,
        monthlyTopContributors,
        feedbacks,
        requestMonthlyTopContributors,
        requestDashboardSummary,
        requestDashboardTopics,
        requestDashboardUsers,
        requestUserSummary,
        requestUniqueValues,
        requestUserFeedbacks,
    } = props; 

    useEffect(() => {
        requestDashboardSummary();
        requestUserSummary();
        requestDashboardTopics();
        requestDashboardUsers();
        requestMonthlyTopContributors();
        requestUniqueValues();
        requestUserFeedbacks();
    }, [])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };  
    return (
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Dashboard"
          className={classes.tabs}
        >
          <Tab label="Dashboard" {...a11yProps(0)} />
          <Tab label="Feedback" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0} className={classes.tabpanel}>
              <UserSummary userSummary={ userSummary } />
              <RangeSelection
                  requestDashboardSummary={ requestDashboardSummary }
                  requestDashboardTopics={ requestDashboardTopics }
                  requestDashboardUsers={ requestDashboardUsers } />
              <Summary summary={ summary } />
              <Topics data={ topics } />
              <Users users={ users }/>
              <MonthSelection
                  requestMonthlyTopContributors={ requestMonthlyTopContributors } />
              <MonthlyTopContributors monthlyTopContributors={ monthlyTopContributors } />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabpanel}>
          <Feedbacks feedbacks={ feedbacks } />
        </TabPanel>
      </div>
    );
}


Dashboard.defaultProps = {
    results: [],
};

const mapStateToProps = (state) => {
    return {
        summary: state.dashboard.summary,
        topics: state.dashboard.topics,
        userSummary: state.dashboard.userSummary,
        users: state.dashboard.users,
        monthlyTopContributors: state.dashboard.monthlyTopContributors,
        feedbacks: state.feedback.feedbacks,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestDashboardSummary: (params) => {
            dispatch(requestDashboardSummary(params));
        },
        requestUserSummary: () => {
            dispatch(requestUserSummary());
        },
        requestDashboardTopics: (params) => {
            dispatch(requestDashboardTopics(params));
        },
        requestDashboardUsers: (params) => {
            dispatch(requestDashboardUsers(params));
        },
        requestMonthlyTopContributors: (params) => {
            dispatch(requestMonthlyTopContributors(params));
        },
        requestUniqueValues: () => {
            dispatch(requestUniqueValues());
        },
        requestUserFeedbacks: () => {
            dispatch(requestUserFeedbacks());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);