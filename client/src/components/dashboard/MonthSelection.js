import React, { Component } from 'react';
import { Button, Icon, MenuItem, InputLabel, Select, FormControl    } from '@material-ui/core';
import {Months, StartYear} from '../../utils/common'

class MonthSelection extends Component {
    state = {
        month: new Date().getMonth()+1,
        year: new Date().getFullYear(),
    }

    render() {
        
        let YearsList = []
        const {
            month,
            year,
        } = this.state;
        for(let i=StartYear; i<= year; i++){
            YearsList.push(i);
        }
        return (
                <div style={ { display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 } }>
                    <FormControl style={{width: '15em'}}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        Month
                        </InputLabel>
                        <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={month}
                        onChange={this.handleChange}
                        name="month"
                        displayEmpty>
                            {Months.map((mon) => {
                                    return (<MenuItem key={mon.field} value={mon.value}>{mon.field}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <FormControl style={{width: '15em'}}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        Year
                        </InputLabel>
                        <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={year}
                        onChange={this.handleChange}
                        name="year"
                        displayEmpty>
                            {YearsList.map((yr) => {
                                    return (<MenuItem key={yr} value={yr}>{yr}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <div>
                        <Button variant="contained" endIcon={<Icon>send</Icon>} color="primary" onClick={ this.handleSubmit } style={{ marginRight: 20 }}>
                            Submit
                        </Button>
                        <Button variant="outlined" color="secondary" endIcon={<Icon>clear</Icon>} onClick={ this.handleDateClear }>
                            Clear
                        </Button>
                    </div>
                </div>
        );
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleDateClear = () => {
        let currentDate = new Date()
        this.setState({
            month: currentDate.getMonth()+1,
            year: currentDate.getFullYear(),
        }, () => {
            this.handleSubmit();
        });
    }

    handleSubmit = () => {
        const {
            month,
            year,
        } = this.state;

        const {
            requestMonthlyTopContributors,
        } = this.props;

        const params = {};

        if (month) {
            params.month = month;
        }

        if (year) {
            params.year = year;
        }
        requestMonthlyTopContributors(params);
    }
}

export default MonthSelection;