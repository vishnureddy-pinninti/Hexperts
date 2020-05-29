import React, { Component } from 'react';
import { connect } from 'react-redux';

import Topics from '../components/dashboard/Topics';
import Summary from '../components/dashboard/Summary';
import UserSummary from '../components/dashboard/UserSummary';
import Users from '../components/dashboard/Users';
import RangeSelection from '../components/dashboard/RangeSelection';
import { requestDashboardSummary, requestUserSummary, requestDashboardTopics, requestDashboardUsers } from '../store/actions/dashboard';

class Dashboard extends Component {
    render() {
        const {
            summary,
            topics,
            userSummary,
            users,
            requestDashboardSummary,
            requestDashboardTopics,
            requestDashboardUsers,
        } = this.props;
        return (
            <div style={{ width: '80%', margin: 'auto', marginTop: 100 }}>
                <UserSummary userSummary={ userSummary } />
                <RangeSelection
                    requestDashboardSummary={ requestDashboardSummary }
                    requestDashboardTopics={ requestDashboardTopics }
                    requestDashboardUsers={ requestDashboardUsers } />
                <Summary summary={ summary } />
                <Topics data={ topics } />
                <Users users={ users }/>
            </div>
        );
    }

    componentDidMount() {
        const {
            requestDashboardSummary,
            requestUserSummary,
            requestDashboardTopics,
            requestDashboardUsers,
        } = this.props;

        requestDashboardSummary();
        requestUserSummary();
        requestDashboardTopics();
        requestDashboardUsers();
    }
}

const mapStateToProps = (state) => {
    return {
        summary: state.dashboard.summary,
        topics: state.dashboard.topics,
        userSummary: state.dashboard.userSummary,
        users: state.dashboard.users,
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);