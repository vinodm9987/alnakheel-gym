import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cartToggleAction } from '../../../actions/toggle.action'
import ShoppingCart from './ShoppingCart'
import { getAllStocks, getCartOfMember, addToCart } from '../../../actions/pos.action'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import { getAmountByRedeemCode } from '../../../actions/reward.action'
import { setTime } from '../../../utils/apis/helpers'

class Shopping extends Component {

  constructor(props) {
    super(props)
    this.default = {
      search: '',
      addedStocks: [],
      cartStatus: false,
      activeStocks: [],
    }
    this.state = this.default
    this.props.loggedUser && this.props.loggedUser.userId && this.props.dispatch(getAllStocks({ branch: this.props.loggedUser.userId.branch }))
    this.props.loggedUser && this.props.loggedUser.userId && this.props.dispatch(getCartOfMember(this.props.loggedUser.userId._id))
  }

  static getDerivedStateFromProps(props, state) {
    if (props.activeStocks) {
      const activeStocks = props.activeStocks && props.activeStocks.map((stock => {
        const exist = props.cartOfMember.some(cart => cart.stockId._id === stock._id)
        if (!exist) {
          return { ...stock, ...{ cartStatus: false } }
        } else {
          return { ...stock, ...{ cartStatus: true } }
        }
      }))
      return {
        activeStocks: activeStocks || []
      }
    }
    return null;
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      this.props.loggedUser && this.props.loggedUser.userId &&
        window.dispatchWithDebounce(getAllStocks)({ branch: this.props.loggedUser.userId.branch, search: this.state.search })
    })
  }

  addToCart(id, cartStatus, e) {
    e.preventDefault()
    if (cartStatus) {
      this.props.dispatch(cartToggleAction())
    } else {
      const cartInfo = {
        dateOfCart: new Date(),
        stockId: id,
        member: this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id,
        addedQuantity: 1
      }
      this.props.dispatch(addToCart(cartInfo))
      this.props.dispatch(getAmountByRedeemCode({ code: '' }))
    }
  }

  render() {
    const { t } = this.props
    const { search } = this.state
    const cartValue = this.props.cartOfMember && this.props.cartOfMember.length
    return (
      <div className="mainPage p-3 Shopping">
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
                <div className="col-12 ShoppingFullCol">
                  <div className="row">
                    <div className="col-12 p-4 mb-2 d-flex flex-wrap align-items-center justify-content-between border-bottom">
                      <div>
                        <h3 className="SegoeBold text-body px-2 mb-2">{t('FITNESS ITEMS')}</h3>
                        <h4 className="mx-1 my-0"><span className="mx-1 text-warning">{this.props.activeStocks && this.props.activeStocks.length}</span><span className="mx-1 text-muted">{t('results')}</span></h4>
                      </div>
                      <div className="d-flex flex-wrap align-items-center">
                        <div className="form-group position-relative mt-3">
                          <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" placeholder="Search" value={search} onChange={(e) => this.handleSearch(e)} />
                          <span className="iconv1 iconv1-search searchBoxIcon"></span>
                        </div>
                        <h4 className="mx-1 my-0 flex-grow-0 flex-shrink-0 cursorPointer" onClick={() => this.props.dispatch(cartToggleAction())}>
                          <span className="mx-1 iconv1 iconv1-cart text-secondary"></span>
                          <small>
                            <small className="mx-1 text-muted">{t('My Cart')}</small>
                            <small className="badge badge-pill badge-danger mx-1">{cartValue}</small>
                          </small>
                        </h4>
                      </div>
                    </div>

                    {this.state.activeStocks && this.state.activeStocks.map((stock, i) => {
                      const { image, itemName, sellingPrice, _id, offerDetails, cartStatus } = stock
                      return (
                        <div key={i} className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 py-3 d-flex">
                          <Link to={`/shopping-item/${_id}`} className="h-100 w-100 d-flex flex-wrap border hoverShadow cursorPointer linkHoverDecLess position-relative">
                            {/* tushar */}
                            {offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()) &&
                              <div className="offered"><span className="semiCut-text pr-1 pl-3">OFFER</span></div>
                            }
                            {/* tushar end */}
                            <div className="mxh-200px w-100 p-3">
                              <img alt='' src={`${image.path}`} className=" w-100 h-100 objectFitContain" />
                            </div>
                            <div className="mt-auto w-100">
                              <h5 className="text-center m-0 pb-1 pt-2 px-3 text-body">{itemName}</h5>
                              <h2 className="text-center text-danger mx-1 my-0 pb-3 font-weight-bold"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">
                                {(offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()))
                                  ? (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)).toFixed(3)
                                  : sellingPrice.toFixed(3)}
                              </span></h2>
                              {/* tushar */}
                              {offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()) &&
                                <div className="d-flex flex-wrap align-items-center pb-3">
                                  <div className="offered2">
                                    <span className="semiCut-val2 mr-2 ml-1">{offerDetails.offerDetails.offerPercentage}%</span><span className="semiCut-text2 mr-3">off</span>
                                  </div>
                                  <small className="ml-3 stripThhrough text-body">{this.props.defaultCurrency} {sellingPrice.toFixed(3)}</small>
                                </div>
                              }
                              {/* tushar end */}
                              <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-success btn-lg text-white d-flex align-items-center mt-1 mb-5"
                                  onClick={(e) => this.addToCart(_id, cartStatus, e)}>
                                  <span className="iconv1 iconv1-cart" style={{ fontSize: '25px' }}></span>
                                  <span className="mx-2"></span>
                                  <span>{cartStatus ? t('Added') : t('Add to Cart')}</span>
                                </button>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <ShoppingCart />

          </form>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ pos: { activeStocks, cartOfMember }, currency: { defaultCurrency }, auth: { loggedUser } }) {
  return {
    activeStocks,
    cartOfMember,
    loggedUser,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(Shopping))