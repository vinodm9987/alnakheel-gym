import axios from 'axios';
import { GET_MEMBER_BY_ID, GET_ALERT_ERROR, GET_CUSTOMER_CLASSES_DETAILS } from './types'
import { IP } from '../config'




export const addMemberInBioStar = (postData) => dispatch => {
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