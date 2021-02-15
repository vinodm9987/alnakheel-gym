import axios from 'axios';
import {
  GET_ERROR, GET_PENDING_FREEZE, CLEAR_ERRORS, GET_FREEZE_HISTORY
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'

/**
 *  Shift
 **/

export const applyFreezeMember = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/applyFreezeMember`, postData)
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

export const applyFreezeAllMember = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/applyFreezeAllMember`, postData)
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

export const getPendingFreezeMember = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getPendingFreezeMember`, postData)
    .then(res =>
      dispatch({ type: GET_PENDING_FREEZE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_PENDING_FREEZE, payload: null })
    )
};

export const freezeMember = (postData) => dispatch => {
  axios
    .post(`${IP}/member/freezeMember`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
      dispatch(getPendingFreezeMember({ search: '', date: '' }))
    }
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
};

export const getFreezeHistory = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getFreezeHistory`, postData)
    .then(res =>
      dispatch({ type: GET_FREEZE_HISTORY, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_FREEZE_HISTORY, payload: null })
    )
};

export const removeMemberFreeze = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/removeMemberFreeze`, postData)
    .then(res => {
      dispatch(getPendingFreezeMember({ search: '', date: '' }))
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

export const cancelFreeze = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/cancelFreeze`, postData)
    .then(res => {
      dispatch(getFreezeHistory({ search: '', date: '' }))
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

export const memberFreezeUpdate = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/memberFreezeUpdate/${id}`, postData)
    .then(res => {
      dispatch(getPendingFreezeMember({ search: '', date: '' }))
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