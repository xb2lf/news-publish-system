/*
 * @Author: {baixiao}
 * @Date: 2022-10-21 03:00:30
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 19:21:45
 * @Description: 
 */
import { combineReducers } from 'redux';
import globalReducer from './globalReducer';
import newsDetailReducer from './newsDetailReducer'

const reducer = combineReducers({ globalReducer, newsDetailReducer });


export default reducer;