import axios from 'axios';

import { ADD_SYSTEM_ADMIN, UPDATE_SYSTEM_ADMIN, GET_ERROR, GET_SYSTEM_ADMIN, CLEAR_ERRORS } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'


export const createAdmin = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/credential/createAdmin`, postData)
        .then(res => {
            dispatch({
                type: ADD_SYSTEM_ADMIN,
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


export const updateSystemAdmin = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/credential/updateSystemAdmin/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_SYSTEM_ADMIN,
                payload: res.data
            })
            dispatch({
                type: GET_ERROR,
                payload: res.data
            })
        }
        )
        .catch(err =>
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


export const getAllAdmin = () => dispatch => {
    axios
        .get(`${IP}/credential/getAllAdmin`)
        .then(res =>
            dispatch({
                type: GET_SYSTEM_ADMIN,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_SYSTEM_ADMIN,
                payload: null
            })
        )
};


