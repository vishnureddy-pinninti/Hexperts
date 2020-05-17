import React, { Component } from 'react';
import Card from './Card';

class Summary extends Component {
    render() {
        const summaryCards = this.getSummaryCards();
        return (
            <div style={ { marginBottom: 20, display: 'flex', justifyContent: 'space-between' } }>
                {
                    summaryCards.map((card, index) => (
                        <Card
                            borderColor={ card.borderColor }
                            key={ card.title }
                            last={ index === summaryCards.length - 1 }
                            title={ card.title }
                            value={ card.value } />
                    ))
                }
            </div>
        );
    }

    getSummaryCards = () => {
        const { summary } = this.props;
        return [
            {
                borderColor: '#50AF8F',
                title: 'Questions Asked',
                value: summary.questions,
            },
            {
                borderColor: '#AC6715',
                title: 'Answers received',
                value: summary.answers,
            },
            {
                borderColor: '#837C78',
                title: 'Blog Posts',
                value: summary.posts,
            },
            {
                borderColor: '#017B9E',
                title: 'Topics',
                value: summary.topics,
            },
        ];
    }
}

export default Summary;