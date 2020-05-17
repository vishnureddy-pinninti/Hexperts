import React, { Component } from 'react';

import Table from '../base/Table';

class Topics extends Component {
    render() {
        const {
            data,
        } = this.props;
        return (
            <div className="admin-container" style={ { marginBottom: 20 } }>
                <Table
                    name="Topic wise data"
                    filtering={true}
                    columns={ this.getColumns() }
                    data={ data } />
            </div>
        )
    }

    getColumns = () => {
        return [
            { field: 'topic', title: 'Topic', render: (rowData) => (rowData.topic || '-') },
            { field: 'questions', title: 'Questions', type: 'numeric' },
            { field: 'answers', title: 'Answers', render: (rowData) => (rowData.answers || 0), type: 'numeric' },
            { field: 'posts', title: 'Blog Posts', type: 'numeric' },
        ]
    }
}

export default Topics;