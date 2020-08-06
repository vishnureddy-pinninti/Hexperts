import React, { Component } from 'react';
import { Typography, IconButton, Tooltip } from '@material-ui/core';
import { Cancel, Check } from '@material-ui/icons';
import { connect } from 'react-redux';

import Table from '../base/Table';
import { isAdmin } from '../../utils/common';
import { requestGrantAdminAccess, requestRevokeAdminAccess } from '../../store/actions/dashboard';

class Users extends Component {
    render() {
        const {
            users,
        } = this.props;
        return (
            <div className="admin-container" style={{ marginBottom: 20 }}>
                <Table
                    name="Users"
                    filtering={true}
                    columns={ this.getColumns() }
                    data={ users } />
            </div>
        )
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

    getColumns = () => {
        return [
            { field: 'name', title: 'Name' },
            { field: 'jobTitle', title: 'Job Title' },
            { field: 'department', title: 'Department' },
            { field: 'city', title: 'Location' },
            { field: 'questions', title: 'Questions' },
            { field: 'answers', title: 'Answers' },
            { field: 'posts', title: 'Blog Posts' },
            { field: 'upvotes', title: 'Upvotes', render: this.renderUpvotesColumn },
            { field: 'role', title: 'Role', render: this.renderRoleColumn },
        ]
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestGrantAdminAccess: (payload) => {
            dispatch(requestGrantAdminAccess(payload));
        },
        requestRevokeAdminAccess: (payload) => {
            dispatch(requestRevokeAdminAccess(payload));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);