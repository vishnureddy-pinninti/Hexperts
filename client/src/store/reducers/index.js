import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import user from './userReducer';
import questions from './questionsReducer';
import answer from './answerReducer';
import topic from './topicReducer';
import blog from './blogReducer';
import search from './searchReducer';
import dashboard from './dashboardReducer';
import draft from './draftReducer';

export default combineReducers({
    form: formReducer,
    questions,
    user,
    answer,
    topic,
    search,
    blog,
    dashboard,
    draft,
});
