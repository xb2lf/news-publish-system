/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 16:11:33
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 15:46:48
 * @Description: 
 */
import axios from "axios";
import { store } from '../store';
import { updateIsLoading } from '../store/action-types'

axios.interceptors.request.use((config) => {
  store.dispatch(updateIsLoading(true));
  return config;
}, (error) => { });

axios.interceptors.response.use((response) => {
  store.dispatch(updateIsLoading(false));
  return response
}, (error) => {
  store.dispatch(updateIsLoading(false));
});

