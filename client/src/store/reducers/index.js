import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import user from './userReducer';
import questions from './questionsReducer';
import answer from './answerReducer';
import topic from './topicReducer';
import search from './searchReducer';

export default combineReducers({
    form: formReducer,
    questions,
    user,
    answer,
    topic,
    search,
});
