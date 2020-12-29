import axios from 'axios';
import {
    ADD_STOCK, GET_ERROR, CLEAR_ERRORS, GET_STOCK, UPDATE_STOCK,
    GET_ACTIVE_STOCK, GET_STOCK_BY_ID, GET_CART_OF_MEMBER, ADD_CART, UPDATE_CART,
    REMOVE_CART, GET_ORDER_HISTORY, GET_STOCK_SELL_BY_ID, GET_CUSTOMER_ORDER_HISTORY
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'

/**
* STOCKS
*/

export const addStocks = postData => dispatch => {
    dispatch(setLoading());
    axios.post(`${IP}/POS/addStocks`, postData)
        .then(res => {
            dispatch({ type: ADD_STOCK, payload: res.data })
            dispatch({ type: GET_ERROR, payload: res.data })
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        ).then(() => setTimeout(() => {
            dispatch(removeLoading())
        }, 1000))
        .then(() => setTimeout(() => {
            dispatch({ type: CLEAR_ERRORS })
        }, 5000))
};


export const getAllStocksForAdmin = (postData) => dispatch => {
    axios.post(`${IP}/POS/getAllStocksForAdmin`, postData)
        .then(res =>
            dispatch({ type: GET_STOCK, payload: res.data })
        )
        .catch(err =>
            dispatch({ type: GET_STOCK, payload: null })
        )
};

export const updateStockStatus = (id, postData) => dispatch => {
    axios.put(`${IP}/POS/updateStockStatus/${id}`, postData)
        .then(res => {
            dispatch({ type: UPDATE_STOCK, payload: res.data })
            dispatch({ type: GET_ERROR, payload: res.data })
            dispatch(getStocksById(id))
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        )
        .then(() =>
            setTimeout(() => {
                dispatch({ type: CLEAR_ERRORS })
            }, 5000)
        )
};

export const updateStocks = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios.put(`${IP}/POS/updateStocks/${id}`, postData)
        .then(res => {
            dispatch({ type: UPDATE_STOCK, payload: res.data })
            dispatch({ type: GET_ERROR, payload: res.data })
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        ).then(() => setTimeout(() => {
            dispatch(removeLoading())
        }, 1000))
        .then(() =>
            setTimeout(() => {
                dispatch({ type: CLEAR_ERRORS })
            }, 5000)
        )
};

export const getAllStocks = (postData) => dispatch => {
    axios.post(`${IP}/POS/getAllStocks`, postData)
        .then(res =>
            dispatch({ type: GET_ACTIVE_STOCK, payload: res.data })
        )
        .catch(err =>
            dispatch({ type: GET_ACTIVE_STOCK, payload: null })
        )
};


export const getStocksById = (id) => dispatch => {
    axios.get(`${IP}/POS/getStocksById/${id}`)
        .then(res =>
            dispatch({ type: GET_STOCK_BY_ID, payload: res.data })
        )
        .catch(err =>
            dispatch({ type: GET_STOCK_BY_ID, payload: null })
        )
}


/** 
 * STOCK SELL
*/

export const addStockSell = postData => dispatch => {
    dispatch(setLoading());
    axios.post(`${IP}/POS/addStockSell`, postData)
        .then(res => {
            dispatch({ type: GET_ERROR, payload: res.data })
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        ).then(() => setTimeout(() => {
            dispatch(removeLoading())
        }, 1000))
        .then(() => setTimeout(() => {
            dispatch({ type: CLEAR_ERRORS })
        }, 5000))
};


export const getOrderHistory = postData => dispatch => {
    axios.post(`${IP}/POS/getOrderHistory`, postData)
        .then(res =>
            dispatch({ type: GET_ORDER_HISTORY, payload: res.data })
        )
        .catch(err =>
            dispatch({ type: GET_ORDER_HISTORY, payload: null })
        )
}

export const getStockSellById = (id) => dispatch => {
    axios.get(`${IP}/POS/getStockSellById/${id}`)
        .then(res =>
            dispatch({ type: GET_STOCK_SELL_BY_ID, payload: res.data })
        )
        .catch(err =>
            dispatch({ type: GET_STOCK_SELL_BY_ID, payload: null })
        )
}

export const getCustomerOrderHistory = postData => dispatch => {
    axios.post(`${IP}/POS/getCustomerOrderHistory`, postData)
        .then(res =>
            dispatch({ type: GET_CUSTOMER_ORDER_HISTORY, payload: res.data })
        )
        .catch(err =>
            dispatch({ type: GET_CUSTOMER_ORDER_HISTORY, payload: null })
        )
}



/** 
 * MEMBER PURCHASE
*/

export const addToCart = postData => dispatch => {
    axios.post(`${IP}/POS/addToCart`, postData)
        .then(res => {
            dispatch({ type: ADD_CART, payload: res.data })
            dispatch({ type: GET_ERROR, payload: res.data })
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        )
        .then(() => setTimeout(() => {
            dispatch({ type: CLEAR_ERRORS })
        }, 5000))
};

export const getCartOfMember = (id) => dispatch => {
    axios.get(`${IP}/POS/getCartOfMember/${id}`)
        .then(res =>
            dispatch({ type: GET_CART_OF_MEMBER, payload: res.data })
        )
        .catch(err =>
            dispatch({ type: GET_CART_OF_MEMBER, payload: null })
        )
}

export const updateCart = (id, postData) => dispatch => {
    dispatch(setLoading());
    axios.put(`${IP}/POS/updateCart/${id}`, postData)
        .then(res => {
            dispatch({ type: UPDATE_CART, payload: res.data })
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        )
        .then(() =>
            dispatch(removeLoading())
        )
        .then(() => setTimeout(() => {
            dispatch({ type: CLEAR_ERRORS })
        }, 5000))
}

export const updateCartQuantity = (id, postData) => dispatch => {
    axios.put(`${IP}/POS/updateCartQuantity/${id}`, postData)
        .then(res => {
            dispatch({ type: UPDATE_CART, payload: res.data })
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        )
        .then(() => setTimeout(() => {
            dispatch({ type: CLEAR_ERRORS })
        }, 5000))
}

export const removeCart = (data, index) => dispatch => {
    axios.post(`${IP}/POS/removeCart`, data)
        .then(res => {
            dispatch({ type: REMOVE_CART, payload: res.data })
        })
        .catch(err =>
            err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
        )
        .then(() => setTimeout(() => {
            dispatch({ type: CLEAR_ERRORS })
        }, 5000))
}