import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

class TrainerInstallment extends Component {
  render() {
    return (
      <div className="tab-pane px-3 fade" id="menu2" role="tabpanel">
        <div className="row">
          <div className="container-fluid px-4 mt-3">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-5">
                        <h4>Total Pending Amount</h4>
                        <h2 className="font-weight-bold dirltrtar text-danger">$ 87511</h2>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-7">
                        <div class="row d-block d-sm-flex justify-content-end pt-3">
                          <div class="col w-auto px-1 flexBasis-auto flex-grow-0">
                            <div class="form-group inlineFormGroup">
                              <select class="form-control mx-sm-2 inlineFormInputs">
                                <option value="">Monthly</option>
                              </select>
                              <span class="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                            </div>
                          </div>
                          <div class="col w-auto px-1 flexBasis-auto flex-grow-0">
                            <div class="form-group inlineFormGroup">
                              <select class="form-control mx-sm-2 inlineFormInputs">
                                <option value="">Jan</option>
                                <option value="">Feb</option>
                              </select>
                              <span class="iconv1 iconv1-arrow-down selectBoxIcon"></span>
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
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th className="text-center w-50px">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-primary font-weight-bold">3656</td>
                            <td>
                              <div className="d-flex">
                                <img alt='' src="https://cdn4.iconfinder.com/data/icons/business-conceptual-part1-1/513/business-man-512.png" className="mx-1 rounded-circle w-50px h-50px" />
                                <div className="mx-1">
                                  <h5 className="m-0 font-weight-bold">Mohammed Al Mulla</h5>
                                  <span class="text-body font-weight-light">abcdefg@gmail.com</span>
                                </div>
                              </div>
                            </td>
                            <td><span className="mx-200-normalwrap">1 Month golden membership</span></td>
                            <td><h5 className="text-warning font-weight-bold m-0 dirltrtar">$ 200</h5></td>
                            <td>12/02/2020</td>
                            <td className="text-center">
                              <span className="d-inline-flex">
                                <button type="button" className="btn btn-success btn-sm w-100px rounded-50px mx-1" data-toggle="modal" data-target="#notYetPaid">Pay</button>
                                <a href="/#" className="btn btn-primary br-50px w-100px btn-sm px-3 mx-1">Details</a>
                                <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white pointer" data-toggle="modal" data-target="#Duedate">
                                  <span className="iconv1 iconv1-edit"></span>
                                </span>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-primary font-weight-bold">3656</td>
                            <td>
                              <div className="d-flex">
                                <img alt='' src="https://cdn4.iconfinder.com/data/icons/business-conceptual-part1-1/513/business-man-512.png" className="mx-1 rounded-circle w-50px h-50px" />
                                <div className="mx-1">
                                  <h5 className="m-0 font-weight-bold">Mohammed Al Mulla</h5>
                                  <span class="text-body font-weight-light">abcdefg@gmail.com</span>
                                </div>
                              </div>
                            </td>
                            <td><span className="mx-200-normalwrap">1 Month golden membership</span></td>
                            <td><h5 className="text-warning font-weight-bold m-0 dirltrtar">$ 200</h5></td>
                            <td>12/02/2020</td>
                            <td className="text-center">
                              <span className="d-inline-flex">
                                <button type="button" className="btn btn-success btn-sm w-100px rounded-50px mx-1" data-toggle="modal" data-target="#notYetPaid">Pay</button>
                                <a href="/#" className="btn btn-primary br-50px w-100px btn-sm px-3 mx-1">Details</a>
                                <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white pointer" data-toggle="modal" data-target="#Duedate">
                                  <span className="iconv1 iconv1-edit"></span>
                                </span>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
                            maxDate={new Date()}
                            invalidDateMessage=''
                            className="form-control pl-2 bg-white FormInputsError border pt-1"
                            minDateMessage=''
                            format="dd/MM/yyyy"
                          />
                        </MuiPickersUtilsProvider>
                        <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                        <div className="errorMessageWrapper">
                          <small className="text-danger errorMessage">Err</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 py-3 text-center">
                      <button type="button" className="btn btn-success">Submit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* -/ Due date popup over */}

        {/* if not paid */}
        {/* <div className="modal fade commonYellowModal" id="notYetPaid" ref='notYetPaid'>
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
                                                            <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="addCardNumber" value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)} />
                                                        </div>
                                                        <div className="errorMessageWrapper">
                                                            <small className="text-danger mx-sm-2 errorMessage">{this.state.cardNumberE}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                <div className="form-group inlineFormGroup  mb-3">
                                                    <label className="mx-sm-2 inlineFormLabel mb-1"></label>
                                                    <div className="d-flex">
                                                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                            <input type="checkbox" className="custom-control-input" id="check" name="checkorNo" />
                                                            <label className="custom-control-label" htmlFor="check">{t('Cheque')}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                        <div className="form-group inlineFormGroup  mb-3">
                                                            <label htmlFor="bankName" className="mx-sm-2 inlineFormLabel mb-1">{t('Bank Name')}</label>
                                                            <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" id="bankName" />
                                                            <div className="errorMessageWrapper">
                                                                <small className="text-danger mx-sm-2 errorMessage"></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                        <div className="form-group inlineFormGroup  mb-3">
                                                            <label htmlFor="CheckNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Number')}</label>
                                                            <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" id="CheckNumber" />
                                                            <div className="errorMessageWrapper">
                                                                <small className="text-danger mx-sm-2 errorMessage"></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                        <div className="form-group inlineFormGroup  mb-3">
                                                            <label htmlFor="CheckDate" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Date')}</label>
                                                            <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" id="CheckDate" />
                                                            <div className="errorMessageWrapper">
                                                                <small className="text-danger mx-sm-2 errorMessage"></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                        <div className="form-group inlineFormGroup mb-3">
                                                            <label htmlFor="ChequeAmount" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Amount')}</label>
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
                    </div> */}
        {/* -/ not paid over */}

      </div>
    )
  }
}

export default TrainerInstallment