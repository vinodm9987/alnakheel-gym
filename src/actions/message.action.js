import axios from 'axios';

import { GET_ERROR, CLEAR_ERRORS, GET_MESSAGE } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'


export const sendSms = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/messaging/sendSms`, postData)
    .then(res =>
      dispatch({ type: GET_ERROR, payload: res.data })
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000)).then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
}

export const sendMail = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/messaging/sendMail`, postData)
    .then(res =>
      dispatch({ type: GET_ERROR, payload: res.data })
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000)).then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
}


export const getMessages = postData => dispatch => {
  axios
    .post(`${IP}/messaging/getMessages`, postData)
    .then(res =>
      dispatch({ type: GET_MESSAGE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MESSAGE, payload: null })
    )
}