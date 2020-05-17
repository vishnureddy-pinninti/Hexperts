import React, { Component } from 'react';
import Card from './Card';

class UserSummary extends Component {
    render() {
        const userCards = this.getUserCards();
        return (
            <div style={ { marginBottom: 20, display: 'flex', justifyContent: 'space-between' } }>
                {
                    userCards.map((card, index) => (
                        <Card
                            borderColor={ card.borderColor }
                            key={ card.title }
                            last={ index === userCards.length - 1 }
                            title={ card.title }
                            tooltip={ card.tooltip }
                            value={ card.value } />
                    ))
                }
            </div>
        );
    }

    getUserCards = () => {
        const { userSummary } = this.props;
        return [
            {
                borderColor: '#017B9E',
                title: 'Registered Users',
                tooltip: 'Number of users who logged into this application atleast once.',
                value: userSummary.users,
            },
            {
                borderColor: '#837C78',
                title: 'Followers',
                tooltip: 'Number of users who are following atleast one topic.',
                value: userSummary.followers,
            },
            {
                borderColor: '#AC6715',
                title: 'Experts',
                tooltip: 'Number of users who marked themselves as expert in atleast one topic.',
                value: userSummary.users,
            },
            {
                borderColor: '#50AF8F',
                title: 'Total Upvotes',
                tooltip: 'Total number of upvotes received for all the users.',
                value: userSummary.upvotes,
                last: true,
            }
        ]
    }
}

export default UserSummary;