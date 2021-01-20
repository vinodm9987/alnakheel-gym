import axios from 'axios';

import {
    ADD_PACKAGE, UPDATE_PACKAGE, GET_ERROR, GET_PACKAGE, CLEAR_ERRORS, GET_PACKAGE_BY_ID, GET_ACTIVE_PACKAGE,
    GET_PACKAGE_BY_SALES_BRANCH
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'


export const addPackage = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/master/addPackage`, postData)
        .then(res => {
            dispatch({
                type: ADD_PACKAGE,
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


export const updatePackage = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .put(`${IP}/master/updatePackage/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_PACKAGE,
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


export const getAllPackage = () => dispatch => {
    axios
        .get(`${IP}/master/getAllPackage`)
        .then(res =>
            dispatch({
                type: GET_PACKAGE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PACKAGE,
                payload: null
            })
        )
};




export const getAllActivePackage = () => dispatch => {
    axios
        .get(`${IP}/master/getAllActivePackage`)
        .then(res =>
            dispatch({
                type: GET_ACTIVE_PACKAGE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACTIVE_PACKAGE,
                payload: null
            })
        )
};




// export const deletePackage = (id) => dispatch => {
//     dispatch(setLoading());
//     axios
//         .delete(`${IP}/master/deletePackage/${id}`)
//         .then(res =>
//             dispatch({
//                 type: DELETE_PACKAGE,
//                 payload: res.data
//             })
//         )
//         .catch(err =>
//             err.response && dispatch({
//                 type: GET_ERROR,
//                 payload: err.response.data
//             })
//         ).then(() => setTimeout(() => {
//             dispatch(removeLoading())
//         }, 1000))
//         .then(() =>
//             setTimeout(() => {
//                 dispatch({
//                     type: CLEAR_ERRORS
//                 })
//             }, 5000)
//         )
// };



export const getPackageById = (id) => dispatch => {
    axios
        .get(`${IP}/master/getPackageById/${id}`)
        .then(res =>
            dispatch({
                type: GET_PACKAGE_BY_ID,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PACKAGE_BY_ID,
                payload: null
            })
        )
};



export const getAllPackageBySalesBranch = (postData) => dispatch => {
    axios
        .post(`${IP}/master/getAllPackageBySalesBranch`, postData)
        .then(res =>
            dispatch({
                type: GET_PACKAGE_BY_SALES_BRANCH,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PACKAGE_BY_SALES_BRANCH,
                payload: null
            })
        )
};