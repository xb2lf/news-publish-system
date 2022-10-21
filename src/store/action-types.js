/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:13:39
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 19:23:23
 * @Description: 
 */
import { CHANGECOLLAPSED, CHANGENAVTITLE, CHANGEISLOADING, CHANGEID } from './constants';


export const updateCollapsed = (bool) => ({ type: CHANGECOLLAPSED, payload: bool });

export const updateNavTitle = (title) => ({ type: CHANGENAVTITLE, payload: title });

export const updateIsLoading = (bool) => ({ type: CHANGEISLOADING, payload: bool });

export const updateId = (id) => ({ type: CHANGEID, payload: id });