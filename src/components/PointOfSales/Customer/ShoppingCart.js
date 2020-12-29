import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cartToggleFalse } from '../../../actions/toggle.action'
import { removeCart, updateCart } from '../../../actions/pos.action'
import { withTranslation } from 'react-i18next'
// import { StripeProvider, Elements } from 'react-stripe-elements'
// import CheckoutForm from './CheckoutForm'
import { getAmountByRedeemCode } from '../../../actions/reward.action';
import { GET_ALERT_ERROR } from '../../../actions/types';
import { setTime } from '../../../utils/apis/helpers'

class ShoppingCart extends Component {

  constructor(props) {
    super(props)
    this.default = {
      cartOfMember: [],
      tax: 0,
      switchToPayment: false,
      giftcard: 0,
      subTotalGiftCard: 0,
      text: '',
      redeemCode: '',
      memberTransactionId: '',
      member: ''
    }
    this.state = this.default
  }

  componentDidMount() {
    if (this.props.loggedUser && this.props.loggedUser.userId) {
      this.setState({ member: this.props.loggedUser.userId._id })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.amountByRedeemCode && this.props.amountByRedeemCode.redeemCode !== (prevProps.amountByRedeemCode && prevProps.amountByRedeemCode.redeemCode)) {
      if (prevState.subTotalGiftCard >= this.props.amountByRedeemCode.giftCard.amount) {
        this.setState({ giftcard: this.props.amountByRedeemCode.giftCard.amount, redeemCode: this.props.amountByRedeemCode.redeemCode, memberTransactionId: this.props.amountByRedeemCode._id })
      } else {
        this.props.dispatch({ type: GET_ALERT_ERROR, payload: 'Sorry gift card is not valid on this transaction' })
      }
    }
  }

  removeFromCart(index) {
    const cart = this.props.cartOfMember
    if (index > -1) {
      const data = {
        cartId: cart[index]._id
      }
      this.props.dispatch(removeCart(data))
      this.setState({ giftcard: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    }
  }

  decrementValue(index) {
    const { t } = this.props
    const cart = this.props.cartOfMember[index]
    if (cart.addedQuantity > 1) {
      const data = {
        addedQuantity: -1
      }
      this.props.dispatch(updateCart(cart._id, data))
      this.setState({ giftcard: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('Sorry this is the min qty') })
    }
  }

  incrementValue(index) {
    const { t } = this.props
    const cart = this.props.cartOfMember[index]
    if (cart.addedQuantity < cart.stockId.quantity) {
      const data = {
        addedQuantity: 1
      }
      this.props.dispatch(updateCart(cart._id, data))
      this.setState({ giftcard: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('You have added the max qty') })
    }
  }

  setSwitchPayment() {
    this.props.dispatch(cartToggleFalse())
    this.setState({
      switchToPayment: false
    })
  }

  addGiftcard(subTotalGiftCard) {
    if (this.state.member) {
      subTotalGiftCard && this.setState({ subTotalGiftCard, cash: 0, card: 0 }, () => {
        if (this.state.text !== this.state.redeemCode) {
          this.setState({ giftcard: 0 })
          this.props.dispatch(getAmountByRedeemCode({ code: this.state.text, memberId: this.state.member._id }))
        } else {
          this.props.dispatch(getAmountByRedeemCode({ code: this.state.text, memberId: this.state.member._id }))
        }
      })
    } else {
      this.props.dispatch({ type: GET_ALERT_ERROR, payload: 'Sorry gift card is not valid' })
    }
  }

  render() {
    const { t } = this.props
    const { giftcard, text, switchToPayment } = this.state
    const cartValue = this.props.cartOfMember && this.props.cartOfMember.length
    let subTotal = 0
    let totalVat = 0
    this.props.cartOfMember && this.props.cartOfMember.forEach(cart => {
      const { stockId: { offerDetails, sellingPrice, vat: { taxPercent } }, addedQuantity } = cart
      const offeredPrice = ((offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()))
        ? (addedQuantity * sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100))
        : addedQuantity * sellingPrice)
      subTotal = subTotal + offeredPrice
      totalVat = totalVat + offeredPrice * taxPercent / 100
    })
    let total = subTotal - giftcard + totalVat
    return (
      <div>
        <div id="cart-sidebar" className={this.props.cartToggle ? "cart-sidenav d-flex flex-wrap active" : "cart-sidenav d-flex flex-wrap"}>
          <div className={switchToPayment ? "d-none flex-wrap w-100 h-100 overflow-auto Section-1" : "d-flex flex-wrap w-100 h-100 overflow-auto Section-1"}>
            <div className="mb-auto w-100">
              <div className="d-flex align-items-center justify-content-between border-bottom px-2 pt-2 pb-3">
                <div className="px-1">
                  <h2 className="SegoeBold my-2 px-2">{t('MY SHOPPING CART')}</h2>
                  <h5 className="my-0 px-1"><span className="mx-1 text-warning">{cartValue}</span><span className="mx-1 text-muted">{t('Items')}</span></h5>
                </div>
                <div className="px-3">
                  <span className="iconv1 iconv1-close font-weight-bold cursorPointer" onClick={() => this.setSwitchPayment()}></span>
                </div>
              </div>
              <div className="cart-body">

                {/* Loop */}
                {this.props.cartOfMember && this.props.cartOfMember.map((cart, i) => {
                  const { stockId: { image, itemName, sellingPrice, offerDetails }, addedQuantity } = cart
                  const price = (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()))
                    ? (addedQuantity * sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100))
                    : addedQuantity * sellingPrice
                  return (
                    <div key={i} className="col-12 d-flex justify-content-between align-items-center border-bottom mb-3">
                      <div className="col-12 px-0 d-flex flex-wrap flex-md-nowrap justify-content-start align-items-center" style={{ maxWidth: 'calc(100% - 47px)' }}>
                        <img alt='' src={`/${image.path}`} className="w-100px h-100px objectFitCover rounded my-3 mx-1" style={{ flexBasis: '0' }} />
                        <div className="mx-1">
                          <h5 className="text-muted w-100 my-2 mx-1">{itemName}</h5>
                          <h5 className="mx-1 my-0 font-weight-bold w-100">
                            <span className="text-danger mx-1">{this.props.defaultCurrency}</span><span className="text-danger mx-1">{price.toFixed(3)}</span>
                          </h5>
                          <div className="d-flex justify-content-start align-items-center my-2">
                            <span className="bg-secondary mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white w-40px cursorPointer"
                              onClick={() => this.decrementValue(i)}>-</span>
                            <span className="bg-warning mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white w-40px">{addedQuantity}</span>
                            <span className="bg-secondary mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white w-40px cursorPointer"
                              onClick={() => this.incrementValue(i)}>+</span>
                          </div>
                        </div>
                      </div>
                      <div className="mx-1 py-3 d-flex align-items-center" style={{ flexBasis: '0' }}>
                        <span className="iconv1 iconv1-delete mx-2 cursorPointer bg-success p-2 rounded-circle text-white" style={{ fontSize: '20px', transform: ' rotate(45deg)' }} onClick={() => this.removeFromCart(i)}><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                      </div>
                      <div className="underline w-100"></div>
                    </div>
                  )
                })}
                {/* /- Loop End */}

