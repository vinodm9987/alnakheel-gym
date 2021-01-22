import $ from 'jquery'
import QRCode from 'qrcode.react'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getAllBranch } from '../../../actions/branch.action'
import { getAllClassesByBranch, purchaseClassByAdmin } from '../../../actions/classes.action'
// import { disableSubmit } from '../../../utils/disableButton'
import { getAllActiveMember } from '../../../actions/member.action'
import { verifyAdminPassword } from '../../../actions/privilege.action'
import { getAmountByRedeemCode } from '../../../actions/reward.action'
import { GET_ALERT_ERROR } from '../../../actions/types'
import instaimg from '../../../assets/img/insta.svg.webp'
import { dateToDDMMYYYY, dateToHHMM, scrollToTop, validator } from '../../../utils/apis/helpers'

class BookAClass extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      branch: '',
      branchE: '',
      classes: '',
      classesE: '',
      member: '',
      memberE: '',
      amount: 0,
      card: 0,
      cardE: '',
      cash: 0,
      cashE: '',
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
      taxPercent: '',
      classReceipt: '',
      password: '',
      passwordE: '',
      showPass: false,
    }
    if (this.props.location.addClassProps) {
      const { branch } = this.props.location.addClassProps
      this.default = {
        branch: branch._id,
        branchE: '',
        classes: '',
        classesE: '',
        member: this.props.location.addClassProps,
        memberE: '',
        amount: 0,
        card: 0,
        cardE: '',
        cash: 0,
        cashE: '',
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
        taxPercent: '',
        classReceipt: '',
        password: '',
        passwordE: '',
        showPass: false,
      }
      scrollToTop()
    } else if (this.props.location.classesProps) {
      this.default = {
        branch: this.props.location.classesProps.branch._id,
        classes: this.props.location.classesProps._id,
        amount: this.props.location.classesProps.amount,
        tax: this.props.location.classesProps.amount * this.props.location.classesProps.vat.taxPercent / 100,
        taxPercent: this.props.location.classesProps.vat.taxPercent,
        branchE: '',
        classesE: '',
        member: '',
        memberE: '',
        card: 0,
        cardE: '',
        cash: 0,
        cashE: '',
        digital: 0,
        digitalE: '',
        cardNumber: '',
        cardNumberE: '',
        subTotalGiftCard: 0,
        redeemCode: '',
        discount: 0,
        giftcard: 0,
        count: 0,
        discountMethod: 'percent',
        giftCard: '',
        text: '',
        memberTransactionId: '',
        classReceipt: '',
        password: '',
        passwordE: '',
        showPass: false,
      }
      scrollToTop()
    } else {
      this.default = {
        branch: '',
        branchE: '',
        classes: '',
        classesE: '',
        member: '',
        memberE: '',
        amount: 0,
        card: 0,
        cardE: '',
        cash: 0,
        cashE: '',
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
        taxPercent: '',
        classReceipt: '',
        password: '',
        passwordE: '',
        showPass: false,
      }
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.state.branch && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch }))
    this.state.branch && this.props.dispatch(getAllActiveMember({ branch: this.state.branch }))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        if (this.props.errors.response && this.props.errors.response.displayReceipt) {
          let classReceipt = this.props.errors.response._doc
          this.setState({ ...{ classReceipt } }, () => {
            const el = findDOMNode(this.refs.receiptOpenModal);
            $(el).click();
          })
        } else {
          this.setState(this.defaultCancel)
        }
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.defaultCancel)
    }
    if (this.props.amountByRedeemCode && this.props.amountByRedeemCode.redeemCode !== (prevProps.amountByRedeemCode && prevProps.amountByRedeemCode.redeemCode)) {
      if (prevState.subTotalGiftCard >= this.props.amountByRedeemCode.giftCard.amount) {
        this.setState({
          giftcard: this.props.amountByRedeemCode.giftCard.amount,
          redeemCode: this.props.amountByRedeemCode.redeemCode,
          memberTransactionId: this.props.amountByRedeemCode._id
        }, () => {
          const tax = (this.state.amount - this.state.discount - this.state.giftCard) * parseFloat(this.state.taxPercent) / 100
          this.setState({ tax })
        })
      } else {
        this.props.dispatch({ type: GET_ALERT_ERROR, payload: 'Sorry gift card is not valid on this transaction' })
      }
    }
    if (((this.props.verifyPassword && this.props.verifyPassword) !== (prevProps.verifyPassword)) && this.props.verifyPassword === 'verified') {
      const el = findDOMNode(this.refs.openDiscount);
      $(el).click();
    }
  }

  handlePrint() {
    var w = window.open('', 'new div', 'height=400,width=600');
    var printOne = $('#ReceiptModal2').html();
    w.document.write('<html><head><title></title>');
    w.document.write('<link rel="stylesheet" href="css/style.css" type="text/css" />');
    w.document.write('<link rel="stylesheet" href="css/style2.css" type="text/css" />');
    w.document.write('<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" />');
    w.document.write('<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" />');
    w.document.write('</head><body >');
    w.document.write(printOne)
    w.document.write('</body></html>');
    w.window.print();
    w.document.close();
    this.setState(this.defaultCancel)
    return false;
  }

  handleReceiptClose() {
    this.setState(this.defaultCancel)
  }

  selectBranch(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'branch', 'text', [t('Enter branch')]), ...{ classes: '', amount: 0, cash: 0, card: 0, digital: 0, giftcard: 0, discount: 0, count: 0, member: '', tax: 0, taxPercent: '' } }, () => {
      this.state.branch && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch }))
      this.state.branch && this.props.dispatch(getAllActiveMember({ branch: this.state.branch }))
    })
  }

  selectClasses(e) {
    const { t } = this.props
    const index = e.nativeEvent.target.selectedIndex
    this.setState(validator(e, 'classes', 'text', [t('Select class')]), () => {
      if (index > 0) {
        this.state.classes && this.setState({
          amount: this.props.classesByBranch[index - 1].amount, cash: 0, card: 0, digital: 0, giftcard: 0, discount: 0, count: 0,
          tax: this.props.classesByBranch[index - 1].amount * this.props.classesByBranch[index - 1].vat.taxPercent / 100,
          taxPercent: this.props.classesByBranch[index - 1].vat.taxPercent
        })
      }
    })
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

  setCardNumber(e) {
    const { t } = this.props
    if (e.target.value.length <= 4) {
      this.setState(validator(e, 'cardNumber', 'number', [t('Enter card number'), t('Enter valid card number')]))
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

  handleSubmit(total) {
    const { t } = this.props
    const { branch, classes, member, amount, cash, card, cardE, discount, tax, giftcard, cardNumber, memberTransactionId, cashE, digital, digitalE } = this.state
    if (branch && classes && member && amount && (parseInt(total) === parseInt((+cash || 0) + (+card || 0) + (+digital || 0))) && !cardE && !cashE && !digitalE) {
      const bookClassInfo = {
        member: member._id,
        classId: classes,
        amount,
        totalAmount: total,
        discount,
        tax,
        giftcard,
        cashAmount: cash ? cash : 0,
        cardAmount: card ? card : 0,
        digitalAmount: digital ? digital : 0,
        cardNumber,
        memberTransactionId,
        userId: this.props.loggedUser ? this.props.loggedUser._id : ''
      }
      this.props.dispatch(purchaseClassByAdmin(bookClassInfo))
    } else {
      if (!branch) this.setState({ branchE: t('Enter branch name') })
      if (!member) this.setState({ memberE: t('Select member') })
      if (!classes) this.setState({ classesE: t('Select class') })
      if (parseInt(total) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0))) this.setState({ cashE: t('Enter amount') })
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
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
    if (subTotal) {
      if (this.state.discountMethod === 'percent') {
        if (this.state.count && this.state.count <= 100) {
          this.setState({ discount: parseFloat(this.state.count ? this.state.count : 0) / 100 * subTotal, cash: 0, card: 0, digital: 0 }, () => {
            const tax = (subTotal - this.state.discount - this.state.giftCard) * parseFloat(this.state.taxPercent) / 100
            this.setState({ tax })
          })
        } else {
          this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0 }, () => {
            const tax = (subTotal - this.state.discount - this.state.giftCard) * parseFloat(this.state.taxPercent) / 100
            this.setState({ tax })
          })
        }
      } else {
        if (this.state.count && this.state.count <= subTotal) {
          this.setState({ discount: parseFloat(this.state.count ? this.state.count : 0), cash: 0, card: 0, digital: 0 }, () => {
            const tax = (subTotal - this.state.discount - this.state.giftCard) * parseFloat(this.state.taxPercent) / 100
            this.setState({ tax })
          })
        } else {
          this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0 }, () => {
            const tax = (subTotal - this.state.discount - this.state.giftCard) * parseFloat(this.state.taxPercent) / 100
            this.setState({ tax })
          })
        }
      }
    }
  }

  addGiftcard(subTotalGiftCard) {
    if (this.state.member) {
      subTotalGiftCard && this.setState({ subTotalGiftCard, cash: 0, card: 0, digital: 0 }, () => {
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

  render() {
    const { t } = this.props
    const { branch, classes, member, amount, discount, giftcard, discountMethod, tax, count, text, cash, card, digital, classReceipt } = this.state

    let subTotal = amount

    let total = subTotal - discount - giftcard + tax

    let totalLeftAfterDigital = total - digital

    let avatarPath = this.props.branches && this.props.branches.filter(b => b._id === branch)[0] &&
      this.props.branches.filter(b => b._id === branch)[0].avatar && this.props.branches.filter(b => b._id === branch)[0].avatar.path


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

    return (
      <div className="mainPage p-3 BookAClass">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes')}</span><span className="mx-2">/</span><span className="crumbText">{t('Book A Class')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Book A Class')}</h1>
            <div className="pageHeadLine"></div>
          </div>
        </div>
        <div className="row p-3">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label className="mx-sm-2 inlineFormLabel">{t('Branch')}</label>
              <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                value={branch} onChange={(e) => this.selectBranch(e)} id="branch">
                <option value="" hidden>{t('Please Select')}</option>
                {this.props.branches && this.props.branches.map((branch, i) => {
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
            <div className="form-group inlineFormGroup">
              <label className="mx-sm-2 inlineFormLabel">{t('Classes')}</label>
              <select className={this.state.classesE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                value={classes} onChange={(e) => this.selectClasses(e)} id="classes">
                <option value="" hidden>{t('Please Select')}</option>
                {this.props.classesByBranch && this.props.classesByBranch.map((classes, i) => {
                  return (
                    <option key={i} value={classes._id}>{classes.className}</option>
                  )
                })}
              </select>
              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.classesE}</small>
              </div>
            </div>

            <div className="form-group inlineFormGroup">
              <label className="mx-sm-2 inlineFormLabel">{t('Members')}</label>
              <Select
                formatOptionLabel={formatOptionLabel}
                options={this.props.activeMember}
                className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                value={member}
                onChange={(e) => this.setState({ ...validator(e, 'member', 'select', [t('Select member')]) })}
                isSearchable={true}
                isClearable={true}
                filterOption={this.customSearch}
                styles={colourStyles}
                placeholder={t('Please Select')}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.memberE}</small>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-4 bg-light">
            <h4 className="font-weight-bold mb-4">{t('Payment Summary')}</h4>
            <div className="table-responsive bg-white px-4 pt-3">
              <table className="table table-borderless">
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
                  <tr>
                    <td>
                      <h5 className="m-0 text-left">{t('Gift Card')} {this.state.text ? `(${this.state.text})` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0 text-right"><small className="d-flex justify-content-end">{giftcard.toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="m-0 text-left">{t('VAT')} {this.state.taxPercent ? `(${this.state.taxPercent} %)` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0 text-right"><small className="d-flex justify-content-end text-primary">{tax.toFixed(3)}</small></h5>
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
            <div className="row mb-1 mt-4">
              <div className="col-12 col-sm-6 d-flex align-items-center">
                <h5 className="my-2 font-weight-bold px-1">{t('Payment Method')}</h5>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-center justify-content-end">
                <button data-toggle="modal" data-target="#passwordAskModal" className="d-flex flex-column align-items-center justify-content-center bg-danger discount-class m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                  <span className="w-100 text-center"><h3><span className="iconv1 iconv1-discount text-white"></span></h3><span className="text-white">{t('Discount')}</span></span></button>
                <button data-toggle="modal" data-target="#GiftCard" className="d-flex flex-column align-items-center justify-content-center bg-primary giftcard-class m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                  <span className="w-100 text-center"><h3><span className="iconv1 iconv1-giftcard text-white"></span></h3><span className="text-white">{t('Gift Card')}</span></span></button>

              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
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
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
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
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="form-group inlineFormGroup mb-3">
                  <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                  <div className={this.state.cardE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                    <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                    <input readOnly type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="form-group inlineFormGroup mb-3">
                  <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                  <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs bg-white" id="addCard4lastno"
                    value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="form-group inlineFormGroup mb-3">
                  <label className="mx-sm-2 inlineFormLabel mb-1"></label>
                  <div className="d-flex">
                    <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                      <input type="checkbox" className="custom-control-input" id="check" name="checkorNo" />
                      <label className="custom-control-label" htmlFor="check">{t('Cheque')}</label>
                    </div>
                  </div>
                </div>
              </div>
              {/* if cheque */}
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="bankName" className="mx-sm-2 inlineFormLabel mb-1">{t('Bank Name')}</label>
                      <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" id="bankName" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="CheckNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Number')}</label>
                      <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" id="CheckNumber" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="CheckDate" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Date')}</label>
                      <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" id="CheckDate" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="ChequeAmount" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Amount')}</label>
                      {/* here currency comes , so change errorclass for div below */}
                      <div className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr">
                        <label htmlFor="ChequeAmount" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                        <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="ChequeAmount" />
                      </div>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* if cheque over */}
              <div className="col-12">
                <div className="px-sm-1 pt-4 pb-5"><button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.handleSubmit(total)}>{t('Checkout')}</button></div>
              </div>

              {/* Popup Discount */}
              <button type="button" id="Discount2" className="d-none" data-toggle="modal" data-target="#Discount" ref="openDiscount">Open modal</button>
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

            </div>
          </div>
        </div>
        {/* --------------Receipt Modal-=--------------- */}
        <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#ReceiptModal" data-backdrop="static" data-keyboard="false" ref="receiptOpenModal">Receipt</button>
        {classReceipt &&
          <div className="modal fade commonYellowModal" id="ReceiptModal">
            <div className="modal-dialog modal-lg" id="ReceiptModal2">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Receipt</h4>
                  {/* <Link to={`/members-details/${classReceipt._id}`}> */}
                  <button type="button" className="close" data-dismiss="modal" ref="receiptCloseModal" onClick={() => this.handleReceiptClose()}><span className="iconv1 iconv1-close"></span></button>
                  {/* </Link> */}
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
                          <label className="m-0 font-weight-bold">Address</label>
                          <p className="whiteSpaceNormal mnw-150px mxw-200px">{this.props.branches && this.props.branches.filter(b => b._id === branch)[0] &&
                            this.props.branches.filter(b => b._id === branch)[0].address}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">VAT Reg Number</label>
                          <p className="">{this.props.branches && this.props.branches.filter(b => b._id === branch)[0] &&
                            this.props.branches.filter(b => b._id === branch)[0].vatRegNo}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">Tax Invoice No</label>
                          <p className="">{classReceipt.orderNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">Date & Time</label>
                          <p className="">{dateToDDMMYYYY(new Date())} {dateToHHMM(new Date())}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="">
                          <label className="m-0 font-weight-bold">Receipt Total</label>
                          <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(total).toFixed(3)}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">Telephone</label>
                          <p className="">{this.props.branches && this.props.branches.filter(b => b._id === branch)[0] &&
                            this.props.branches.filter(b => b._id === branch)[0].telephone}</p>
                        </div>
                      </div>
                    </div>
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
                    <div className="table-responsive RETable">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Class Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{this.props.classesByBranch && this.props.classesByBranch.filter(c => c._id === classes)[0] &&
                              this.props.classesByBranch.filter(c => c._id === classes)[0].className}</td>
                          </tr>
                          <tr>
                            <td colSpan="4">
                              <div className="text-right my-1">Amount Total :</div>
                              {parseFloat(discount) ?
                                <div className="text-right my-1">Discount :</div>
                                : <div></div>}
                              {parseFloat(tax) ?
                                <div className="text-right my-1">VAT{this.state.tax ? `(${this.state.tax} %)` : ''}:</div>
                                : <div></div>}
                              {parseFloat(digital) ?
                                <div className="text-right my-1">Digital :</div>
                                : <div></div>}
                              {parseFloat(cash) ?
                                <div className="text-right my-1">Cash :</div>
                                : <div></div>}
                              {parseFloat(card) ?
                                <div className="text-right my-1">Card :</div>
                                : <div></div>}
                              <div className="text-right my-1">Grand Total :</div>
                              <div className="text-right my-1">Paid Amount :</div>
                              {this.state.cardNumber ?
                                <div className="text-right my-1">Card last four digit :</div>
                                : <div></div>}
                            </td>
                            <td className="">
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(subTotal).toFixed(3)}</span></div>
                              {parseFloat(discount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(discount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(tax) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(tax).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(digital) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(digital).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(cash) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(cash).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(card) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(card).toFixed(3)}</span></div>
                                : <div></div>}
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(total).toFixed(3)}</span></div>
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(total).toFixed(3)}</span></div>
                              {this.state.cardNumber ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{this.state.cardNumber}</span></div>
                                : <div></div>}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* {this.state.cardNumber ?
                        <div className="my-1"><span className="px-1">Card last four digit {this.state.cardNumber}</span></div>
                        : <div></div>} */}
                    </div>
                    {/* <div className="d-flex justify-content-center">
                      <QRCode value={`http://instagram.com/${this.props.branches && this.props.branches.filter(b => b._id === branch)[0] &&
                        this.props.branches.filter(b => b._id === branch)[0].instaId}/`} renderAs='svg' />
                    </div> */}
                    <div className="d-flex flex-wrap justify-content-between my-2">
                      {/* <h6 className="font-weight-bold">Paid Amount: {this.props.defaultCurrency} {parseFloat(total).toFixed(3)}</h6> */}
                      <div className="d-flex align-items-center">
                        <div className="mr-3 text-center">
                          <img src={instaimg} alt="" className="w-30px" />
                          <h6 className="font-weight-bold mb-0 mt-1">Follow Us</h6>
                        </div>
                        <div className="w-50px mr-3">
                          <QRCode value={`http://instagram.com/${this.props.branches && this.props.branches.filter(b => b._id === branch)[0] &&
                            this.props.branches.filter(b => b._id === branch)[0].instaId}/`} renderAs='svg' width="50" height="50" />
                        </div>
                      </div>
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
                      {/* <Link to={`/members-details/${classReceipt._id}`}> */}
                      <button type="button" className="btn btn-success px-4 py-1 my-2" data-dismiss="modal" onClick={() => this.handlePrint(classReceipt._id)}>Print Receipt</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {/* --------------Receipt Modal Ends-=--------------- */}

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

function mapStateToProps({ auth: { loggedUser }, errors, branch: { activeResponse }, currency: { defaultCurrency }, classes: { classesByBranch, classById }, member: { activeMember },
  privilege: { verifyPassword } }) {
  return {
    loggedUser,
    errors,
    branches: activeResponse,
    defaultCurrency,
    classesByBranch,
    classById,
    activeMember,
    verifyPassword
  }
}

export default withTranslation()(connect(mapStateToProps)(BookAClass))