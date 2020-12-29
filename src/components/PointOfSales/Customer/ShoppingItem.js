import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cartToggleAction } from '../../../actions/toggle.action'
import ShoppingCart from './ShoppingCart'
import { getStocksById, addToCart, getCartOfMember, updateCartQuantity } from '../../../actions/pos.action'
import { withTranslation } from 'react-i18next'
import { getAmountByRedeemCode } from '../../../actions/reward.action'
import { setTime } from '../../../utils/apis/helpers'

class ShoppingItem extends Component {

  constructor(props) {
    super(props)
    this.default = {
      addedQuantity: 1,
      addedPrice: 0,
      cartStatus: false,
      stockId: '',
    }
    this.state = this.default
    this.props.dispatch(getStocksById(this.props.match.params.id))
    this.props.loggedUser && this.props.loggedUser.userId && this.props.dispatch(getCartOfMember(this.props.loggedUser.userId._id))
  }

  componentDidUpdate(prevProps) {
    if ((this.props.stockById && this.props.stockById._id !== this.state.stockId) || this.props.cartOfMember.length !== prevProps.cartOfMember.length) {
      const exist = this.props.cartOfMember.some(cart => cart.stockId._id === this.props.stockById._id)
      if (!exist) {
        this.setState({ cartStatus: false, stockId: this.props.stockById._id })
      } else {
        this.setState({ cartStatus: true, stockId: this.props.stockById._id })
      }
    }
  }

  handleCheckOut() {
    if (!this.state.cartStatus) {
      const cartInfo = {
        dateOfCart: new Date(),
        stockId: this.props.stockById._id,
        member: this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id,
        addedQuantity: this.state.addedQuantity
      }
      this.props.dispatch(addToCart(cartInfo))
      setTimeout(() => {
        this.props.dispatch(cartToggleAction())
      }, 1000)
    } else {
      const cart = this.props.cartOfMember.filter(cart => cart.stockId._id === this.props.stockById._id)[0]
      const data = {
        addedQuantity: this.state.addedQuantity
      }
      console.log("ShoppingItem -> handleCheckOut -> data", data)
      this.props.dispatch(updateCartQuantity(cart._id, data))
      setTimeout(() => {
        this.props.dispatch(cartToggleAction())
      }, 1000)
    }
  }

  addToCart() {
    const cartInfo = {
      dateOfCart: new Date(),
      stockId: this.props.stockById._id,
      member: this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id,
      addedQuantity: 1
    }
    this.props.dispatch(addToCart(cartInfo))
    this.props.dispatch(getAmountByRedeemCode({ code: '' }))
  }

  removeFromCart(index) {
    const addedStocks = this.state.addedStocks
    if (index > -1) {
      this.props.activeStocks.filter(stock => stock._id === addedStocks[index]._id)[0].isAdded = false
      addedStocks.splice(index, 1)
      this.setState({ addedStocks: this.state.addedStocks, cash: 0, card: 0 })
    }
  }

