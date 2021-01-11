import axios from 'axios';
import {
    SET_CURRENT_USER, GET_ERROR, VERIFY_CODE, CLEAR_ERRORS, REGISTER_MEMBER, LOGGED_USER, LOG_OUT,
    GET_ALERT_ERROR
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'
import { storeItem, removeItemFromStorage } from '../utils/localstorage'

export const login = (postData) => dispatch => {
    dispatch(setLoading())
    axios.post(`${IP}/credential/login`, postData)
        .then(res => {
            const { response } = res.data;
            storeItem('jwtToken', response);
        }).catch(err => {
            err.response && dispatch({
                type: GET_ERROR,
                payload: err.response.data
            })
        }
        ).then(() => setTimeout(() => {
            dispatch(removeLoading())
        }, 1000))
        .then(() => setTimeout(() => {
            dispatch({
                type: CLEAR_ERRORS
            })
        }, 5000))
};


export const logout = () => dispatch => {
    axios.post(`${IP}/credential/logout`)
        .then(res => {
        }).catch(err => {
            err.response && dispatch({
                type: GET_ERROR,
                payload: err.response.data
            })
        }
        )
}


export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};




export const getVerificationCode = postData => dispatch => {
    axios.post(`${IP}/member/generateToken`, postData)
        .then(res => {
            dispatch({
                type: VERIFY_CODE,
                payload: res.data.response.code
            });
        }).catch(err =>
            err.response && dispatch({
                type: GET_ALERT_ERROR,
                payload: err.response.data.message
            })
        )
}

export const registerMember = postData => dispatch => {
    dispatch(setLoading());
    axios.post(`${IP}/member/createNewMember`, postData)
        .then(res => {
            dispatch({
                type: REGISTER_MEMBER,
                payload: res.data.response
            });
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
}




export const logoutUser = () => dispatch => {
    removeItemFromStorage('jwtToken');
    dispatch({
        type: LOG_OUT,
        payload: {}
    })
};

export const getUserById = (id) => dispatch => {
    dispatch(setLoading());
    axios.get(`${IP}/credential/getUserById/${id}`)
        .then(res => {
            dispatch({
                type: LOGGED_USER,
                payload: res.data
            })
        }).catch(err =>
            dispatch({
                type: LOGGED_USER,
                payload: null
            })
        ).then(() => setTimeout(() => {
            dispatch(removeLoading())
        }, 1000))
}

export const resetPassword = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios.post(`${IP}/credential/resetPassword/${id}`, postData)
        .then(res => {
            dispatch({ type: GET_ERROR, payload: res.data })
        }).catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        ).then(() => setTimeout(() => {
            dispatch(removeLoading())
        }, 1000))
        .then(() =>
            setTimeout(() => {
                dispatch({ type: CLEAR_ERRORS })
            }, 5000)
        )
}

export const forgotPassword = (postData) => dispatch => {
    dispatch(setLoading());
    axios.post(`${IP}/credential/forgotPassword`, postData)
        .then(res => {
            dispatch({ type: GET_ERROR, payload: res.data })
        }).catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        ).then(() => setTimeout(() => {
            dispatch(removeLoading())
        }, 1000))
        .then(() =>
            setTimeout(() => {
                dispatch({ type: CLEAR_ERRORS })
            }, 5000)
        )
}
