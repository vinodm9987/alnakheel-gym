import axios from 'axios';
import { GET_ERROR, CLEAR_ERRORS, GET_APPOINTMENT_REQUESTS, GET_MEMBER_APPOINTMENT_HISTORY, GET_MEMBER_APPOINTMENT_STATUS, GET_MEMBER_TRAFFIC } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action';
import { listen } from '../utils/socket';



export const bookAppointment = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/appointment/bookAppointment`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
};

export const getAppointmentRequests = (postData) => dispatch => {
  axios.post(`${IP}/appointment/getAppointmentRequests`, postData)
    .then(res =>
      dispatch({ type: GET_APPOINTMENT_REQUESTS, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_APPOINTMENT_REQUESTS, payload: null })
    )
};

export const getMemberAppointmentHistory = (postData) => dispatch => {
  axios.post(`${IP}/appointment/getMemberAppointmentHistory`, postData)
    .then(res =>
      dispatch({ type: GET_MEMBER_APPOINTMENT_HISTORY, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER_APPOINTMENT_HISTORY, payload: null })
    )
};

export const getMemberTraffics = (postData) => dispatch => {
  axios.post(`${IP}/appointment/getMemberTraffics`, postData)
    .then(res =>
      dispatch({ type: GET_MEMBER_TRAFFIC, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER_TRAFFIC, payload: null })
    )
};

export const getMemberAppointmentStatus = (io) => dispatch => {
  listen('memberCheckedIn', io)
    .subscribe(res => {
      dispatch({ type: GET_MEMBER_APPOINTMENT_STATUS, payload: res })
    }, err => {
      dispatch({ type: GET_MEMBER_APPOINTMENT_STATUS, payload: null })
    })
}