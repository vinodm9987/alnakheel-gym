import React, { Component } from 'react'
import { DonutChart } from '../../Layout'
import { connect } from 'react-redux'
import { dateToDDMMYYYY, calculateDays } from '../../../utils/apis/helpers'
import { validator } from '../../../utils/apis/helpers'
import { updateMemberDetails } from '../../../actions/member.action'
import { startPackage } from '../../../actions/bioStar.action'
import $ from 'jquery'
import { findDOMNode } from 'react-dom';
import { withTranslation } from 'react-i18next'
import { GET_ALERT_ERROR } from '../../../actions/types'

class PackageDetails extends Component {

  state = {
    packageName: '',
    totalAmount: 0,
    packageId: '',
    index: 0,
    paidType: 'Cash',
    cashE: '',
    cash: 0,
    card: 0,
    cardE: '',
    digital: 0,
    digitalE: '',
    multipleE: '',
    cardNumber: '',
    cardNumberE: '',
  }

  onClickPayButton(packageName, totalAmount, packageId, index) {
    this.setState({
      packageName,
      totalAmount,
      packageId,
      index
    })
  }

  setPaidType(type) {
    this.setState({
      paidType: type,
      cash: 0,
      card: 0
    })
  }

  setDigital(e) {
    const { t } = this.props
    const { totalAmount } = this.state
    this.setState({ ...validator(e, 'digital', 'numberText', [t('Enter amount')]), ...{ card: 0 } }, () => {
      if (this.state.digital <= totalAmount.toFixed(3) && this.state.digital >= 0) {
        const cash = (totalAmount.toFixed(3) - this.state.digital).toFixed(3)

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

  setCash(e, totalAmount) {
    const { t } = this.props
    this.setState(validator(e, 'cash', 'numberText', [t('Enter amount'), t('Enter valid amount')]), () => {
      if (this.state.cash && this.state.cash <= parseFloat(totalAmount).toFixed(3) && this.state.cash >= 0) {
        const card = parseFloat(totalAmount).toFixed(3) - this.state.cash
        this.setState({
          card,
          cardE: ''
        })
      } else {
        this.setState({
          cardE: t('Entered cash amount is greater than requested amount'),
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

  handlePay() {
    const { t } = this.props
    const el = findDOMNode(this.refs.notYetPaidClose);

    const { index, paidType, cardNumber, totalAmount, cash, card, digital, cashE, cardE, digitalE } = this.state
    if (totalAmount) {
      const memberInfo = { ...this.props.memberById }
      memberInfo.transactionAmount = totalAmount
      memberInfo.index = index
      const packageDetails = [...memberInfo.packageDetails]
      const packages = { ...packageDetails[index] }
      packages.paidStatus = 'Paid'
      packageDetails[index] = packages
      packageDetails[index].paidType = paidType
      if (paidType === 'Multiple') {
        if ((cash || card || digital) && cardNumber && !cashE && !cardE && !digitalE) {
          packageDetails[index].cashAmount = parseFloat(cash)
          packageDetails[index].digitalAmount = parseFloat(digital)
          packageDetails[index].cardAmount = card
          packageDetails[index].cardNumber = cardNumber
          packageDetails[index].totalAmount = totalAmount
          memberInfo.packageDetails = packageDetails
          this.props.dispatch(updateMemberDetails(memberInfo._id, memberInfo))
          $(el).click();
        } else {
          if (!cash) this.setState({ cashE: t('Enter amount') })
          if (!digital) this.setState({ digitalE: t('Enter amount') })
          if (!card) this.setState({ cardE: t('Enter amount') })
          if (!cardNumber) this.setState({ cardNumberE: t('Enter card number') })
        }
      } else if (paidType === 'Card') {
        if (cardNumber) {
          packageDetails[index].totalAmount = totalAmount
          packageDetails[index].cardNumber = cardNumber
          packageDetails[index].cardAmount = totalAmount
          memberInfo.packageDetails = packageDetails
          this.props.dispatch(updateMemberDetails(memberInfo._id, memberInfo))
          $(el).click();
        } else {
          this.setState({
            cardNumberE: t('Enter card number')
          })
        }
      } else if (paidType === 'Cash') {
        packageDetails[index].totalAmount = totalAmount
        packageDetails[index].cashAmount = totalAmount
        memberInfo.packageDetails = packageDetails
        this.props.dispatch(updateMemberDetails(memberInfo._id, memberInfo))
        $(el).click();
      }
    }

  }

  handleStartPackage(memberId, packageDetailId, periodDays, trainerFees, paidStatus, doneFingerAuth) {
    const { t } = this.props
    if (paidStatus === 'Paid' && doneFingerAuth) {
      const memberInfo = {
        memberId,
        packageDetailId,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + periodDays)).toISOString()
      }
      if (trainerFees) {
        memberInfo.trainerStart = new Date().toISOString()
        memberInfo.trainerEnd = new Date(new Date().setDate(new Date().getDate() + trainerFees.period.periodDays)).toISOString()
        memberInfo.trainer = trainerFees.trainerName
      }
      this.props.dispatch(startPackage(memberInfo))
    } else {
      this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please Enroll the Fingerprint before starting the Package !') })
    }
  }

  render() {
    const { t } = this.props
    if (this.props.memberById) {
      const { packageDetails, doneFingerAuth } = this.props.memberById
      const { cash, paidType, card, digital, totalAmount } = this.state

      let totalLeftAfterDigital = totalAmount - digital

      return (
        <div className="tab-pane fade show active" id="menu1" role="tabpanel">
          <div className="col-12">
            <ul className="row px-0">
              {packageDetails && packageDetails.map((pack, i) => {
                const { startDate, endDate, extendDate, reactivationDate, packages: { packageName, _id, period: { periodDays } },
                  paidStatus, totalAmount, trainer, trainerFees, trainerStart, trainerEnd, trainerExtend } = pack
                if ((extendDate && reactivationDate) ? new Date().setHours(0, 0, 0, 0) <= new Date(extendDate).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0) <= new Date(endDate).setHours(0, 0, 0, 0)) {
                  return (
                    <li key={i} className="d-block col-12 px-0">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-end align-items-center pb-2">
                          <small className="text-secondary">{t('Payment Status')}</small>
                          {paidStatus === 'Paid'
                            ? <button className="btn btn-success badge-pill btn-sm px-3 mx-1 py-0 w-100px" data-toggle="modal" data-target="#allreadyPaid"><small className="mx-1">{t(`${paidStatus}`)}</small><small className="iconv1 iconv1-arrow-down mx-1"></small></button>
                            : <button className="btn btn-danger badge-pill btn-sm px-3 mx-1 py-0 w-100px" data-toggle="modal" data-target="#notYetPaid" onClick={() => this.onClickPayButton(packageName, totalAmount, _id, i)}><small className="mx-1">{t(`${paidStatus}`)}</small><small className="iconv1 iconv1-arrow-down mx-1"></small></button>
                          }
                        </div>
                        <div className="col-12 col-lg-5">
                          <h5 className="">{packageName}</h5>
                          <div className="d-flex justify-content-between align-items-start flex-wrap">
                            <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                              <span className="text-secondary">{t('Start Date')}</span>
                              <span className="text-danger w-100">{dateToDDMMYYYY(startDate)}</span>
                            </div>
                            <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                              <span className="text-secondary whiteSpaceNoWrap">{t('End Date')}</span>
                              <span className="text-danger w-100 text-right">{dateToDDMMYYYY(endDate)}</span>
                              {extendDate && <span className="text-secondary whiteSpaceNoWrap">{t('Extended till')}</span>}
                              {extendDate && <span className="text-danger w-100 text-right">{dateToDDMMYYYY(extendDate)}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center flex-column py-3">
                          {(extendDate && reactivationDate)
                            ? <DonutChart
                              dataValue={calculateDays(new Date(reactivationDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? new Date() : reactivationDate, extendDate)}
                              value={
                                calculateDays(new Date(reactivationDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? new Date() : reactivationDate, extendDate) /
                                calculateDays(startDate, endDate) * 100
                              }
                              size={90}
                              strokewidth={12}
                              text1={t('Days')}
                              text2={t('Left')}
                            />
                            : <DonutChart
                              dataValue={calculateDays(new Date(), endDate)}
                              value={calculateDays(new Date(), endDate) / calculateDays(startDate, endDate) * 100}
                              size={90}
                              strokewidth={12}
                              text1={t('Days')}
                              text2={t('Left')}
                            />
                          }
                        </div>
                        {trainer &&
                          <div className="col-12 col-lg-5 d-flex align-items-stretch">
                            <div className="border border-info rounded alert-primary w-100 d-flex align-items-center">
                              <div className="d-flex p-2 w-100 flex-wrap">
                                <div className="d-flex justify-content-between pb-1 w-100 align-items-start">
                                  <h6 className="font-weight-bold text-black">{t('Trainer Details')}</h6>
                                  {(trainerExtend ? (new Date(trainerExtend).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : (new Date(trainerEnd).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))
                                    ? <h5 className="m-0 btn btn-danger px-3 py-0 btn-sm br-50px cursorDefault">{t('Expired')}</h5>
                                    : <span className="d-none"></span>
                                  }
                                </div>
                                <div className="d-flex align-items-start w-100">
                                  <img alt='' src={`${trainer.credentialId.avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                  <div className="mx-1">
                                    <p className="m-0 text-black">{trainer.credentialId.userName}</p>
                                    {/* <span className="wordBreakBreakAll text-black">{trainer.credentialId.email}</span> */}
                                    {/* Tusar phone added */}
                                    <small className="dirltrtar d-inline-block text-black">{trainer.mobileNo}</small>
                                    {(trainerExtend ? (new Date(trainerExtend).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : (new Date(trainerEnd).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))
                                      ? <h5 className="m-0 text-orange d-none">{t('Expired')}</h5>
                                      : <div className="d-flex justify-content-between align-items-start flex-wrap">
                                        <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                                          <small className="w-100 text-black">{dateToDDMMYYYY(trainerStart)}</small>
                                        </div>
                                    -
                                    <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                                          <small className="w-100 text-right text-black">{dateToDDMMYYYY(trainerEnd)}</small>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className="underline my-3"></div>
                    </li>
                  )
                } else if (!startDate && !endDate) {
                  return (
                    <li key={i} className="d-block col-12 px-0">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-end align-items-center pb-2">
                          <small className="text-secondary">{t('Payment Status')}</small>
                          {paidStatus === 'Paid'
                            ? <button className="btn btn-success badge-pill btn-sm px-3 mx-1 py-0 w-100px" data-toggle="modal" data-target="#allreadyPaid"><small className="mx-1">{t(`${paidStatus}`)}</small><small className="iconv1 iconv1-arrow-down mx-1"></small></button>
                            : <button className="btn btn-danger badge-pill btn-sm px-3 mx-1 py-0 w-100px" data-toggle="modal" data-target="#notYetPaid" onClick={() => this.onClickPayButton(packageName, totalAmount, _id, i)}><small className="mx-1">{t(`${paidStatus}`)}</small><small className="iconv1 iconv1-arrow-down mx-1"></small></button>
                          }
                        </div>
                        <div className="col-12 col-lg-5">
                          <h5 className="">{packageName}</h5>
                          <button disabled={paidStatus === 'UnPaid'} className="btn btn-success btn-sm px-3 m-1" onClick={() => this.handleStartPackage(this.props.memberById._id, pack._id, periodDays, trainerFees, paidStatus, doneFingerAuth)}>Start Package</button>
                        </div>
                        <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center flex-column py-3">

                        </div>
                        {trainer &&
                          <div className="col-12 col-lg-5 d-flex align-items-stretch">
                            <div className="border border-info rounded alert-primary w-100 d-flex align-items-center">
                              <div className="d-flex p-2 w-100 flex-wrap">
                                <div className="d-flex justify-content-between pb-1 w-100 align-items-start">
                                  <h6 className="font-weight-bold text-black">{t('Trainer Details')}</h6>
                                </div>
                                <div className="d-flex align-items-start w-100">
                                  <img alt='' src={`${trainer.credentialId.avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                  <div className="mx-1">
                                    <p className="m-0 text-black">{trainer.credentialId.userName}</p>
                                    {/* <span className="wordBreakBreakAll d-inline-block text-body">{trainer.credentialId.email}</span> */}
                                    {/* Tusar phone added */}
                                    <small className="dirltrtar d-inline-block text-black">{trainer.mobileNo}</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className="underline my-3"></div>
                    </li>
                  )
                } else {
                  return null
                }
              })}
            </ul>

            <div className="modal fade commonYellowModal" id="allreadyPaid">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">{t('Payment')}</h4>
                    <button type="button" className="close" data-dismiss="modal">
                      <span className="iconv1 iconv1-close"></span>
                    </button>
                  </div>
                  <div className="modal-body px-0">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-12 py-3 text-center">
                          <span className="justify-content-center align-items-center d-inline-flex rounded-circle w-50px h-50px" style={{ backgroundColor: 'rgb(139, 196, 64)' }}>
                            <h4 className="iconv1 iconv1-tick m-0"><span className="path1"></span><span className="path2"></span></h4>
                          </span>
                          <h3 className="font-weight-normal pt-3 pb-2 mt-2">{t('You have already paid')}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade commonYellowModal" id="notYetPaid" ref='notYetPaid'>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">{t('Payment')}</h4>
                    <button type="button" ref='notYetPaidClose' className="close" data-dismiss="modal">
                      <span className="iconv1 iconv1-close"></span>
                    </button>
                  </div>
                  <div className="modal-body px-0">
                    <form className="container-fluid">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group position-relative">
                            <label htmlFor="packageName" className="m-0 text-secondary mx-sm-2">{t('Package Name')}</label>
                            <input disabled type="text" autoComplete="off" className="form-control bg-light inlineFormInputs w-100 mx-sm-2" value={this.state.packageName} id="packageName" />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group position-relative">
                            <label htmlFor="amountpay" className="mx-sm-2 inlineFormLabel mb-1">{t('Amount')}</label>
                            <div className={this.state.multipleE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center"}>
                              <label htmlFor="amountpay" className="text-danger my-0 mx-1">{this.props.defaultCurrency}</label>
                              <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="amountpay" value={this.state.totalAmount.toFixed(3)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group inlineFormGroup flex-shrink-1 flex-grow-1">
                            <label className="mx-sm-2 inlineFormLabel mb-1">{t('Payment Method')}</label>
                            <div className="w-100 d-flex flex-wrap">
                              <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                <input type="radio" className="custom-control-input" id="cashRadio" name="cardOrCasOrMultiple" checked={this.state.paidType === 'Cash'} onChange={() => this.setPaidType('Cash')} />
                                <label className="custom-control-label" htmlFor="cashRadio">{t('Cash')}</label>
                              </div>
                              <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                <input type="radio" className="custom-control-input" id="cardRadio" name="cardOrCasOrMultiple" checked={this.state.paidType === 'Card'} onChange={() => this.setPaidType('Card')} />
                                <label className="custom-control-label" htmlFor="cardRadio">{t('Card')}</label>
                              </div>
                              <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                <input type="radio" className="custom-control-input" id="multipleRadio" name="cardOrCasOrMultiple" checked={this.state.paidType === 'Multiple'} onChange={() => this.setPaidType('Multiple')} />
                                <label className="custom-control-label" htmlFor="multipleRadio">{t('Multiple')}</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {(paidType === 'Multiple') &&
                          <div className="col-12">
                            <div className="form-group inlineFormGroup">
                              <label htmlFor="addDigital" className="mx-sm-2 inlineFormLabel mb-1">{t('Digital')}</label>
                              <div className={this.state.digitalE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center"}>
                                <label htmlFor="addDigital" className="text-danger my-0 mx-1">{this.props.defaultCurrency}</label>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="addDigital" value={digital} onChange={(e) => this.setDigital(e)} />
                              </div>
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.digitalE}</small>
                              </div>
                            </div>
                          </div>
                        }
                        {(paidType === 'Multiple') &&
                          <div className="col-12">
                            <div className="form-group inlineFormGroup">
                              <label htmlFor="addCash" className="mx-sm-2 inlineFormLabel mb-1">{t('Cash')}</label>
                              <div className={this.state.cashE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center"}>
                                <label htmlFor="addCash" className="text-danger my-0 mx-1">{this.props.defaultCurrency}</label>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="addCash" value={cash} onChange={(e) => this.setCash(e, totalLeftAfterDigital)} />
                              </div>
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.cashE}</small>
                              </div>
                            </div>
                          </div>
                        }
                        {(paidType === 'Multiple') &&
                          <div className="col-12">
                            <div className="form-group inlineFormGroup">
                              <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                              <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center">
                                <label htmlFor="addCard" className="text-danger my-0 mx-1">{this.props.defaultCurrency}</label>
                                <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="addCard" value={card.toFixed(3)} />
                              </div>
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                              </div>
                            </div>
                          </div>
                        }
                        {(paidType === 'Cash' || paidType === 'Card') &&
                          <div className="col-12">
                            <div className="form-group inlineFormGroup">
                              <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Amount')}</label>
                              <div className={this.state.multipleE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center"}>
                                <label htmlFor="addCard" className="text-danger my-0 mx-1">{this.props.defaultCurrency}</label>
                                <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="addCard" value={this.state.totalAmount.toFixed(3)} />
                              </div>
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.multipleE}</small>
                              </div>
                            </div>
                          </div>
                        }
                        {(paidType === 'Card' || paidType === 'Multiple') &&
                          <div className="col-12">
                            <div className="form-group inlineFormGroup">
                              <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                              <div className={this.state.cardNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center"}>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="addCardNumber" value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)} />
                              </div>
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.cardNumberE}</small>
                              </div>
                            </div>
                          </div>
                        }
                        {/* {(this.state.paidType === 'Card' || this.state.paidType === 'Multiple') &&
                          <div className="col-12">
                            <div className="form-group position-relative">
                              <label htmlFor="lastDigits" className="m-0 text-secondary mx-sm-2">Last 4 digits card Number</label>
                              <input type="number" autoComplete="off" className="form-control inlineFormInputs w-100 mx-sm-2" id="lastDigits"
                                value={this.state.cardNumber} onChange={(e) => this.setState({ cardNumber: e.target.value })} />
                            </div>
                          </div>
                        } */}
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="form-group inlineFormGroup">
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
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="bankName" className="mx-sm-2 inlineFormLabel mb-1">{t('Bank Name')}</label>
                      <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" id="bankName" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="CheckNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Check Number')}</label>
                      <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" id="CheckNumber" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="CheckDate" className="mx-sm-2 inlineFormLabel mb-1">{t('Check Date')}</label>
                      <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" id="CheckDate" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="form-group inlineFormGroup">
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
                        <div className="col-12 pt-3">
                          <div className="justify-content-sm-end d-flex pt-3 pb-2">
                            <button type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handlePay()}>{t('Pay')}</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="col-12">
            <h5 className="text-secondary">{t('Package History')}</h5>
          </div>
          <div className="col-12 tableTypeStriped">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Package Name')}</th>
                    <th>{t('From Date')}</th>
                    <th>{t('To Date')}</th>
                    <th>{t('Amount')}</th>
                    <th>{t('Trainer')}</th>
                    <th className="text-center">Installments</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {packageDetails && packageDetails.map((pack, i) => {
                    const { startDate, endDate, packages: { packageName }, totalAmount, trainer } = pack

                    return (
                      <tr key={i}>
                        <td>{packageName}</td>
                        <td>{dateToDDMMYYYY(startDate)}</td>
                        <td>{dateToDDMMYYYY(endDate)}</td>
                        <td className="text-danger font-weight-bold"><span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span>{totalAmount.toFixed(3)}</span></td>
                        <td>{trainer ? trainer.credentialId.userName : 'NA'}</td>
                        {/* <td className="text-center">
                          <span className="bg-warning action-icon"><span className="iconv1 iconv1-download"></span></span>
                        </td> */}
                        <td className="text-center">No</td>
                        <td className="text-center">
                          <span class="badge badge-pill badge-primary px-3 py-2 cursorPointer" data-toggle="modal" data-target="#InstallmentDetails">Details</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ------------Pop up Installments table details------------ */}

            <div className="modal fade commonYellowModal" id="InstallmentDetails">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Installments</h4>
                    <button type="button" className="close align-self-center" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                  </div>
                  <div className="modal-body px-4">
                    <div className="d-flex flex-wrap justify-content-between p-1">
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">package Name</h6>
                        <h6 className="text-danger">One month gold package</h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">Total Amount</h6>
                        <h6 className="text-danger"><b>$500</b></h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">Paid Amount</h6>
                        <h6 className="text-danger"><b>$200</b></h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">Remaining Amount</h6>
                        <h6 className="text-danger"><b>$300</b></h6>
                      </div>
                    </div>
                    <h5 className="m-1 py-3"><b>Installment History</b></h5>
                    <div className="table-responsive">
                      <table className="table table-striped InstallmentTable">
                        <thead>
                          <tr className="border">
                            <th>Installment Type</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Paid Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Installment 1</td>
                            <td className="text-danger font-weight-bold">$ 300</td>
                            <td>22/02/2020</td>
                            <td>22/02/2020</td>
                            {/* <td className="text-danger font-weight-bold">Pending</td> */}
                            <td className="text-success font-weight-bold">Paid</td>
                          </tr>
                          <tr>
                            <td>Installment 1</td>
                            <td className="text-danger font-weight-bold">$ 300</td>
                            <td>22/02/2020</td>
                            <td>22/02/2020</td>
                            <td className="text-danger font-weight-bold">Pending</td>
                            {/* <td className="text-success font-weight-bold">Paid</td> */}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ------------Pop up Installments table details Ends------------ */}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ member: { memberById }, currency: { defaultCurrency } }) {
  return {
    memberById,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(PackageDetails))