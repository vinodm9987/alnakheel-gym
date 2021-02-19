import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import $ from 'jquery';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Select from 'react-select';
import { applyFreezeAllMember, applyFreezeMember, memberFreezeUpdate } from '../../../actions/freeze.action';
import { getActiveStatusNotExpiredRegisterMembers } from '../../../actions/member.action';
import { getAllVat } from '../../../actions/vat.action';
import { calculateDays, dateToDDMMYYYY, validator, dateToHHMM } from '../../../utils/apis/helpers';
import { disableSubmit } from '../../../utils/disableButton';
import instaimg from '../../../assets/img/insta.jpg'
import QRCode from 'qrcode.react';
import { PRODIP } from '../../../config'

class AddFreeze extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      url: this.props.match.url,
      freezeType: 'Individual',
      member: '',
      fromDate: new Date(),
      toDate: new Date(),
      noOfDays: 1,
      reactivationDate: new Date().setDate(new Date().getDate() + 1),
      reason: '',
      memberE: '',
      fromDateE: '',
      toDateE: '',
      noOfDaysE: '',
      reactivationDateE: '',
      reasonE: '',
      amount: '',
      amountE: '',
      wantCharge: 'Yes',
      vat: '',
      taxPercent: '',
      cash: 0,
      card: 0,
      cashE: '', cardE: '',
      digital: 0,
      digitalE: '',
      cardNumber: '',
      showCheque: false,
      bankName: '',
      chequeNumber: '',
      chequeDate: new Date(),
      cheque: 0,
      bankNameE: '',
      chequeNumberE: '',
      chequeDateE: '',
      chequeE: '',
      freezeId: '',
      packageReceipt: null,
    }
    if (this.props.location.freezeProps) {
      const { fromDate, toDate, reactivationDate, memberId, reason, noOfDays, _id } = JSON.parse(this.props.location.freezeProps)
      this.default = {
        url: this.props.match.url,
        freezeType: 'Individual',
        member: memberId,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        noOfDays: noOfDays,
        reactivationDate: new Date(reactivationDate),
        reason: reason,
        memberE: '',
        fromDateE: '',
        toDateE: '',
        noOfDaysE: '',
        reactivationDateE: '',
        reasonE: '',
        amount: '',
        amountE: '',
        wantCharge: 'No',
        vat: '',
        taxPercent: '',
        cash: 0,
        card: 0,
        cashE: '', cardE: '',
        digital: 0,
        digitalE: '',
        cardNumber: '',
        showCheque: false,
        bankName: '',
        chequeNumber: '',
        chequeDate: new Date(),
        cheque: 0,
        bankNameE: '',
        chequeNumberE: '',
        chequeDateE: '',
        chequeE: '',
        freezeId: _id,
        packageReceipt: null,
      }
      this.props.dispatch(getAllVat({ branch: memberId.branch }))
    } else {
      this.default = {
        url: this.props.match.url,
        freezeType: 'Individual',
        member: '',
        fromDate: new Date(),
        toDate: new Date(),
        noOfDays: 1,
        reactivationDate: new Date().setDate(new Date().getDate() + 1),
        reason: '',
        memberE: '',
        fromDateE: '',
        toDateE: '',
        noOfDaysE: '',
        reactivationDateE: '',
        reasonE: '',
        amount: '',
        amountE: '',
        wantCharge: 'Yes',
        vat: '',
        taxPercent: '',
        cash: 0,
        card: 0,
        cashE: '', cardE: '',
        digital: 0,
        digitalE: '',
        cardNumber: '',
        showCheque: false,
        bankName: '',
        chequeNumber: '',
        chequeDate: new Date(),
        cheque: 0,
        bankNameE: '',
        chequeNumberE: '',
        chequeDateE: '',
        chequeE: '',
        freezeId: '',
        packageReceipt: null,
      }
    }
    this.state = this.default
    this.props.dispatch(getActiveStatusNotExpiredRegisterMembers({ search: '' }))
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        if (this.props.errors.response && this.props.errors.response.displayReceipt) {
          let packageReceipt = this.props.errors.response._doc
          this.setState({ ...{ packageReceipt } }, () => {
            const el = findDOMNode(this.refs.receiptOpenModal);
            $(el).click();
          })
        } else {
          this.setState(this.defaultCancel)
        }
      }
    }
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.defaultCancel)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.defaultCancel)
    }
  }

  handleCheckout(totalAmount, totalVat) {
    const { wantCharge, freezeType } = this.state
    if (freezeType !== 'Individual') {
      this.handleSubmit(totalAmount, totalVat)
    } else if (freezeType === 'Individual' && wantCharge !== 'Yes') {
      this.handleSubmit(totalAmount, totalVat)
    }
  }

  handleSubmit(totalAmount, totalVat) {
    const el = findDOMNode(this.refs.paymentSummaryClose);
    const { t } = this.props
    const { freezeType, member, fromDate, toDate, noOfDays, reason, reactivationDate, noOfDaysE, amount, wantCharge, cash, card, cashE, cardE, cardNumber, digital, digitalE, cheque,
      freezeId, bankName, chequeNumber, chequeDate } = this.state
    if (freezeType === 'Individual') {
      if (member && fromDate <= toDate && noOfDays && reason && !noOfDaysE) {
        const freezeInfo = {
          memberId: member._id,
          fromDate,
          toDate,
          noOfDays,
          reactivationDate,
          reason,
          freezeType
        }
        if (wantCharge === 'Yes') {
          if (amount && (parseInt(totalAmount) === parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) && !cardE && !cashE && !digitalE) {
            freezeInfo.totalAmount = totalAmount
            freezeInfo.actualAmount = amount ? parseInt(amount) : 0
            freezeInfo.cashAmount = cash ? parseFloat(cash) : 0
            freezeInfo.cardAmount = card ? parseFloat(card) : 0
            freezeInfo.digitalAmount = digital ? parseFloat(digital) : 0
            freezeInfo.cardNumber = cardNumber
            freezeInfo.vatAmount = totalVat
            freezeInfo.chequeAmount = cheque ? parseFloat(cheque) : 0
            freezeInfo.bankName = bankName
            freezeInfo.chequeNumber = chequeNumber
            freezeInfo.chequeDate = chequeDate
            this.props.dispatch(applyFreezeMember(freezeInfo))
            $(el).click();
          } else {
            if (!amount) this.setState({ amountE: t('Enter amount') })
            if (parseInt(totalAmount) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) this.setState({ cashE: t('Enter amount') })
            if (!digital) this.setState({ digitalE: t('Enter amount') })
            if (!card) this.setState({ cardE: t('Enter amount') })
          }
        } else {
          if (freezeId) {
            this.props.dispatch(memberFreezeUpdate(freezeId, freezeInfo))
          } else {
            this.props.dispatch(applyFreezeMember(freezeInfo))
          }
        }
      } else {
        if (!member) this.setState({ memberE: t('Select member') })
        if (fromDate > toDate) this.setState({ toDateE: t('End Date should be greater than Start Date') })
        if (!reason) this.setState({ reasonE: t('Enter reason') })
      }
    } else {
      if (fromDate <= toDate && noOfDays && reason && !noOfDaysE) {
        const freezeInfo = {
          fromDate,
          toDate,
          noOfDays,
          reactivationDate,
          reason,
          freezeType,
          members: this.props.activeStatusNotExpiredRegisterMember && this.props.activeStatusNotExpiredRegisterMember.map(m => m._id)
        }
        this.props.dispatch(applyFreezeAllMember(freezeInfo))
      } else {
        if (fromDate > toDate) this.setState({ toDateE: t('End Date should be greater than Start Date') })
        if (!reason) this.setState({ reasonE: t('Enter reason') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
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

  handleDate(e, type) {
    this.setState(validator(e, type, 'date', []), () => {
      const noOfDays = Math.abs(calculateDays(this.state.fromDate, this.state.toDate)) + 1
      const reactivationDate = new Date(this.state.toDate)
      this.setState({ reactivationDate: new Date(reactivationDate.setDate(reactivationDate.getDate() + 1)), noOfDays })
    })
  }

  setMember(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'member', 'select', [t('Select member')]) }, () => {
      this.state.member && this.props.dispatch(getAllVat({ branch: this.state.member.branch }))
    })
  }

  setVat(vat, taxPercent) {
    this.setState({ vat, taxPercent, cash: 0, card: 0, digital: 0, cheque: 0, })
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

  setAmount(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]), ...{ cash: 0, card: 0, digital: 0, cheque: 0 } })
  }

  render() {
    const { t } = this.props
    const { freezeType, member, fromDate, toDate, noOfDays, reactivationDate, reason, wantCharge, amount, cash, card, taxPercent, digital, freezeId, packageReceipt, } = this.state

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
    };

    let taxPercentValue = taxPercent !== '' ? taxPercent : ((this.props.activeVats && this.props.activeVats.filter(vat => vat.defaultVat)[0]) ? this.props.activeVats.filter(vat => vat.defaultVat)[0].taxPercent : '')
    const subTotal = amount ? parseFloat(amount) : 0
    let totalVat = (subTotal) * taxPercentValue / 100
    const totalAmount = subTotal + totalVat

    let totalLeftAfterDigital = totalAmount - digital
    let totalLeftAfterCash = totalAmount - digital - cash

    return (
      <div className={this.state.url === '/freeze-members' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <form className="col-12 form-inline mt-5 px-0">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel mb-2">{t('Freeze Members')}</label>
                      <div className="d-flex w-100">
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input disabled={freezeId} type="radio" className="custom-control-input" id="All" name="AllOrIndividual"
                            checked={freezeType === 'All'} onChange={() => this.setState({ freezeType: 'All' })}
                          />
                          <label className="custom-control-label" htmlFor="All">{t('All')}</label>
                        </div>
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input disabled={freezeId} type="radio" className="custom-control-input" id="Individual" name="AllOrIndividual"
                            checked={freezeType === 'Individual'} onChange={() => this.setState({ freezeType: 'Individual' })}
                          />
                          <label className="custom-control-label" htmlFor="Individual">{t('Individual')}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  {/* see design */}
                  {/* If Individual */}
                  {freezeType === 'Individual' &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                      <div className="form-group inlineFormGroup">
                        <label className="mx-sm-2 inlineFormLabel mb-2">{t('Members')}</label>
                        <Select
                          formatOptionLabel={formatOptionLabel}
                          options={this.props.activeStatusNotExpiredRegisterMember}
                          className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                          value={member}
                          onChange={(e) => this.setMember(e)}
                          isSearchable={true}
                          isClearable={true}
                          filterOption={this.customSearch}
                          styles={colourStyles}
                          placeholder={t('Please Select')}
                          isDisabled={freezeId}
                        />
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{this.state.memberE}</small>
                        </div>
                      </div>
                    </div>
                  }
                  {/* If Individual Over */}
                  <div className="col">
                    <div className="row flex-wrap flex-lg-nowrap">
                      <div className="col mnw-200px flex-grow-0 flex-shrink-0">
                        <div className="form-group inlineFormGroup">
                          <label className="mx-sm-2 inlineFormLabel mb-2">{t('From Date')}</label>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                              variant='inline'
                              InputProps={{
                                disableUnderline: true,
                              }}
                              autoOk
                              className={this.state.fromDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"}
                              invalidDateMessage=''
                              minDateMessage=''
                              minDate={new Date()}
                              format="dd/MM/yyyy"
                              value={fromDate}
                              onChange={(e) => this.handleDate(e, 'fromDate')}
                            />
                          </MuiPickersUtilsProvider>
                          <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                          {/* <input type="text" autoComplete="off" className="form-control w-100 mx-sm-2 inlineFormInputs FormInputsError p-0" /> */}
                          <div className="errorMessageWrapper">
                            <small className="text-danger mx-sm-2 errorMessage">{this.state.fromDateE}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col mnw-200px flex-grow-0 flex-shrink-0">
                        <div className="form-group inlineFormGroup">
                          <label className="mx-sm-2 inlineFormLabel mb-2">{t('To Date')}</label>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                              variant='inline'
                              InputProps={{
                                disableUnderline: true,
                              }}
                              autoOk
                              className={this.state.toDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"}
                              invalidDateMessage=''
                              minDateMessage=''
                              minDate={fromDate}
                              format="dd/MM/yyyy"
                              value={toDate}
                              onChange={(e) => this.handleDate(e, 'toDate')}
                            />
                          </MuiPickersUtilsProvider>
                          <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                          {/* <input type="text" autoComplete="off" className="form-control w-100 mx-sm-2 inlineFormInputs FormInputsError p-0" /> */}
                          <div className="errorMessageWrapper">
                            <small className="text-danger mx-sm-2 errorMessage">{this.state.toDateE}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col mnw-200px flex-grow-0 flex-shrink-0">
                        <div className="form-group inlineFormGroup">
                          <label className="mx-sm-2 inlineFormLabel mb-2">{t('Reactivation Date')}</label>
                          <input disabled className="form-control mx-sm-2 inlineFormInputs w-100" value={dateToDDMMYYYY(reactivationDate)} />
                          <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                          {/* <input type="text" autoComplete="off" className="form-control w-100 mx-sm-2 inlineFormInputs FormInputsError p-0" /> */}
                          <div className="errorMessageWrapper">
                            <small className="text-danger mx-sm-2 errorMessage">{this.state.reactivationDateE}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col mnw-200px flex-grow-0 flex-shrink-0">
                        <div className="form-group inlineFormGroup">
                          <label className="mx-sm-2 inlineFormLabel mb-2">{t('No of Days')}</label>
                          <input disabled type="number" autoComplete="off" className="form-control w-100 mx-sm-2 inlineFormInputs" value={noOfDays} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="Reason" className="mx-sm-2 inlineFormLabel mb-2">{t('Reason')}</label>
                      <input type="text" autoComplete="off" className={this.state.reasonE ? "form-control w-100 mx-sm-2 inlineFormInputs FormInputsError" : "form-control w-100 mx-sm-2 inlineFormInputs"} id="Reason"
                        value={reason} onChange={(e) => this.setState(validator(e, 'reason', 'text', [t('Enter reason')]))}
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.reasonE}</small>
                      </div>
                    </div>
                  </div>
                  {freezeType === 'Individual' && !freezeId &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                      <div className=" d-flex flex-wrap px-2 py-4 mt-1">
                        <h6 className="my-2">{t('Do you want to charge?')}</h6>
                        <div className="position-relative mx-3">
                          <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white"
                            value={wantCharge} onChange={(e) => this.setState({ wantCharge: e.target.value, cash: 0, card: 0, digital: 0, cheque: 0, amount: 0 })}
                          >
                            <option value="Yes">{t('Yes')}</option>
                            <option value="No">{t('No')}</option>
                          </select>
                          <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                        </div>
                      </div>
                    </div>
                  }
                  {wantCharge === 'Yes' && freezeType === 'Individual' && !freezeId &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                      <div className="form-group inlineFormGroup">
                        <label htmlFor="amount" className="mx-sm-2 inlineFormLabel mb-2">{t('Enter Value')}</label>
                        <div className={this.state.amountE ? "form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart FormInputsError p-0 d-flex align-items-center w-100 dirltr" : "form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart p-0 d-flex align-items-center w-100 dirltr"}>
                          <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                          <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" id="amount"
                            value={amount} onChange={(e) => this.setAmount(e)}
                          />
                        </div>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{this.state.amountE}</small>
                        </div>
                      </div>
                    </div>
                  }
                  {/* -------------------------- */}
                  {member && member.branch && this.props.activeVats && this.props.activeVats.length > 0 && wantCharge === 'Yes' && freezeType === 'Individual' && !freezeId &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                      <div className="form-group inlineFormGroup">
                        <label htmlFor="VAT" className="mx-sm-2 inlineFormLabel type2">{t('VAT')}</label>
                        <div className="form-group">
                          {this.props.activeVats && this.props.activeVats.map((vat, i) => {
                            const { vatName, taxPercent, defaultVat, _id } = vat
                            return (
                              <div key={i} className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                <input type="radio" className="custom-control-input" id={`${vatName}-${i}`} name="radioVat" checked={this.state.vat ? this.state.vat === _id : defaultVat}
                                  onChange={() => this.setVat(_id, taxPercent)}
                                />
                                <label className="custom-control-label" htmlFor={`${vatName}-${i}`}>{taxPercent === 0 ? `${vatName}` : `${taxPercent}%`}</label>
                              </div>
                            )
                          })}
                          <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage"></small></div>
                        </div>
                      </div>
                    </div>
                  }
                  {/* ------------------------ */}
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  <button disabled={disableSubmit(this.props.loggedUser, 'Members', 'FreezeMembers')}
                    data-toggle="modal" data-target="#myModal" type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleCheckout(totalAmount, totalVat)}>{freezeId ? t('Update') : t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>


              {wantCharge === 'Yes' && freezeType === 'Individual' && member && fromDate <= toDate && noOfDays && reason && amount !== '' &&
                <div className="modal right fade" id="myModal">
                  <div className="modal-dialog">
                    <div className="modal-content">

                      <div className="modal-header">
                        <h4 className="modal-title">{t('Payment Summary')}</h4>
                        <button type="button" className="close" data-dismiss="modal" ref="paymentSummaryClose">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-12">
                              <div className="table-responsive bg-light">
                                <table className="table table-borderless">
                                  <tbody className="border-bottom">
                                    <tr>
                                      <td className="text-left" dir="ltr"><h6 className="mb-0 mt-2">{t('Sub Total')}</h6></td>
                                      <td className="text-right" dir="ltr"><h6 className="mb-0 mt-2">{this.props.defaultCurrency} {subTotal.toFixed(3)}</h6></td>
                                    </tr>
                                    <tr>
                                      <td className="text-left" dir="ltr"><h6 className="mb-0 mt-2">{t('VAT')} {taxPercent ? `(${taxPercent} %)` : ''}</h6></td>
                                      <td className="text-right" dir="ltr"><h6 className="mb-0 mt-2">{this.props.defaultCurrency} {totalVat.toFixed(3)}</h6></td>
                                    </tr>
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td className="text-left mt-2 mb-0" dir="ltr"><h4>{t('Total')}</h4></td>
                                      <td className="text-right text-danger mt-2 mb-0" dir="ltr"><h4>{this.props.defaultCurrency} {totalAmount.toFixed(3)}</h4></td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                            <div className="col-12">
                              <h5 className="font-weight-bold my-4">{t('Payment Method')}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <div className="form-group inlineFormGroup mb-3">
                                <label htmlFor="addDigital" className="mx-sm-2 inlineFormLabel mb-1">{t('Digital')}</label>
                                <div className="form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart p-0 d-flex align-items-center w-100 dirltr">
                                  <label htmlFor="addDigital" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                                  <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addDigital" value={digital} onChange={(e) => this.setDigital(e, totalAmount)} />
                                </div>
                                <div className="errorMessageWrapper">
                                  <small className="text-danger mx-sm-2 errorMessage">{this.state.digitalE}</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <div className="form-group inlineFormGroup mb-3">
                                <label className="mx-sm-2 inlineFormLabel mb-2">{t('Cash')}</label>
                                {/* className={this.state.amountE ? "form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart FormInputsError p-0 d-flex align-items-center" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs inlineFormInputPaddingStart"} */}
                                <div className="form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart p-0 d-flex align-items-center w-100 dirltr">
                                  <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                                  <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" value={cash} onChange={(e) => this.setCash(e, totalLeftAfterDigital)} />
                                </div>
                                <div className="errorMessageWrapper">
                                  <small className="text-danger mx-sm-2 errorMessage">{this.state.cashE}</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <div className="form-group inlineFormGroup mb-3">
                                <label className="mx-sm-2 inlineFormLabel mb-2">{t('Card')}</label>
                                {/* className={this.state.amountE ? "form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart FormInputsError p-0 d-flex align-items-center" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs inlineFormInputPaddingStart"} */}
                                <div className="form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart p-0 d-flex align-items-center w-100 dirltr">
                                  <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                                  <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} onChange={(e) => this.setCard(e, totalLeftAfterCash)} />
                                </div>
                                <div className="errorMessageWrapper">
                                  <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                                </div>
                              </div>
                            </div>
                            {parseFloat(card) ?
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
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
                                      checked={this.state.showCheque} onChange={() => this.setCheque(totalAmount)}
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
                                      <input type="text" autoComplete="off" className={this.state.bankNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white" : "form-control mx-sm-2 inlineFormInputs w-100 py-0 px-2 d-flex align-items-center bg-white"}
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
                                          className={this.state.chequeDateE ? "form-control pl-2 bg-white mx-sm-2 inlineFormInputs FormInputsError" : "form-control pl-2 bg-white mx-sm-2 inlineFormInputs"}
                                          minDate={new Date()}
                                          format="dd/MM/yyyy"
                                          value={this.state.chequeDate}
                                          onChange={(e) => this.setState(validator(e, 'chequeDate', 'date', []))}
                                        />
                                      </MuiPickersUtilsProvider>
                                      <span class="iconv1 iconv1-calander dateBoxIcon"></span>
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
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-success w-100 mx-0 my-1" onClick={() => this.handleSubmit(totalAmount, totalVat)}>{t('Check Out')}</button>
                      </div>

                    </div>
                  </div>
                </div>
              }



            </div>
          </div>
        </form>

        {/* --------------Receipt Modal-=--------------- */}
        <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#ReceiptModal" data-backdrop="static" data-keyboard="false" ref="receiptOpenModal">{t('Receipt')}</button>
        {packageReceipt && freezeType === 'Individual' && wantCharge === 'Yes' &&
          <div className="modal fade commonYellowModal" id="ReceiptModal">
            <div className="modal-dialog modal-lg" id="ReceiptModal2">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">{t('Receipt')}</h4>
                  {/* <Link to={`/members-details/${packageReceipt._id}`}> */}
                  <button type="button" className="close" data-dismiss="modal" ref="receiptCloseModal" onClick={() => this.handleReceiptClose()}><span className="iconv1 iconv1-close"></span></button>
                  {/* </Link> */}
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="text-center my-3">
                      <img alt='' src={packageReceipt.memberId.branch.avatar && packageReceipt.memberId.branch.avatar.path} className="" width="100" />
                    </div>
                    <h4 className="border-bottom border-dark text-center font-weight-bold pb-1">{t('Tax Invoice')}</h4>
                    <div className="row px-5 justify-content-between">
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">{t('VAT Reg Number')}</label>
                          <p className="">{packageReceipt.memberId.branch.vatRegNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Address')}</label>
                          <p className="whiteSpaceNormal mnw-150px mxw-200px">{packageReceipt.memberId.branch.address}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">{t('Tax Invoice No')}</label>
                          <p className="">{packageReceipt.orderNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Date & Time')}</label>
                          <p className="">{dateToDDMMYYYY(new Date())} {dateToHHMM(new Date())}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Receipt Total')}</label>
                          <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(totalAmount).toFixed(3)}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Telephone')}</label>
                          <p className="">{packageReceipt.memberId.branch.telephone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                      <div className="">
                        <h6 className="font-weight-bold m-1">
                          <span className="px-1">{t('ID')}:</span>
                          <span className="px-1">{packageReceipt.memberId.memberId}</span>
                        </h6>
                      </div>
                      <h6 className="font-weight-bold m-1">{packageReceipt.memberId.credentialId.userName}</h6>
                      <div className="">
                        <h6 className="font-weight-bold m-1">
                          <span className="px-1">{t('Mob')}:</span>
                          <span className="px-1">{packageReceipt.memberId.mobileNo}</span>
                        </h6>
                      </div>
                    </div>
                    <div className="table-responsive RETable">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t('Type')}</th>
                            <th>{t('From Date')}</th>
                            <th>{t('To Date')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Freezed</td>
                            <td>{dateToDDMMYYYY(fromDate)}</td>
                            <td>{dateToDDMMYYYY(toDate)}</td>
                          </tr>
                          <tr>
                            <td colSpan="4">
                              <div className="text-right my-1">{t('Amount Total')} :</div>
                              {parseFloat(totalVat) ?
                                <div className="text-right my-1">{t('VAT')}{this.state.tax ? `(${this.state.tax} %)` : ''}:</div>
                                : <div></div>}
                              {parseFloat(digital) ?
                                <div className="text-right my-1">{t('Digital')} :</div>
                                : <div></div>}
                              {parseFloat(cash) ?
                                <div className="text-right my-1">{t('Cash')} :</div>
                                : <div></div>}
                              {parseFloat(card) ?
                                <div className="text-right my-1">{t('Card')} :</div>
                                : <div></div>}
                              {parseFloat(this.state.cheque) ?
                                <div className="text-right my-1">{t('Cheque')} :</div>
                                : <div></div>}
                              {this.state.bankName ?
                                <div className="text-right my-1">{t('Bank Name')} :</div>
                                : <div></div>}
                              {this.state.chequeNumber ?
                                <div className="text-right my-1">{t('Cheque Number')} :</div>
                                : <div></div>}
                              {this.state.chequeDate ?
                                <div className="text-right my-1">{t('Cheque Date')} :</div>
                                : <div></div>}
                              <div className="text-right my-1">{t('Grand Total')} :</div>
                              <div className="text-right my-1">{t('Paid Amount')} :</div>
                              {this.state.cardNumber ?
                                <div className="text-right my-1">{t('Card last four digit')} :</div>
                                : <div></div>}
                            </td>
                            <td className="">
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(subTotal).toFixed(3)}</span></div>
                              {parseFloat(totalVat) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(totalVat).toFixed(3)}</span></div>
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
                              {parseFloat(this.state.cheque) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(this.state.cheque).toFixed(3)}</span></div>
                                : <div></div>}
                              {this.state.bankName ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{this.state.bankName}</span></div>
                                : <div></div>}
                              {this.state.chequeNumber ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{this.state.chequeNumber}</span></div>
                                : <div></div>}
                              {this.state.chequeDate ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{dateToDDMMYYYY(this.state.chequeDate)}</span></div>
                                : <div></div>}
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(totalAmount).toFixed(3)}</span></div>
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(totalAmount).toFixed(3)}</span></div>
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
                      <QRCode value={`http://instagram.com/${packageReceipt.memberId.branch.instaId}/`} renderAs='svg' />
                    </div> */}
                    <div className="d-flex align-items-center flex-wrap justify-content-between my-4">
                      <div className="d-flex">
                        <div className="mr-3 text-center">
                          <img src={instaimg} alt="" className="w-30px" />
                          <h6 className="font-weight-bold mb-0 mt-1">{t('Follow Us')}</h6>
                        </div>
                        <div className="w-50px mr-3">
                          <QRCode value={`http://instagram.com/${packageReceipt.memberId.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                        </div>
                      </div>
                      {/* <h6 className="font-weight-bold">{t('Paid Amount')}: {this.props.defaultCurrency} {parseFloat(totalAmount).toFixed(3)}</h6> */}
                      {packageReceipt.doneBy &&
                        <h6 className="font-weight-bold">{t('Served by')}: {packageReceipt.doneBy.userName}</h6>}
                    </div>
                    {/* <div className="text-center px-5">
                      <h5 className="text-muted">{t('Membership cannot be refunded or transferred to others.')}</h5>
                      <h5 className="font-weight-bold">{t('Thank You')}</h5>
                    </div> */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <h6 className="font-weight-bold" >{t('Membership cannot be refunded or transferred to others.')}</h6>
                        <h6 className="font-weight-bold">{t('Thank You')}</h6>
                      </div>
                    </div>
                    <div className="text-center">
                      {/* <Link to={`/members-details/${packageReceipt._id}`}> */}
                      <button type="button" className="btn btn-success px-4 py-1 my-2" data-dismiss="modal" onClick={() => this.handlePrint(packageReceipt._id)}>{t('Print Receipt')}</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {/* --------------Receipt Modal Ends-=--------------- */}

        {packageReceipt && freezeType === 'Individual' && wantCharge === 'Yes' &&
          <div className="PageBillWrapper d-none">
            <div style={{ width: "450px", padding: "15px", margin: "auto" }} id="newPrint">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={packageReceipt.memberId.branch.avatar ? `${PRODIP}/${packageReceipt.memberId.branch.avatar.path}` : ''} width="200" style={{ width: "100px" }} alt="" />
              </div>
              <h5 style={{ textAlign: "center", margin: "19px 0" }}>{t('Tax Invoice')}</h5>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>
                <span>{packageReceipt.memberId.branch.memberId.branchName}</span><br />
                <span>{packageReceipt.memberId.branch.address}</span><br />
                {/* <span>Road/Street 50, Samaheej,</span><br /> */}
                {/* <span>Block 236, Bahrain,</span><br /> */}
                <span>{t('Tel')} : {packageReceipt.memberId.branch.telephone}</span><br />
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>{t('VAT Reg No')} - {packageReceipt.memberId.branch.vatRegNo}</p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0" }}>
                <span style={{ padding: "2px", fontSize: "14px" }}>{dateToDDMMYYYY(new Date())} {dateToHHMM(new Date())}</span>
                <span style={{ padding: "2px", fontSize: "14px" }}>{t('Bill No')}:{packageReceipt.orderNo}</span>
              </p>
              <div>
                <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between" }}>
                  <span>{t('ID:')} <span style={{ padding: "10px" }}>{packageReceipt.memberId.memberId}</span></span>
                  <span>{t('Mob:')} <span style={{ padding: "10px" }}>{packageReceipt.memberId.mobileNo}</span></span>
                </p>
                <p style={{ display: "flex", textAlign: "center", justifyContent: "center", marginTop: "0" }}>
                  <span>{packageReceipt.memberId.credentialId.userName}</span>
                </p>
              </div>
              {/* <p style={{ textAlign: "right", margin: "0 0 10px 0" }}>66988964</p> */}
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr style={{ borderTop: "1px dashed #000" }}>
                    <td>{t('Type')}</td>
                    <td>{t('From Date')}</td>
                    <td>{t('To Date')}</td>
                  </tr>
                  {/* <tr style={{ borderTop: "1px dashed #000" }}>
                  <td>1</td>
                  <td>3 Month</td>
                  <td>26-Dec-19</td>
                  <td>13-Sep-20</td>
                </tr> */}
                  <tr>
                    <td>Freezed</td>
                    <td>{dateToDDMMYYYY(fromDate)}</td>
                    <td>{dateToDDMMYYYY(toDate)}</td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: "100%", textAlign: "right", borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>{t('Amount Total')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(subTotal).toFixed(3)}</td>
                  </tr>
                  {parseFloat(totalVat) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('VAT')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(totalVat).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(digital) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Digital')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(digital).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(cash) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Cash')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(cash).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(card) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(card).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(this.state.cheque) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(this.state.cheque).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.bankName ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Bank Name')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.bankName}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.chequeNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Number')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.chequeNumber}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.chequeDate ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Date')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{dateToDDMMYYYY(this.state.chequeDate)}</td>
                    </tr>
                    : <tr></tr>}
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Grand Total')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(totalAmount).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Paid Amount')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(totalAmount).toFixed(3)}</td>
                  </tr>
                  {this.state.cardNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card last four digit')} :</td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.cardNumber}</td>
                    </tr>
                    : <tr></tr>}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ marginRight: "10px", justifyContent: "center" }}>
                    <img src={instaimg} alt="" style={{ width: "30px", height: "30px" }} />
                    {/* <h6>{t('Follow Us')}</h6> */}
                  </div>
                  <QRCode value={`http://instagram.com/${packageReceipt.memberId.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                </div>
                {packageReceipt.doneBy &&
                  <span>{t('Served by')}: {packageReceipt.doneBy.userName}</span>}
              </div>
              <p style={{ display: "flex", margin: "0 0 10px 0" }}>
                <span>{t('NB')}:</span>
                <span style={{ flexGrow: "1", textAlign: "center" }}>{t('Membership cannot be refunded or transferred to others.')}</span>
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>{t('Thank You')}</p>
            </div>
          </div>
        }

      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, member: { activeStatusNotExpiredRegisterMember }, currency: { defaultCurrency }, vat: { activeVats } }) {
  return {
    loggedUser,
    errors,
    activeStatusNotExpiredRegisterMember,
    defaultCurrency,
    activeVats
  }
}

export default withTranslation()(connect(mapStateToProps)(AddFreeze))