import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { dateToDDMMYYYY, getPageWiseData, monthSmallNamesCaps, validator } from '../../utils/apis/helpers';
import { getSystemYear } from '../../actions/dashboard.action';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import { changeDueDateOfPackageInstallment, getPackageInstallment } from '../../actions/installment.action';
import Pagination from '../Layout/Pagination';
import { getAllVat } from '../../actions/vat.action';
import $ from 'jquery';
import { VERIFY_ADMIN_PASSWORD } from '../../actions/types';
import { verifyAdminPassword } from '../../actions/privilege.action';

class PackageInstallment extends Component {
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
      subTotal: 0
    }
    this.props.dispatch(getSystemYear())
    this.props.dispatch(getPackageInstallment({ month: parseInt(this.state.pendingMonth), day: this.state.pendingYear }))
  }

  componentDidUpdate(prevProps) {
    if (((this.props.verifyPassword && this.props.verifyPassword) !== (prevProps.verifyPassword)) && this.props.verifyPassword === 'verified') {
      const el = findDOMNode(this.refs.openDiscount);
      $(el).click();
    }
  }

  setMonthYear(pendingMonth, pendingYear) {
    this.setState({ pendingMonth, pendingYear }, () => {
      this.props.dispatch(getPackageInstallment({ month: parseInt(this.state.pendingMonth), year: parseInt(this.state.pendingYear) }))
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
    const { packagesDetailsId, installmentId, memberId, changeDueDate } = this.state
    const dueDateInfo = {
      packagesDetailsId, installmentId, memberId, dueDate: changeDueDate
    }
    this.props.dispatch(changeDueDateOfPackageInstallment(dueDateInfo))
  }

  setPayment(packageAmount, branch) {
    this.setState({
      subTotal: packageAmount
    })
    this.props.dispatch(getAllVat({ branch }))
  }

  handlePayment(totalAmount) {
    const el = findDOMNode(this.refs.checkoutCloseModal);
    const { t } = this.props
  }

  render() {
    const { t } = this.props
    const { pendingMonth, pendingYear, digital, cash, card, discount, discountMethod, count, subTotal } = this.state
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
    this.props.packageInstallment && this.props.packageInstallment.forEach(installment => {
      totalPendingAmount += installment.packageAmount ? installment.packageAmount : 0
    })

    return (
      <div className="tab-pane px-3 fade show active" id="menu1" role="tabpanel">
        <div className="row">
          <div className="container-fluid px-4 mt-3">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-5">
                        <h4>Total Pending Amount</h4>
                        <h2 className="font-weight-bold dirltrtar text-danger">{this.props.defaultCurrency} {totalPendingAmount}</h2>
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
                            <th>Member Id</th>
                            <th>Name</th>
                            <th>Package</th>
                            <th>Installment</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th className="text-center w-50px">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.props.packageInstallment && getPageWiseData(this.state.pageNumber, this.props.packageInstallment, this.state.displayNum).map((installment, i) => {
                            const { memberId, branch, credentialId: { avatar, userName }, mobileNo, packages: { packageName }, installmentName, packageAmount,
                              dueDate, packagesDetailsId, installmentId, _id } = installment
                            return (
                              <tr key={i}>
                                <td className="text-primary font-weight-bold">{memberId}</td>
                                <td>
                                  <div className="d-flex">
                                    <img alt='' src={`/${avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                    <div className="mx-1">
                                      <h5 className="m-0 font-weight-bold">{userName}</h5>
                                      <span className="text-body font-weight-light">{mobileNo}</span>
                                    </div>
                                  </div>
                                </td>
                                <td><span className="mx-200-normalwrap">{packageName}</span></td>
                                <td><span className="mx-200-normalwrap">{installmentName}</span></td>
                                <td><h5 className="text-warning font-weight-bold m-0 dirltrtar">{this.props.defaultCurrency} {packageAmount}</h5></td>
                                <td>{dateToDDMMYYYY(dueDate)}</td>
                                <td className="text-center">
                                  <span className="d-inline-flex">
                                    <button type="button" className="btn btn-success btn-sm w-100px rounded-50px mx-1" data-toggle="modal" data-target="#notYetPaid"
                                      onClick={() => this.setPayment(packageAmount, branch)}
                                    >Pay</button>
                                    <Link type="button" className="btn btn-primary br-50px w-100px btn-sm px-3 mx-1" to={`/members-details/${_id}`}>{t('Details')}</Link>
                                    <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white pointer" data-toggle="modal" data-target="#Duedate"
                                      onClick={() => this.setState({ changeDueDate: dueDate, packagesDetailsId, installmentId, memberId: _id })}
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
                    {this.props.packageInstallment &&
                      <Pagination
                        pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                        getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                        fullData={this.props.packageInstallment}
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
        <div className="modal fade commonYellowModal" id="Duedate">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Due Date</h4>
                <button type="button" className="close" data-dismiss="modal">
                  <span className="iconv1 iconv1-close"></span>
                </button>
              </div>
              <div className="modal-body px-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group position-relative">
                        <label>Due date</label>
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
                      <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => this.handleSubmit()}>Submit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* -/ Due date popup over */}

        {/* if not paid */}
        <div className="modal fade commonYellowModal" id="notYetPaid" ref='notYetPaid'>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Payment')}</h4>
                <button type="button" className="close" data-dismiss="modal" onClick={() => this.setState({ digital: 0, cash: 0, card: 0 })}><span className="iconv1 iconv1-close"></span></button>
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
                          <h5 className="m-0">{t('Tax')} {this.state.tax ? `(${this.state.tax} %)` : ''}</h5>
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
                  <div className="col-12 col-sm-6 d-flex align-items-center"><h5 className="my-2 font-weight-bold px-1">Payment Method</h5></div>
                  <div className="col-12 col-sm-6 d-flex align-items-center justify-content-end">
                    <button onClick={(e) => e.preventDefault()} data-toggle="modal" data-target="#passwordAskModal" className="d-flex flex-column align-items-center justify-content-center bg-danger discount-class m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">

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
                      <div className="form-control w-100 p-0 d-flex align-items-center bg-white dirltr">
                        <label htmlFor="addCash" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                        <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCash" value={cash} onChange={(e) => this.setCash(e, totalLeftAfterDigital)} />
                      </div>
                      <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage">{this.state.cashE}</small></div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                      <div className="form-control w-100 p-0 d-flex align-items-center bg-white dirltr">
                        <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                        <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} onChange={(e) => this.setCard(e, totalLeftAfterCash)} />
                      </div>
                      <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small></div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                    <div className="form-group inlineFormGroup mb-3">
                      <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                      <input type="text" autoComplete="off" className="form-control bg-white" id="addCard4lastno" value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)} />
                    </div>
                  </div>
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
                            <input type="text" autoComplete="off" className={this.state.chequeDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}
                              id="CheckDate"
                              value={this.state.chequeDate} onChange={(e) => this.setState({ chequeDate: e.target.value })}
                            />
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
                      <button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.handlePayment(totalAmount)}>Checkout</button>
                    </div>
                  </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* -/ not paid over */}

        {/* -/ password ask modal */}
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


function mapStateToProps({ dashboard: { systemYear, pendingInstallments }, currency: { defaultCurrency }, installment: { packageInstallment }, vat: { activeVats } }) {
  return {
    defaultCurrency, pendingInstallments, systemYear, activeVats,
    packageInstallment: packageInstallment && packageInstallment.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }
}


export default withTranslation()(connect(mapStateToProps)(PackageInstallment))