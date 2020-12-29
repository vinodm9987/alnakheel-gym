import axios from 'axios';
import { ADD_BRANCH, GET_ERROR, GET_BRANCH, CLEAR_ERRORS, UPDATE_BRANCH, GET_ACTIVE_BRANCH } from './types'
import { IP } from '../config'


export const addBranch = postData => dispatch => {
    axios
        .post(`${IP}/master/addBranch`, postData)
        .then(res => {
            dispatch({
                type: ADD_BRANCH,
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
        )
        .then(() => setTimeout(() => {
            dispatch({
                type: CLEAR_ERRORS
            })
        }, 5000))
};


export const getAllBranchForAdmin = () => dispatch => {
    axios
        .get(`${IP}/master/getAllBranchForAdmin`)
        .then(res =>
            dispatch({
                type: GET_BRANCH,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_BRANCH,
                payload: null
            })
        )
};

export const updateBranch = (id, postData) => dispatch => {
    axios
        .put(`${IP}/master/updateBranch/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_BRANCH,
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
        )
        .then(() =>
            setTimeout(() => {
                dispatch({
                    type: CLEAR_ERRORS
                })
            }, 5000)
        )
};

export const getAllBranch = () => dispatch => {
    axios
        .get(`${IP}/master/getAllBranch`)
        .then(res =>
            dispatch({
                type: GET_ACTIVE_BRANCH,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACTIVE_BRANCH,
                payload: null
            })
        )
};