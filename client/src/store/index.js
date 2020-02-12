import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import apiRequest from '../utils/apiRequest';

const store = () => createStore(reducers, applyMiddleware(apiRequest, reduxThunk));

export default store;
