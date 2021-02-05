import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import $ from 'jquery';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Select from 'react-select';
import { applyFreezeAllMember, applyFreezeMember } from '../../../actions/freeze.action';
import { getActiveStatusNotExpiredRegisterMembers } from '../../../actions/member.action';
import { getAllVat } from '../../../actions/vat.action';
import { calculateDays, dateToDDMMYYYY, validator } from '../../../utils/apis/helpers';
import { disableSubmit } from '../../../utils/disableButton';

class AddFreeze extends Component {

  constructor(props) {
    super(props)
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
      taxPercent: 0,
      cash: 0,
      card: 0,
      cashE: '', cardE: '',
      digital: 0,
      digitalE: '',
      cardNumber: '',
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
    this.props.dispatch(getActiveStatusNotExpiredRegisterMembers({ search: '' }))
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
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
    const { freezeType, member, fromDate, toDate, noOfDays, reason, reactivationDate, noOfDaysE, amount, wantCharge, cash, card, cashE, cardE, cardNumber, digital, digitalE, cheque } = this.state
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
            this.props.dispatch(applyFreezeMember(freezeInfo))
            $(el).click();
          } else {
            if (!amount) this.setState({ amountE: t('Enter amount') })
            if (parseInt(totalAmount) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) this.setState({ cashE: t('Enter amount') })
            if (!digital) this.setState({ digitalE: t('Enter amount') })
            if (!card) this.setState({ cardE: t('Enter amount') })
          }
        } else {
          this.props.dispatch(applyFreezeMember(freezeInfo))
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
    this.setState(this.default)
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
    this.setState({ ...validator(e, 'digital', 'numberText', [t('Enter amount')]), ...{ card: 0, cheque: 0 } }, () => {
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
    this.setState({ ...validator(e, 'cash', 'numberText', [t('Enter amount'), t('Enter valid amount')]), ...{ cheque: 0 } }, () => {
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

  setAmount(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]), ...{ cash: 0, card: 0, digital: 0, cheque: 0 } })
  }

  render() {
    const { t } = this.props
    const { freezeType, member, fromDate, toDate, noOfDays, reactivationDate, reason, wantCharge, amount, cash, card, taxPercent, digital } = this.state

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

    let taxPercentValue = taxPercent ? taxPercent : ((this.props.activeVats && this.props.activeVats.filter(vat => vat.defaultVat)[0]) ? this.props.activeVats.filter(vat => vat.defaultVat)[0].taxPercent : '')
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
                          <input type="radio" className="custom-control-input" id="All" name="AllOrIndividual"
                            checked={freezeType === 'All'} onChange={() => this.setState({ freezeType: 'All' })}
                          />
                          <label className="custom-control-label" htmlFor="All">{t('All')}</label>
                        </div>
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input type="radio" className="custom-control-input" id="Individual" name="AllOrIndividual"
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
                  {freezeType === 'Individual' &&
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
                  {wantCharge === 'Yes' && freezeType === 'Individual' &&
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
                  {member && member.branch && this.props.activeVats && this.props.activeVats.length > 0 && wantCharge === 'Yes' && freezeType === 'Individual' &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                      <div className="form-group inlineFormGroup">
                        <label htmlFor="VAT" className="mx-sm-2 inlineFormLabel type2">VAT</label>
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
                    data-toggle="modal" data-target="#myModal" type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleCheckout(totalAmount, totalVat)}>{t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>


              {wantCharge === 'Yes' && freezeType === 'Individual' && member && fromDate <= toDate && noOfDays && reason && amount &&
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
                                      checked={this.state.showCheque} onChange={() => this.setState({ showCheque: !this.state.showCheque, cash: 0, card: 0, digital: 0, cheque: 0 })}
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