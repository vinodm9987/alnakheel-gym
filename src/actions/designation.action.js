import axios from 'axios';

import { ADD_DESIGNATION, UPDATE_DESIGNATION, GET_ERROR, GET_DESIGNATION, CLEAR_ERRORS, GET_ACTIVE_DESIGNATION, GET_FILTER_DESIGNATION } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'


export const addDesignation = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/master/addDesignation`, postData)
        .then(res => {
            dispatch({
                type: ADD_DESIGNATION,
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


export const updateDesignation = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .put(`${IP}/master/updateDesignation/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_DESIGNATION,
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


export const getAllDesignationForAdmin = () => dispatch => {
    axios
        .get(`${IP}/master/getAllDesignationForAdmin`)
        .then(res =>
            dispatch({
                type: GET_DESIGNATION,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_DESIGNATION,
                payload: null
            })
        )
};

export const getAllDesignation = () => dispatch => {
    axios
        .get(`${IP}/master/getAllDesignation`)
        .then(res =>
            dispatch({
                type: GET_ACTIVE_DESIGNATION,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACTIVE_DESIGNATION,
                payload: null
            })
        )
};


export const getFilterDesignation = () => dispatch => {

    axios
        .get(`${IP}/master/getDesignationForFilter`)
        .then(res =>
            dispatch({
                type: GET_FILTER_DESIGNATION,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_FILTER_DESIGNATION,
                payload: null
            })
        )
};