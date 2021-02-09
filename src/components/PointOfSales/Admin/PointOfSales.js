import $ from 'jquery';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import Select from "react-select";
import { getAllBranch } from '../../../actions/branch.action';
import { getActiveStatusRegisterMembers } from '../../../actions/member.action';
import { addStockSell, getAllStocks } from '../../../actions/pos.action';
import { verifyAdminPassword } from '../../../actions/privilege.action';
import { getAmountByRedeemCode } from '../../../actions/reward.action';
import { GET_ACTIVE_STOCK, GET_ALERT_ERROR } from '../../../actions/types';
import instaimg from '../../../assets/img/insta.jpg'
import { dateToDDMMYYYY, dateToHHMM, setTime, validator } from '../../../utils/apis/helpers';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

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
      cardNumber: '',
      cardNumberE: '',
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
      branchE: '',
      posReceipt: null,
      password: '',
      passwordE: '',
      showPass: false,
      branches: [],
      staffName: '',
      showCheque: false,
      bankName: '',
      chequeNumber: '',
      chequeDate: '',
      cheque: 0,
      bankNameE: '',
      chequeNumberE: '',
      chequeDateE: '',
      chequeE: ''
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
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        if (this.props.errors.response && this.props.errors.response.displayReceipt) {
          let posReceipt = this.props.errors.response._doc
          this.setState({ ...{ posReceipt } }, () => {
            const el = findDOMNode(this.refs.receiptOpenModal);
            $(el).click();
          })
        } else {
          this.setState({ ...this.default, ...{ addedStocks: [], customerStatus: 'Member' } })
        }
      }
    }
    if (((this.props.verifyPassword && this.props.verifyPassword) !== (prevProps.verifyPassword)) && this.props.verifyPassword === 'verified') {
      const el = findDOMNode(this.refs.openDiscount);
      $(el).click();
    }
  }

  componentDidMount() {
    const branches = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch
    const staffName = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    this.setState({ branches, staffName })
  }

  handlePrint() {
    var w = window.open('', 'new div', 'height=400,width=600');
    var printOne = $('#newPrint').html();
    w.document.body.innerHTML = printOne
    w.window.print();
    w.document.close();
    this.setState({ ...this.default, ...{ addedStocks: [], customerStatus: 'Member' } })
    return false;
  }

  handleReceiptClose() {
    this.setState({ ...this.default, ...{ addedStocks: [], customerStatus: 'Member' } })
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
      this.setState({ addedStocks, cash: 0, card: 0, digital: 0, cheque: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
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
      this.setState({ addedStocks: this.state.addedStocks, cash: 0, card: 0, digital: 0, cheque: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
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
      this.setState({ addedStocks: this.state.addedStocks, cash: 0, card: 0, digital: 0, cheque: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
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
      this.setState({ addedStocks: this.state.addedStocks, cash: 0, card: 0, digital: 0, cheque: 0, giftcard: 0, discount: 0, count: 0, redeemCode: '', text: '' }, () => {
        this.props.dispatch(getAmountByRedeemCode({ code: this.state.text }))
      })
    } else {
      this.props.dispatch({ type: 'GET_ALERT_ERROR', payload: t('You have added the max qty') })
    }
  }

  setDigital(e, total) {
    const { t } = this.props
    this.setState({ ...validator(e, 'digital', 'numberText', [t('Enter amount')]), ...{ card: 0, cheque: 0, cardE: '', chequeE: '' } }, () => {
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
    this.setState({ ...validator(e, 'cash', 'numberText', [t('Enter amount'), t('Enter valid amount')]), ...{ cheque: 0, chequeE: '' } }, () => {
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

  setCard(e, total) {
    const { t } = this.props
    if (this.state.showCheque) {
      this.setState(validator(e, 'card', 'numberText', [t('Enter amount'), t('Enter valid amount')]), () => {
        if (this.state.card <= total.toFixed(3) && this.state.card >= 0) {
          const cheque = (total.toFixed(3) - this.state.card).toFixed(3)
          this.setState({
            cheque,
            chequeE: ''
          })
        } else {
          this.setState({
            chequeE: t('Enter valid amount'),
            cheque: 0
          })
        }
      })
    }
  }

  setCardNumber(e) {
    const { t } = this.props
    if (e.target.value.length <= 4) {
      this.setState(validator(e, 'cardNumber', 'number', [t('Enter card number'), t('Enter valid card number')]))
    }
  }

  setCheque(totalAmount) {
    this.setState({ showCheque: !this.state.showCheque }, () => {
      if (this.state.showCheque) {
        this.setState({ cash: 0, card: 0, digital: 0, cheque: totalAmount, cashE: '', cardE: '', digitalE: '' })
      } else {
        this.setState({ cash: 0, card: 0, digital: 0, cheque: 0, cashE: '', cardE: '', digitalE: '' })
      }
    })
  }

  verifyPassword() {
    const { password } = this.state
    const { t } = this.props
    if (password) {
      const postData = {
        password: password
      }
      this.props.dispatch({ type: 'VERIFY_ADMIN_PASSWORD', payload: 'null' })
      this.props.dispatch(verifyAdminPassword(postData))
    } else {
      if (!password) this.setState({ passwordE: t('Enter password') })
    }
  }

  addDiscount(subTotal) {
    if (this.state.discountMethod === 'percent') {
      if (this.state.count && this.state.count <= 100) {
        this.setState({ discount: (parseFloat(this.state.count ? this.state.count : 0) / 100 * subTotal).toFixed(3), cash: 0, card: 0, digital: 0, cheque: 0 })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0 })
      }
    } else {
      if (this.state.count && this.state.count <= subTotal) {
        this.setState({ discount: parseFloat(this.state.count ? this.state.count : 0), cash: 0, card: 0, digital: 0, cheque: 0 })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0 })
      }
    }
  }

  addGiftcard(subTotalGiftCard) {
    if (this.state.member) {
      subTotalGiftCard && this.setState({ subTotalGiftCard, cash: 0, card: 0, digital: 0, cheque: 0 }, () => {
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
    const { cash, card, digital, addedStocks, customerStatus, member, discount, giftcard, memberTransactionId, branch, cashE, cardE, digitalE, cardNumber, cheque } = this.state
    if (customerStatus === 'Member') {
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
      let total = actualAmount - discount - giftcard + totalVat
      if ((parseInt(total) === parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) && addedStocks.length > 0 && member && branch && !cardE && !cashE && !digitalE) {
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
          totalAmount: total,
          cashAmount: cash ? cash : 0,
          cardAmount: card ? card : 0,
          digitalAmount: digital ? digital : 0,
          cardNumber,
          memberTransactionId
        }
        this.props.dispatch(addStockSell(stockSellsInfo))
        this.props.activeStocks.forEach(stock => stock.isAdded = false)
      } else {
        if ((parseInt(total) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0)))) this.setState({ cashE: t('Enter amount') })
        if (!member) this.setState({ memberE: t('Select member') })
        if (!branch) this.setState({ branchE: t('Select branch') })
      }
    } else {
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
      let total = actualAmount - discount + totalVat
      if ((parseInt(total) === parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) && addedStocks.length > 0 && branch && !cardE && !cashE && !digitalE) {
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
          totalAmount: total,
          cashAmount: cash ? cash : 0,
          cardAmount: card ? card : 0,
          digitalAmount: digital ? digital : 0,
          cardNumber,
          paymentType: 'POS'
        }
        this.props.dispatch(addStockSell(stockSellsInfo))
        this.props.activeStocks.forEach(stock => stock.isAdded = false)
      } else {
        if ((parseInt(total) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0)))) this.setState({ cashE: t('Enter amount') })
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

    const { customerStatus, member, search, addedStocks, discount, giftcard, discountMethod, count, text, cash, card, branch, digital, posReceipt, branches, staffName } = this.state

    let filteredBranches = []
    if (staffName) {
      filteredBranches = branches
    } else {
      filteredBranches = this.props.activeResponse
    }

    let avatarPath = filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
      filteredBranches.filter(b => b._id === branch)[0].avatar && filteredBranches.filter(b => b._id === branch)[0].avatar.path

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
    let totalLeftAfterCash = total - digital - cash

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
                  {/* instead of above col use below col */}
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                    <div className="form-group inlineFormGroup d-flex flex-wrap justify-content-start">
                      {/* Normal */}
                      <button type="button" className={customerStatus === 'General' ? "btn btn-warning btn-orange mr-4 px-3 active text-white" : "btn btn-warning btn-orange mr-4 px-3 text-white"}
                        onClick={() => this.setState({ customerStatus: 'General', member: '' })}
                      >{t('General')}</button>
                      <button type="button" className={customerStatus === 'Member' ? "btn btn-success px-3 active" : "btn btn-success px-3"}
                        onClick={() => this.setState({ customerStatus: 'Member', member: '' })}
                      >{t('Member')}</button>
                    </div>
                  </div>
                  {customerStatus === 'Member' &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
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
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 d-flex flex-wrap justify-content-end align-items-start align-content-start">
                    <span className="position-relative mw-100 mx-sm-2">
                      <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.selectBranch(e)}>
                        <option value="" hidden>{t('Please Select')}</option>
                        {filteredBranches && filteredBranches.map((branch, i) => {
                          return (
                            <option key={i} value={branch._id}>{branch.branchName}</option>
                          )
                        })}
                      </select>
                      <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3" style={{ top: '0', left: '0' }}>
                        <span className="iconv1 iconv1-fill-navigation"></span>
                        <span className="iconv1 iconv1-arrow-down"></span>
                      </span>
                    </span>
                    <div className="d-flex justify-content-end w-100 mw-100 mb-4 position-relative">
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.branchE}</small>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">{t('Branch')}</label>
                      <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        value={branch} onChange={(e) => this.selectBranch(e)}>
                        <option value="" hidden>{t('Please Select')}</option>
                        {filteredBranches && filteredBranches.map((branch, i) => {
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
                  </div> */}
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
                    <div className="col-12 mt-3">
                      <div className="card px-2 bgGray w-100 border-light">
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
                                  <h5 className="m-0 text-left">{t('Sub Total')}</h5>
                                </td>
                                <td>
                                  <h5 className="m-0 text-right"><small className="d-flex justify-content-end">{this.props.defaultCurrency} {subTotal.toFixed(3)}</small></h5>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <h5 className="m-0 text-left">{t('Discount')} {parseFloat(this.state.count) ? `(${this.state.count} ${this.state.discountMethod === 'percent' ? '%' : this.props.defaultCurrency})` : ''}</h5>
                                </td>
                                <td>
                                  <h5 className="m-0 text-right"><small className="d-flex justify-content-end">{parseFloat(discount).toFixed(3)}</small></h5>
                                </td>
                              </tr>
                              {/* {customerStatus === 'Member' &&
                              <tr>
                                  <td>
                                    <h5 className="m-0 text-left">{t('Gift Card')} {this.state.text ? `(${this.state.text})` : ''}</h5>
                                  </td>
                                  <td>
                                    <h5 className="m-0 text-right"><small className="d-flex justify-content-end">{giftcard.toFixed(3)}</small></h5>
                                  </td>
                                </tr>
                              } */}
                              <tr>
                                <td>
                                  <h5 className="m-0 text-left">{t('VAT')}</h5>
                                </td>
                                <td>
                                  <h5 className="m-0 text-right"><small className="d-flex justify-content-end text-primary">{totalVat.toFixed(3)}</small></h5>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2">
                                  <div className="bg-secondary border-top w-100 border-secondary"></div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <h3 className="m-0 text-left">{t('Total')}</h3>
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
                          <a href="/#" data-toggle="modal" data-target="#passwordAskModal"
                            className="d-flex flex-column align-items-center justify-content-center bg-danger discount-class m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                            <h3><span className="iconv1 iconv1-discount m-0 text-white"></span></h3>
                            <span className="w-100 text-center text-white">{t('Discount')}</span>
                          </a>
                          {/* {customerStatus === 'Member' &&
                            <a href="/#" data-toggle="modal" data-target="#GiftCard"
                              className="d-flex flex-column align-items-center justify-content-center bg-primary w-75px h-75px m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                              <span className="iconv1 iconv1-giftcard"></span>
                              <span className="w-100 text-center"><small>{t('Gift Card')}</small></span>
                            </a>
                          } */}
                        </div>
                      </div>
                    </div>
                    {/* } */}

                    {/* Popup Discount */}
                    <button type="button" id="Discount2" className="d-none" data-toggle="modal" data-target="#Discount" ref="openDiscount">Open modal</button>
                    <div className="modal fade commonYellowModal" id="Discount">
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
                          <div className="form-group inlineFormGroup mb-3">
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
                          <div className="form-group inlineFormGroup mb-3">
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
                          <div className="form-group inlineFormGroup mb-3">
                            <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                            <div className={this.state.cardE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                              <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                              <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} onChange={(e) => this.setCard(e, totalLeftAfterCash)} />
                            </div>
                            <div className="errorMessageWrapper">
                              <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                            </div>
                          </div>
                        </div>
                        {parseFloat(card) ?
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                            <div className="form-group inlineFormGroup mb-3">
                              <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                              <input type="text" autoComplete="off" className={this.state.cardNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError bg-white" : "form-control mx-sm-2 inlineFormInputs bg-white"} id="addCard4lastno"
                                value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)}
                              />
                            </div>
                          </div>
                          : null
                        }
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                          <div className="form-group inlineFormGroup">
                            <label className="mx-sm-2 inlineFormLabel mb-1"></label>
                            <div className="d-flex">
                              <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                <input type="checkbox" className="custom-control-input" id="check" name="checkorNo"
                                  checked={this.state.showCheque} onChange={() => this.setCheque(total)}
                                />
                                <label className="custom-control-label" htmlFor="check">{t('Cheque')}</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* if cheque */}
                        {this.state.showCheque &&
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="bankName" className="mx-sm-2 inlineFormLabel mb-1">{t('Bank Name')}</label>
                                  <input type="text" autoComplete="off" className={this.state.bankNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 py-0 px-2 d-flex align-items-center bg-white dirltr"}
                                    id="bankName"
                                    value={this.state.bankName} onChange={(e) => this.setState({ bankName: e.target.value })}
                                  />
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage"></small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="CheckNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Number')}</label>
                                  <input type="text" autoComplete="off" className={this.state.chequeNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 py-0 px-2 d-flex align-items-center bg-white dirltr"}
                                    id="CheckNumber"
                                    value={this.state.chequeNumber} onChange={(e) => this.setState({ chequeNumber: e.target.value })}
                                  />
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage"></small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="CheckDate" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Date')}</label>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                      InputProps={{
                                        disableUnderline: true,
                                      }}
                                      autoOk
                                      invalidDateMessage=''
                                      minDateMessage=''
                                      className={this.state.chequeDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}
                                      minDate={new Date()}
                                      format="dd/MM/yyyy"
                                      value={this.state.chequeDate}
                                      onChange={(e) => this.setState(validator(e, 'chequeDate', 'date', []))}
                                    />
                                  </MuiPickersUtilsProvider>
                                  <span className="icon-date dateBoxIcon"></span>
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage"></small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="ChequeAmount" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Amount')}</label>
                                  {/* here currency comes , so change errorclass for div below */}
                                  <div className={this.state.chequeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                                    <label htmlFor="ChequeAmount" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                                    <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="ChequeAmount" value={this.state.cheque} />
                                  </div>
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage"></small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                        {/* if cheque over */}
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
        {/* --------------Receipt Modal-=--------------- */}
        <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#ReceiptModal" data-backdrop="static" data-keyboard="false" ref="receiptOpenModal">Receipt</button>
        {posReceipt &&
          <div className="modal fade commonYellowModal" id="ReceiptModal">
            <div className="modal-dialog modal-lg" id="ReceiptModal2">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Receipt</h4>
                  <button type="button" className="close" data-dismiss="modal" ref="receiptCloseModal" onClick={() => this.handleReceiptClose()}><span className="iconv1 iconv1-close"></span></button>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="text-center my-3">
                      <img alt='' src={`/${avatarPath}`} className="" width="100" />
                    </div>
                    <h4 class="border-bottom border-dark text-center font-weight-bold pb-1">Tax Invoice</h4>
                    <div className="row px-5 justify-content-between">
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">VAT Reg Number</label>
                          <p className="">{filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                            filteredBranches.filter(b => b._id === branch)[0].vatRegNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">Address</label>
                          <p className="whiteSpaceNormal mnw-150px mxw-200px">{filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                            filteredBranches.filter(b => b._id === branch)[0].address}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">Tax Invoice No</label>
                          <p className="">{posReceipt.orderNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">Date & Time</label>
                          <p className="dirltrtar">{dateToDDMMYYYY(posReceipt.dateOfPurchase)} {dateToHHMM(posReceipt.created_at)}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="">
                          <label className="m-0 font-weight-bold">Receipt Total</label>
                          <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(posReceipt.totalAmount).toFixed(3)}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">Telephone</label>
                          <p className="">{filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                            filteredBranches.filter(b => b._id === branch)[0].telephone}</p>
                        </div>
                      </div>
                    </div>
                    {member &&
                      <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">ID:</span>
                            <span className="px-1">{member.memberId}</span>
                          </h6>
                        </div>
                        <h6 className="font-weight-bold m-1">{member.credentialId.userName}</h6>
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">Mob:</span>
                            <span className="px-1">{member.mobileNo}</span>
                          </h6>
                        </div>
                      </div>
                    }
                    <div className="table-responsive RETable">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedStocks && addedStocks.map((addedStock, i) => {
                            const { itemName, addedQuantity, addedPrice } = addedStock
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{itemName}</td>
                                <td>{this.props.defaultCurrency} {(parseFloat(addedPrice) / addedQuantity).toFixed(3)}</td>
                                <td>{addedQuantity}</td>
                                <td>{this.props.defaultCurrency} {parseFloat(addedPrice).toFixed(3)}</td>
                              </tr>
                            )
                          })}
                          <tr>
                            <td colSpan="4">
                              <div className="text-right my-1">Amount Total :</div>
                              {parseFloat(posReceipt.discount) ?
                                <div className="text-right my-1">Discount :</div>
                                : <div></div>}
                              {parseFloat(posReceipt.giftcard) ?
                                <div className="text-right my-1">Gift Card :</div>
                                : <div></div>}
                              {parseFloat(posReceipt.vatAmount) ?
                                <div className="text-right my-1">VAT:</div>
                                : <div></div>}
                              {parseFloat(posReceipt.digitalAmount) ?
                                <div className="text-right my-1">Digital :</div>
                                : <div></div>}
                              {parseFloat(posReceipt.cashAmount) ?
                                <div className="text-right my-1">Cash :</div>
                                : <div></div>}
                              {parseFloat(posReceipt.cardAmount) ?
                                <div className="text-right my-1">Card :</div>
                                : <div></div>}
                              <div className="text-right my-1">Grand Total :</div>
                              <div className="text-right my-1">Paid Amount :</div>
                              {posReceipt.cardNumber ?
                                <div className="text-right my-1">Card last four digit :</div>
                                : <div></div>}
                            </td>
                            <td className="">
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.actualAmount).toFixed(3)}</span></div>
                              {parseFloat(posReceipt.discount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.discount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(posReceipt.giftcard) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.giftcard).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(posReceipt.vatAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.vatAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(posReceipt.digitalAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.digitalAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(posReceipt.cashAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.cashAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(posReceipt.cardAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.cardAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.totalAmount).toFixed(3)}</span></div>
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(posReceipt.totalAmount).toFixed(3)}</span></div>
                              {posReceipt.cardNumber ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{posReceipt.cardNumber}</span></div>
                                : <div></div>}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* {posReceipt.cardNumber ?
                        <div className="my-1"><span className="px-1">Card last four digit {posReceipt.cardNumber}</span></div>
                        : <div></div>} */}
                    </div>
                    {/* <div className="d-flex justify-content-center">
                      <QRCode value={`http://instagram.com/${filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                        filteredBranches.filter(b => b._id === branch)[0].instaId}/`} renderAs='svg' />
                    </div> */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center my-4">
                      <div className="d-flex">
                        <div className="mr-3 text-center">
                          <img src={instaimg} alt="" className="w-30px" />
                          <h6 className="font-weight-bold mb-0 mt-1">Follow Us</h6>
                        </div>
                        <div className="w-50px mr-3">
                          <QRCode value={`http://instagram.com/${filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                            filteredBranches.filter(b => b._id === branch)[0].instaId}/`} renderAs='svg' width="50" height="50" />
                        </div>
                      </div>
                      {/* <h6 className="font-weight-bold">Paid Amount: {this.props.defaultCurrency} {parseFloat(posReceipt.totalAmount).toFixed(3)}</h6> */}
                      {this.props.loggedUser && <h6 className="font-weight-bold">Served by: {this.props.loggedUser.userName}</h6>}
                    </div>
                    {/* <div className="text-center px-5">
                      <h5 className="text-muted">Membership cannot be refunded or transferred to others.</h5>
                      <h5 className="font-weight-bold">Thank You</h5>
                    </div> */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <h6 className="font-weight-bold" >Membership cannot be refunded or transferred to others.</h6>
                        <h6 className="font-weight-bold">Thank You</h6>
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="button" className="btn btn-success px-4 py-1 my-2" data-dismiss="modal" onClick={() => this.handlePrint()}>Print Receipt</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {/* --------------Receipt Modal Ends-=--------------- */}

        {posReceipt &&
          <div className="PageBillWrapper d-none">
            <div style={{ width: "450px", padding: "15px", margin: "auto" }} id="newPrint">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={`/${avatarPath}`} width="200" style={{ width: "100px" }} alt="" />
              </div>
              <h5 style={{ textAlign: "center", margin: "19px 0" }}>Tax Invoice</h5>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>
                <span>{filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                  filteredBranches.filter(b => b._id === branch)[0].branchName}</span><br />
                <span>{filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                  filteredBranches.filter(b => b._id === branch)[0].address}</span><br />
                {/* <span>Road/Street 50, Samaheej,</span><br /> */}
                {/* <span>Block 236, Bahrain,</span><br /> */}
                <span>Tel : {filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                  filteredBranches.filter(b => b._id === branch)[0].telephone}</span><br />
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>VAT - {filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                filteredBranches.filter(b => b._id === branch)[0].vatRegNo}</p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0" }}>
                <span style={{ padding: "2px", fontSize: "14px" }}>{dateToDDMMYYYY(posReceipt.dateOfPurchase)} {dateToHHMM(posReceipt.created_at)}</span>
                <span style={{ padding: "2px", fontSize: "14px" }}>Bill No:{posReceipt.orderNo}</span>
              </p>
              {member &&
                <div>
                  <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between" }}>
                    <span>ID: <span style={{ padding: "10px" }}>{member.memberId}</span></span>
                    <span>Mob: <span style={{ padding: "10px" }}>{member.mobileNo}</span></span>
                  </p>
                  <p style={{ display: "flex", textAlign: "center", justifyContent: "center", marginTop: "0" }}>
                    <span>{member.credentialId.userName}</span>
                  </p>
                </div>
              }
              {/* <p style={{ textAlign: "right", margin: "0 0 10px 0" }}>66988964</p> */}
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr style={{ borderTop: "1px dashed #000" }}>
                    <td>No.</td>
                    <td>DESCRIPTION</td>
                    <td>PRICE</td>
                    <td>QTY</td>
                    <td>TOTAL</td>
                  </tr>
                  {/* <tr style={{ borderTop: "1px dashed #000" }}>
                  <td>1</td>
                  <td>3 Month</td>
                  <td>26-Dec-19</td>
                  <td>13-Sep-20</td>
                </tr> */}
                  {addedStocks && addedStocks.map((addedStock, i) => {
                    const { itemName, addedQuantity, addedPrice } = addedStock
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{itemName}</td>
                        <td>{this.props.defaultCurrency} {(parseFloat(addedPrice) / addedQuantity).toFixed(3)}</td>
                        <td>{addedQuantity}</td>
                        <td>{this.props.defaultCurrency} {parseFloat(addedPrice).toFixed(3)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <table style={{ width: "100%", textAlign: "right", borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>Amount Total {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(posReceipt.actualAmount).toFixed(3)}</td>
                  </tr>
                  {parseFloat(posReceipt.discount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Discount {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(posReceipt.discount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(posReceipt.giftcard) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Giftcard {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(posReceipt.giftcard).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(posReceipt.vatAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>VAT {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(posReceipt.vatAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(posReceipt.digitalAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Digital {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(posReceipt.digitalAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(posReceipt.cashAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Cash {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(posReceipt.cashAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(posReceipt.cardAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Card {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(posReceipt.cardAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Grand Total {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(posReceipt.totalAmount).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Paid Amount {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(posReceipt.totalAmount).toFixed(3)}</td>
                  </tr>
                  {posReceipt.cardNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Card last four digit :</td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{posReceipt.cardNumber}</td>
                    </tr>
                    : <tr></tr>}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ marginRight: "10px", justifyContent: "center" }}>
                    <img src={instaimg} alt="" style={{ width: "30px", height: "30px" }} />
                    {/* <h6>Follow Us</h6> */}
                  </div>
                  <QRCode value={`http://instagram.com/${filteredBranches && filteredBranches.filter(b => b._id === branch)[0] &&
                    filteredBranches.filter(b => b._id === branch)[0].instaId}/`} renderAs='svg' width="50" height="50" />
                </div>
                {this.props.loggedUser && <span>Served by: {this.props.loggedUser.userName}</span>}
              </div>
              <p style={{ display: "flex", margin: "0 0 10px 0" }}>
                <span>NB:</span>
                <span style={{ flexGrow: "1", textAlign: "center" }}>Membership cannot be refunded or transferred to others.</span>
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>Thank You</p>
            </div>
          </div>
        }

        <div className="modal fade commonYellowModal" id="passwordAskModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Password')}</h4>
                <button type="button" className="close" data-dismiss="modal" ref="passwordModalClose">
                  <span className="iconv1 iconv1-close"></span>
                </button>
              </div>
              <div className="modal-body px-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group position-relative fle">
                        <label htmlFor="password" className="m-0 text-secondary mx-sm-2">{t('Password')}</label>
                        <input type={this.state.showPass ? "text" : "password"} className={this.state.passwordE ? "form-control inlineFormInputs w-100 mx-sm-2 FormInputsError" : "form-control inlineFormInputs w-100 mx-sm-2"} id="password"
                          value={this.state.password} onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))}
                        />
                        <span className={this.state.showPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showPass: !this.state.showPass })}></span>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{this.state.passwordE}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 pt-3">
                      <div className="justify-content-sm-end d-flex pt-4 pb-2">
                        <button type="button" className="btn btn-success mx-1 px-4" data-dismiss="modal" onClick={() => this.verifyPassword()}>{t('Submit')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ pos: { activeStocks }, currency: { defaultCurrency }, member: { activeStatusRegisterMember },
  reward: { amountByRedeemCode }, branch: { activeResponse }, errors, auth: { loggedUser }, privilege: { verifyPassword }
}) {
  return {
    activeStocks,
    defaultCurrency,
    activeStatusRegisterMember,
    amountByRedeemCode,
    activeResponse,
    errors,
    loggedUser,
    verifyPassword
  }
}

export default withTranslation()(connect(mapStateToProps)(PointOfSales))