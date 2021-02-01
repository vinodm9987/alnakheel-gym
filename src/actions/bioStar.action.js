import axios from 'axios';
import { IP } from '../config';
import { GET_ALERT_ERROR, GET_CUSTOMER_CLASSES_DETAILS, GET_EMPLOYEE_BY_ID, GET_MEMBER_BY_ID } from './types';




export const addMemberFingerPrint = (postData) => dispatch => {
    axios.post(`${IP}/member/addMemberFingerPrint`, postData)
        .then(res => {
            dispatch({
                type: GET_MEMBER_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: GET_ALERT_ERROR,
                payload: 'Something wrong happened, Kindly try agian..'
            })
        })
};

export const addMemberFaceRecognition = (postData) => dispatch => {
    axios.post(`${IP}/member/addMemberFaceRecognition`, postData)
        .then(res => {
            dispatch({
                type: GET_MEMBER_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: GET_ALERT_ERROR,
                payload: 'Something wrong happened, Kindly try agian..'
            })
        })
};

export const updateFingerPrint = (postData) => dispatch => {
    axios.post(`${IP}/member/updateFingerPrint`, postData)
        .then(res => {
            dispatch({
                type: GET_MEMBER_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: GET_ALERT_ERROR,
                payload: err.response.data.message
            })
        })
};

export const updateFaceRecognition = (postData) => dispatch => {
    axios.post(`${IP}/member/updateFaceRecognition`, postData)
        .then(res => {
            dispatch({
                type: GET_MEMBER_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: GET_ALERT_ERROR,
                payload: err.response.data.message
            })
        })
};

export const excludeMemberFingerPrint = (postData) => dispatch => {
    axios.post(`${IP}/member/excludeMemberFingerPrint`, postData)
        .then(res => {
            dispatch({
                type: GET_MEMBER_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            err.response && dispatch({
                type: GET_ALERT_ERROR,
                payload: err.response.data.message
            })
        })
};

export const updateEmployeeFingerPrint = (postData) => dispatch => {
    axios.post(`${IP}/employee/updateEmployeeFingerPrint`, postData)
        .then(res => {
            dispatch({
                type: GET_EMPLOYEE_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: GET_ALERT_ERROR,
                payload: err.response.data.message
            })
        })
};


export const updateEmployeeFaceRecognition = (postData) => dispatch => {
    axios.post(`${IP}/employee/updateEmployeeFaceRecognition`, postData)
        .then(res => {
            dispatch({
                type: GET_EMPLOYEE_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: GET_ALERT_ERROR,
                payload: err.response.data.message
            })
        })
};

export const startPackage = (postData) => dispatch => {
    axios.post(`${IP}/member/startPackage`, postData)
        .then(res => {
            dispatch({
                type: GET_MEMBER_BY_ID,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: GET_ALERT_ERROR,
                payload: 'Something wrong happened, Kindly try agian..'
            })
        })
};


export const startClass = (postData) => dispatch => {
    axios.post(`${IP}/member/startClass`, postData)
        .then(res => {
            dispatch({ type: GET_CUSTOMER_CLASSES_DETAILS, payload: res.data })
        }).catch(err => {
            dispatch({ type: GET_ALERT_ERROR, payload: 'Something wrong happened, Kindly try agian..' })
        })
};