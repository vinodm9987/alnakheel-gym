import axios from 'axios';

import {
  GET_ERROR, CLEAR_ERRORS, GET_WORKOUTS, UPDATE_WORKOUT_STATUS, GET_ACTIVE_WORKOUTS,
  GET_WORKOUTS_LEVEL, GET_ACTIVE_WORKOUTS_LEVEL, UPDATE_WORKOUT_LEVEL_STATUS,
  GET_ACTIVE_WORKOUTS_BY_CATEGORY, GET_MEMBER_WORKOUT_BY_DATE, GET_MEMBER_WORKOUT_BY_DATE_FOR_TRAINER
} from './types'

import { setLoading, removeLoading } from './loader.action'
import { IP } from '../config'



/**
 * ACTION FOR WORKOUT ITEM 
 */


export const addWorkout = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/workout/addWorkout`, postData)
    .then(res => {
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }).catch(err =>
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


export const getAllWorkoutForAdmin = () => dispatch => {
  axios
    .get(`${IP}/workout/getAllWorkoutForAdmin`)
    .then(res =>
      dispatch({
        type: GET_WORKOUTS,
        payload: res.data
      })
    ).catch(err =>
      dispatch({
        type: GET_WORKOUTS,
        payload: null
      })
    )
};

export const getAllWorkoutByFilter = (data) => dispatch => {
  axios
    .post(`${IP}/workout/getAllWorkoutByFilter`, data)
    .then(res =>
      dispatch({
        type: GET_WORKOUTS,
        payload: res.data
      })
    ).catch(err =>
      dispatch({
        type: GET_WORKOUTS,
        payload: null
      })
    )
};

export const updateWorkout = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/workout/updateWorkout/${id}`, postData)
    .then(res => {
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }
    ).catch(err =>
      err.response && dispatch({
        type: GET_ERROR,
        payload: err.response.data
      })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() =>
      setTimeout(() => {
        dispatch({
          type: CLEAR_ERRORS
        })
      }, 5000)
    )
};

export const updateWorkoutStatus = (id, postData) => dispatch => {
  axios
    .put(`${IP}/workout/updateWorkoutStatus/${id}`, postData)
    .then(res => {
      dispatch({
        type: UPDATE_WORKOUT_STATUS,
        payload: res.data
      })
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }
    ).catch(err =>
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

export const getAllWorkouts = () => dispatch => {
  axios
    .get(`${IP}/workout/getAllWorkouts`)
    .then(res =>
      dispatch({
        type: GET_ACTIVE_WORKOUTS,
        payload: res.data
      })
    ).catch(err =>
      dispatch({
        type: GET_ACTIVE_WORKOUTS,
        payload: null
      })
    )
};

export const getAllWorkoutByWorkoutCategory = (data) => dispatch => {
  axios
    .post(`${IP}/workout/getAllWorkoutByWorkoutCategory`, data)
    .then(res =>
      dispatch({
        type: GET_ACTIVE_WORKOUTS_BY_CATEGORY,
        payload: res.data
      })
    ).catch(err =>
      dispatch({
        type: GET_ACTIVE_WORKOUTS_BY_CATEGORY,
        payload: null
      })
    )
};





/**
 * ACTION FOR WORKOUT  LEVEL
 */


export const addWorkoutLevel = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/workout/addWorkoutLevel`, postData)
    .then(res => {
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }).catch(err =>
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


export const getAllWorkoutLevelForAdmin = () => dispatch => {
  axios
    .get(`${IP}/workout/getAllWorkoutLevelForAdmin`)
    .then(res =>
      dispatch({
        type: GET_WORKOUTS_LEVEL,
        payload: res.data
      })
    ).catch(err =>
      dispatch({
        type: GET_WORKOUTS_LEVEL,
        payload: null
      })
    )
};

export const updateWorkoutLevel = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/workout/updateWorkoutLevel/${id}`, postData)
    .then(res => {
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }
    ).catch(err =>
      err.response && dispatch({
        type: GET_ERROR,
        payload: err.response.data
      })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() =>
      setTimeout(() => {
        dispatch({
          type: CLEAR_ERRORS
        })
      }, 5000)
    )
};

export const updateWorkoutLevelStatus = (id, postData) => dispatch => {
  axios
    .put(`${IP}/workout/updateWorkoutLevel/${id}`, postData)
    .then(res => {
      dispatch({
        type: UPDATE_WORKOUT_LEVEL_STATUS,
        payload: res.data
      })
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }
    ).catch(err =>
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


export const getAllWorkoutLevel = () => dispatch => {
  axios
    .get(`${IP}/workout/getAllWorkoutLevel`)
    .then(res =>
      dispatch({
        type: GET_ACTIVE_WORKOUTS_LEVEL,
        payload: res.data
      })
    ).catch(err =>
      dispatch({
        type: GET_ACTIVE_WORKOUTS_LEVEL,
        payload: null
      })
    )
};




/**
 * ACTION FOR MEMBER WORKOUT (MANAGE WORKOUTS) ITEM 
 */

export const addMemberWorkout = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/workout/addMemberWorkout`, postData)
    .then(res => {
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }).catch(err =>
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


export const getMemberWorkoutByDate = postData => dispatch => {
  axios
    .post(`${IP}/workout/getMemberWorkoutByDate`, postData)
    .then(res =>
      dispatch({
        type: GET_MEMBER_WORKOUT_BY_DATE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MEMBER_WORKOUT_BY_DATE,
        payload: null
      })
    )
};


export const getMemberWorkoutByDateForTrainer = postData => dispatch => {
  axios
    .post(`${IP}/workout/getMemberWorkoutByDateForTrainer`, postData)
    .then(res =>
      dispatch({
        type: GET_MEMBER_WORKOUT_BY_DATE_FOR_TRAINER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MEMBER_WORKOUT_BY_DATE_FOR_TRAINER,
        payload: null
      })
    )
};


export const updateMemberWorkoutById = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/workout/updateMemberWorkoutById/${id}`, postData)
    .then(res => {
      dispatch({
        type: GET_ERROR,
        payload: res.data
      })
    }).catch(err =>
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