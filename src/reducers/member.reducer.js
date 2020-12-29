import {
  GET_MEMBER, GET_NEW_REGISTER_MEMBER_FILTER, GET_MEMBER_BY_ID, GET_ACTIVE_REGISTER_MEMBER_FILTER,
  GET_PENDING_REGISTER_MEMBER_FILTER, GET_ACTIVE_STATUS_REGISTER_MEMBER_FILTER, GET_EXPIRED_MEMBER,
  GET_ACTIVE_STATUS_NOT_EXPIRED_REGISTER_MEMBER_FILTER, GET_ACTIVE_MEMBER, GET_CLASSES_MEMBER, GET_CPR,
  GET_MEMBER_ENTRANCE
} from '../actions/types';

const initialState = {
  AllMember: [],
  NewRegisteredMember: [],
  currentUpdate: {}
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case GET_MEMBER: {
        return {
          ...state,
          ...{ allMember: action.payload.response }
        }
      }

      case GET_NEW_REGISTER_MEMBER_FILTER: {
        return {
          ...state,
          ...{ NewRegisteredMember: action.payload.response }
        }
      }

      case GET_ACTIVE_REGISTER_MEMBER_FILTER: {
        return {
          ...state,
          ...{ activeRegisterMember: action.payload.response }
        }
      }

      case GET_ACTIVE_STATUS_REGISTER_MEMBER_FILTER: {
        return {
          ...state,
          ...{ activeStatusRegisterMember: action.payload.response }
        }
      }

      case GET_ACTIVE_STATUS_NOT_EXPIRED_REGISTER_MEMBER_FILTER: {
        return {
          ...state,
          ...{ activeStatusNotExpiredRegisterMember: action.payload.response }
        }
      }

      case GET_PENDING_REGISTER_MEMBER_FILTER: {
        return {
          ...state,
          ...{ pendingRegisterMember: action.payload.response }
        }
      }

      case GET_EXPIRED_MEMBER: {
        return {
          ...state,
          ...{ expiredMember: action.payload.response }
        }
      }

      case GET_MEMBER_BY_ID: {
        return {
          ...state,
          ...{ memberById: action.payload.response }
        }
      }

      case GET_ACTIVE_MEMBER: {
        return {
          ...state,
          ...{ activeMember: action.payload.response }
        }
      }

      case GET_CLASSES_MEMBER: {
        return {
          ...state,
          ...{ classesMember: action.payload.response }
        }
      }

      case GET_CPR: {
        return {
          ...state,
          ...{ cpr: action.payload }
        }
      }

      case GET_MEMBER_ENTRANCE: {
        return {
          ...state,
          ...{ memberEntrance: action.payload }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
