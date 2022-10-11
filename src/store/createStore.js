import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authReducer, postReducer } from '../reducers';

const persistConfig = {
  key: 'root',
  storage
};
const rootReducer = combineReducers({
  authReducer,
  postReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer
});
export const persistor = persistStore(store);
