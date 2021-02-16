import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { dateToDDMMYYYY, dateToHHMM, getPageWiseData, monthSmallNamesCaps, validator } from '../../utils/apis/helpers';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import { changeDueDateOfTrainerInstallment, getTrainerInstallment, payTrainerInstallments } from '../../actions/installment.action';
import Pagination from '../Layout/Pagination';
import { getAllVat } from '../../actions/vat.action';
import $ from 'jquery';
import { verifyAdminPassword } from '../../actions/privilege.action';
import { VERIFY_ADMIN_PASSWORD } from '../../actions/types';
import instaimg from '../../assets/img/insta.jpg'
import QRCode from 'qrcode.react';

class TrainerInstallment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingMonth: new Date().getMonth(),
      pendingYear: new Date().getFullYear(),
      showCheque: false,
      bankName: '',
      chequeNumber: '',
      chequeDate: '',
      cheque: 0,
      bankNameE: '',
      chequeNumberE: '',
      chequeDateE: '',
      chequeE: '',
      vat: 0,
      vatId: '',
      discount: 0,
      count: 0,
      tax: 0,
      discountMethod: 'percent',
      cashE: '',
      cash: 0,
      card: 0,
      cardE: '',
      digital: 0,
      digitalE: '',
      changeDueDate: new Date(),
      packagesDetailsId: '',
      installmentId: '',
      memberId: '',
      trainerDetailsId: '',
      subTotal: 0,
      password: '',
      passwordE: '',
      showPass: false,
      dueDate: new Date(),
      installmentName: '',
      url: this.props.match.url,
      packageReceipt: null,
      trainerAmount: 0
    }
    this.props.dispatch(getTrainerInstallment({ month: parseInt(this.state.pendingMonth), year: this.state.pendingYear }))
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
    if (((this.props.verifyPassword && this.props.verifyPassword) !== (prevProps.verifyPassword)) && this.props.verifyPassword === 'verified') {
      console.log("🚀 ~ file: TrainerInstallment.js ~ line 61 ~ TrainerInstallment ~ componentDidUpdate ~ this.props.verifyPassword", this.props.verifyPassword)
      const el = findDOMNode(this.refs.openDiscount1);
      $(el).click();
    }
  }

  handlePrint() {
    var w = window.open('', 'new div', 'height=400,width=600');
    var printOne = $('#newPrint').html();
    w.document.body.innerHTML = printOne
    w.window.print();
    w.document.close();
    this.setState(this.default)
    return false;
  }

  handleReceiptClose() {
    this.setState(this.default)
  }

  setMonthYear(pendingMonth, pendingYear) {
    this.setState({ pendingMonth, pendingYear }, () => {
      this.props.dispatch(getTrainerInstallment({ month: parseInt(this.state.pendingMonth), year: parseInt(this.state.pendingYear) }))
    })
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

  addDiscount(subTotal) {
    if (this.state.discountMethod === 'percent') {
      if (this.state.count && this.state.count <= 100) {
        this.setState({ discount: (parseFloat(this.state.count ? this.state.count : 0) / 100 * subTotal).toFixed(3), cash: 0, card: 0, digital: 0, cheque: 0, })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0, })
      }
    } else {
      if (this.state.count && this.state.count <= subTotal) {
        this.setState({ discount: parseFloat(this.state.count ? this.state.count : 0), cash: 0, card: 0, digital: 0, cheque: 0, })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0, })
      }
    }
  }

  verifyPassword() {
    const { password } = this.state
    const { t } = this.props
    if (password) {
      const postData = {
        password: password
      }
      this.props.dispatch({ type: VERIFY_ADMIN_PASSWORD, payload: 'null' })
      this.props.dispatch(verifyAdminPassword(postData))
    } else {
      if (!password) this.setState({ passwordE: t('Enter password') })
    }
  }

  handleSubmit() {
    const { packagesDetailsId, installmentId, memberId, changeDueDate, trainerDetailsId } = this.state
    const dueDateInfo = {
      packagesDetailsId, installmentId, memberId, dueDate: changeDueDate, trainerDetailsId
    }
    this.props.dispatch(changeDueDateOfTrainerInstallment(dueDateInfo))
  }

  setPayment(trainerAmount, branch, packagesDetailsId, installmentId, memberId, dueDate, installmentName, trainerDetailsId, trainerName) {
    this.setState({
      subTotal: trainerAmount, packagesDetailsId, installmentId, memberId, dueDate, installmentName, trainerDetailsId, trainerName
    })
    this.props.dispatch(getAllVat({ branch }))
  }

  handlePayment(totalAmount, totalVat) {
    const el = findDOMNode(this.refs.checkoutCloseModal1);
    const { t } = this.props
    const { packagesDetailsId, installmentId, memberId, dueDate, showCheque, cash, card, digital, cheque, bankName, trainerDetailsId,
      chequeNumber, chequeDate, discount, cardNumber, subTotal, cashE, cardE, digitalE } = this.state
    if (packagesDetailsId && installmentId && memberId && dueDate && (parseInt(totalAmount) === parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) && !cardE && !cashE && !digitalE) {
      let memberInfo = {
        packagesDetailsId, installmentId, memberId, dueDate, trainerDetailsId
      }
      if (showCheque) {
        memberInfo = {
          ...memberInfo, ...{
            paidStatus: 'Paid', cashAmount: cash ? parseFloat(cash) : 0, cardAmount: card ? parseFloat(card) : 0, digitalAmount: digital ? digital : 0,
            cardNumber: cardNumber, actualAmount: subTotal, totalAmount: totalAmount, discount: parseFloat(discount), vatAmount: totalVat,
            chequeAmount: cheque ? parseFloat(cheque) : 0, bankName, chequeNumber, chequeDate
          }
        }
      } else {
        memberInfo = {
          ...memberInfo, ...{
            paidStatus: 'Paid', cashAmount: cash ? parseFloat(cash) : 0, cardAmount: card ? parseFloat(card) : 0, digitalAmount: digital ? digital : 0,
            cardNumber: cardNumber, actualAmount: subTotal, totalAmount: totalAmount, discount: parseFloat(discount), vatAmount: totalVat,
          }
        }
      }
      this.props.dispatch(payTrainerInstallments(memberInfo))
      $(el).click();
    } else {
      if (parseInt(totalAmount) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) this.setState({ cashE: t('Enter amount') })
    }
  }

  render() {
    const { t } = this.props
    const { pendingMonth, pendingYear, digital, cash, card, discount, discountMethod, count, subTotal, packageReceipt, trainerName, installmentName } = this.state
    let systemYears = []
    if (this.props.systemYear) {
      for (let i = new Date(this.props.systemYear.year).getFullYear(); i <= new Date().getFullYear(); i++) {
        systemYears.push(i)
      }
    }
    let tax = this.props.activeVats ? this.props.activeVats.filter(vat => vat.defaultVat)[0] ? this.props.activeVats.filter(vat => vat.defaultVat)[0].taxPercent : 0 : 0
    let totalVat = (subTotal - discount) * tax / 100
    const totalAmount = subTotal - discount + totalVat

    let totalLeftAfterDigital = totalAmount - digital
    let totalLeftAfterCash = totalAmount - digital - cash

    let totalPendingAmount = 0
    this.props.trainerInstallment && this.props.trainerInstallment.forEach(installment => {
      totalPendingAmount += installment.trainerAmount ? installment.trainerAmount : 0
    })

    return (
      <div className={this.state.url === '/pending-installments/pending-installments-trainer' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="row">
          <div className="container-fluid px-4 mt-3">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-5">
                        <label className="mb-1">{t('Total Pending Amount')}</label>
                        <h5 className="font-weight-bold dirltrtar text-danger">{this.props.defaultCurrency} {totalPendingAmount.toFixed(3)}</h5>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-7">
                        <div className="row d-block d-sm-flex justify-content-end pt-3">
                          <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                            <div className="form-group inlineFormGroup">
                              <select className="form-control mx-sm-2 inlineFormInputs" value={pendingMonth} onChange={(e) => this.setMonthYear(e.target.value, pendingYear)} >
                                {monthSmallNamesCaps.map((month, i) => {
                                  return (
                                    <option key={i} value={i}>{t(month)}</option>
                                  )
                                })}
                              </select>
                              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                            </div>
                          </div>
                          <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                            <div className="form-group inlineFormGroup">
                              <select className="form-control mx-sm-2 inlineFormInputs" value={this.state.pendingYear} onChange={(e) => this.setMonthYear(pendingMonth, e.target.value)}>
                                {systemYears.map(year => {
                                  return (<option key={year} value={year}>{year}</option>)
                                })}
                              </select>
                              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="borderRoundSeperateTable tdGray">
                        <thead>
                          <tr>
                            <th>{t('Member Id')}</th>
                            <th>{t('Name')}</th>
                            <th>{t('Trainer')}</th>
                            <th>{t('Installment')}</th>
                            <th>{t('Amount')}</th>
                            <th>{t('Due Date')}</th>
                            <th className="text-center w-50px">{t('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.props.trainerInstallment && getPageWiseData(this.state.pageNumber, this.props.trainerInstallment, this.state.displayNum).map((installment, i) => {
                            const { memberId, branch, credentialId: { avatar, userName }, mobileNo, trainerData: { credentialId: { userName: trainerName } }, installmentName, trainerAmount,
                              dueDate, packagesDetailsId, installmentId, trainerDetailsId, _id } = installment
                            return (
                              <tr key={i}>
                                <td className="text-primary font-weight-bold">{memberId}</td>
                                <td>
                                  <div className="d-flex">
                                    <img alt='' src={`/${avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                    <div className="mx-1">
                                      <h6 className="my-1 font-weight-bold">{userName}</h6>
                                      <span className="text-body font-weight-light dirltrtar d-inline-block">{mobileNo}</span>
                                    </div>
                                  </div>
                                </td>
                                <td><span className="mx-200-normalwrap">{trainerName}</span></td>
                                <td><span className="mx-200-normalwrap">{installmentName}</span></td>
                                <td><h5 className="text-warning font-weight-bold m-0 dirltrtar">{this.props.defaultCurrency} {trainerAmount.toFixed(3)}</h5></td>
                                <td>{dateToDDMMYYYY(dueDate)}</td>
                                <td className="text-center">
                                  <span className="d-inline-flex">
                                    <button type="button" className="btn btn-success btn-sm w-100px rounded-50px mx-1" data-toggle="modal" data-target="#notYetPaid1"
                                      onClick={() => this.setPayment(trainerAmount, branch, packagesDetailsId, installmentId, _id, dueDate, installmentName, trainerDetailsId, trainerName)}>{t('Pay')}</button>
                                    <Link type="button" className="btn btn-primary br-50px w-100px btn-sm px-3 mx-1" to={`/members-details/${_id}`}>{t('Details')}</Link>
                                    <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white pointer" data-toggle="modal" data-target="#Duedate1"
                                      onClick={() => this.setState({ changeDueDate: dueDate, packagesDetailsId, installmentId, memberId: _id, trainerDetailsId })}
                                    >
                                      <span className="iconv1 iconv1-edit"></span>
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/*Pagination Start*/}
                    {this.props.trainerInstallment &&
                      <Pagination
                        pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                        getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                        fullData={this.props.trainerInstallment}
                        displayNumber={(displayNum) => this.setState({ displayNum })}
                        displayNum={this.state.displayNum ? this.state.displayNum : 5}
                      />
                    }
                    {/* Pagination End // displayNumber={5} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* if Due date popup */}
        <div className="modal fade commonYellowModal" id="Duedate1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Edit Due Date')}</h4>
                <button type="button" className="close" data-dismiss="modal">
                  <span className="iconv1 iconv1-close"></span>
                </button>
              </div>
              <div className="modal-body px-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group position-relative">
                        <label>{t('Due Date')}</label>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            variant='inline'
                            InputProps={{
                              disableUnderline: true,
                            }}
                            autoOk
                            minDate={new Date()}
                            invalidDateMessage=''
                            className="form-control pl-2 bg-white border pt-1"
                            minDateMessage=''
                            format="dd/MM/yyyy"
                            value={this.state.changeDueDate}
                            onChange={(e) => this.setState(validator(e, 'changeDueDate', 'date', []))}
                          />
                        </MuiPickersUtilsProvider>
                        <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      </div>
                    </div>
                    <div className="col-12 py-3 text-center">
                      <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* -/ Due date popup over */}

        {/* if not paid */}
        <div className="modal fade commonYellowModal" id="notYetPaid1" ref='notYetPaid1'>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Payment')}</h4>
                <button type="button" className="close" data-dismiss="modal" ref='checkoutCloseModal1' onClick={() => this.setState({ digital: 0, cash: 0, card: 0 })}><span className="iconv1 iconv1-close"></span></button>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4 pb-4 pt-4 bg-light rounded-bottom">
                <div className="table-responsive bg-white px-4 pt-3">
                  <table className="table table-borderless">
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
                      <tr>
                        <td>
                          <h5 className="m-0">{t('VAT')} {this.state.tax ? `(${this.state.tax} %)` : ''}</h5>
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
                          <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold dirltrjcs"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{totalAmount.toFixed(3)}</span></h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="row mb-1 mt-4">
                  <div className="col-12 col-sm-6 d-flex align-items-center"><h5 className="my-2 font-weight-bold px-1">{t('Payment Method')}</h5></div>
                  <div className="col-12 col-sm-6 d-flex align-items-center justify-content-end">
                    <button onClick={(e) => e.preventDefault()} data-toggle="modal" data-target="#passwordAskModal1" className="d-flex flex-column align-items-center justify-content-center bg-danger discount-class m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                      <span className="w-100 text-center">
                        <h3><span className="iconv1 iconv1-discount text-white"></span></h3>
                        <span className="text-white">{t('Discount')}</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="addDigital" className="mx-sm-2 inlineFormLabel mb-1">{t('Digital')}</label>
                      <div className={this.state.digitalE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                        <label htmlFor="addDigital" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                        <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addDigital" value={digital} onChange={(e) => this.setDigital(e, totalAmount)} />
                      </div>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.digitalE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="addCash" className="mx-sm-2 inlineFormLabel mb-1">{t('Cash')}</label>
                      <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr">
                        <label htmlFor="addCash" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                        <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCash" value={cash} onChange={(e) => this.setCash(e, totalLeftAfterDigital)} />
                      </div>
                      <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage">{this.state.cashE}</small></div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                      <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr">
                        <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                        <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} onChange={(e) => this.setCard(e, totalLeftAfterCash)} />
                      </div>
                      <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small></div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                      <input type="text" autoComplete="off" className="form-control bg-white mx-sm-2 inlineFormInputs" id="addCard4lastno1" value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)} />
                    </div>
                  </div>
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
                            <input type="text" autoComplete="off" className={this.state.bankNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 py-0 px-2 d-flex align-items-center bg-white dirltr"}
                              id="bankName" value={this.state.bankName} onChange={(e) => this.setState({ bankName: e.target.value })} />
                            <div className="errorMessageWrapper">
                              <small className="text-danger mx-sm-2 errorMessage"></small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                          <div className="form-group inlineFormGroup mb-3">
                            <label htmlFor="CheckNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Number')}</label>
                            <input type="text" autoComplete="off" className={this.state.chequeNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 py-0 px-2 d-flex align-items-center bg-white dirltr"}
                              id="CheckNumber" value={this.state.chequeNumber} onChange={(e) => this.setState({ chequeNumber: e.target.value })} />
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
                                className={this.state.chequeDateE ? "form-control pl-2 bg-white mx-sm-2 inlineFormInputs FormInputsError dirltr" : "form-control pl-2 bg-white mx-sm-2 inlineFormInputs dirltr"}
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
                      <button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.handlePayment(totalAmount)}>{t('Checkout')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* -/ not paid over */}

        {/* -/ password ask modal */}
        <div className="modal fade commonYellowModal" id="passwordAskModal1">
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
                        <input type={this.state.showPass ? "text" : "password"} className={this.state.passwordE ? "form-control inlineFormInputs w-100 mx-sm-2 FormInputsError" : "form-control inlineFormInputs w-100 mx-sm-2"} id="password1"
                          value={this.state.password} onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))} />
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

        {/* Popup Discount */}
        <button type="button" id="Discount2" className="d-none" data-toggle="modal" data-target="#Discount" ref="openDiscount">{t('Open')}</button>
        <div className="modal fade commonYellowModal" id="Discount" >
          {/* <button type="button" id="Discount2" className="d-none" data-toggle="modal" data-target="#Discount1" ref="openDiscount1">Open modal</button>
        <div className="modal fade commonYellowModal" id="Discount1" > */}
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

        {/* --------------Receipt Modal-=--------------- */}
        <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#ReceiptModal" data-backdrop="static" data-keyboard="false" ref="receiptOpenModal">{t('Receipt')}</button>
        {packageReceipt &&
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
                      <img alt='' src={packageReceipt.branch.avatar && packageReceipt.branch.avatar.path} className="" width="100" />
                    </div>
                    <h4 className="border-bottom border-dark text-center font-weight-bold pb-1">{t('Tax Invoice')}</h4>
                    <div className="row px-5 justify-content-between">
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">{t('VAT Reg Number')}</label>
                          <p className="">{packageReceipt.branch.vatRegNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Address')}</label>
                          <p className="whiteSpaceNormal mnw-150px mxw-200px">{packageReceipt.branch.address}</p>
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
                          <p className="">{packageReceipt.branch.telephone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                      <div className="">
                        <h6 className="font-weight-bold m-1">
                          <span className="px-1">{t('ID')}:</span>
                          <span className="px-1">{packageReceipt.memberId}</span>
                        </h6>
                      </div>
                      <h6 className="font-weight-bold m-1">{packageReceipt.credentialId.userName}</h6>
                      <div className="">
                        <h6 className="font-weight-bold m-1">
                          <span className="px-1">{t('Mob')}:</span>
                          <span className="px-1">{packageReceipt.mobileNo}</span>
                        </h6>
                      </div>
                    </div>
                    <div className="table-responsive RETable">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t('Trainer Name')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{trainerName} ({installmentName})</td>
                          </tr>
                          <tr>
                            <td colSpan="4">
                              <div className="text-right my-1">{t('Amount Total')} :</div>
                              {parseFloat(discount) ?
                                <div className="text-right my-1">{t('Discount')} :</div>
                                : <div></div>}
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
                              {parseFloat(discount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(discount).toFixed(3)}</span></div>
                                : <div></div>}
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
                      <QRCode value={`http://instagram.com/${packageReceipt.branch.instaId}/`} renderAs='svg' />
                    </div> */}
                    <div className="d-flex align-items-center flex-wrap justify-content-between my-4">
                      <div className="d-flex">
                        <div className="mr-3 text-center">
                          <img src={instaimg} alt="" className="w-30px" />
                          <h6 className="font-weight-bold mb-0 mt-1">{t('Follow Us')}</h6>
                        </div>
                        <div className="w-50px mr-3">
                          <QRCode value={`http://instagram.com/${packageReceipt.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                        </div>
                      </div>
                      {/* <h6 className="font-weight-bold">{t('Paid Amount')}: {this.props.defaultCurrency} {parseFloat(total).toFixed(3)}</h6> */}
                      {this.props.loggedUser && <h6 className="font-weight-bold">{t('Served by')}: {this.props.loggedUser.userName}</h6>}
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
                      <button type="button" className="btn btn-success px-4 py-1 my-2" data-dismiss="modal" onClick={() => this.handlePrint()}>{t('Print Receipt')}</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {/* --------------Receipt Modal Ends-=--------------- */}

        {packageReceipt &&
          <div className="PageBillWrapper d-none">
            <div style={{ width: "450px", padding: "15px", margin: "auto" }} id="newPrint">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={packageReceipt.branch.avatar ? `/${packageReceipt.branch.avatar.path}` : ''} width="200" style={{ width: "100px" }} alt="" />
              </div>
              <h5 style={{ textAlign: "center", margin: "19px 0" }}>{t('Tax Invoice')}</h5>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>
                <span>{packageReceipt.branch.branchName}</span><br />
                <span>{packageReceipt.branch.address}</span><br />
                {/* <span>Road/Street 50, Samaheej,</span><br /> */}
                {/* <span>Block 236, Bahrain,</span><br /> */}
                <span>{t('Tel')} : {packageReceipt.branch.telephone}</span><br />
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>{t('VAT')} - {packageReceipt.branch.vatRegNo}</p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0" }}>
                <span style={{ padding: "2px", fontSize: "14px" }}>{dateToDDMMYYYY(new Date())} {dateToHHMM(new Date())}</span>
                <span style={{ padding: "2px", fontSize: "14px" }}>{t('Bill No')}:{packageReceipt.orderNo}</span>
              </p>
              <p style={{ textAlign: "center", margin: "0" }}>
                <span style={{ padding: "0 2px" }}>{packageReceipt.memberId}</span>
                <span style={{ padding: "0 2px" }}>{packageReceipt.credentialId.userName}</span>
                <span style={{ padding: "0 2px" }}>{packageReceipt.mobileNo}</span>
              </p>
              <div>
                <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between" }}>
                  <span>{t('ID:')} <span style={{ padding: "10px" }}>{packageReceipt.memberId}</span></span>
                  <span>{t('Mob:')} <span style={{ padding: "10px" }}>{packageReceipt.mobileNo}</span></span>
                </p>
                <p style={{ display: "flex", textAlign: "center", justifyContent: "center", marginTop: "0" }}>
                  <span>{packageReceipt.credentialId.userName}</span>
                </p>
              </div>
              {/* <p style={{ textAlign: "right", margin: "0 0 10px 0" }}>66988964</p> */}
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr style={{ borderTop: "1px dashed #000" }}>
                    <td>{t('Package Name')}</td>
                  </tr>
                  {/* <tr style={{ borderTop: "1px dashed #000" }}>
                  <td>1</td>
                  <td>3 Month</td>
                  <td>26-Dec-19</td>
                  <td>13-Sep-20</td>
                </tr> */}
                  <tr>
                    <td>{trainerName} ({installmentName})</td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: "100%", textAlign: "right", borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>{t('Amount Total')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(subTotal).toFixed(3)}</td>
                  </tr>
                  {parseFloat(discount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Discount')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(discount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
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
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Bank Name')} :</td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.bankName}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.chequeNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Number')} :</td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.chequeNumber}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.chequeDate ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Date')} :</td>
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
                  <QRCode value={`http://instagram.com/${packageReceipt.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                </div>
                {this.props.loggedUser && <span>{t('Served by')}: {this.props.loggedUser.userName}</span>}
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


function mapStateToProps({ dashboard: { systemYear, pendingInstallments }, currency: { defaultCurrency }, installment: { trainerInstallment }, vat: { activeVats },
  privilege: { verifyPassword } }) {
  return {
    defaultCurrency, pendingInstallments, systemYear, activeVats, verifyPassword,
    trainerInstallment: trainerInstallment && trainerInstallment.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }
}


export default withTranslation()(connect(mapStateToProps)(TrainerInstallment))