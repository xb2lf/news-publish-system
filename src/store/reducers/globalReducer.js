/*
 * @Author: {baixiao}
 * @Date: 2022-10-21 03:02:43
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 15:31:09
 * @Description: 
 */
import { CHANGECOLLAPSED, CHANGENAVTITLE, CHANGEISLOADING } from '../constants';

const INITIAL_STATE = {
  isCollapsed: false,
  navTitle: '首页',
  isLoading: false,
};

const glogbalReducer = (state = INITIAL_STATE, action) => {
  const newState = { ...state };
  switch (action.type) {
    case CHANGECOLLAPSED:
      return {
        ...newState,
        isCollapsed: action.payload
      };
    case CHANGENAVTITLE:
      return {
        ...newState,
        navTitle: action.payload
      }
    case CHANGEISLOADING:
      return {
        ...newState,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default glogbalReducer