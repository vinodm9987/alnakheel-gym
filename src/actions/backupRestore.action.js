import axios from 'axios';
import { GET_ERROR, CLEAR_ERRORS, GET_MANUAL_BACKUP, GET_RESTORE } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action';



export const processBackup = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/backupRestore/processBackup`, postData)
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


export const getAllManualBackup = () => dispatch => {
  axios
    .post(`${IP}/backupRestore/getAllManualBackup`)
    .then(res =>
      dispatch({ type: GET_MANUAL_BACKUP, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MANUAL_BACKUP, payload: null })
    )
};


export const processRestore = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/backupRestore/processRestore`, postData)
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


export const getAllRestore = () => dispatch => {
  axios
    .post(`${IP}/backupRestore/getAllRestore`)
    .then(res =>
      dispatch({ type: GET_RESTORE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_RESTORE, payload: null })
    )
};