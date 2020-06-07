/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class SuggestionList extends React.Component {
    render() {
        const {
            suggestionsState,
            handleSuggestionItemClick,
        } = this.props;
        const {
            left,
            top,
            array,
        } = suggestionsState;

        const style = {
            borderRadius: 3,
            margin: 0,
            padding: 0,
            background: 'white',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, .1), 0 1px 10px rgba(0, 0, 0, .35)',
            zIndex: 3000,
            position: 'fixed',
            left,
            top,
        };
        if (!array) {
            return null;
        }
        return (
            <List style={
                style
            }>
                { ' ' }
                {
                    array.map((person) => (
                        <ListItem
                            button
                            onClick={ (e) => { handleSuggestionItemClick(e, person); } }
                            key={
                                person._id
                            }>
                            <ListItemText>
                                { ' ' }
                                {
                                    person.options.name
                                }
                                { ' ' }
                            </ListItemText>

                        </ListItem>
                    ), this)
                }
                { ' ' }

            </List>
        );
    }
}


export default SuggestionList;
