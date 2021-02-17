import React, { Component } from 'react'
import { DonutChart } from '../../Layout'
import { connect } from 'react-redux'
import { dateToDDMMYYYY, calculateDays, dateToHHMM } from '../../../utils/apis/helpers'
import { validator } from '../../../utils/apis/helpers'
import { updateMemberDetails } from '../../../actions/member.action'
import { startPackage } from '../../../actions/bioStar.action'
import $ from 'jquery'
import { findDOMNode } from 'react-dom';
import { withTranslation } from 'react-i18next'
import { GET_ALERT_ERROR } from '../../../actions/types'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import instaimg from '../../../assets/img/insta.jpg'
import QRCode from 'qrcode.react'

class PackageDetails extends Component {

  state = {
    url: this.props.match.url,
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
    Installments: [],
    installmentTotalAmount: 0,
    installmentPaidAmount: 0,
    installmentRemainAmount: 0,
    installmentPackageName: '',
    installmentTrainerName: '',
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

  onClickPayButton(packageName, totalAmount, packageId, index) {
    this.setState({
      packageName,
      totalAmount,
      packageId,
      index
    })
  }

  handlePrint() {
    var w = window.open('', 'new div', 'height=400,width=600');
    var printOne = $('#newPrint').html();
    w.document.body.innerHTML = printOne
    w.window.print();
    w.document.close();
    return false;
  }

  setInstallments(Installments, installmentTotalAmount, installmentPackageName) {
    let paidAmount = 0
    if (Installments && Installments.length) {
      Installments.forEach((installment) => {
        if (installment.paidStatus === 'Paid') {
          paidAmount += installment.actualAmount ? installment.actualAmount : installment.totalAmount
        }
      })
    }
    let remainAmount = parseFloat(installmentTotalAmount) - parseFloat(paidAmount)
    if (Installments && Installments.length) {
      this.setState({ Installments, installmentTotalAmount, installmentPaidAmount: paidAmount, installmentRemainAmount: remainAmount, installmentPackageName })
    }
  }


  setTrainerInstallments(Installments, installmentTotalAmount, installmentTrainerName, installmentPackageName) {
    let paidAmount = 0
    if (Installments && Installments.length) {
      Installments.forEach((installment) => {
        if (installment.paidStatus === 'Paid') {
          paidAmount += installment.actualAmount ? installment.actualAmount : installment.totalAmount
        }
      })
    }
    let remainAmount = parseFloat(installmentTotalAmount) - parseFloat(paidAmount)
    if (Installments && Installments.length) {
      this.setState({
        Installments, installmentTotalAmount, installmentPaidAmount: paidAmount, installmentRemainAmount: remainAmount,
        installmentTrainerName, installmentPackageName: `${installmentTrainerName}-${installmentPackageName}`
      })
    }
  }

  setPaidType(type) {
    this.setState({
      paidType: type,
      cash: 0,
      card: 0,
      digital: 0,
      cheque: 0
    })
  }

  setDigital(e) {
    const { t } = this.props
    const { totalAmount } = this.state
    this.setState({ ...validator(e, 'digital', 'numberText', [t('Enter amount')]), ...{ card: 0, cheque: 0, cardE: '', chequeE: '' } }, () => {
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
    this.setState({ ...validator(e, 'cash', 'numberText', [t('Enter amount'), t('Enter valid amount')]), ...{ cheque: 0, chequeE: '' } }, () => {
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
        if ((parseInt(totalAmount) === parseInt((+cash || 0) + (+card || 0) + (+digital || 0))) && cardNumber && !cashE && !cardE && !digitalE) {
          packageDetails[index].cashAmount = parseFloat(cash)
          packageDetails[index].digitalAmount = parseFloat(digital)
          packageDetails[index].cardAmount = card
          packageDetails[index].cardNumber = cardNumber
          packageDetails[index].totalAmount = totalAmount
          memberInfo.packageDetails = packageDetails
          this.props.dispatch(updateMemberDetails(memberInfo._id, memberInfo))
          $(el).click();
        } else {

          if (parseInt(totalAmount) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0))) this.setState({ cashE: t('Enter amount') })
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
      const { packageDetails, doneFingerAuth, branch, credentialId, memberId, mobileNo } = this.props.memberById
      const { cash, paidType, card, digital, totalAmount, installmentReceipt } = this.state

      let totalLeftAfterDigital = totalAmount - digital
      let totalLeftAfterCash = totalAmount - digital - cash

      return (
        <div className={this.state.url === `/members-details/${this.props.memberId}` ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
          <div className="col-12">
            <ul className="row px-0">
              {packageDetails && packageDetails.map((pack, i) => {
                const { startDate, endDate, extendDate, reactivationDate, packages: { packageName, _id, period: { periodDays } },
                  paidStatus, trainerDetails } = pack
                let trainer = null
                if (trainerDetails && trainerDetails.length) {
                  trainer = trainerDetails[trainerDetails.length - 1]
                }
                if ((extendDate && reactivationDate) ? new Date().setHours(0, 0, 0, 0) <= new Date(extendDate).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0) <= new Date(endDate).setHours(0, 0, 0, 0)) {
                  return (
                    <li key={i} className="d-block col-12 px-0">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-end align-items-center pb-2">
                          <span className="text-secondary">{t('Payment Status')}</span>
                          {(paidStatus === 'Paid' || paidStatus === 'Installment')
                            ? <button className="btn btn-success badge-pill btn-sm px-3 py-05 d-inline-flex justify-content-between align-items-center mx-1 py-0 w-100px text-nowrap" data-toggle="modal" data-target="#allreadyPaid"><span className="mx-1">{t(`Paid`)}</span><span className="iconv1 iconv1-arrow-down mx-1"></span></button>
                            : <button className="btn btn-danger badge-pill btn-sm px-3 py-05 d-inline-flex justify-content-between align-items-center mx-1 py-0 w-100px text-nowrap" data-toggle="modal" data-target="#notYetPaid" onClick={() => this.onClickPayButton(packageName, totalAmount, _id, i)}><span className="mx-1">{t(`${paidStatus}`)}</span><span className="iconv1 iconv1-arrow-down mx-1"></span></button>
                          }
                        </div>
                        <div className="col-12 col-lg-5">
                          <h5 className="">{packageName}</h5>
                          <div className="d-flex justify-content-between align-items-start flex-wrap">
                            <div className="d-flex justify-content-start flex-wrap flexBasis-0">
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
                              dataValue={calculateDays(new Date(startDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? new Date() : startDate, endDate)}
                              value={calculateDays(new Date(startDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? new Date() : startDate, endDate) / calculateDays(startDate, endDate) * 100}
                              size={90}
                              strokewidth={12}
                              text1={t('Days')}
                              text2={t('Left')}
                            />
                          }
                        </div>
                        {trainer && trainer.trainer.credentialId &&
                          <div className="col-12 col-lg-5 d-flex align-items-stretch">
                            <div className="border border-info rounded alert-primary w-100 d-flex align-items-center">
                              <div className="d-flex p-2 w-100 flex-wrap">
                                <div className="d-flex justify-content-between pb-1 w-100 align-items-start">
                                  <h6 className="font-weight-bold text-black">{t('Trainer Details')}</h6>
                                  {(trainer.trainerExtend ? (new Date(trainer.trainerExtend).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : (new Date(trainer.trainerEnd).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))
                                    ? <h5 className="m-0 btn btn-danger px-3 py-0 btn-sm br-50px cursorDefault">{t('Expired')}</h5>
                                    : <span className="d-none"></span>
                                  }
                                </div>
                                <div className="d-flex align-items-start w-100">
                                  <img alt='' src={`/${trainer.trainer.credentialId.avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                  <div className="mx-1">
                                    <p className="m-0 text-black">{trainer.trainer.credentialId.userName}</p>
                                    {/* <span className="wordBreakBreakAll text-black">{trainer.credentialId.email}</span> */}
                                    {/* Tusar phone added */}
                                    <small className="dirltrtar d-inline-block text-black">{trainer.trainer.mobileNo}</small>
                                    {(trainer.trainerExtend ? (new Date(trainer.trainerExtend).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : (new Date(trainer.trainerEnd).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))
                                      ? <h5 className="m-0 text-orange d-none">{t('Expired')}</h5>
                                      : <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                                          <small className="w-100 text-black">{dateToDDMMYYYY(trainer.trainerStart)}</small>
                                        </div>
                                        <span className="px-1">-</span>
                                        <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                                          <small className="w-100 text-right text-black">{dateToDDMMYYYY(trainer.trainerEnd)}</small>
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
                          <span className="text-secondary">{t('Payment Status')}</span>
                          {paidStatus === 'Paid'
                            ? <button className="btn btn-success badge-pill btn-sm px-3 py-05 d-inline-flex justify-content-between align-items-center mx-1 py-0 w-100px text-nowrap" data-toggle="modal" data-target="#allreadyPaid"><span className="mx-1">{t(`${paidStatus}`)}</span><span className="iconv1 iconv1-arrow-down mx-1"></span></button>
                            : <button className="btn btn-danger badge-pill btn-sm px-3 py-05 d-inline-flex justify-content-between align-items-center mx-1 py-0 w-100px text-nowrap" data-toggle="modal" data-target="#notYetPaid" onClick={() => this.onClickPayButton(packageName, totalAmount, _id, i)}><span className="mx-1">{t(`${paidStatus}`)}</span><span className="iconv1 iconv1-arrow-down mx-1"></span></button>
                          }
                        </div>
                        <div className="col-12 col-lg-5">
                          <h5 className="">{packageName}</h5>
                          <button disabled={paidStatus === 'UnPaid'} className="btn btn-success btn-sm px-3 m-1" onClick={() => this.handleStartPackage(this.props.memberById._id, pack._id, periodDays, paidStatus, doneFingerAuth)}>Start Package</button>
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
                            <div className="form-group inlineFormGroup  mb-3">
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
                            <div className="form-group inlineFormGroup  mb-3">
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
                            <div className="form-group inlineFormGroup  mb-3">
                              <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                              <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center">
                                <label htmlFor="addCard" className="text-danger my-0 mx-1">{this.props.defaultCurrency}</label>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} onChange={(e) => this.setCard(e, totalLeftAfterCash)} />
                              </div>
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                              </div>
                            </div>
                          </div>
                        }
                        {(paidType === 'Cash' || paidType === 'Card') &&
                          <div className="col-12">
                            <div className="form-group inlineFormGroup  mb-3">
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
                            <div className="form-group inlineFormGroup  mb-3">
                              <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                              <div className={this.state.cardNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center"}>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="addCardNumber"
                                  value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)} />
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
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                          <div className="form-group inlineFormGroup">
                            <label className="mx-sm-2 inlineFormLabel mb-1"></label>
                            <div className="d-flex">
                              <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                <input type="checkbox" className="custom-control-input" id="check" name="checkorNo"
                                  checked={this.state.showCheque} onChange={() => this.setCheque(this.state.totalAmount)}
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
          <div className="col-12 px-0">
            <h5 className="text-secondary">{t('History')}</h5>
          </div>
          <div className="col-12 px-0">
            <nav className="commonNavForTab">
              <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab1001" role="tablist">
                <a className="nav-link active" data-toggle="tab" href="#submenu1" role="tab" >{t('Package History')}</a>
                <a className="nav-link" data-toggle="tab" href="#submenu2" role="tab" >{t('Trainer History')}</a>
              </div>
            </nav>
          </div>
          <div className="tab-content" >
            <div className="tab-pane fade show active" id="submenu1" role="tabpanel" >
              <div className="col-12 tableTypeStriped">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>{t('Package Name')}</th>
                        <th>{t('From Date')}</th>
                        <th>{t('To Date')}</th>
                        <th>{t('Amount')}</th>
                        {/* <th>{t('Trainer')}</th> */}
                        <th className="text-center">{t('Installments')}</th>
                        <th className="text-center">{t('Action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageDetails && packageDetails.map((pack, i) => {
                        const { startDate, endDate, packages: { packageName, amount }, totalAmount, paidStatus, Installments } = pack
                        return (
                          <tr key={i}>
                            <td>{packageName}</td>
                            <td>{dateToDDMMYYYY(startDate)}</td>
                            <td>{dateToDDMMYYYY(endDate)}</td>
                            {totalAmount
                              ? <td className="text-danger font-weight-bold"><span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span>{totalAmount.toFixed(3)}</span></td>
                              : <td className="text-danger font-weight-bold"><span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span>{amount.toFixed(3)}</span></td>}
                            {/* <td>{trainer ? trainer.credentialId.userName : 'NA'}</td> */}
                            {/* <td className="text-center">
                              <span className="bg-warning action-icon"><span className="iconv1 iconv1-download"></span></span>
                            </td> */}
                            <td className="text-center">{paidStatus === 'Installment' ? t('Yes') : t('No')}</td>
                            {paidStatus === 'Installment'
                              ? <td className="text-center">
                                <span className="badge badge-pill badge-primary px-3 py-2 cursorPointer" data-toggle="modal" data-target="#InstallmentDetails"
                                  onClick={() => this.setInstallments(Installments, amount, packageName)}>{t('Payment Details')}</span>
                              </td>
                              : <td className="text-center">
                                {/* <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                                onClick={() => this.setState({ installmentReceipt: order })}></span> */}
                                <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                                  onClick={() => this.setState({ installmentReceipt: pack, installmentPackageName: packageName })} ></span>
                              </td>
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {/* <div className="col-12">Paginate</div> */}
              </div>
            </div>

            <div className="tab-pane fade" id="submenu2" role="tabpanel" >
              <div className="col-12 tableTypeStriped">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>{t('Trainer Name')}</th>
                        <th>{t('Package Name')}</th>
                        <th>{t('Start Date')}</th>
                        <th>{t('End Date')}</th>
                        <th>{t('Amount')}</th>
                        <th className="text-center">{t('Action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageDetails && packageDetails.map((pack) => {
                        const { packages: { packageName }, trainerDetails } = pack
                        return (
                          trainerDetails && trainerDetails.map((ta, j) => {
                            const { trainerStart, trainerEnd, trainer: { credentialId: { userName, avatar } }, trainerFees: { amount }, Installments } = ta
                            return (
                              <tr key={j}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img src={`/${avatar.path}`} alt="" className="w-30px h-30px br-50 mr-2" />
                                    <h5 className="my-2">{userName}</h5>
                                  </div>
                                </td>
                                <td>{packageName}</td>
                                <td className="dirltrtar">{dateToDDMMYYYY(trainerStart)}</td>
                                <td className="dirltrtar">{dateToDDMMYYYY(trainerEnd)}</td>
                                <td className="text-danger font-weight-bold"><span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span>{amount}</span></td>
                                {/* tushar if installment */}
                                {Installments.length > 0
                                  ? <td className="text-center">
                                    <span className="badge badge-pill badge-primary px-3 py-2 cursorPointer" data-toggle="modal" data-target="#InstallmentDetails1"
                                      onClick={() => this.setTrainerInstallments(Installments, amount, userName, packageName)}>{t('Payment Details')}</span>
                                  </td>
                                  : <td className="text-center">
                                    {/* <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                                  onClick={() => this.setState({ installmentReceipt: order })}></span> */}
                                    <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                                      onClick={() => this.setState({ installmentReceipt: ta, installmentPackageName: `${userName}-${packageName}` })} ></span>
                                  </td>
                                }
                              </tr>
                            )
                          })
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="col-12">Paginate</div> */}
            </div>

          </div>

          {/* ------------Pop up Installments details------------ */}
          {this.state.Installments && this.state.Installments.length > 0 &&
            <div className="modal fade commonYellowModal" id="InstallmentDetails">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">{t('Payment Details')}</h4>
                    <button type="button" className="close align-self-center" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                  </div>
                  <div className="modal-body px-4">
                    <div className="d-flex flex-wrap justify-content-between p-1">
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Package Name')}</h6>
                        <h6 className="text-danger">{this.state.installmentPackageName}</h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Total Amount')}</h6>
                        <h6 className="text-danger"><b>{this.props.defaultCurrency} {this.state.installmentTotalAmount}</b></h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Paid Amount')}</h6>
                        <h6 className="text-danger"><b>{this.props.defaultCurrency} {this.state.installmentPaidAmount}</b></h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Remaining Amount')}</h6>
                        <h6 className="text-danger"><b>{this.props.defaultCurrency} {this.state.installmentRemainAmount}</b></h6>
                      </div>
                    </div>
                    <h5 className="m-1 py-3"><b>{t('Installment History')}</b></h5>
                    <div className="table-responsive">
                      <table className="table table-striped InstallmentTable">
                        <thead>
                          <tr className="border">
                            <th>{t('Installment Type')}</th>
                            <th>{t('Amount')}</th>
                            <th>{t('Due Date')}</th>
                            <th>{t('Paid Date')}</th>
                            <th>{t('Status')}</th>
                            <th className="text-center">{t('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.Installments.map((installment, k) => {
                            return (
                              <tr key={k}>
                                <td>Installment {k + 1}</td>
                                <td className="text-danger font-weight-bold">{this.props.defaultCurrency} {installment.actualAmount ? installment.actualAmount : installment.totalAmount}</td>
                                <td>{dateToDDMMYYYY(installment.dueDate)}</td>
                                <td>{dateToDDMMYYYY(installment.dateOfPaid)}</td>
                                {installment.paidStatus === 'Paid' ? <td className="text-success font-weight-bold">{t('Paid')}</td> : <td className="text-danger font-weight-bold">{t('Pending')}</td>}
                                {/* tushar new button here */}
                                {installment.paidStatus === 'Paid' &&
                                  <td className="text-center">
                                    <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                                      onClick={() => this.setState({ installmentReceipt: installment })} ></span>
                                  </td>
                                }
                                {/* -/ tushar new button here over */}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.Installments && this.state.Installments.length > 0 &&
            <div className="modal fade commonYellowModal" id="InstallmentDetails1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">{t('Payment Details')}</h4>
                    <button type="button" className="close align-self-center" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                  </div>
                  <div className="modal-body px-4">
                    <div className="d-flex flex-wrap justify-content-between p-1">
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Trainer Name')}</h6>
                        <h6 className="text-danger">{this.state.installmentTrainerName}</h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Total Amount')}</h6>
                        <h6 className="text-danger"><b>{this.props.defaultCurrency} {this.state.installmentTotalAmount}</b></h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Paid Amount')}</h6>
                        <h6 className="text-danger"><b>{this.props.defaultCurrency} {this.state.installmentPaidAmount}</b></h6>
                      </div>
                      <div className="m-1">
                        <h6 className="font-weight-bold mb-1">{t('Remaining Amount')}</h6>
                        <h6 className="text-danger"><b>{this.props.defaultCurrency} {this.state.installmentRemainAmount}</b></h6>
                      </div>
                    </div>
                    <h5 className="m-1 py-3"><b>{t('Installment History')}</b></h5>
                    <div className="table-responsive">
                      <table className="table table-striped InstallmentTable">
                        <thead>
                          <tr className="border">
                            <th>{t('Installment Type')}</th>
                            <th>{t('Amount')}</th>
                            <th>{t('Due Date')}</th>
                            <th>{t('Paid Date')}</th>
                            <th>{t('Status')}</th>
                            <th className="text-center">{t('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.Installments.map((installment, k) => {
                            return (
                              <tr key={k}>
                                <td>Installment {k + 1}</td>
                                <td className="text-danger font-weight-bold">{this.props.defaultCurrency} {installment.actualAmount ? installment.actualAmount : installment.totalAmount}</td>
                                <td>{dateToDDMMYYYY(installment.dueDate)}</td>
                                <td>{dateToDDMMYYYY(installment.dateOfPaid)}</td>
                                {installment.paidStatus === 'Paid' ? <td className="text-success font-weight-bold">{t('Paid')}</td> : <td className="text-danger font-weight-bold">{t('Pending')}</td>}
                                {installment.paidStatus === 'Paid' &&
                                  <td className="text-center">
                                    <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                                      onClick={() => this.setState({ installmentReceipt: installment })} ></span>
                                  </td>
                                }
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* ------------Pop up Installments details Ends------------ */}






          {/* --------------Receipt Modal-=--------------- */}
          {installmentReceipt &&
            <div className="modal fade commonYellowModal" id="ReceiptModal">
              <div className="modal-dialog modal-lg" id="ReceiptModal2">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">{t('Receipt')}</h4>
                    <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                  </div>
                  <div className="modal-body">
                    <div className="container">
                      <div className="text-center my-3">
                        <img alt='' src={branch.avatar ? `/${branch.avatar.path}` : ''} className="mb-2" width="100" />
                      </div>
                      <h4 className="border-bottom border-dark text-center font-weight-bold pb-1">{t('Tax Invoice')}</h4>
                      <div className="row px-5 justify-content-between">
                        <div className="col-free p-3">
                          <div className="mb-3">
                            <label className="m-0 font-weight-bold">{t('VAT Reg Number')}</label>
                            <p className="">{branch.vatRegNo}</p>
                          </div>
                          <div className="">
                            <label className="m-0 font-weight-bold">{t('Address')}</label>
                            <p className="whiteSpaceNormal mnw-150px mxw-200px">{branch.address}</p>
                          </div>
                        </div>
                        <div className="col-free p-3">
                          <div className="mb-3">
                            <label className="m-0 font-weight-bold">{t('Tax Invoice No')}</label>
                            <p className="">{installmentReceipt.orderNo}</p>
                          </div>
                          <div className="">
                            <label className="m-0 font-weight-bold">{t('Date & Time')}</label>
                            <p className="">{dateToDDMMYYYY(installmentReceipt.dateOfPaid)} {dateToHHMM(installmentReceipt.timeOfPaid)}</p>
                          </div>
                        </div>
                        <div className="col-free p-3">
                          <div className="">
                            <label className="m-0 font-weight-bold">{t('Receipt Total')}</label>
                            <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(installmentReceipt.totalAmount).toFixed(3)}</p>
                          </div>
                          <div className="">
                            <label className="m-0 font-weight-bold">{t('Telephone')}</label>
                            <p className="">{branch.telephone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">{t('ID')}:</span>
                            <span className="px-1">{memberId}</span>
                          </h6>
                        </div>
                        <h6 className="font-weight-bold m-1">{credentialId.userName}</h6>
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">{t('Mob')}:</span>
                            <span className="px-1">{mobileNo}</span>
                          </h6>
                        </div>
                      </div>
                      <div className="table-responsive RETable">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>{t('Name')}</th>
                              <th className="w-50px"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{this.state.installmentPackageName} {installmentReceipt.installmentName ? installmentReceipt.installmentName : ''}</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>
                                <div className="text-right my-1">{t('Amount Total')} :</div>
                                {parseFloat(installmentReceipt.discount) ?
                                  <div className="text-right my-1">{t('Discount')} :</div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.giftcard) ?
                                  <div className="text-right my-1">{t('Gift Card')} :</div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.vatAmount) ?
                                  <div className="text-right my-1">{t('VAT(5%)')} :</div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.digitalAmount) ?
                                  <div className="text-right my-1">{t('Digital')} :</div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.cashAmount) ?
                                  <div className="text-right my-1">{t('Cash')} :</div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.cardAmount) ?
                                  <div className="text-right my-1">{t('Card')} :</div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.chequeAmount) ?
                                  <div className="text-right my-1">{t('Cheque')} :</div>
                                  : <div></div>}
                                {installmentReceipt.bankName ?
                                  <div className="text-right my-1">{t('Bank Name')} :</div>
                                  : <div></div>}
                                {installmentReceipt.chequeNumber ?
                                  <div className="text-right my-1">{t('Cheque Number')} :</div>
                                  : <div></div>}
                                {installmentReceipt.chequeDate ?
                                  <div className="text-right my-1">{t('Cheque Date')} :</div>
                                  : <div></div>}
                                <div className="text-right my-1">{t('Grand Total')} :</div>
                                <div className="text-right my-1">{t('Paid Amount')} :</div>
                                {installmentReceipt.cardNumber ?
                                  <div className="text-right my-1">{t('Card last four digit')} :</div>
                                  : <div></div>}
                              </td>
                              <td className="">
                                <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.actualAmount).toFixed(3)}</span></div>
                                {parseFloat(installmentReceipt.discount) ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.discount).toFixed(3)}</span></div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.giftcard) ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.giftcard).toFixed(3)}</span></div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.vatAmount) ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.vatAmount).toFixed(3)}</span></div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.digitalAmount) ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.digitalAmount).toFixed(3)}</span></div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.cashAmount) ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.cashAmount).toFixed(3)}</span></div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.cardAmount) ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.cardAmount).toFixed(3)}</span></div>
                                  : <div></div>}
                                {parseFloat(installmentReceipt.chequeAmount) ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.chequeAmount).toFixed(3)}</span></div>
                                  : <div></div>}
                                {installmentReceipt.bankName ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{installmentReceipt.bankName}</span></div>
                                  : <div></div>}
                                {installmentReceipt.chequeNumber ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{installmentReceipt.chequeNumber}</span></div>
                                  : <div></div>}
                                {installmentReceipt.chequeDate ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{dateToDDMMYYYY(installmentReceipt.chequeDate)}</span></div>
                                  : <div></div>}
                                <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.totalAmount).toFixed(3)}</span></div>
                                <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(installmentReceipt.totalAmount).toFixed(3)}</span></div>
                                {installmentReceipt.cardNumber ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{installmentReceipt.cardNumber}</span></div>
                                  : <div></div>}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex flex-wrap justify-content-between align-items-center my-4">
                        <div className="d-flex">
                          <div className="mr-3 text-center">
                            <img src={instaimg} alt="" className="w-30px" />
                            <h6 className="font-weight-bold mb-0 mt-1">{t('Follow Us')}</h6>
                          </div>
                          <div className="w-50px mr-3">
                            <QRCode value={`http://instagram.com/${branch.instaId}/`} renderAs='svg' width="50" height="50" />
                          </div>
                        </div>
                        {installmentReceipt.doneBy && <h6 className="font-weight-bold">{t('Served by')}: {installmentReceipt.doneBy.userName}</h6>}
                      </div>
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="text-center">
                          <h6 className="font-weight-bold">{t('Membership cannot be refunded or transferred to others.')}</h6>
                          <h6 className="font-weight-bold">{t('Thank You')}</h6>
                        </div>
                      </div>
                      <div className="text-center">
                        <button type="button" className="btn btn-success px-4 py-1 my-2" data-dismiss="modal" onClick={() => this.handlePrint()}>{t('Print Receipt')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* --------------Receipt Modal Ends-=--------------- */}

          {installmentReceipt &&
            <div className="PageBillWrapper d-none">
              <div style={{ width: "450px", padding: "15px", margin: "auto" }} id="newPrint">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={branch.avatar ? `/${branch.avatar.path}` : ''} width="200" style={{ width: "100px" }} alt="" />
                </div>
                <h5 style={{ textAlign: "center", margin: "19px 0" }}>{t('Tax Invoice')}</h5>
                <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>
                  <span>{branch.branchName}</span><br />
                  <span>{branch.address}</span><br />
                  <span>{t('Tel')} : {branch.telephone}</span><br />
                </p>
                <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>{t('VAT Reg No')} - {branch.vatRegNo}</p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: "0" }}>
                  <span style={{ paddingRight: "4px", fontSize: "14px", whiteSpace: "nowrap" }}>{dateToDDMMYYYY(installmentReceipt.dateOfPaid)} {dateToHHMM(installmentReceipt.timeOfPaid)}</span>
                  <span style={{ paddingLeft: "4px", fontSize: "14px", whiteSpace: "nowrap" }}>{t('Bill No')}:{installmentReceipt.orderNo}</span>
                </p>
                <div>
                  <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between" }}>
                    <span>{t('ID:')} <span style={{ padding: "10px" }}>{memberId}</span></span>
                    <span>{t('Mob:')} <span style={{ padding: "10px" }}>{mobileNo}</span></span>
                  </p>
                  <p style={{ display: "flex", textAlign: "center", justifyContent: "center", marginTop: "0" }}>
                    <span>{credentialId.userName}</span>
                  </p>
                </div>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr style={{ borderTop: "1px dashed #000" }}>
                      <td>{t('Name')}</td>
                    </tr>
                    <tr>
                      <td>{this.state.installmentPackageName} {installmentReceipt.installmentName ? installmentReceipt.installmentName : ''}</td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: "100%", textAlign: "right", borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>{t('Amount Total')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(installmentReceipt.actualAmount).toFixed(3)}</td>
                    </tr>
                    {parseFloat(installmentReceipt.discount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Discount')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(installmentReceipt.discount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(installmentReceipt.giftcard) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Giftcard')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(installmentReceipt.giftcard).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(installmentReceipt.vatAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('VAT')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(installmentReceipt.vatAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(installmentReceipt.digitalAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Digital')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(installmentReceipt.digitalAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(installmentReceipt.cashAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Cash')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(installmentReceipt.cashAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(installmentReceipt.cardAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(installmentReceipt.cardAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(installmentReceipt.cheque) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(installmentReceipt.cheque).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {installmentReceipt.bankName ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Bank Name')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{installmentReceipt.bankName}</td>
                      </tr>
                      : <tr></tr>}
                    {installmentReceipt.chequeNumber ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Number')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{installmentReceipt.chequeNumber}</td>
                      </tr>
                      : <tr></tr>}
                    {installmentReceipt.chequeDate ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Date')} {this.props.defaultCurrency}: </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{dateToDDMMYYYY(installmentReceipt.chequeDate)}</td>
                      </tr>
                      : <tr></tr>}
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Grand Total')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(installmentReceipt.totalAmount).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Paid Amount')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(installmentReceipt.totalAmount).toFixed(3)}</td>
                    </tr>
                    {installmentReceipt.cardNumber ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card last four digit')} :</td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{installmentReceipt.cardNumber}</td>
                      </tr>
                      : <tr></tr>}
                  </tbody>
                </table>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ marginRight: "10px", justifyContent: "center" }}>
                      <img src={instaimg} alt="" style={{ width: "30px", height: "30px" }} />
                    </div>
                    <QRCode value={`http://instagram.com/${branch.instaId}/`} renderAs='svg' width="50" height="50" />
                  </div>
                  {installmentReceipt.doneBy && <span>{t('Served by')}: {installmentReceipt.doneBy.userName}</span>}
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