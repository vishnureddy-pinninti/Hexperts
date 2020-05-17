import React, { Component } from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Button, Icon } from '@material-ui/core';

class RangeSelection extends Component {
    state = {
        startDate: null,
        startDateText: null,
        endDate: null,
        endDateText: null,
    }

    render() {
        const {
            startDate,
            endDate,
        } = this.state;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div style={ { display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 } }>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        emptyLabel="From beginning"
                        label="Start Date"
                        value={ startDate }
                        onChange={ (date, dateText) => this.handleDateChange(date, dateText, 'startDate') }
                        format="yyyy-MM-dd"
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        emptyLabel="Till date"
                        label="End Date"
                        value={ endDate }
                        onChange={ (date, dateText) => this.handleDateChange(date, dateText, 'endDate') }
                        format="yyyy-MM-dd"
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <div>
                        <Button variant="contained" endIcon={<Icon>send</Icon>} color="primary" onClick={ this.handleSubmit } style={{ marginRight: 20 }}>
                            Submit
                        </Button>
                        <Button variant="outlined" color="secondary" endIcon={<Icon>clear</Icon>} onClick={ this.handleDateClear }>
                            Clear
                        </Button>
                    </div>
                </div>
            </MuiPickersUtilsProvider>
        );
    }

    handleDateChange = (date, dateText, type) => {
        this.setState({
            [type]: date,
            [`${type}Text`]: dateText,
        });
    }

    handleDateClear = () => {
        this.setState({
            startDate: null,
            startDateText: null,
            endDate: null,
            endDateText: null,
        }, () => {
            this.handleSubmit();
        });
    }

    handleSubmit = () => {
        const {
            startDateText,
            endDateText,
        } = this.state;

        const {
            requestDashboardSummary,
            requestDashboardTopics,
        } = this.props;

        const params = {};

        if (startDateText) {
            params.startDate = startDateText;
        }

        if (endDateText) {
            params.endDate = endDateText;
        }

        requestDashboardSummary(params);
        requestDashboardTopics(params);
    }
}

export default RangeSelection;