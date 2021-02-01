import React, { Component } from 'react';

import Table from '../base/Table';

class Feedbacks extends Component {
    render() {
        const {
            feedbacks,
        } = this.props;

        return (
            <div className="admin-container" style={ { marginBottom: 20 } }>
                <Table
                    name="Feedbacks"
                    filtering={true}
                    columns={ this.getColumns() }
                    data={ feedbacks.userFeedbacks }/>
            </div>
        )
    }


    getColumns = () => {
        const { departments = [], jobTitles = [], location = [] } = this.props.feedbacks;
        const departmentsLookup = {};
        departments.forEach((department) => departmentsLookup[department] = department);
        const jobTitlesLookup = {};
        jobTitles.forEach((jobTitle) => jobTitlesLookup[jobTitle] = jobTitle);
        const locationsLookup = {};
        location.forEach((location) => locationsLookup[location] = location);
        return [
            { field: 'subject', title: 'Subject',filtering: false, filterCellStyle: { overflow: 'auto', minWidth: 200, },  },
            { field: 'description', title: 'Description',filtering: false, filterCellStyle: { overflow: 'auto', minWidth: 300, } },
            { field: 'user', title: 'Name' },
            { field: 'jobTitle', title: 'Job Title', filtering: true, lookup: jobTitlesLookup, filterCellStyle: { overflow: 'auto',  minWidth: 120, maxWidth: 200}, },
            { field: 'department', title: 'Department', filtering: true, lookup: departmentsLookup, filterCellStyle: { overflow: 'auto', minWidth: 150, maxWidth: 200}, },
            { field: 'city', title: 'Location', filtering: true, lookup: locationsLookup, filterCellStyle: { overflow: 'auto',  minWidth: 50, maxWidth: 70}, },
        ]
    }

}

export default Feedbacks;