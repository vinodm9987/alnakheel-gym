import { TOGGLE, TOGGLE_FALSE, CART_TOGGLE, CART_TOGGLE_FALSE, TOP_SCROLL } from './types'

export const toggleAction = () => dispatch => {
  dispatch({
    type: TOGGLE,
  })
};

export const toggleFalse = () => dispatch => {
  dispatch({
    type: TOGGLE_FALSE,
  })
};

export const cartToggleAction = () => dispatch => {
  dispatch({
    type: CART_TOGGLE,
  })
};

export const scrollTopAction = (payload) => dispatch => {
  dispatch({
    type: TOP_SCROLL,
    payload
  })
};

export const cartToggleFalse = () => dispatch => {
  dispatch({
    type: CART_TOGGLE_FALSE,
  })
};