              </div>
            </div>

            {this.props.cartOfMember && this.props.cartOfMember.length > 0 &&
              <div className="cart-footer mt-auto w-100 px-15px">
                <div className="row">
                  <div className="col-12">
                    <div className="card px-2 bgGray w-100 border-light mt-1">
                      <div className="table-responsive">
                        <table className="table table-borderless table-sm">
                          <thead>
                            <tr>
                              <td></td>
                              <td></td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <p className="m-0">{t('Sub Total')}</p>
                              </td>
                              <td>
                                <p className="m-0"><small className="d-flex justify-content-end">{this.props.defaultCurrency} {subTotal.toFixed(3)}</small></p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p className="m-0">{t('Discount')}</p>
                              </td>
                              <td>
                                <p className="m-0"><small className="d-flex justify-content-end">{giftcard.toFixed(3)}</small></p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p className="m-0">{t('Tax')}</p>
                              </td>
                              <td>
                                <p className="m-0"><small className="d-flex justify-content-end text-primary">{totalVat.toFixed(3)}</small></p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                <div className="bg-secondary border-top w-100 border-secondary"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h3 className="m-0">{t('Total')}</h3>
                              </td>
                              <td>
                                <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{total.toFixed(3)}</span></h5>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-12 px-0 pt-2">
                      <button type="button" className="btn d-flex  justify-content-start align-items-center btn-outline-primary w-100" data-toggle="modal" data-target="#GiftCard">
                        <span className="iconv1 iconv1-email" style={{ fontSize: '50px' }}></span><span className="mx-3"></span><span>{t('Click here if you have Gift Card')}</span>
                      </button>
                    </div>

                    <div className="col-12 px-0 pt-2 pb-3">
                      <button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.setState({ switchToPayment: true })}>{t('SUBMIT')}</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>


