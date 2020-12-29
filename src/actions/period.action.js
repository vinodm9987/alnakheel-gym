import axios from 'axios';
import { ADD_PERIOD, GET_ERROR, GET_PERIOD, CLEAR_ERRORS, UPDATE_PERIOD, GET_ACTIVE_PERIOD } from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'


export const addPeriod = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/master/addPeriod`, postData)
        .then(res => {
            dispatch({
                type: ADD_PERIOD,
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
        .then(() => setTimeout(() => {
            dispatch({
                type: CLEAR_ERRORS
            })
        }, 5000))
};


export const getAllPeriodForAdmin = () => dispatch => {
    axios
        .get(`${IP}/master/getAllPeriodForAdmin`)
        .then(res =>
            dispatch({
                type: GET_PERIOD,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PERIOD,
                payload: null
            })
        )
};

export const getAllPeriod = () => dispatch => {
    axios
        .get(`${IP}/master/getAllPeriod`)
        .then(res =>
            dispatch({
                type: GET_ACTIVE_PERIOD,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACTIVE_PERIOD,
                payload: null
            })
        )
};


export const updatePeriod = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .put(`${IP}/master/updatePeriod/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_PERIOD,
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