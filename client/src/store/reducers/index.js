import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import user from './userReducer';
import questions from './questionsReducer';

export default combineReducers({
    form: formReducer,
    questions,
    user,
});
