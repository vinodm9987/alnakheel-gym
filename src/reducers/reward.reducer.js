import {
  GET_GIFTCARD, UPDATE_GIFTCARD, GET_ACTIVE_GIFTCARD,
  ADD_POLICY, GET_POLICY, UPDATE_POLICY, GET_ACTIVE_POLICY, GET_MEMBER_TRANSACTION,
  GET_ALL_TRANSACTION, AMOUNT_BY_REDEEM_CODE, GET_REFER_CODE
} from '../actions/types';

const initialState = { giftcards: [], policies: [] };


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {


      /**
       * Giftcard
      **/

      case GET_GIFTCARD: {
        return {
          ...state,
          ...{ giftcards: action.payload.response }
        }
      }

      case UPDATE_GIFTCARD: {
        return {
          ...state,
          giftcards: state.giftcards.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_GIFTCARD: {
        return {
          ...state,
          ...{ activeGiftcards: action.payload.response }
        }
      }




      /**
       * Reward Policy
      **/

      case ADD_POLICY: {
        return {
          ...state,
          policies: [...state.policies, action.payload.response]
        }
      }

      case GET_POLICY: {
        return {
          ...state,
          ...{ policies: action.payload.response }
        }
      }

      case UPDATE_POLICY: {
        return {
          ...state,
          policies: state.policies.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_POLICY: {
        return {
          ...state,
          ...{ activePolicies: action.payload.response }
        }
      }

      case GET_MEMBER_TRANSACTION: {
        return {
          ...state,
          ...{ memberTransactions: action.payload.response }
        }
      }

      case GET_ALL_TRANSACTION: {
        return {
          ...state,
          ...{ allTransactions: action.payload.response }
        }
      }

      case AMOUNT_BY_REDEEM_CODE: {
        return {
          ...state,
          ...{ amountByRedeemCode: action.payload.response }
        }
      }

      case GET_REFER_CODE: {
        return {
          ...state,
          ...{ referCode: action.payload.response }
        }
      }


      default:
        return state
    }
  } else {
    return state
  }
};