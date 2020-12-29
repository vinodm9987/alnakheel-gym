import axios from 'axios';
import { GET_USER_NOTIFICATION, GET_USER_NOTIFICATIONS } from './types';
import { IP } from '../config'
import { listen } from '../utils/socket';
// import { setLoading, removeLoading } from './loader.action'

export const getUserNotification = (postData) => dispatch => {
  axios
    .post(`${IP}/notification/getUserNotification`, postData)
    .then(res =>
      dispatch({ type: GET_USER_NOTIFICATION, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_USER_NOTIFICATION, payload: null })
    )
};

export const getUserNotifications = (io) => dispatch => {
  listen('getNotification', io)
    .subscribe(res => dispatch({ type: GET_USER_NOTIFICATIONS, payload: res }), eror => {
      dispatch({ type: GET_USER_NOTIFICATIONS, payload: null })
    })
}