  decrementValue() {
    const { t } = this.props
    let { addedQuantity, addedPrice } = this.state
    if (addedQuantity !== 1) {
      addedQuantity = addedQuantity - 1
      this.setState({ addedQuantity, addedPrice })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('Sorry this is the min qty') })
    }
  }

  incrementValue(quantity) {
    const { t } = this.props
    let { addedQuantity, addedPrice } = this.state
    if (addedQuantity !== quantity) {
      addedQuantity = addedQuantity + 1
      this.setState({ addedQuantity, addedPrice })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('You have added the max qty') })
    }
  }

  render() {
    const { t } = this.props
    if (this.props.stockById) {
      const { addedQuantity, cartStatus } = this.state
      const cartValue = this.props.cartOfMember && this.props.cartOfMember.length
      const { itemName, image, sellingPrice, quantity, offerDetails } = this.props.stockById
      const total = (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()))
        ? (addedQuantity * sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100))
        : addedQuantity * sellingPrice
      return (
        <div className="mainPage p-3 ShoppingItem">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Sales')}</span><span className="mx-2">/</span><span className="crumbText">{t('Shopping')}</span>
            </div>
            <div className="col-12 pageHead">
              <h1>{t('Shopping')}</h1>
              <div className="pageHeadLine"></div>
            </div>

            <form className="col-12 px-4">
              <div className="row">

                <div className="col-12 p-0 d-flex flex-wrap">
                  <div className="col-12 ShoppingItemFullCol">
                    <div className="row">
                      <div className="col-12 p-4 mb-2 d-flex flex-wrap align-items-center justify-content-between border-bottom">
                        <div>
                          <h3 className="SegoeBold text-body px-2 mb-2"><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span><span className="mx-1"></span>{t('ITEM DETAILS')}</h3>
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                          <h4 className="mx-1 my-0 flex-grow-0 flex-shrink-0 cursorPointer" onClick={() => this.props.dispatch(cartToggleAction())}>
                            <span className="mx-1 iconv1 iconv1-cart text-secondary"></span>
                            <small>
                              <small className="mx-1 text-muted">{t('My Cart')}</small>
                              <small className="badge badge-pill badge-danger mx-1">{cartValue}</small>
                            </small>
                          </h4>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="row px-sm-3 pt-5">
                          <div className="col-12 ShoppingItemImageCol mb-3">
                            <img alt='' src={`/${image.path}`} className="w-100 h-auto mxw-350px" />
                          </div>
                          <div className="col ShoppingItemMiddleCol mb-3">
                            <h4 className="w-100 mb-3">{itemName}</h4>
                            <h4 className="mx-1 mb-3 font-weight-bold w-100 d-flex flex-wrap align-items-center">
                              {offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()) &&
                                <small style={{ textDecoration: 'line-through' }}><span className="text-muted">{this.props.defaultCurrency}</span><span className="text-muted">{sellingPrice.toFixed(3)}</span></small>
                              }
                              <span className="mx-3"></span>
                              <span className="text-danger">{this.props.defaultCurrency}</span><span className="text-danger mx-1">
                                {(offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()))
                                  ? (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)).toFixed(3)
                                  : sellingPrice.toFixed(3)}
                              </span>
                            </h4>
                            <button type="button" className="btn btn-success btn-lg text-white d-flex align-items-center my-5"
                              onClick={() => cartStatus ? this.props.dispatch(cartToggleAction()) : this.addToCart()}>
                              <span className="iconv1 iconv1-cart" style={{ fontSize: '25px' }}></span>
                              <span className="mx-2"></span>
                              <span>{cartStatus ? t('Added') : t('Add to Cart')}</span>
                            </button>
                          </div>
                          <div className="col-12 ShoppingItemPriceCol mb-3">
                            <div className="card bgGray border-0 w-100 p-3">
                              <div className="d-flex flex-wrap align-items-center justify-content-center">
                                <h6 className="SegoeSemiBold my-2">{t('Total Price')}</h6>
                                <span className="mx-2"></span>
                                <h3 className="d-flex align-items-center text-danger my-2"><small>{this.props.defaultCurrency}</small><span className="mx-1 SegoeBold">{total.toFixed(3)}</span></h3>
                              </div>
                              <h6 className="text-center">
                                <small className="mx-2 text-muted SegoeSemiBold">{t('Best price guarantee')}</small>
                              </h6>
                              <div className="underline w-100 my-2"></div>
                              <div className="d-flex flex-wrap align-items-center justify-content-center py-2">
                                <h6 className="SegoeSemiBold text-muted my-2">{t('Quantity')}</h6>
                                <span className="mx-2"></span>
                                <div className="d-inline-flex justify-content-start align-items-center my-2">
                                  <span className="bg-secondary mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white w-40px cursorPointer"
                                    onClick={() => this.decrementValue()}>-</span>
                                  <span className="bg-warning mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white w-40px">{addedQuantity}</span>
                                  <span className="bg-secondary mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white w-40px cursorPointer"
                                    onClick={() => this.incrementValue(quantity)}>+</span>
                                </div>
                              </div>
                              <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-warning btn-lg text-white d-flex align-items-center my-3 px-4" onClick={() => this.handleCheckOut()}>{t('Check out')}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>



                </div>
              </div>

              <ShoppingCart />

            </form>

          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ pos: { stockById, cartOfMember }, currency: { defaultCurrency }, auth: { loggedUser } }) {
  return {
    stockById,
    cartOfMember,
    defaultCurrency,
    loggedUser
  }
}

export default withTranslation()(connect(mapStateToProps)(ShoppingItem))