import axios from 'axios';
import {
  GET_ERROR, CLEAR_ERRORS, GET_FEEDBACK, UPDATE_FEEDBACK, ADD_FEEDBACK, GET_FEEDBACK_MEMBER
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'


export const addFeedback = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/feedback/addFeedback`, postData)
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

export const addFeedbackMember = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/feedback/addFeedback`, postData)
    .then(res => {
      dispatch({ type: ADD_FEEDBACK, payload: res.data })
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

export const getFeedbackList = (postData) => dispatch => {
  axios
    .post(`${IP}/feedback/getFeedbackList`, postData)
    .then(res =>
      dispatch({ type: GET_FEEDBACK, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_FEEDBACK, payload: null })
    )
};

export const updateFeedback = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/feedback/updateFeedback/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_FEEDBACK, payload: res.data })
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

export const getMemberFeedback = (postData) => dispatch => {
  axios
    .post(`${IP}/feedback/getMemberFeedback`, postData)
    .then(res =>
      dispatch({ type: GET_FEEDBACK_MEMBER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_FEEDBACK_MEMBER, payload: null })
    )
};
