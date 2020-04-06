import React from 'react';
import { connect } from 'react-redux';
import QuestionsList from '../question/QuestionsList';

const QuestionSuggestions = (props) => {
    const { questionSuggestions } =props;
    return (
        <QuestionsList
            openInNewWindow
            questions={ questionSuggestions.questionSuggestions || [] } />
    );
}

const mapStateToProps = (state) => {
    return {
        questionSuggestions: state.questions.questionSuggestions,
    };
};

export default connect(mapStateToProps)(QuestionSuggestions);

