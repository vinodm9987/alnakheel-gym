import {
  ADD_FOOD_ITEM, GET_FOOD_ITEM, GET_ACTIVE_FOOD_ITEM, UPDATE_FOOD_ITEM,
  ADD_FOOD_SESSION, GET_FOOD_SESSION, UPDATE_FOOD_SESSION, GET_ACTIVE_FOOD_SESSION,
  GET_MEMBER_DIET_BY_DATE, GET_MEMBER_DIET_BY_DATE_FOR_TRAINER, EMPTY_MEMBER_DIET_BY_DATE_FOR_TRAINER,
  EMPTY_MEMBER_DIET_BY_DATE
} from '../actions/types'

const initialState = {
  foodResponse: [],
  sessionResponse: []
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      /**
       * DIET FOOD ITEM
      */

      case ADD_FOOD_ITEM: {
        return {
          ...state,
          foodResponse: [...state.foodResponse, action.payload.response]
        }
      }

      case GET_FOOD_ITEM: {
        return {
          ...state,
          ...{ foodResponse: action.payload.response }
        }
      }

      case UPDATE_FOOD_ITEM: {
        return {
          ...state,
          foodResponse: state.foodResponse.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_FOOD_ITEM: {
        return {
          ...state,
          ...{ activeFoodResponse: action.payload.response }
        }
      }

      /**
       * DIET FOOD SESSION
      */


      case ADD_FOOD_SESSION: {
        return {
          ...state,
          sessionResponse: [...state.sessionResponse, action.payload.response]
        }
      }

      case GET_FOOD_SESSION: {
        return {
          ...state,
          ...{ sessionResponse: action.payload.response }
        }
      }

      case UPDATE_FOOD_SESSION: {
        return {
          ...state,
          sessionResponse: state.sessionResponse.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_FOOD_SESSION: {
        return {
          ...state,
          ...{ activeSessionResponse: action.payload.response }
        }
      }

      /**
       * MEMBER DIET
      */

      case GET_MEMBER_DIET_BY_DATE: {
        return {
          ...state,
          ...{ memberDietByDate: action.payload.response }
        }
      }

      case EMPTY_MEMBER_DIET_BY_DATE: {
        return {
          ...state,
          ...{ memberDietByDate: [] }
        }
      }

      case GET_MEMBER_DIET_BY_DATE_FOR_TRAINER: {
        return {
          ...state,
          ...{ memberDietByDateForTrainer: action.payload.response[0] || null }
        }
      }

      case EMPTY_MEMBER_DIET_BY_DATE_FOR_TRAINER: {
        return {
          ...state,
          ...{ memberDietByDateForTrainer: null }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
