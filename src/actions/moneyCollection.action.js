import axios from 'axios';
import { GET_ERROR, CLEAR_ERRORS, GET_MONEY_COLLECTION, GET_MONEY_COLLECTION_HISTORY, GET_MONEY_COLLECTION_BY_ID } from './types'
import { IP } from '../config'


export const getMoneyCollection = (postData) => dispatch => {
  axios
    .post(`${IP}/moneyCollection/getMoneyCollection`, postData)
    .then(res => {
      dispatch({ type: GET_MONEY_COLLECTION, payload: res.data })
    })
    .catch(err => {
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
      dispatch({ type: GET_MONEY_COLLECTION, payload: {} })
    }
    )
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
};

export const addMoneyCollection = (postData) => dispatch => {
  axios
    .post(`${IP}/moneyCollection/addMoneyCollection`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    )
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
};


export const getMoneyCollectionHistory = (postData) => dispatch => {
  axios.post(`${IP}/moneyCollection/getMoneyCollectionHistory`, postData)
    .then(res =>
      dispatch({ type: GET_MONEY_COLLECTION_HISTORY, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MONEY_COLLECTION_HISTORY, payload: null })
    )
};


export const getMoneyCollectionById = (id) => dispatch => {
  axios
    .get(`${IP}/moneyCollection/getMoneyCollectionById/${id}`)
    .then(res =>
      dispatch({ type: GET_MONEY_COLLECTION_BY_ID, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MONEY_COLLECTION_BY_ID, payload: null })
    )
};