/*
 * @Author: {baixiao}
 * @Date: 2022-10-21 19:17:17
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 19:22:27
 * @Description: 
 */
import { CHANGEID } from '../constants';

const INITIAL_STATE = {
  Id: 1
};

const newsDetailReducer = (state = INITIAL_STATE, action) => {
  const newState = { ...state };
  switch (action.type) {
    case CHANGEID:
      return {
        ...newState,
        Id: action.payload
      }
    default:
      return state
  }
}

export default newsDetailReducer