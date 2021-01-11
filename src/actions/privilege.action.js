import axios from 'axios';
import {
  GET_ERROR, CLEAR_ERRORS, USER_BY_DESIGNATION_SEARCH, ADD_ADMIN_PASSWORD, GET_ADMIN_PASSWORD, VERIFY_ADMIN_PASSWORD
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'
// import { storeItem, removeItemFromStorage } from '../utils/localstorage'

export const assignViewForWeb = (postData) => dispatch => {
  dispatch(setLoading());
  axios.post(`${IP}/privilege/assignViewForWeb`, postData)
    .then(res => {
      dispatch(getAllUserFilterByDesignationAndSearch({ designation: '', search: '' }))
    }).catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => {
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    })
}

export const assignReport = (postData) => dispatch => {
  dispatch(setLoading());
  axios.post(`${IP}/privilege/assignReport`, postData)
    .then(res => {
      dispatch(getAllUserFilterByDesignationAndSearch({ designation: '', search: '' }))
    }).catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => {
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    })
}

export const blackListUser = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios.post(`${IP}/member/blackListUser/${id}`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
      dispatch(getAllUserFilterByDesignationAndSearch({ designation: '', search: '' }))
    }).catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => {
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    })
}

export const updateNotification = (postData) => dispatch => {
  dispatch(setLoading());
  axios.post(`${IP}/credential/updateNotification`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
      dispatch(getAllUserFilterByDesignationAndSearch({ designation: '', search: '' }))
    }).catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => {
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    })
}


export const getAllUserFilterByDesignationAndSearch = (postData) => dispatch => {
  axios.post(`${IP}/credential/getAllUserFilterByDesignationAndSearch`, postData)
    .then(res => {
      dispatch({ type: USER_BY_DESIGNATION_SEARCH, payload: res.data });
    }).catch(err =>
      dispatch({ type: USER_BY_DESIGNATION_SEARCH, payload: null })
    )
}




export const addAdminPassword = (postData) => dispatch => {
  axios.post(`${IP}/privilege/addAdminPassword`, postData)
    .then(res => {
      dispatch({ type: ADD_ADMIN_PASSWORD, payload: res.data })
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
}


export const getAdminPassword = () => dispatch => {
  axios.get(`${IP}/privilege/getAdminPassword`)
    .then(res =>
      dispatch({ type: GET_ADMIN_PASSWORD, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ADMIN_PASSWORD, payload: null })
    )
}

export const verifyAdminPassword = (postData) => dispatch => {
  axios.post(`${IP}/privilege/verifyAdminPassword`, postData)
    .then(res => {
      dispatch({ type: VERIFY_ADMIN_PASSWORD, payload: 'verified' })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    )
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
}