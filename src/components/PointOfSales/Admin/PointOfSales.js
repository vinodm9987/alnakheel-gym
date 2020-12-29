import React, { Component } from 'react'
import Select from "react-select";
import { connect } from "react-redux"
import { validator, setTime } from '../../../utils/apis/helpers';
import { getAllStocks, addStockSell } from '../../../actions/pos.action';
import { getActiveStatusRegisterMembers } from '../../../actions/member.action';
import { withTranslation } from 'react-i18next'
import { getAmountByRedeemCode } from '../../../actions/reward.action';
import { GET_ALERT_ERROR, GET_ACTIVE_STOCK } from '../../../actions/types';
import { getAllBranch } from '../../../actions/branch.action';

class PointOfSales extends Component {

  constructor(props) {
    super(props)
    this.default = {
      customerStatus: 'Member',
      member: '',
      memberE: '',
      search: '',
      addedStocks: [],
      cash: 0,
      card: 0,
      cashE: '',
      cardE: '',
      digital: 0,
      digitalE: '',
      subTotalGiftCard: 0,
      redeemCode: '',
      discount: 0,
      giftcard: 0,
      count: 0,
      tax: 0,
      discountMethod: 'percent',
      giftCard: '',
      text: '',
      memberTransactionId: '',
      branch: '',
      branchE: ''
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    // this.props.dispatch(getAllStocks())
    this.props.dispatch({ type: GET_ACTIVE_STOCK, payload: [] })
    this.props.dispatch(getActiveStatusRegisterMembers({ search: "" }))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.amountByRedeemCode && this.props.amountByRedeemCode.redeemCode !== (prevProps.amountByRedeemCode && prevProps.amountByRedeemCode.redeemCode)) {
      if (prevState.subTotalGiftCard >= this.props.amountByRedeemCode.giftCard.amount) {
        this.setState({
          giftcard: this.props.amountByRedeemCode.giftCard.amount,
          redeemCode: this.props.amountByRedeemCode.redeemCode,
          memberTransactionId: this.props.amountByRedeemCode._id
        })
      } else {
        this.props.dispatch({ type: GET_ALERT_ERROR, payload: 'Sorry gift card is not valid on this transaction' })
      }
    }
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () =>
      window.dispatchWithDebounce(getAllStocks)({ branch: this.state.branch, search: this.state.search })
    )
  }

  addToCart(stock, index) {
    const { t } = this.props
    const exist = this.state.addedStocks.some(addedStock => addedStock._id === stock._id)
    if (!exist) {
      this.props.activeStocks[index].isAdded = true
      const addedStocks = this.state.addedStocks
      addedStocks.push({
        ...stock, ...{
          addedQuantity: 1,
          addedPrice: (stock.offerDetails && stock.offerDetails.isOffer && stock.offerDetails.offerDetails.status && setTime(stock.offerDetails.offerDetails.endDate) >= setTime(new Date()))
            ? stock.sellingPrice * (1 - stock.offerDetails.offerDetails.offerPercentage / 100)
            : stock.sellingPrice
        }
      })
      this.setState({ addedStocks, cash: 0, card: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('Item already added') })
    }
  }

  removeFromCart(index) {
    const addedStocks = this.state.addedStocks
    if (index > -1) {
      this.props.activeStocks.filter(stock => stock._id === addedStocks[index]._id)[0].isAdded = false
      addedStocks.splice(index, 1)
      this.setState({ addedStocks: this.state.addedStocks, cash: 0, card: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    }
  }

  decrementValue(index) {
    const { t } = this.props
    const stock = this.state.addedStocks[index]
    if (stock.addedQuantity !== 1) {
      stock.addedQuantity = stock.addedQuantity - 1
      stock.addedPrice = (stock.offerDetails && stock.offerDetails.isOffer && stock.offerDetails.offerDetails.status && setTime(stock.offerDetails.offerDetails.endDate) >= setTime(new Date()))
        ? stock.addedQuantity * stock.sellingPrice * (1 - stock.offerDetails.offerDetails.offerPercentage / 100)
        : stock.addedQuantity * stock.sellingPrice
      this.setState({ addedStocks: this.state.addedStocks, cash: 0, card: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('Sorry this is the min qty') })
    }
  }

  incrementValue(index) {
    const { t } = this.props
    const stock = this.state.addedStocks[index]
    if (stock.addedQuantity !== stock.quantity) {
      stock.addedQuantity = stock.addedQuantity + 1
      stock.addedPrice = (stock.offerDetails && stock.offerDetails.isOffer && stock.offerDetails.offerDetails.status && setTime(stock.offerDetails.offerDetails.endDate) >= setTime(new Date()))
        ? stock.addedQuantity * stock.sellingPrice * (1 - stock.offerDetails.offerDetails.offerPercentage / 100)
        : stock.addedQuantity * stock.sellingPrice
      this.setState({ addedStocks: this.state.addedStocks, cash: 0, card: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('You have added the max qty') })
    }
  }

  setDigital(e, total) {
    const { t } = this.props
    this.setState({ ...validator(e, 'digital', 'numberText', [t('Enter amount')]), ...{ card: 0 } }, () => {
      if (this.state.digital <= total.toFixed(3) && this.state.digital >= 0) {
        const cash = (total.toFixed(3) - this.state.digital).toFixed(3)

        this.setState({
          cash,
          cashE: ''
        })
      } else {
        this.setState({
          cashE: t('Enter valid amount'),
          cash: 0
        })
      }
    })
  }

  setCash(e, total) {
    const { t } = this.props
    this.setState(validator(e, 'cash', 'numberText', [t('Enter amount'), t('Enter valid amount')]), () => {
      if (this.state.cash <= total.toFixed(3) && this.state.cash >= 0) {
        const card = (total.toFixed(3) - this.state.cash).toFixed(3)

        this.setState({
          card,
          cardE: ''
        })
      } else {
        this.setState({
          cardE: t('Enter valid amount'),
          card: 0
        })
      }
    })
  }

  addDiscount(subTotal) {
    if (this.state.discountMethod === 'percent') {
      if (this.state.count && this.state.count <= 100) {
        this.setState({ discount: (parseFloat(this.state.count ? this.state.count : 0) / 100 * subTotal).toFixed(3), cash: 0, card: 0 })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0 })
      }
    } else {
      if (this.state.count && this.state.count <= subTotal) {
        this.setState({ discount: parseFloat(this.state.count ? this.state.count : 0), cash: 0, card: 0 })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0 })
      }
    }
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
      this.props.dispatch({ type: GET_ALERT_ERROR, payload: 'Please select member first' })
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { cash, card, digital, addedStocks, customerStatus, member, discount, giftcard, memberTransactionId, branch, cashE, cardE, digitalE } = this.state
    if (customerStatus === 'Member') {
      if ((cash || card || digital) && addedStocks.length > 0 && member && branch && !cardE && !cashE && !digitalE) {
        let purchaseStock = []
        let actualAmount = 0
        let totalVat = 0
        addedStocks.forEach(addedStock => {
          purchaseStock.push({ stockId: addedStock._id, quantity: addedStock.addedQuantity, amount: addedStock.addedPrice })
          actualAmount = actualAmount + addedStock.addedPrice
          totalVat = totalVat + addedStock.addedPrice * addedStock.vat.taxPercent / 100
        })
        const stockSellsInfo = {
          purchaseStock,
          customerDetails: {
            typeOfCustomer: customerStatus,
            member: member._id
          },
          branch,
          discount,
          vatAmount: totalVat,
          giftcard,
          actualAmount,
          totalAmount: actualAmount - discount - giftcard + totalVat,
          cashAmount: cash ? cash : 0,
          cardAmount: card ? card : 0,
          digitalAmount: digital ? digital : 0,
          memberTransactionId
        }
        this.props.dispatch(addStockSell(stockSellsInfo))
        this.props.activeStocks.forEach(stock => stock.isAdded = false)
        this.setState({ ...this.default, ...{ addedStocks: [], customerStatus: 'Member' } })
      } else {
        if ((!cash || !digital)) this.setState({ cashE: t('Enter amount') })
        if (!member) this.setState({ memberE: t('Select member') })
        if (!branch) this.setState({ branchE: t('Select branch') })
      }
    } else {
      if ((cash || card || digital) && addedStocks.length > 0 && branch && !cardE && !cashE && !digitalE) {
        let purchaseStock = []
        let actualAmount = 0
        let totalVat = 0
        addedStocks.forEach(addedStock => {
          purchaseStock.push({ stockId: addedStock._id, quantity: addedStock.addedQuantity, amount: addedStock.addedPrice })
          actualAmount = actualAmount + addedStock.addedPrice
        })
        addedStocks.forEach(addedStock => {
          totalVat = totalVat + (addedStock.addedPrice - (discount * addedStock.addedPrice / actualAmount) - (giftcard * addedStock.addedPrice / actualAmount)) * addedStock.vat.taxPercent / 100
        })
        const stockSellsInfo = {
          purchaseStock,
          customerDetails: {
            typeOfCustomer: customerStatus,
          },
          branch,
          discount,
          vatAmount: totalVat,
          giftcard: 0,
          actualAmount,
          totalAmount: actualAmount - discount + totalVat,
          cashAmount: cash ? cash : 0,
          cardAmount: card ? card : 0,
          digitalAmount: digital ? digital : 0,
          paymentType: 'POS'
        }
        this.props.dispatch(addStockSell(stockSellsInfo))
        this.props.activeStocks.forEach(stock => stock.isAdded = false)
        this.setState({ ...this.default, ...{ addedStocks: [], customerStatus: 'Member' } })
      } else {
        if ((!cash && !digital)) this.setState({ cashE: t('Enter amount') })
        if (!branch) this.setState({ branchE: t('Select branch') })
      }
    }
  }

  customSearch(options, search) {
    if (
      String(options.data.memberId).toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.userName.toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.email.toLowerCase().includes(search.toLowerCase()) ||
      options.data.mobileNo.toLowerCase().includes(search.toLowerCase()) ||
      options.data.personalId.toLowerCase().includes(search.toLowerCase())
    ) {
      return true
    } else {
      return false
    }
  }

  selectBranch(e) {
    const { t } = this.props
    this.setState(validator(e, 'branch', 'text', [t('Select branch')]), () => {
      this.setState({ addedStocks: [] })
      if (this.state.branch) {
        this.props.dispatch(getAllStocks({ branch: this.state.branch, search: this.state.search }))
      } else {
        this.props.dispatch({ type: GET_ACTIVE_STOCK, payload: [] })
      }
    })
  }

  render() {
    const { t } = this.props
    const formatOptionLabel = ({ credentialId: { userName, avatar, email }, memberId }) => {
      return (
        <div className="d-flex align-items-center">
          <img alt='' src={`/${avatar.path}`} className="rounded-circle mx-1 w-30px h-30px" />
          <div className="w-100">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{userName} ({memberId})</small>
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1' }}>{email}</small>
          </div>
        </div>
      )
    }
    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
    }

    const { customerStatus, member, search, addedStocks, discount, giftcard, discountMethod, count, text, cash, card, branch, digital } = this.state

    let subTotal = 0
    let totalVat = 0
    addedStocks.forEach(addedStock => {
      subTotal = subTotal + addedStock.addedPrice
    })
    addedStocks.forEach(addedStock => {
      totalVat = totalVat + (addedStock.addedPrice - (discount * addedStock.addedPrice / subTotal) - (giftcard * addedStock.addedPrice / subTotal)) * addedStock.vat.taxPercent / 100
    })

    let total = subTotal - discount - giftcard + totalVat

    let totalLeftAfterDigital = total - digital

    return (
      <div className="mainPage p-3 PointOfSales">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Sales')}</span><span className="mx-2">/</span><span className="crumbText">{t('Point of Sales')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Point of Sales')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <form className="col-12 px-4">
            <div className="row">
              <div className="col-12">
                <div className="row pt-4">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3">
                    <div className="form-group inlineFormGroup d-flex flex-wrap">
                      <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                        <input type="radio" className="custom-control-input" id="posRgeneral" name="posRgeneralMembers"
                          checked={customerStatus === 'General'} onChange={() => this.setState({ customerStatus: 'General' })} />
                        <label className="custom-control-label" htmlFor="posRgeneral">{t('General')}</label>
                      </div>
                      <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                        <input type="radio" className="custom-control-input" id="posRmembers" name="posRgeneralMembers"
                          checked={customerStatus === 'Member'} onChange={() => this.setState({ customerStatus: 'Member' })} />
                        <label className="custom-control-label" htmlFor="posRmembers">{t('Member')}</label>
                      </div>
                    </div>
                  </div>
                  {customerStatus === 'Member' &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
                      <div className="form-group inlineFormGroup">
                        <Select
                          formatOptionLabel={formatOptionLabel}
                          className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                          value={member}
                          onChange={(e) => this.setState({ ...validator(e, 'member', 'select', [t('Select member')]) })}
                          isSearchable={true}
                          isClearable={true}
                          filterOption={this.customSearch}
                          styles={colourStyles}
                          options={this.props.activeStatusRegisterMember}
                          placeholder={t('Please Select')}
                        />
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{this.state.memberE}</small>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">{t('Branch')}</label>
                      <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        value={branch} onChange={(e) => this.selectBranch(e)}>
                        <option value="" hidden>{t('Please Select')}</option>
                        {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                          return (
                            <option key={i} value={branch._id}>{branch.branchName}</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.branchE}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pageHeadLine"></div>
              </div>
              <div className="col-12 p-0 d-flex flex-wrap">
                <div className="col-12 PointOfSalesStartCol mt-5">
                  <div className="row">
                    <div className="col-12 subHead px-4 d-flex flex-wrap justify-content-between">
                      <h5 className="font-weight-bold">{t('Item Details')}</h5>
                      <div className="form-group inlineFormGroup">
                        <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" value={search} onChange={(e) => this.handleSearch(e)} />
                        <span className="iconv1 iconv1-search searchBoxIcon"></span>
                      </div>
                    </div>
                    {this.props.activeStocks && this.props.activeStocks.map((stock, i) => {
                      const { image, itemName, isAdded, sellingPrice, offerDetails } = stock
                      return (
                        <div key={i} className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 pb-3 d-flex hahahahaha" onClick={() => this.addToCart(stock, i)}>
                          <div className={isAdded ? "h-100 w-100 d-flex flex-wrap bg-warning" : "h-100 w-100 d-flex flex-wrap bg-light"}>
                            {/* bg-warning */}
                            <div className="mxh-200px w-100 py-3 px-4 position-relative">
                              {/* If Offer */}
                              {offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()) &&
                                <div className="offered">
                                  <span className="semiCut-text pr-1 pl-3">OFFER</span>
                                </div>
                              }
                              {/* /- If Offer */}
                              <img alt='' src={`/${image.path}`} className=" w-100 h-100 objectFitContain" />
                            </div>
                            <div className="mt-auto w-100">
                              <div className="underline"></div>
                              <h6 className="text-center m-0 pb-2 pt-2 px-3"><small className={isAdded ? "text-white" : "text-body"}>{itemName}</small></h6>
                              {/* text-white */}
                              {(offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && setTime(offerDetails.offerDetails.endDate) >= setTime(new Date()))
                                ? <div className="d-flex flex-wrap align-items-center pb-3">
                                  <div className="offered2">
                                    <span className="semiCut-val2 mr-2 ml-1">{offerDetails.offerDetails.offerPercentage}%</span><span className="semiCut-text2 mr-3">off</span>
                                  </div>
                                  <span className="ml-3">{this.props.defaultCurrency} {(sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)).toFixed(3)}</span>
                                  <small className="ml-3 stripThhrough">{this.props.defaultCurrency} {sellingPrice.toFixed(3)}</small>
                                </div>
                                : <div className="d-flex flex-wrap align-items-center pb-3">
                                  <span className="ml-3">{this.props.defaultCurrency} {sellingPrice.toFixed(3)}</span>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div
                  // className={addedStocks.length > 0 ? "col-12 PointOfSalesEndCol bg-light" : "col-12 PointOfSalesEndCol bg-white"}
                  className="col-12 PointOfSalesEndCol bg-light"
                >
                  <div className="row">
                    <div className="col-12 subHead px-4 d-flex flex-wrap justify-content-end align-items-end h-75px pb-2">
                      <span><span className="iconv1 iconv1-cart mx-1"></span><span className="badge badge-pill badge-warning mx-1">{addedStocks.length}</span></span>
                    </div>
                    <div className="underline w-100"></div>

                    {/* looped */}
                    {addedStocks && addedStocks.map((addedStock, i) => {
                      const { itemName, image, addedQuantity, addedPrice } = addedStock
                      return (
                        <div key={i} className="col-12 d-flex flex-wrap justify-content-between align-items-center">
                          <img alt='' src={`/${image.path}`} className="w-100px h-100px objectFitCover rounded my-3 mx-1" style={{ flexBasis: '0' }} />
                          <div className="mx-1 d-flex flex-wrap justify-content-start align-items-center" style={{ flexBasis: '0' }}>
                            <h5 className="text-muted w-100 my-2 mx-1">{itemName}</h5>
                            <div className="d-flex justify-content-start align-items-center my-2">
                              <span className="bg-secondary mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white h-40px w-40px cursorPointer"
                                onClick={() => this.decrementValue(i)}>-</span>
                              <span className="bg-warning mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white h-40px w-40px">{addedQuantity}</span>
                              <span className="bg-secondary mx-1 rounded d-flex align-items-center justify-content-center font-weight-bold text-white h-40px w-40px cursorPointer"
                                onClick={() => this.incrementValue(i)}>+</span>
                            </div>
                          </div>
                          <div className="mx-1 py-3 d-flex align-items-center" style={{ flexBasis: '0' }}>
                            <h5 className="text-danger mx-1 my-0 font-weight-bold"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{addedPrice.toFixed(3)}</span></h5>
                            <span className="bg-secondary w-30px h-30px mx-2 text-white rounded-circle d-flex justify-content-center align-items-center cursorPointer"
                              onClick={() => this.removeFromCart(i)}><span className="iconv1 iconv1-delete"></span></span>
                          </div>
                          <div className="underline w-100"></div>
                        </div>
                      )
                    })}
                    {/* /- looped end */}

                    {/* {addedStocks.length > 0 && */}
                    <div className="col-12 mt-3 mt-sm-5 pt-md-5">
                      <div className="card px-2 bgGray w-100 border-light mt-lg-5">
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
                                  <h5 className="m-0">{t('Sub Total')}</h5>
                                </td>
                                <td>
                                  <h5 className="m-0"><small className="d-flex justify-content-end">{this.props.defaultCurrency} {subTotal.toFixed(3)}</small></h5>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <h5 className="m-0">{t('Discount')} {parseFloat(this.state.count) ? `(${this.state.count} ${this.state.discountMethod === 'percent' ? '%' : this.props.defaultCurrency})` : ''}</h5>
                                </td>
                                <td>
                                  <h5 className="m-0"><small className="d-flex justify-content-end">{parseFloat(discount).toFixed(3)}</small></h5>
                                </td>
                              </tr>
                              {customerStatus === 'Member' &&
                                <tr>
                                  <td>
                                    <h5 className="m-0">{t('Gift Card')} {this.state.text ? `(${this.state.text})` : ''}</h5>
                                  </td>
                                  <td>
                                    <h5 className="m-0"><small className="d-flex justify-content-end">{giftcard.toFixed(3)}</small></h5>
                                  </td>
                                </tr>
                              }
                              <tr>
                                <td>
                                  <h5 className="m-0">{t('Tax')}</h5>
                                </td>
                                <td>
                                  <h5 className="m-0"><small className="d-flex justify-content-end text-primary">{totalVat.toFixed(3)}</small></h5>
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
                                  <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold dirltrjcs"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{total.toFixed(3)}</span></h5>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* } */}

                    {/* {addedStocks.length > 0 && */}
                    <div className="col-12 pt-4 pb-3">
                      <div className="row">
                        <div className="col-12 col-sm-6 d-flex align-items-center">
                          <h5 className="my-2 font-weight-bold px-1">{t('Payment Method')}</h5>
                        </div>
                        <div className="col-12 col-sm-6 d-flex align-items-center justify-content-end">
                          <a href="/#" data-toggle="modal" data-target="#Discount"
                            className="d-flex flex-column align-items-center justify-content-center bg-danger w-75px h-75px m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                            <span className="iconv1 iconv1-discount"></span>
                            <span className="w-100 text-center"><small>{t('Discount')}</small></span>
                          </a>
                          {customerStatus === 'Member' &&
                            <a href="/#" data-toggle="modal" data-target="#GiftCard"
                              className="d-flex flex-column align-items-center justify-content-center bg-primary w-75px h-75px m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                              <span className="iconv1 iconv1-giftcard"></span>
                              <span className="w-100 text-center"><small>{t('Gift Card')}</small></span>
                            </a>
                          }
                        </div>
                      </div>
                    </div>
                    {/* } */}

                    {/* Popup Discount */}
                    <div className="modal fade commonYellowModal" id="Discount" >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title">{t('Add Order Discount')}</h4>
                            <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                          </div>
                          <div className="modal-body px-0">
                            <div className="container-fluid">
                              <div className="col-12 px-3 pt-3 d-flex">
                                <ul className="pagination">
                                  <li className={discountMethod === 'percent' ? "page-item active cursorPointer" : "page-item cursorPointer"}
                                    onClick={() => this.setState({ discountMethod: 'percent', count: 0 })}><span className="page-link">%</span></li>
                                  <li className={discountMethod === 'money' ? "page-item active cursorPointer" : "page-item cursorPointer"}
                                    onClick={() => this.setState({ discountMethod: 'money', count: 0 })}><span className="page-link">{this.props.defaultCurrency}</span></li>
                                </ul>
                                <span className="mx-1"></span>
                                <input type="number" autoComplete="off" className="form-control" placeholder={t('Enter discount')}
                                  value={count} onChange={(e) => this.setState(validator(e, 'count', 'numberText', []))} />
                              </div>
                              <div className="col-12 p-3">
                                <button type="button" className="btn btn-block btn-success btn-lg" data-dismiss="modal" onClick={() => this.addDiscount(subTotal)}>{t('Add Discount')}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /- Popup Discount End*/}

                    {/* Popup Gift Card */}
                    <div className="modal fade commonYellowModal" id="GiftCard" >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title">{t('Gift Card')}</h4>
                            <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                          </div>
                          <div className="modal-body px-0">
                            <div className="container-fluid">
                              <div className="col-12 p-3">
                                <input type="text" autoComplete="off" className="form-control h-50px" placeholder={t('Scan Gift Card or Enter Gift Card Number')}
                                  value={text} onChange={(e) => this.setState({ text: e.target.value })} />
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


                    {/* {addedStocks.length > 0 && */}
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div className="form-group inlineFormGroup">
                            <label htmlFor="addDigital" className="mx-sm-2 inlineFormLabel mb-1">{t('Digital')}</label>
                            <div className={this.state.digitalE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                              <label htmlFor="addDigital" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                              <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addDigital" value={digital} onChange={(e) => this.setDigital(e, total)} />
                            </div>
                            <div className="errorMessageWrapper">
                              <small className="text-danger mx-sm-2 errorMessage">{this.state.digitalE}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div className="form-group inlineFormGroup">
                            <label htmlFor="addCash" className="mx-sm-2 inlineFormLabel mb-1">{t('Cash')}</label>
                            <div className={this.state.cashE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                              <label htmlFor="addCash" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                              <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCash" value={cash} onChange={(e) => this.setCash(e, totalLeftAfterDigital)} />
                            </div>
                            <div className="errorMessageWrapper">
                              <small className="text-danger mx-sm-2 errorMessage">{this.state.cashE}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div className="form-group inlineFormGroup">
                            <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                            <div className={this.state.cardE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                              <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                              <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} />
                            </div>
                            <div className="errorMessageWrapper">
                              <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="px-sm-1 pt-4 pb-5">
                            <button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.handleSubmit()}>{t('SUBMIT')}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* } */}

                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* <AddStock /> */}

        </div>
      </div>
    )
  }
}

function mapStateToProps({ pos: { activeStocks }, currency: { defaultCurrency }, member: { activeStatusRegisterMember },
  reward: { amountByRedeemCode }, branch: { activeResponse }
}) {
  return {
    activeStocks,
    defaultCurrency,
    activeStatusRegisterMember,
    amountByRedeemCode,
    activeResponse
  }
}

export default withTranslation()(connect(mapStateToProps)(PointOfSales))