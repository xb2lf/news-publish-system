/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:14:25
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 15:52:03
 * @Description: 
 */
import { legacy_createStore as createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  /* whitelist: ['exampleReducer'], //需要被持久化的reducer
  blacklist:['exampleReducer'], // 不需要被持久化的reducer */
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export {
  store,
  persistor
}