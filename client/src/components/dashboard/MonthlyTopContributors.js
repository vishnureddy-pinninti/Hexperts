import React, { Component } from 'react';

import Table from '../base/Table';

class MonthlyTopContributors extends Component {
    render() {
        const {
            monthlyTopContributors,
        } = this.props;
        return (
            <div className="admin-container" style={ { marginBottom: 20 } }>
                <Table
                    name="Monthly Top Contributors"
                    filtering={true}
                    columns={ this.getColumns() }
                    data={ monthlyTopContributors } />
            </div>
        )
    }


    getColumns = () => {
        return [
            { field: 'name', title: 'Name' },
            { field: 'jobTitle', title: 'Job Title' },
            // { field: 'month', title: 'Month' },
            // { field: 'year', title: 'Year' },
            { field: 'questions', title: 'Questions' },
            { field: 'answers', title: 'Answers' },
            { field: 'posts', title: 'Blog Posts' },
            { field: 'upvotes', title: 'Upvotes' },
            { field: 'reputation', title: 'Reputation' },
        ]
    }
}


export default MonthlyTopContributors;