import axios from 'axios';
import { GET_ATTENDANCE_DETAILS, GET_MEMBER_ATTENDANCE_FILTER, GET_MEMBER_ATTENDANCE, GET_MEMBER_ATTENDANCES } from './types'
import { IP } from '../config'
import { listen } from '../utils/socket';



export const getAttendanceDetails = (postData) => dispatch => {
  axios
    .post(`${IP}/attendance/getAttendanceDetails`, postData)
    .then(res =>
      dispatch({ type: GET_ATTENDANCE_DETAILS, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ATTENDANCE_DETAILS, payload: null })
    )
};



export const getMemberAttendanceForAdmin = (postData) => dispatch => {
  axios.post(`${IP}/attendance/getMemberAttendanceForAdmin`, postData)
    .then(res =>
      dispatch({ type: GET_MEMBER_ATTENDANCE_FILTER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER_ATTENDANCE_FILTER, payload: null })
    )
};




export const getMemberAttendance = (postData) => dispatch => {
  axios.post(`${IP}/attendance/getMemberAttendance`, postData)
    .then(res =>
      dispatch({ type: GET_MEMBER_ATTENDANCE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER_ATTENDANCE, payload: null })
    )
};


export const getMemberAttendances = (io, branch) => dispatch => {
  listen('newMember', io)
    .subscribe(res => {
      dispatch({ type: GET_MEMBER_ATTENDANCES, payload: res })
      dispatch(getAttendanceDetails({ branch }));
    }, err => {
      dispatch({ type: GET_MEMBER_ATTENDANCES, payload: null })
    })
}
