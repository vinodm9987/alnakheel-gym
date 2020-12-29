import {
  ADD_ROOM, GET_ROOM, UPDATE_ROOM, GET_ACTIVE_ROOM, GET_ROOM_BY_BRANCH,
  ADD_CLASS, GET_CLASS, UPDATE_CLASS, GET_CLASS_BY_BRANCH, GET_CLASS_BY_ID,
  GET_CLASS_SCHEDULE_BY_DATE, GET_CUSTOMER_CLASS_SCHEDULE_BY_DATE,
  GET_CUSTOMER_CLASSES_DETAILS
} from '../actions/types';

const initialState = { rooms: [], classes: [] };


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {


      /**
       * Room
      **/

      case ADD_ROOM: {
        return {
          ...state,
          rooms: [...state.rooms, action.payload.response]
        }
      }

      case GET_ROOM: {
        return {
          ...state,
          ...{ rooms: action.payload.response }
        }
      }

      case UPDATE_ROOM: {
        return {
          ...state,
          rooms: state.rooms.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_ROOM: {
        return {
          ...state,
          ...{ activeRooms: action.payload.response }
        }
      }

      case GET_ROOM_BY_BRANCH: {
        return {
          ...state,
          ...{ roomByBranch: action.payload.response }
        }
      }




      /**
       * Classes
      **/

      case ADD_CLASS: {
        return {
          ...state,
          classes: [...state.classes, action.payload.response]
        }
      }

      case GET_CLASS: {
        return {
          ...state,
          ...{ classes: action.payload.response }
        }
      }

      case GET_CLASS_BY_ID: {
        return {
          ...state,
          ...{ classById: action.payload.response }
        }
      }

      case UPDATE_CLASS: {
        return {
          ...state,
          classes: state.classes.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_CLASS_BY_BRANCH: {
        return {
          ...state,
          ...{ classesByBranch: action.payload.response }
        }
      }

      case GET_CLASS_SCHEDULE_BY_DATE: {
        return {
          ...state,
          ...{ classesScheduleByDate: action.payload.response }
        }
      }

      case GET_CUSTOMER_CLASS_SCHEDULE_BY_DATE: {
        return {
          ...state,
          ...{ customerClassesScheduleByDate: action.payload.response }
        }
      }

      case GET_CUSTOMER_CLASSES_DETAILS: {
        return {
          ...state,
          ...{ customerClassesDetails: action.payload.response }
        }
      }


      default:
        return state
    }
  } else {
    return state
  }
};
