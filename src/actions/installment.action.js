import axios from 'axios';
import { GET_PACKAGE_INSTALLMENT, GET_TRAINER_INSTALLMENT } from './types'
import { IP } from '../config'


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