import axios from 'axios';
import {
  ADD_ROOM, GET_ERROR, GET_ROOM, CLEAR_ERRORS, UPDATE_ROOM, GET_ACTIVE_ROOM,
  GET_ROOM_BY_BRANCH, ADD_CLASS, GET_CLASS, UPDATE_CLASS, GET_CLASS_BY_BRANCH,
  GET_CLASS_BY_ID, GET_CLASS_SCHEDULE_BY_DATE, GET_CUSTOMER_CLASS_SCHEDULE_BY_DATE,
  GET_CUSTOMER_CLASSES_DETAILS
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'

/**
 *  Room
 **/

export const addRoom = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/classes/addRoom`, postData)
    .then(res => {
      dispatch({ type: ADD_ROOM, payload: res.data })
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


export const getAllRoomForAdmin = () => dispatch => {
  axios
    .get(`${IP}/classes/getAllRoomForAdmin`)
    .then(res =>
      dispatch({ type: GET_ROOM, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ROOM, payload: null })
    )
};

export const updateRoom = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/classes/updateRoom/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_ROOM, payload: res.data })
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

export const getAllRoom = () => dispatch => {
  axios
    .get(`${IP}/classes/getAllRoom`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_ROOM, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_ROOM, payload: null })
    )
};

export const getAllRoomByBranch = (postData) => dispatch => {
  axios
    .post(`${IP}/classes/getAllRoomByBranch`, postData)
    .then(res =>
      dispatch({ type: GET_ROOM_BY_BRANCH, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ROOM_BY_BRANCH, payload: null })
    )
};







/**
 *  Classes
 **/

export const addNewClasses = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/classes/addNewClasses`, postData)
    .then(res => {
      dispatch({ type: ADD_CLASS, payload: res.data })
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

export const getAllClassesForAdmin = (postData) => dispatch => {
  axios
    .post(`${IP}/classes/getAllClassesForAdmin`, postData)
    .then(res =>
      dispatch({ type: GET_CLASS, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CLASS, payload: null })
    )
};


export const getClassById = (id) => dispatch => {
  axios
    .get(`${IP}/classes/getClassById/${id}`)
    .then(res =>
      dispatch({ type: GET_CLASS_BY_ID, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CLASS_BY_ID, payload: null })
    )
};

export const updateClasses = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/classes/updateClasses/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_CLASS, payload: res.data })
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

export const getAllClassesByBranch = (postData) => dispatch => {
  axios
    .post(`${IP}/classes/getAllClassesByBranch`, postData)
    .then(res =>
      dispatch({ type: GET_CLASS_BY_BRANCH, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CLASS_BY_BRANCH, payload: null })
    )
};


export const purchaseClassByAdmin = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/classes/purchaseClassByAdmin`, postData)
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




export const purchaseClassByMember = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/classes/purchaseClassByMember`, postData)
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



export const getClassesScheduleByDates = (postData) => dispatch => {
  axios
    .post(`${IP}/classes/getClassesScheduleByDates`, postData)
    .then(res =>
      dispatch({ type: GET_CLASS_SCHEDULE_BY_DATE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CLASS_SCHEDULE_BY_DATE, payload: null })
    )
};



export const getCustomerClassesScheduleByDates = (postData) => dispatch => {
  axios
    .post(`${IP}/classes/getCustomerClassesScheduleByDates`, postData)
    .then(res =>
      dispatch({ type: GET_CUSTOMER_CLASS_SCHEDULE_BY_DATE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CUSTOMER_CLASS_SCHEDULE_BY_DATE, payload: null })
    )
};



export const getCustomerClassesDetails = (postData) => dispatch => {
  axios
    .post(`${IP}/classes/getCustomerClassesDetails`, postData)
    .then(res =>
      dispatch({ type: GET_CUSTOMER_CLASSES_DETAILS, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CUSTOMER_CLASSES_DETAILS, payload: null })
    )
};
