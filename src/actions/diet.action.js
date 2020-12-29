import axios from 'axios';

import {
    ADD_FOOD_ITEM, GET_FOOD_ITEM, GET_ACTIVE_FOOD_ITEM, UPDATE_FOOD_ITEM, GET_ERROR, CLEAR_ERRORS,
    ADD_FOOD_SESSION, GET_FOOD_SESSION, UPDATE_FOOD_SESSION, GET_ACTIVE_FOOD_SESSION,
    GET_MEMBER_DIET_BY_DATE, GET_MEMBER_DIET_BY_DATE_FOR_TRAINER
} from './types'

import { setLoading, removeLoading } from './loader.action'
import { IP } from '../config'



/**
 * ACTION FOR FOOD ITEM 
 */


export const addDietFood = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/diet/addDietFood`, postData)
        .then(res => {
            dispatch({
                type: ADD_FOOD_ITEM,
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
        .then(() => setTimeout(() => {
            dispatch({
                type: CLEAR_ERRORS
            })
        }, 5000))
};


export const getAllDietFoodForAdmin = () => dispatch => {
    axios
        .get(`${IP}/diet/getAllDietFoodForAdmin`)
        .then(res =>
            dispatch({
                type: GET_FOOD_ITEM, GET_ACTIVE_FOOD_ITEM,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_FOOD_ITEM, GET_ACTIVE_FOOD_ITEM,
                payload: null
            })
        )
};

export const updateDietFood = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .put(`${IP}/diet/updateDietFood/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_FOOD_ITEM,
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

export const getAllDietFood = () => dispatch => {
    axios
        .get(`${IP}/diet/getAllDietFood`)
        .then(res =>
            dispatch({
                type: GET_ACTIVE_FOOD_ITEM,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACTIVE_FOOD_ITEM,
                payload: null
            })
        )
};






/**
 * ACTION FOR FOOD SESSION 
 */


export const addDietSession = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/diet/addDietSession`, postData)
        .then(res => {

            dispatch({
                type: ADD_FOOD_SESSION,
                payload: res.data
            })
            dispatch({
                type: GET_ERROR,
                payload: res.data
            })
        })
        .catch(err => {
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


export const getAllDietSessionForAdmin = () => dispatch => {
    axios
        .get(`${IP}/diet/getAllDietSessionForAdmin`)
        .then(res =>
            dispatch({
                type: GET_FOOD_SESSION,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_FOOD_SESSION,
                payload: null
            })
        )
};

export const updateDietSession = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .put(`${IP}/diet/updateDietSession/${id}`, postData)
        .then(res => {
            dispatch({
                type: UPDATE_FOOD_SESSION,
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

export const getAllDietSession = () => dispatch => {
    axios
        .get(`${IP}/diet/getAllDietSession`)
        .then(res =>
            dispatch({
                type: GET_ACTIVE_FOOD_SESSION,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACTIVE_FOOD_SESSION,
                payload: null
            })
        )
};




/**
 * ACTION FOR MEMBER DIET (MANAGE DIET PLAN) ITEM 
 */

export const addMemberDiet = postData => dispatch => {
    dispatch(setLoading());
    axios
        .post(`${IP}/diet/addMemberDiet`, postData)
        .then(res => {
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
};

export const getMemberDietByDate = postData => dispatch => {
    axios
        .post(`${IP}/diet/getMemberDietByDate`, postData)
        .then(res =>
            dispatch({
                type: GET_MEMBER_DIET_BY_DATE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_MEMBER_DIET_BY_DATE,
                payload: null
            })
        )
};


export const getMemberDietByDateForTrainer = postData => dispatch => {
    axios
        .post(`${IP}/diet/getMemberDietByDate`, postData)
        .then(res =>
            dispatch({
                type: GET_MEMBER_DIET_BY_DATE_FOR_TRAINER,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_MEMBER_DIET_BY_DATE_FOR_TRAINER,
                payload: null
            })
        )
};


export const updateMemberDietById = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios
        .put(`${IP}/diet/updateMemberDietById/${id}`, postData)
        .then(res => {
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
};
