import axios from 'axios';

import {
    ADD_TRAINER_FEES, UPDATE_TRAINER_FEES, GET_ERROR, CLEAR_ERRORS, GET_TRAINER_FEES, GET_ACTIVE_TRAINER_FEES, GET_UNIQUE_TRAINER_BY_BRANCH,
    GET_PERIOD_OF_TRAINER, GET_TRAINER_BY_BRANCH
} from '../actions/types';

import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'


export const addTrainerFees = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/master/addTrainerFees`, postData)
        .then(res => {
            dispatch({
                type: ADD_TRAINER_FEES,
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


export const updateTrainerFees = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .put(`${IP}/master/updateTrainerFees/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_TRAINER_FEES,
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


export const getAllTrainerFeesForAdmin = (postData) => dispatch => {
    axios
        .post(`${IP}/master/getAllTrainerFeesForAdmin`, postData)
        .then(res =>
            dispatch({
                type: GET_TRAINER_FEES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_TRAINER_FEES,
                payload: null
            })
        )
};

export const getAllTrainerFees = () => dispatch => {
    axios
        .get(`${IP}/master/getAllTrainerFees`)
        .then(res =>
            dispatch({
                type: GET_ACTIVE_TRAINER_FEES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACTIVE_TRAINER_FEES,
                payload: null
            })
        )
};

export const getUniqueTrainerByBranch = (branchId) => dispatch => {
    axios
        .get(`${IP}/master/getUniqueTrainerByBranch/${branchId}`)
        .then(res =>
            dispatch({
                type: GET_UNIQUE_TRAINER_BY_BRANCH,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_UNIQUE_TRAINER_BY_BRANCH,
                payload: null
            })
        )
};

export const getPeriodOfTrainer = (data) => dispatch => {
    axios
        .post(`${IP}/master/getPeriodOfTrainer`, data)
        .then(res =>
            dispatch({
                type: GET_PERIOD_OF_TRAINER,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PERIOD_OF_TRAINER,
                payload: null
            })
        )
};


export const getTrainerByBranch = (branchId) => dispatch => {
    axios
        .get(`${IP}/employee/getTrainerByBranch/${branchId}`)
        .then(res =>
            dispatch({
                type: GET_TRAINER_BY_BRANCH,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_TRAINER_BY_BRANCH,
                payload: null
            })
        )
};