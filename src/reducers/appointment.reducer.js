import { GET_APPOINTMENT_REQUESTS, GET_MEMBER_APPOINTMENT_HISTORY, GET_MEMBER_APPOINTMENT_STATUS, GET_MEMBER_TRAFFIC } from '../actions/types';

const initialState = {
  appointmentRequests: []
};


export default (state = initialState, action) => {

  if (action.payload) {

    switch (action.type) {

      case GET_APPOINTMENT_REQUESTS: {
        return {
          ...state,
          ...{ appointmentRequests: action.payload.response }
        }
      }

      case GET_MEMBER_APPOINTMENT_HISTORY: {
        return {
          ...state,
          ...{ memberAppointmentHistory: action.payload.response }
        }
      }

      case GET_MEMBER_APPOINTMENT_STATUS: {
        return {
          ...state,
          appointmentRequests: state.appointmentRequests.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_MEMBER_TRAFFIC: {
        return {
          ...state,
          ...{ memberTraffic: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
