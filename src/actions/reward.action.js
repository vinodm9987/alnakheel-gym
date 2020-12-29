import axios from 'axios';
import {
  GET_ERROR, GET_GIFTCARD, CLEAR_ERRORS, UPDATE_GIFTCARD, GET_ACTIVE_GIFTCARD,
  ADD_POLICY, GET_POLICY, UPDATE_POLICY, GET_ACTIVE_POLICY, GET_MEMBER_TRANSACTION,
  GET_ALL_TRANSACTION, AMOUNT_BY_REDEEM_CODE, GET_REFER_CODE
} from './types'
import { IP } from '../config'
import { setLoading, removeLoading } from './loader.action'
import { getVerificationCode } from './auth.action';
import { createNewMemberByAdmin, updateMemberAndAddPackage } from './member.action';

/**
 *  Giftcard
 **/

export const addGiftcard = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/reward/addGiftcard`, postData)
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


export const getAllGiftcardForAdmin = () => dispatch => {
  axios
    .get(`${IP}/reward/getAllGiftcardForAdmin`)
    .then(res =>
      dispatch({ type: GET_GIFTCARD, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_GIFTCARD, payload: null })
    )
};

export const updateGiftcard = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/reward/updateGiftcard/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_GIFTCARD, payload: res.data })
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

export const getAllGiftcard = () => dispatch => {
  axios
    .get(`${IP}/reward/getAllGiftcard`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_GIFTCARD, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_GIFTCARD, payload: null })
    )
};

export const redeemOffer = (postData) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/reward/redeemOffer`, postData)
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
}

export const cancelRedeem = (postData) => dispatch => {
  axios
    .post(`${IP}/reward/cancelRedeem`, postData)
    .then(res => {
      dispatch({ type: GET_ERROR, payload: res.data })
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    )
    .then(() => setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS })
    }, 5000))
}

export const getAmountByRedeemCode = (postData) => dispatch => {
  axios
    .post(`${IP}/reward/getAmountByRedeemCode`, postData)
    .then(res =>
      dispatch({ type: AMOUNT_BY_REDEEM_CODE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: AMOUNT_BY_REDEEM_CODE, payload: null })
    )
};


export const checkReferralCodeValidity = (postData, email) => dispatch => {
  axios
    .post(`${IP}/reward/checkReferralCodeValidity`, postData)
    .then(res =>
      dispatch(getVerificationCode({ email }))
    )
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    )
}


export const checkReferralCodeValidityOnAdmin = (postData, formData, addPackage) => dispatch => {
  axios
    .post(`${IP}/reward/checkReferralCodeValidity`, postData)
    .then(res => {
      if (addPackage) {
        dispatch(updateMemberAndAddPackage(formData))
      } else {
        dispatch(createNewMemberByAdmin(formData))
      }
    })
    .catch(err =>
      err.response && dispatch({ type: GET_ERROR, payload: err.response.data })
    )
}



/**
 *  Reward Policy
 **/

export const addNewPolicy = postData => dispatch => {
  dispatch(setLoading());
  axios
    .post(`${IP}/reward/addNewPolicy`, postData)
    .then(res => {
      dispatch({ type: ADD_POLICY, payload: res.data })
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


export const getAllPolicyForAdmin = () => dispatch => {
  axios
    .get(`${IP}/reward/getAllPolicyForAdmin`)
    .then(res =>
      dispatch({ type: GET_POLICY, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_POLICY, payload: null })
    )
};

export const updatePolicy = (id, postData) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`${IP}/reward/updatePolicy/${id}`, postData)
    .then(res => {
      dispatch({ type: UPDATE_POLICY, payload: res.data })
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

export const getAllPolicy = () => dispatch => {
  axios
    .get(`${IP}/reward/getAllPolicy`)
    .then(res =>
      dispatch({ type: GET_ACTIVE_POLICY, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ACTIVE_POLICY, payload: null })
    )
};

export const getMemberTransaction = (postData) => dispatch => {
  axios
    .post(`${IP}/reward/getMemberTransaction`, postData)
    .then(res =>
      dispatch({ type: GET_MEMBER_TRANSACTION, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER_TRANSACTION, payload: null })
    )
};

export const getAllTransactionsForAdmin = (postData) => dispatch => {
  axios
    .post(`${IP}/reward/getAllTransactionsForAdmin`, postData)
    .then(res =>
      dispatch({ type: GET_ALL_TRANSACTION, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_ALL_TRANSACTION, payload: null })
    )
};


export const referFriend = (postData) => dispatch => {
  axios
    .post(`${IP}/reward/referFriend`, postData)
    .then(res =>
      dispatch({ type: GET_REFER_CODE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_REFER_CODE, payload: null })
    )
};
