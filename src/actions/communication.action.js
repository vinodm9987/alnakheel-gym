import axios from 'axios';
import {
  GET_ERROR, GET_ANNOUNCEMENT, CLEAR_ERRORS, UPDATE_ANNOUNCEMENT, GET_ACTIVE_ANNOUNCEMENT,
  ADD_EVENT, GET_EVENT, UPDATE_EVENT, GET_ACTIVE_EVENT, GET_EVENT_BY_DATE,
  ADD_OFFER, GET_OFFER, UPDATE_OFFER, GET_ACTIVE_OFFER
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'

/**
 *  Announcement
 **/

export const addAnnouncement = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/announcement/addAnnouncement`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
};


export const getAllAnnouncementForAdmin = (postData) => dispatch => {
  axios
    .post(`${IP}/announcement/getAllAnnouncementForAdmin`, postData)
    .then(res =>
      dispatch({ type: GET_ANNOUNCEMENT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ANNOUNCEMENT, payload: null })
    )
};

export const updateAnnouncement = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/announcement/updateAnnouncement/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_ANNOUNCEMENT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    }
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
};

export const getAllAnnouncement = (postData) => dispatch => {
  axios
    .post(`${IP}/announcement/getAllAnnouncement`, postData)
    .then(res =>
      dispatch({ type: GET_ACTIVE_ANNOUNCEMENT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_ANNOUNCEMENT, payload: null })
    )
};


/**
 *  Event
 **/

export const addEvent = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/event/addEvent`, postData)
    .then(res => {
      dispatch({ type: ADD_EVENT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
};


export const getAllEventForAdmin = () => dispatch => {
  axios
    .get(`${IP}/event/getAllEventForAdmin`)
    .then(res =>
      dispatch({ type: GET_EVENT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_EVENT, payload: null })
    )
};

export const updateEvent = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/event/updateEvent/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_EVENT, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    }
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
};

export const getAllEvent = () => dispatch => {
  axios
    .get(`${IP}/event/getAllEvent`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_EVENT, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_EVENT, payload: null })
    )
};

export const getEventsByDate = (postData) => dispatch => {
  axios
    .post(`${IP}/event/getEventsByDate`, postData)
    .then(res =>
      dispatch({ type: GET_EVENT_BY_DATE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_EVENT_BY_DATE, payload: null })
    )
};



/**
 *  Offer
 **/

export const addOffer = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/offer/addOffer`, postData)
    .then(res => {
      dispatch({ type: ADD_OFFER, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
};


export const getAllOfferForAdmin = () => dispatch => {
  axios
    .get(`${IP}/offer/getAllOfferForAdmin`)
    .then(res =>
      dispatch({ type: GET_OFFER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_OFFER, payload: null })
    )
};

export const updateOffer = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/offer/updateOffer/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_OFFER, payload: res.data })
      dispatch({ type: GET_ERROR, payload: res.data })
    }
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    ).then(() => setTimeout(() => {
      dispatch(removeLoading())
    }, 1000))
    .then(() =>
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS })
      }, 5000)
    )
};

export const getAllOffer = () => dispatch => {
  axios
    .get(`${IP}/offer/getAllOffer`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_OFFER, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_OFFER, payload: null })
    )
};