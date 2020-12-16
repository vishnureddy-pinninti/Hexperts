import React, { Component } from 'react';
import { Typography, IconButton, Tooltip } from '@material-ui/core';
import { Cancel, Check } from '@material-ui/icons';
import { connect } from 'react-redux';

import Table from '../base/Table';
import { isAdmin } from '../../utils/common';
import getBadge from '../../utils/badge';
import { requestGrantAdminAccess, requestRevokeAdminAccess } from '../../store/actions/dashboard';

class Users extends Component {
    render() {
        return (
            <div className="admin-container" style={{ marginBottom: 20 }}>
                <Table
                    name="Users"
                    filtering={ true }
                    columns={ this.getColumns() }
                    data={ this.processData() } />
            </div>
        )
    }

    processData = () => {
        const {
            users,
        } = this.props;

        return users.map((user = {}) => ({ ...user, membership: getBadge(user.reputation) }));
    }

    handleAdminAccess = (rowData, admin = false) => {
        const {
            requestGrantAdminAccess,
            requestRevokeAdminAccess,
        } = this.props;
        const postPayload = { userid: rowData._id };

        if (admin) {
            return requestRevokeAdminAccess(postPayload);
        }
        return requestGrantAdminAccess(postPayload);
    }

    renderRoleColumn = (rowData) => {
        const { user } = this.props;
        if (isAdmin(rowData)) {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>{ rowData.role }</Typography>
                    <Tooltip title="Revoke Admin access">
                        <span>
                            <IconButton color="secondary" onClick={ () => this.handleAdminAccess(rowData, true) } disabled={ user._id === rowData._id }>
                                <Cancel />
                            </IconButton>
                        </span>
                    </Tooltip>
                </div>
            );
        }
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography>{ rowData.role }</Typography>
                <Tooltip title="Grant Admin access">
                    <span>
                        <IconButton color="primary" onClick={ () => this.handleAdminAccess(rowData) } disabled={ user._id === rowData._id }>
                            <Check />
                        </IconButton>
                    </span>
                </Tooltip>
            </div>
        );
    }

    renderUpvotesColumn = (rowData) => {
        return (
            <Tooltip title="Total upvotes received irrespective of time frame">
                <Typography>
                    { rowData.upvotes }
                </Typography>
            </Tooltip>
        );
    }

    renderReputationColumn = (rowData) => {
        return (
            <Tooltip title="Total points till date">
                <Typography>
                    { rowData.reputation }
                </Typography>
            </Tooltip>
        );
    }

    renderMembershipStatus = (rowData) => {
        return (
            <Typography style={{ textTransform: 'capitalize' }}>
                { getBadge(rowData.reputation) }
            </Typography>
        );
    }

    getColumns = () => {
        const { uniqueValues } = this.props;
        const { departments = [], jobTitles = [], location = [] } = uniqueValues;
        const departmentsLookup = {};
        departments.forEach((department) => {
            if(department && department.trim() != '')
                departmentsLookup[department] = department
        });
        const jobTitlesLookup = {};
        jobTitles.forEach((jobTitle) => {
            if(jobTitle && jobTitle.trim() != '')
                jobTitlesLookup[jobTitle] = jobTitle
        });
        const locationsLookup = {};
        location.forEach((location) => {
            if(location && location.trim() != '')
                locationsLookup[location] = location
        });
        const membershipLookup = {
            blue: 'Blue',
            gold: 'Gold',
            silver: 'Silver',
        };
        return [
            { field: 'name', title: 'Name', cellStyle: { whiteSpace: 'nowrap' } },
            { field: 'jobTitle', title: 'Job Title', filtering: true, lookup: jobTitlesLookup, filterCellStyle: { overflow: 'auto', minWidth: 250, maxWidth: 250}, },
            { field: 'department', title: 'Department', filtering: true, lookup: departmentsLookup, filterCellStyle: { overflow: 'auto', minWidth: 200 , maxWidth: 250}, },
            { field: 'city', title: 'Location', filtering: true, lookup: locationsLookup, filterCellStyle: { overflow: 'auto',  maxWidth: 150}, },
            { field: 'questions', title: 'Questions' },
            { field: 'answers', title: 'Answers' },
            { field: 'posts', title: 'Blog Posts' },
            { field: 'upvotes', title: 'Upvotes', render: this.renderUpvotesColumn },
            { field: 'reputation', title: 'Points', render: this.renderReputationColumn },
            { field: 'membership', title: 'Membership', render: this.renderMembershipStatus, lookup: membershipLookup },
            { field: 'role', title: 'Role', render: this.renderRoleColumn },
        ]
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        uniqueValues: state.dashboard.uniqueValues,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestGrantAdminAccess: (payload) => {
            dispatch(requestGrantAdminAccess(payload));
        },
        requestRevokeAdminAccess: (payload) => {
            dispatch(requestRevokeAdminAccess(payload));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);