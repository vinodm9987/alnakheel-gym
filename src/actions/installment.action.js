import axios from 'axios';
import { CLEAR_ERRORS, GET_ERROR, GET_PACKAGE_INSTALLMENT, GET_TRAINER_INSTALLMENT } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action';


export const getPackageInstallment = (postData) => dispatch => {
  axios.post(`${IP}/installment/getPackageInstallment`, postData)
    .then(res =>
      dispatch({ type: GET_PACKAGE_INSTALLMENT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_PACKAGE_INSTALLMENT, payload: null })
    )
};


export const getTrainerInstallment = (postData) => dispatch => {
  axios.post(`${IP}/installment/getTrainerInstallment`, postData)
    .then(res =>
      dispatch({ type: GET_TRAINER_INSTALLMENT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_TRAINER_INSTALLMENT, payload: null })
    )
};


export const changeDueDateOfPackageInstallment = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/installment/changeDueDateOfPackageInstallment`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
      dispatch(getPackageInstallment({ month: new Date().getMonth(), day: new Date().getFullYear() }))
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


export const changeDueDateOfTrainerInstallment = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/installment/changeDueDateOfTrainerInstallment`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
      dispatch(getTrainerInstallment({ month: new Date().getMonth(), day: new Date().getFullYear() }))
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