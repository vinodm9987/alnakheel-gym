
import { GET_MONEY_COLLECTION, GET_MONEY_COLLECTION_HISTORY, GET_MONEY_COLLECTION_BY_ID } from '../actions/types';

const initialState = {
  moneyCollection: null
};


export default (state = initialState, action) => {

  if (action.payload) {

    switch (action.type) {

      case GET_MONEY_COLLECTION: {
        return {
          ...state,
          ...{ moneyCollection: action.payload.response }
        }
      }

      case GET_MONEY_COLLECTION_HISTORY: {
        return {
          ...state,
          ...{ moneyCollectionHistory: action.payload.response }
        }
      }

      case GET_MONEY_COLLECTION_BY_ID: {
        return {
          ...state,
          ...{ moneyCollectionById: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
