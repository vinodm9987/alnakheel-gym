import axios from 'axios';
import {
  ADD_SHIFT, GET_ERROR, GET_SHIFT, CLEAR_ERRORS, UPDATE_SHIFT, GET_ACTIVE_SHIFT,
  ADD_EMPLOYEE_SHIFT, UPDATE_EMPLOYEE_SHIFT, GET_EMPLOYEE_SHIFT, GET_EMPLOYEE_SHIFT_BY_ID_AND_BRANCH,
  GET_ACTIVE_SHIFT_BY_BRANCH, GET_EMPLOYEE_SHIFT_BY_SHIFT_BRANCH_EMPLOYEE, GET_NOT_EXPIRED_SHIFT_BY_BRANCH
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'

/**
 *  Shift
 **/

export const addShift = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/shift/addShift`, postData)
    .then(res => {
      dispatch({ type: ADD_SHIFT, payload: res.data })
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


export const getAllShiftForAdmin = () => dispatch => {
  axios
    .get(`${IP}/shift/getAllShiftForAdmin`)
    .then(res =>
      dispatch({ type: GET_SHIFT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_SHIFT, payload: null })
    )
};

export const updateShift = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/shift/updateShift/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_SHIFT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    }
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
};

export const getAllShift = () => dispatch => {
  axios
    .get(`${IP}/shift/getAllShift`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_SHIFT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_SHIFT, payload: null })
    )
};

export const getAllShiftByBranch = (postData) => dispatch => {
  axios
    .post(`${IP}/shift/getAllShiftByBranch`, postData)
    .then(res =>
      dispatch({ type: GET_ACTIVE_SHIFT_BY_BRANCH, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_SHIFT_BY_BRANCH, payload: null })
    )
};

export const getAllNotExpiredShiftByBranch = (postData) => dispatch => {
  axios
    .post(`${IP}/shift/getAllShiftByBranch`, postData)
    .then(res =>
      dispatch({ type: GET_NOT_EXPIRED_SHIFT_BY_BRANCH, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_NOT_EXPIRED_SHIFT_BY_BRANCH, payload: null })
    )
};




/**
 *  Employee Shift
 **/

export const addEmployeeShift = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/shift/addEmployeeShift`, postData)
    .then(res => {
      dispatch({ type: ADD_EMPLOYEE_SHIFT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
      dispatch(getAllEmployeeShiftByIdAndBranch({ employeeId: postData.employee, branch: postData.branch }))
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

export const updateEmployeeShift = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/shift/updateEmployeeShift/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_EMPLOYEE_SHIFT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
};

export const getAllEmployeeShift = (postData) => dispatch => {
  axios
    .post(`${IP}/shift/getAllEmployeeShift`, postData)
    .then(res =>
      dispatch({ type: GET_EMPLOYEE_SHIFT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_EMPLOYEE_SHIFT, payload: null })
    )
};

export const getAllEmployeeShiftByIdAndBranch = (postData) => dispatch => {
  axios
    .post(`${IP}/shift/getAllEmployeeShiftByIdAndBranch`, postData)
    .then(res =>
      dispatch({ type: GET_EMPLOYEE_SHIFT_BY_ID_AND_BRANCH, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_EMPLOYEE_SHIFT_BY_ID_AND_BRANCH, payload: null })
    )
};

export const getAllEmployeeShiftByShiftAndBranchAndEmployee = (postData) => dispatch => {
  axios
    .post(`${IP}/shift/getAllEmployeeShiftByShiftAndBranchAndEmployee`, postData)
    .then(res =>
      dispatch({ type: GET_EMPLOYEE_SHIFT_BY_SHIFT_BRANCH_EMPLOYEE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_EMPLOYEE_SHIFT_BY_SHIFT_BRANCH_EMPLOYEE, payload: null })
    )
};
