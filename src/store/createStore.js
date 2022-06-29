import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../reducers';

const rootReducer = combineReducers({
  authReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
