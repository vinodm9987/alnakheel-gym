import { TOGGLE, TOGGLE_FALSE, CART_TOGGLE, CART_TOGGLE_FALSE, TOP_SCROLL } from '../actions/types';

export default (state = { toggle: false, cartToggle: false, topScroll: false }, action) => {

  switch (action.type) {

    case TOGGLE: {
      return {
        ...state,
        toggle: !state.toggle
      }
    }

    case TOGGLE_FALSE: {
      return {
        ...state,
        toggle: false
      }
    }

    case CART_TOGGLE: {
      return {
        ...state,
        cartToggle: !state.cartToggle
      }
    }

    case CART_TOGGLE_FALSE: {
      return {
        ...state,
        cartToggle: false
      }
    }

    case TOP_SCROLL: {
      return {
        ...state,
        topScroll: action.payload
      }
    }

    default:
      return state
  }
};