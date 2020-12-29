import axios from 'axios';

import { ADD_CURRENCY, UPDATE_CURRENCY, GET_ERROR, GET_CURRENCY, CLEAR_ERRORS, DEFAULT_CURRENCY } from './types'
import { IP } from '../config'


export const addCurrency = postData => dispatch => {
  axios
    .post(`${IP}/master/addCurrency`, postData)
    .then(res => {
      dispatch({
        type: ADD_CURRENCY,
        payload: res.data
      })
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    })
    .catch(err =>
      err.response && dispatch({
        type: GET_ERROR,
        payload: err.response.data
      })
    )
    .then(() =>
      setTimeout(() => {
        dispatch({
          type: CLEAR_ERRORS
        })
      }, 5000)
    )
};


export const updateCurrency = (id, postData) => dispatch => {
  axios
    .put(`${IP}/master/updateCurrency/${id}`, postData)
    .then(res => {
      dispatch({
        type: UPDATE_CURRENCY,
        payload: res.data
      })
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }
    )
    .catch(err =>
      err.response && dispatch({
        type: GET_ERROR,
        payload: err.response.data
      })
    ).then(() =>
      setTimeout(() => {
        dispatch({
          type: CLEAR_ERRORS
        })
      }, 5000)
    )
};


export const getAllCurrencyForAdmin = () => dispatch => {
  axios
    .get(`${IP}/master/getAllCurrencyForAdmin`)
    .then(res =>
      dispatch({
        type: GET_CURRENCY,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CURRENCY,
        payload: null
      })
    )
};


export const getDefaultCurrency = () => dispatch => {
  axios
    .get(`${IP}/master/getDefaultCurrency`)
    .then(res =>
      dispatch({
        type: DEFAULT_CURRENCY,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: DEFAULT_CURRENCY,
        payload: null
      })
    )
};

export const updateDefaultCurrency = (id) => dispatch => {
  axios
    .put(`${IP}/master/updateDefaultCurrency/${id}`)
    .then(res => {
      dispatch(getDefaultCurrency())
      dispatch({
        type: GET_CURRENCY,
        payload: res.data
      })
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }
    )
    .catch(err =>
      err.response && dispatch({
        type: GET_ERROR,
        payload: err.response.data
      })
    ).then(() =>
      setTimeout(() => {
        dispatch({
          type: CLEAR_ERRORS
        })
      }, 5000)
    )
}