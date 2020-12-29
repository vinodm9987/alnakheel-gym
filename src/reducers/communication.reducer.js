import {
  ADD_ANNOUNCEMENT, GET_ANNOUNCEMENT, UPDATE_ANNOUNCEMENT, GET_ACTIVE_ANNOUNCEMENT,
  ADD_EVENT, GET_EVENT, UPDATE_EVENT, GET_ACTIVE_EVENT, GET_EVENT_BY_DATE,
  ADD_OFFER, GET_OFFER, UPDATE_OFFER, GET_ACTIVE_OFFER
} from '../actions/types';

const initialState = { announcements: [], events: [], offers: [] };


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {


      /**
       * Announcement
      **/

      case ADD_ANNOUNCEMENT: {
        return {
          ...state,
          announcements: [...state.announcements, action.payload.response]
        }
      }

      case GET_ANNOUNCEMENT: {
        return {
          ...state,
          ...{ announcements: action.payload.response }
        }
      }

      case UPDATE_ANNOUNCEMENT: {
        return {
          ...state,
          announcements: state.announcements.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_ANNOUNCEMENT: {
        return {
          ...state,
          ...{ activeAnnouncements: action.payload.response }
        }
      }


      /**
       * Event
      **/

      case ADD_EVENT: {
        return {
          ...state,
          events: [...state.events, action.payload.response]
        }
      }

      case GET_EVENT: {
        return {
          ...state,
          ...{ events: action.payload.response }
        }
      }

      case UPDATE_EVENT: {
        return {
          ...state,
          events: state.events.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_EVENT: {
        return {
          ...state,
          ...{ activeEvents: action.payload.response }
        }
      }

      case GET_EVENT_BY_DATE: {
        return {
          ...state,
          ...{ eventsByDate: action.payload.response }
        }
      }



      /**
         * Offer
        **/

      case ADD_OFFER: {
        return {
          ...state,
          offers: [...state.offers, action.payload.response]
        }
      }

      case GET_OFFER: {
        return {
          ...state,
          ...{ offers: action.payload.response }
        }
      }

      case UPDATE_OFFER: {
        return {
          ...state,
          offers: state.offers.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_OFFER: {
        return {
          ...state,
          ...{ activeOffers: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