          {/* If Payment */}
          <div className={switchToPayment ? "d-flex flex-wrap w-100 h-100 overflow-auto Section-2" : "d-none flex-wrap w-100 h-100 overflow-auto Section-2"}>
            <div className="mb-auto w-100">
              <div className="d-flex align-items-center justify-content-between border-bottom px-2 pt-3 pb-4">
                <div className="px-1 d-flex align-items-center justify-content-start">
                  <h4 className="iconv1 iconv1-left-arrow font-weight-bold mx-1 my-0 cursorPointer" onClick={() => this.setState({ switchToPayment: false })}> </h4>
                  <h2 className="SegoeBold my-2 px-2">{t('CHECKOUT')}</h2>
                </div>
                <div className="px-3">
                  <span className="iconv1 iconv1-close font-weight-bold cursorPointer" onClick={() => this.setSwitchPayment()}></span>
                </div>
              </div>
              <div className="cart-body py-3">

                {/* <div className="col-12 py-1">
                  <a href="/#" className="card bgGray border-0 py-2 px-2 linkHoverDecLess">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center justify-content-start">
                        <span className="iconv1 iconv1-email font-weight-bold mx-2 text-warning" style={{ fontSize: '50px' }}></span>
                        <h5 className="SegoeSemiBold my-0 mx-2 text-body">{t('Pay with Credit Card')}</h5>
                      </div>
                      <span className="iconv1 iconv1-right-arrow font-weight-bold mx-3 text-body"></span>
                    </div>
                  </a>
                </div>
                <div className="col-12 py-1">
                  <a href="/#" className="card bgGray border-0 py-2 px-2 linkHoverDecLess">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center justify-content-start">
                        <span className="iconv1 iconv1-email font-weight-bold mx-2 text-warning" style={{ fontSize: '50px' }}></span>
                        <h5 className="SegoeSemiBold my-0 mx-2 text-body">{t('Pay with Debit Card')}</h5>
                      </div>
                      <span className="iconv1 iconv1-right-arrow font-weight-bold mx-3 text-body"></span>
                    </div>
                  </a>
                </div>
                <div className="col-12 py-1">
                  <a href="/#" className="card bgGray border-0 py-2 px-2 linkHoverDecLess">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center justify-content-start">
                        <span className="iconv1 iconv1-email font-weight-bold mx-2 text-warning" style={{ fontSize: '50px' }}></span>
                        <h5 className="SegoeSemiBold my-0 mx-2 text-body">{t('PayPal')}</h5>
                      </div>
                      <span className="iconv1 iconv1-right-arrow font-weight-bold mx-3 text-body"></span>
                    </div>
                  </a>
                </div>
                <div className="col-12 py-1">
                  <a href="/#" className="card bgGray border-0 py-2 px-2 linkHoverDecLess">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center justify-content-start">
                        <span className="iconv1 iconv1-email font-weight-bold mx-2 text-warning" style={{ fontSize: '50px' }}></span>
                        <h5 className="SegoeSemiBold my-0 mx-2 text-body">{t('PayPal')}</h5>
                      </div>
                      <span className="iconv1 iconv1-right-arrow font-weight-bold mx-3 text-body"></span>
                    </div>
                  </a>
                </div> */}
                {/* <StripeProvider apiKey="pk_test_sVwoXjapu6vrvVsqLkiJAZWA00oI61gnJf">
                  <Elements>
                    <CheckoutForm defaultCurrency={this.props.defaultCurrency} amount={total.toFixed(3)} />
                  </Elements>
                </StripeProvider> */}

              </div>
            </div>
          </div>
          {/* /- If Payment End */}









        </div>
        <div className={this.props.cartToggle ? "h-100 bg-dark fixed-top" : "d-none h-100 bg-dark fixed-top"} style={{ opacity: '0.85', zIndex: '1010' }} onClick={() => this.setSwitchPayment()}></div>




        {/* Popup Gift Card */}
        <div className="modal fade" id="GiftCard">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <h4 className="my-3 font-weight-bold text-center">{t('Gift Card')}</h4>
                  </div>
                  <div className="col-12 p-3">
                    <input type="text" autoComplete="off" className="form-control h-50px" placeholder={t('Scan Gift Card or Enter Gift Card Number')}
                      value={text} onChange={(e) => this.setState({ text: e.target.value })}
                    />
                  </div>
                  <div className="col-12 p-3">
                    <button type="button" className="btn btn-block btn-success btn-lg" data-dismiss="modal" onClick={() => this.addGiftcard(subTotal)}>{t('Redeem Gift Card')}</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* /- Popup Gift Card End*/}

      </div>
    )
  }
}

function mapStateToProps({ toggle: { cartToggle }, pos: { cartOfMember }, currency: { defaultCurrency }, reward: { amountByRedeemCode }, auth: { loggedUser } }) {
  return {
    cartToggle,
    cartOfMember,
    defaultCurrency,
    amountByRedeemCode,
    loggedUser
  }
}

export default withTranslation()(connect(mapStateToProps)(ShoppingCart))