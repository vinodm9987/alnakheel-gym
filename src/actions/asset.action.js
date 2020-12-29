import axios from 'axios';
import {
  GET_ERROR, CLEAR_ERRORS, GET_SUPPLIER, GET_ACTIVE_SUPPLIER, UPDATE_SUPPLIER, GET_SUPPLIER_BY_ID,
  GET_ASSET, GET_ACTIVE_ASSET, UPDATE_ASSET, GET_ASSET_BY_ID, GET_ASSET_BY_SUPPLIER,
  GET_CONTRACT, UPDATE_CONTRACT, GET_CONTRACT_BY_ID
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'

/**
 *  SUPPLIER
 **/

export const addNewSupplier = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/asset/addNewSupplier`, postData)
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


export const getAllSuppliersForAdmin = (postData) => dispatch => {
  axios
    .post(`${IP}/asset/getAllSuppliersForAdmin`, postData)
    .then(res =>
      dispatch({ type: GET_SUPPLIER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_SUPPLIER, payload: null })
    )
};

export const updateSupplier = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/asset/updateSupplier/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_SUPPLIER, payload: res.data })
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

export const getAllSuppliers = () => dispatch => {
  axios
    .get(`${IP}/asset/getAllSuppliers`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_SUPPLIER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_SUPPLIER, payload: null })
    )
};

export const getASuppliersById = (id) => dispatch => {
  axios
    .get(`${IP}/asset/getASuppliersById/${id}`)
    .then(res =>
      dispatch({ type: GET_SUPPLIER_BY_ID, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_SUPPLIER_BY_ID, payload: null })
    )
};


/**
 *  ASSET
 **/

export const addNewAssets = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/asset/addNewAssets`, postData)
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


export const getAllAssetsForAdmin = (postData) => dispatch => {
  axios
    .post(`${IP}/asset/getAllAssetsForAdmin`, postData)
    .then(res =>
      dispatch({ type: GET_ASSET, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ASSET, payload: null })
    )
};

export const updateAssets = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/asset/updateAssets/${id}`, postData)
    .then(res => {
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

export const updateAssetsStatus = (id, postData) => dispatch => {
  axios
    .put(`${IP}/asset/updateAssetsStatus/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_ASSET, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
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

export const addNewRepair = (id, postData) => dispatch => {
  axios
    .put(`${IP}/asset/addNewRepair/${id}`, postData)
    .then(res => {
      dispatch({ type: GET_ASSET_BY_ID, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
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


export const getAllAssets = () => dispatch => {
  axios
    .get(`${IP}/asset/getAllAssets`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_ASSET, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_ASSET, payload: null })
    )
};

export const getAssetsById = (id) => dispatch => {
  axios
    .get(`${IP}/asset/getAssetsById/${id}`)
    .then(res =>
      dispatch({ type: GET_ASSET_BY_ID, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ASSET_BY_ID, payload: null })
    )
};

export const getAssetsBySupplier = (postData) => dispatch => {
  axios
    .post(`${IP}/asset/getAssetsBySupplier`, postData)
    .then(res =>
      dispatch({ type: GET_ASSET_BY_SUPPLIER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ASSET_BY_SUPPLIER, payload: null })
    )
};


/**
 *  CONTRACT
 **/

export const addContract = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/asset/addContract`, postData)
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


export const getAllContractForAdmin = (postData) => dispatch => {
  axios
    .post(`${IP}/asset/getAllContractForAdmin`, postData)
    .then(res =>
      dispatch({ type: GET_CONTRACT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CONTRACT, payload: null })
    )
};

export const updateStatusOfContract = (id, postData) => dispatch => {
  axios
    .put(`${IP}/asset/updateStatusOfContract/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_CONTRACT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
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

export const updateContract = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/asset/updateContract/${id}`, postData)
    .then(res => {
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

export const getContractById = (id) => dispatch => {
  axios
    .get(`${IP}/asset/getContractById/${id}`)
    .then(res =>
      dispatch({ type: GET_CONTRACT_BY_ID, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_CONTRACT_BY_ID, payload: null })
    )
};
