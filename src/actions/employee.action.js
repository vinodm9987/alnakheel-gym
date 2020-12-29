import axios from 'axios';
import { GET_EMPLOYEE, CLEAR_ERRORS, GET_ERROR, GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE_STATUS, GET_ACTIVE_TRAINER, GET_MEMBERS_OF_TRAINER, GET_ACTIVE_EMPLOYEE } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'
import { getMemberById } from './member.action';




export const addEmployee = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/employee/createNewEmployee`, postData)
    .then(res => {
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
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      })
    }, 5000))
};







export const updateEmployee = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/employee/updateEmployee`, postData)
    .then(res => {
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
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      })
    }, 5000))
};





export const updateStatusOfEmployee = (id, postData) => dispatch => {
  axios
    .post(`${IP}/employee/updateStatusOfEmployee/${id}`, postData)
    .then(res => {
      dispatch({
        type: UPDATE_EMPLOYEE_STATUS,
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
    ).then(() => setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      })
    }, 5000))
};





export const getAllActiveEmployee = () => dispatch => {
  dispatch(setLoading());
  axios
    .get(`${IP}/employee/getAllActiveEmployee`)
    .then(res =>
      dispatch({
        type: GET_ACTIVE_EMPLOYEE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ACTIVE_EMPLOYEE,
        payload: null
      })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
};





export const getAllEmployeeByFilter = (data) => dispatch => {
  axios
    .post(`${IP}/employee/getAllEmployeeByFilter`, data)
    .then(res =>
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EMPLOYEE,
        payload: null
      })
    )
};




export const getEmployeeById = (id) => dispatch => {
  axios
    .get(`${IP}/employee/getEmployeeById/${id}`)
    .then(res =>
      dispatch({
        type: GET_EMPLOYEE_BY_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EMPLOYEE_BY_ID,
        payload: null
      })
    )
};



export const getActiveTrainer = () => dispatch => {
  axios
    .get(`${IP}/employee/getActiveTrainer`)
    .then(res =>
      dispatch({
        type: GET_ACTIVE_TRAINER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ACTIVE_TRAINER,
        payload: null
      })
    )
}


export const getAllMemberOfTrainer = (trainerId, postData) => dispatch => {
  axios
    .post(`${IP}/employee/getAllMemberOfTrainer/${trainerId}`, postData)
    .then(res =>
      dispatch({
        type: GET_MEMBERS_OF_TRAINER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MEMBERS_OF_TRAINER,
        payload: null
      })
    )
}


export const trainerRating = (postData) => dispatch => {
  axios
    .post(`${IP}/employee/trainerRating`, postData)
    .then(res => {
      dispatch(getMemberById(postData.rating.member))
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      })
    }, 5000))
}