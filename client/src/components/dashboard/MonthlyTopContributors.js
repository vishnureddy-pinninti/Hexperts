import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        const { uniqueValues } = this.props;
        const { departments = [], jobTitles = [], location = [] } = uniqueValues;
        const departmentsLookup = {};
        departments.forEach((department) => departmentsLookup[department] = department);
        const jobTitlesLookup = {};
        jobTitles.forEach((jobTitle) => jobTitlesLookup[jobTitle] = jobTitle);
        const locationsLookup = {};
        location.forEach((location) => locationsLookup[location] = location);
        return [
            { field: 'name', title: 'Name' },
            { field: 'jobTitle', title: 'Job Title', filtering: true, lookup: jobTitlesLookup, filterCellStyle: { overflow: 'auto',  minWidth: 250, maxWidth: 250}, },
            { field: 'department', title: 'Department', filtering: true, lookup: departmentsLookup, filterCellStyle: { overflow: 'auto', minWidth: 200, maxWidth: 250 }, },
            { field: 'city', title: 'Location', filtering: true, lookup: locationsLookup, filterCellStyle: { overflow: 'auto',  maxWidth: 150}, },
            { field: 'questions', title: 'Questions' },
            { field: 'answers', title: 'Answers' },
            { field: 'posts', title: 'Blog Posts' },
            { field: 'upvotes', title: 'Upvotes' },
            { field: 'reputation', title: 'Points' },
        ]
    }
}


const mapStateToProps = state => {
    return {
        uniqueValues: state.dashboard.uniqueValues,
    }
}

export default connect(mapStateToProps)(MonthlyTopContributors);