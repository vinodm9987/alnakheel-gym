import {
  GET_SUPPLIER, GET_ACTIVE_SUPPLIER, UPDATE_SUPPLIER, GET_SUPPLIER_BY_ID,
  GET_ASSET, GET_ACTIVE_ASSET, UPDATE_ASSET, GET_ASSET_BY_ID, GET_ASSET_BY_SUPPLIER,
  GET_CONTRACT, GET_ACTIVE_CONTRACT, UPDATE_CONTRACT, GET_CONTRACT_BY_ID,
} from '../actions/types';

const initialState = { suppliers: [], contracts: [], assets: [] };

export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      /**
       * SUPPLIER
      */

      case GET_SUPPLIER: {
        return {
          ...state,
          ...{ suppliers: action.payload.response }
        }
      }

      case UPDATE_SUPPLIER: {
        return {
          ...state,
          suppliers: state.suppliers.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_SUPPLIER: {
        return {
          ...state,
          ...{ activeSuppliers: action.payload.response }
        }
      }

      case GET_SUPPLIER_BY_ID: {
        return {
          ...state,
          ...{ supplierById: action.payload.response }
        }
      }


      /**
       * ASSET
      */

      case GET_ASSET: {
        return {
          ...state,
          ...{ assets: action.payload.response }
        }
      }

      case UPDATE_ASSET: {
        return {
          ...state,
          assets: state.assets.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_ASSET: {
        return {
          ...state,
          ...{ activeAssets: action.payload.response }
        }
      }

      case GET_ASSET_BY_ID: {
        return {
          ...state,
          ...{ assetById: action.payload.response }
        }
      }

      case GET_ASSET_BY_SUPPLIER: {
        return {
          ...state,
          ...{ assetBySupplier: action.payload.response }
        }
      }


      /**
       * CONTRACT
      */

      case GET_CONTRACT: {
        return {
          ...state,
          ...{ contracts: action.payload.response }
        }
      }

      case UPDATE_CONTRACT: {
        return {
          ...state,
          contracts: state.contracts.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_CONTRACT: {
        return {
          ...state,
          ...{ activeContracts: action.payload.response }
        }
      }

      case GET_CONTRACT_BY_ID: {
        return {
          ...state,
          ...{ contractById: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};