import axios from 'axios';

import { ADD_VAT, UPDATE_VAT, GET_ERROR, GET_VAT, CLEAR_ERRORS, DEFAULT_VAT, GET_ACTIVE_VAT } from './types'
import { IP } from '../config'


export const addVat = postData => dispatch => {
  axios
    .post(`${IP}/finance/addVat`, postData)
    .then(res => {
      dispatch({ type: ADD_VAT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    )
    .then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
};


export const updateVat = (id, postData) => dispatch => {
  axios
    .put(`${IP}/finance/updateVat/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_VAT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    }
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
};


export const getAllVatForAdmin = () => dispatch => {
  axios
    .post(`${IP}/finance/getAllVatForAdmin`)
    .then(res =>
      dispatch({ type: GET_VAT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_VAT, payload: null })
    )
};

export const getAllVat = (postData) => dispatch => {
  axios
    .post(`${IP}/finance/getAllVat`, postData)
    .then(res =>
      dispatch({ type: GET_ACTIVE_VAT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_VAT, payload: null })
    )
};

export const getDefaultVat = () => dispatch => {
  axios
    .get(`${IP}/finance/getDefaultVat`)
    .then(res =>
      dispatch({ type: DEFAULT_VAT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: DEFAULT_VAT, payload: null })
    )
}

export const updateDefaultVat = (id) => dispatch => {
  axios
    .put(`${IP}/finance/updateDefaultVat/${id}`)
    .then(res => {
      // dispatch(getDefaultVat())
      dispatch({ type: GET_VAT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
}