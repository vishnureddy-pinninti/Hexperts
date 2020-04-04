import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from './reducers';
import apiRequest from '../utils/apiRequest';

const store = () => {
    if (process.env.NODE_ENV === 'production') {
        return createStore(reducers, applyMiddleware(apiRequest, reduxThunk));
    }
    return createStore(reducers, applyMiddleware(apiRequest, reduxThunk, logger));
};

export default store();
