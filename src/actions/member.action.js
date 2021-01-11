import axios from 'axios';
import {
  GET_MEMBER, CLEAR_ERRORS, GET_ERROR, GET_NEW_REGISTER_MEMBER_FILTER, GET_MEMBER_BY_ID, GET_ACTIVE_REGISTER_MEMBER_FILTER,
  GET_PENDING_REGISTER_MEMBER_FILTER, GET_ACTIVE_STATUS_REGISTER_MEMBER_FILTER, GET_EXPIRED_MEMBER,
  GET_ACTIVE_STATUS_NOT_EXPIRED_REGISTER_MEMBER_FILTER, GET_ACTIVE_MEMBER, GET_CLASSES_MEMBER, GET_CPR,
  GET_MEMBER_ENTRANCE
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'
import { getUserById } from './auth.action';
import { listen } from '../utils/socket';


export const createNewMember = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/createNewMember`, postData)
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


export const createNewMemberByAdmin = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/createNewMemberByAdmin`, postData)
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


export const getAllMember = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getAllMember`, postData)
    .then(res =>
      dispatch({ type: GET_MEMBER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER, payload: null })
    )
};


export const getFirstRegisterMembers = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getFirstRegisterMembers`, postData)
    .then(res =>
      dispatch({ type: GET_NEW_REGISTER_MEMBER_FILTER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_NEW_REGISTER_MEMBER_FILTER, payload: null })
    )
};


export const getActiveRegisterMembers = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getActiveRegisterMembers`, postData)
    .then(res =>
      dispatch({ type: GET_ACTIVE_REGISTER_MEMBER_FILTER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_REGISTER_MEMBER_FILTER, payload: null })
    )
};


export const getActiveStatusRegisterMembers = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getActiveStatusRegisterMembers`, postData)
    .then(res =>
      dispatch({ type: GET_ACTIVE_STATUS_REGISTER_MEMBER_FILTER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_STATUS_REGISTER_MEMBER_FILTER, payload: null })
    )
};


export const getActiveStatusNotExpiredRegisterMembers = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getActiveStatusNotExpiredRegisterMembers`, postData)
    .then(res =>
      dispatch({ type: GET_ACTIVE_STATUS_NOT_EXPIRED_REGISTER_MEMBER_FILTER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_STATUS_NOT_EXPIRED_REGISTER_MEMBER_FILTER, payload: null })
    )
};


export const getAllPendingMember = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getAllPendingMember`, postData)
    .then(res =>
      dispatch({ type: GET_PENDING_REGISTER_MEMBER_FILTER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_PENDING_REGISTER_MEMBER_FILTER, payload: null })
    )
};

export const getExpiredMembers = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getExpiredMembers`, postData)
    .then(res =>
      dispatch({ type: GET_EXPIRED_MEMBER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_EXPIRED_MEMBER, payload: null })
    )
};

export const getAboutToExpireMembers = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getAboutToExpireMembers`, postData)
    .then(res =>
      dispatch({ type: GET_EXPIRED_MEMBER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_EXPIRED_MEMBER, payload: null })
    )
};

export const getMemberById = (id) => dispatch => {
  axios
    .get(`${IP}/member/getMemberById/${id}`)
    .then(res =>
      dispatch({ type: GET_MEMBER_BY_ID, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER_BY_ID, payload: null })
    )
};


export const payAtGym = (id, postData, credentialId) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/payAtGymMobile/${id}`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
      credentialId && dispatch(getUserById(credentialId))
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


export const bookTrainer = (postData, credentialId) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/member/bookTrainer`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
      credentialId && dispatch(getUserById(credentialId))
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


export const updateMemberDetails = (id, postData) => dispatch => {                      //package details
  dispatch(setLoading());
  axios
    .post(`${IP}/member/updateMemberDetails/${id}`, postData)
    .then(res => {
      dispatch({ type: GET_MEMBER_BY_ID, payload: res.data })
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

export const updateMember = (postData) => dispatch => {                      //add member
  dispatch(setLoading());
  axios
    .post(`${IP}/member/updateMember`, postData)
    .then(res => {
      dispatch({ type: GET_MEMBER_BY_ID, payload: res.data })
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

export const updateMemberAndAddPackage = (postData) => dispatch => {                      //add package
  dispatch(setLoading());
  axios
    .post(`${IP}/member/updateMemberAndAddPackage`, postData)
    .then(res => {
      dispatch({ type: GET_MEMBER_BY_ID, payload: res.data })
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


export const getAllActiveMember = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getAllActiveMember`, postData)
    .then(res =>
      dispatch({ type: GET_ACTIVE_MEMBER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_MEMBER, payload: null })
    )
};



export const getClassesMembers = (postData) => dispatch => {
  axios
    .post(`${IP}/member/getClassesMembers`, postData)
    .then(res =>
      dispatch({ type: GET_CLASSES_MEMBER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CLASSES_MEMBER, payload: null })
    )
};


export const getCprData = () => dispatch => {
  axios
    .get(`${IP}/member/getCprData`)
    .then(res =>
      dispatch({ type: GET_CPR, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CPR, payload: null })
    )
};


export const getMemberEntrance = (io) => dispatch => {
  listen('memberEntrance', io)
    .subscribe(res => {
      dispatch({ type: GET_MEMBER_ENTRANCE, payload: res })
    }, err => {
      dispatch({ type: GET_MEMBER_ENTRANCE, payload: null })
    })
}