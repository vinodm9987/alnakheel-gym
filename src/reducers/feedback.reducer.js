import { GET_FEEDBACK, UPDATE_FEEDBACK, GET_FEEDBACK_MEMBER, ADD_FEEDBACK } from '../actions/types';

const initialState = { memberFeedbacks: [] };


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {


      case GET_FEEDBACK: {
        return {
          ...state,
          ...{ feedbacks: action.payload.response }
        }
      }

      case UPDATE_FEEDBACK: {
        return {
          ...state,
          feedbacks: {
            ...state.feedbacks,
            newResponse: state.feedbacks.newResponse.map(data => {
              if (data._id === action.payload.response._id) {
                return action.payload.response
              }
              return data
            }),
            complaint: {
              pending: action.payload.response.optionType === 'Complaints' ? state.feedbacks.complaint.pending - 1 : state.feedbacks.complaint.pending,
              completed: action.payload.response.optionType === 'Complaints' ? state.feedbacks.complaint.completed + 1 : state.feedbacks.complaint.completed
            },
            suggestion: {
              pending: action.payload.response.optionType === 'Suggestions' ? state.feedbacks.suggestion.pending - 1 : state.feedbacks.suggestion.pending,
              completed: action.payload.response.optionType === 'Suggestions' ? state.feedbacks.suggestion.completed + 1 : state.feedbacks.suggestion.completed
            }
          }
        }
      }

      case ADD_FEEDBACK: {
        return {
          ...state,
          memberFeedbacks: [...state.memberFeedbacks, action.payload.response]
        }
      }

      case GET_FEEDBACK_MEMBER: {
        return {
          ...state,
          ...{ memberFeedbacks: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
