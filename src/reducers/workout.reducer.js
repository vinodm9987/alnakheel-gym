import {
  GET_WORKOUTS, UPDATE_WORKOUT_STATUS, GET_ACTIVE_WORKOUTS,
  GET_WORKOUTS_LEVEL, GET_ACTIVE_WORKOUTS_LEVEL, UPDATE_WORKOUT_LEVEL_STATUS,
  GET_ACTIVE_WORKOUTS_BY_CATEGORY, GET_MEMBER_WORKOUT_BY_DATE, GET_MEMBER_WORKOUT_BY_DATE_FOR_TRAINER,
  EMPTY_MEMBER_WORKOUT_BY_DATE_FOR_TRAINER, EMPTY_MEMBER_WORKOUT_BY_DATE
} from '../actions/types'

const initialState = {
  workoutsResponse: [],
  workoutsLevel: []
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      /**
       * WORKOUTS
      */

      case GET_WORKOUTS: {
        return {
          ...state,
          ...{ workoutsResponse: action.payload.response }
        }
      }

      case UPDATE_WORKOUT_STATUS: {
        return {
          ...state,
          workoutsResponse: state.workoutsResponse.map(data => {
            if (data._id === action.payload.response._id) {
              return {
                ...data,
                ...{ status: action.payload.response.status }
              }
            }
            return data
          })
        }
      }

      case GET_ACTIVE_WORKOUTS: {
        return {
          ...state,
          ...{ activeWorkoutsResponse: action.payload.response }
        }
      }

      case GET_ACTIVE_WORKOUTS_BY_CATEGORY: {
        return {
          ...state,
          ...{ activeWorkoutsByCategory: action.payload.response }
        }
      }

      /**
       * WORKOUTS LEVEL
      */


      case GET_WORKOUTS_LEVEL: {
        return {
          ...state,
          ...{ workoutsLevel: action.payload.response }
        }
      }

      case UPDATE_WORKOUT_LEVEL_STATUS: {
        return {
          ...state,
          workoutsLevel: state.workoutsLevel.map(data => {
            if (data._id === action.payload.response._id) {
              return { ...data, ...{ status: action.payload.response.status } }
            }
            return data
          })
        }
      }

      case GET_ACTIVE_WORKOUTS_LEVEL: {
        return {
          ...state,
          ...{ activeWorkoutsLevel: action.payload.response }
        }
      }


      /**
       *  MEMBER WORKOUT
      */

      case GET_MEMBER_WORKOUT_BY_DATE: {
        return {
          ...state,
          ...{ memberWorkoutByDate: action.payload.response }
        }
      }

      case EMPTY_MEMBER_WORKOUT_BY_DATE: {
        return {
          ...state,
          ...{ memberWorkoutByDate: [] }
        }
      }

      case GET_MEMBER_WORKOUT_BY_DATE_FOR_TRAINER: {
        return {
          ...state,
          ...{ memberWorkoutByDateForTrainer: action.payload.response }
        }
      }

      case EMPTY_MEMBER_WORKOUT_BY_DATE_FOR_TRAINER: {
        return {
          ...state,
          ...{ memberWorkoutByDateForTrainer: null }
        }
      }


      default:
        return state
    }
  } else {
    return state
  }
};
