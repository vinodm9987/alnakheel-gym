import React, { Component } from 'react'

class MemberInstallmentDetails extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="mainPage p-3 membersInstallment">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Members</span><span className="mx-2">/</span><span className="crumbText">Member Installments Details</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-12 pageHead">
                                <h1>Member Installments Details</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <div className="row px-3">
                                    <div className="col-12 border rounded bg-light pt-4 pb-2">
                                        <div className="row">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3 pb-2">
                                                <span className="d-flex">
                                                    <img alt='' src="https://www.w3schools.com/bootstrap/paris.jpg"
                                                        className="mx-1 rounded-circle w-75px h-75px" />
                                                    <div className="mx-1">
                                                        <h5 className="mt-2 mb-1 text-muted">Ansar A</h5>
                                                        <span className="text-muted">ID : 325</span>
                                                    </div>
                                                </span>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                <label>Package Name</label>
                                                <h5 className="text-warning">One month gold package</h5>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-2">
                                                <label>Total Amount</label>
                                                <h5 className="text-danger">$ 300</h5>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-2">
                                                <label>Paid Amount</label>
                                                <h5 className="text-danger">$ 300</h5>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-2">
                                                <label>Remaining Amount</label>
                                                <h5 className="text-danger">$ 300</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <form className="form-inline row">
                                    <div className="col-12">
                                        <div className="row d-block d-sm-flex justify-content-between pt-5">
                                            <div className="col w-auto px-1 flexBasis-auto flex-grow-1"><h4 className="px-3">Installment History</h4></div>
                                            {/* <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                                                <div className="form-group inlineFormGroup">
                                                    <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" placeholder="Search"/>
                                                    <span className="iconv1 iconv1-search searchBoxIcon"></span>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="borderRoundSeperateTable tdGray">
                                        <thead>
                                            <tr>
                                                <th>Installment Type</th>
                                                <th>Amount</th>
                                                <th>Paid Date</th>
                                                <th>Due Date</th>
                                                <th>{t('Status')}</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Installment 1</td>
                                                <td className="text-danger"><h4 className="m-0">$ 500</h4></td>
                                                <td>19/11/2020</td>
                                                <td>Nil</td>
                                                <td>
                                                    <h5 className="text-success">Paid</h5>
                                                    {/* if Pending */}
                                                    {/* <h5 className="text-warning">Pending</h5> */}
                                                    {/* / if Pending */}
                                                </td>
                                                <td className="text-center">
                                                    {/* onclick give active to "addMemberFakePopUp" */}
                                                    {/* <button type="button" className="btn btn-success btn-sm">Pay Amount</button> */}
                                                    {/* / onclick give active to "addMemberFakePopUp" over */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Installment 2</td>
                                                <td className="text-danger"><h4 className="m-0">$ 100</h4></td>
                                                <td>Nil</td>
                                                <td>19/11/2020</td>
                                                <td>
                                                    {/* <h5 className="text-success">Paid</h5> */}
                                                    {/* if Pending */}
                                                    <h5 className="text-warning">Pending</h5>
                                                    {/* / if Pending */}
                                                </td>
                                                <td className="text-center">
                                                    {/* onclick give active to "addMemberFakePopUp" */}
                                                    <button type="button" className="btn btn-success btn-sm">Pay Amount</button>
                                                    {/* / onclick give active to "addMemberFakePopUp" over */}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/*Pagination*/}
                            </div>

                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className="addMemberFakePopUp">
                                    {/* Make active by above submit button like this */}
                                    {/* <div className="addMemberFakePopUp active"> */}
                                    {/* / - Make active by above submit button like this over */}
                                    <div className="addMemberFakePopUpInner">
                                        <div className="row p-3">
                                            <div className="commonYellowModal w-100">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Payment</h4>
                                                    {/* on click this button remove active from top that div */}
                                                    <button type="button" className="close" ><span className="iconv1 iconv1-close"></span></button>
                                                    {/* / - on click this button remove active from top that div over */}
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4 pb-4 pt-4 bg-light rounded-bottom">
                                                <div className="table-responsive bg-white px-4 pt-3">
                                                    <table className="table table-borderless">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0">Total</h5>
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0"><small className="d-flex justify-content-end">$ 60.00</small></h5>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0">Trainer</h5>
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0"><small className="d-flex justify-content-end">$ 20.00</small></h5>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0">Gift Card (GC0015)</h5>
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0"><small className="d-flex justify-content-end">-2.00</small></h5>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0">Discount</h5>
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0"><small className="d-flex justify-content-end">0.00</small></h5>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0">Tax</h5>
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0"><small className="d-flex justify-content-end text-primary">0.00</small></h5>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2">
                                                                    <div className="bg-secondary border-top w-100 border-secondary"></div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <h3 className="m-0">Total Amount</h3>
                                                                </td>
                                                                <td>
                                                                    <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold dirltrjcs"><span className="mx-1">$</span><span className="mx-1">80.00</span></h5>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="row mb-1 mt-4">
                                                    <div className="px-3 d-flex align-items-center"><h5 className="my-2 font-weight-bold px-1">Remaining Amount</h5></div>
                                                    <div className="px-3 d-flex align-items-center justify-content-end">
                                                        <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold dirltrjcs"><span className="mx-1">$</span><span className="mx-1">20.00</span></h5>
                                                    </div>
                                                </div>
                                                <div className="row mb-1 mt-4">
                                                    <div className="col-12 col-sm-6 d-flex align-items-center"><h5 className="my-2 font-weight-bold px-1">Payment Method</h5></div>
                                                    <div className="col-12 col-sm-6 d-flex align-items-center justify-content-end">
                                                        <button type="button" data-toggle="modal" data-target="#Discount" className="d-flex flex-column align-items-center justify-content-center bg-danger w-75px h-75px m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                                                            <span className="w-100 text-center">
                                                                <h4 className="m-0"><span className="iconv1 iconv1-discount text-white"></span></h4>
                                                                <small className="text-white">Discount</small>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                                        <div className="form-group inlineFormGroup mb-3">
                                                            <label htmlFor="addDigital" className="mx-sm-2 inlineFormLabel mb-1">Digital</label>
                                                            <div className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr">
                                                                <label htmlFor="addDigital" className="text-danger my-0 mx-1 font-weight-bold">$</label>
                                                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addDigital" />
                                                            </div>
                                                            <div className="errorMessageWrapper">
                                                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                                        <div className="form-group inlineFormGroup mb-3">
                                                            <label htmlFor="addCash" className="mx-sm-2 inlineFormLabel mb-1">Cash</label>
                                                            <div className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr">
                                                                <label htmlFor="addCash" className="text-danger my-0 mx-1 font-weight-bold">$</label>
                                                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCash" />
                                                            </div>
                                                            <div className="errorMessageWrapper">
                                                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                                        <div className="form-group inlineFormGroup mb-3">
                                                            <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">Card</label>
                                                            <div className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr">
                                                                <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">$</label>
                                                                <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" />
                                                            </div>
                                                            <div className="errorMessageWrapper">
                                                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                                        <div className="form-group inlineFormGroup mb-3">
                                                            <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">Card Number (last 4 digits)</label>
                                                            <input type="text" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" id="addCard4lastno" />
                                                            <div className="errorMessageWrapper">
                                                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                            <div className="form-group inlineFormGroup mb-3">
                              <label className="mx-sm-2 inlineFormLabel mb-1"></label>
                              <div className="d-flex">
                                <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                  <input type="checkbox" className="custom-control-input" id="check" name="checkorNo" />
                                  <label className="custom-control-label" htmlFor="check">Cheque</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* if cheque */}
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="bankName" className="mx-sm-2 inlineFormLabel mb-1">Bank Name</label>
                                  <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" id="bankName" />
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage"></small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="CheckNumber" className="mx-sm-2 inlineFormLabel mb-1">Cheque Number</label>
                                  <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" id="CheckNumber" />
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage"></small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="CheckDate" className="mx-sm-2 inlineFormLabel mb-1">Cheque Date</label>
                                  <input type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" id="CheckDate" />
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage"></small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <div className="form-group inlineFormGroup mb-3">
                                  <label htmlFor="ChequeAmount" className="mx-sm-2 inlineFormLabel mb-1">Cheque Amount</label>
                                  {/* here currency comes , so change errorclass for div below */}
                                  <div className="form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr">
                                    <label htmlFor="ChequeAmount" className="text-danger my-0 mx-1 font-weight-bold">$</label>
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
                                                        <div className="px-sm-1 pt-4 pb-5">
                                                            <button type="button" className="btn btn-block btn-success btn-lg" >Checkout</button>
                                                        </div>
                                                    </div>
                                                    <div className="modal fade commonYellowModal" id="Discount" >
                                                        <div className="modal-dialog modal-dialog-centered">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h4 className="modal-title">Add Order Discount</h4>
                                                                    <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                                                                </div>
                                                                <div className="modal-body px-0">
                                                                    <div className="container-fluid">
                                                                        <div className="col-12 px-3 pt-3 d-flex">
                                                                            <ul className="pagination">
                                                                                {/* <li className={discountMethod === 'percent' ? "page-item active cursorPointer" : "page-item cursorPointer"}
                                                                                onClick={() => this.setState({ discountMethod: 'percent', count: 0 })}><span className="page-link">%</span></li> */}
                                                                                <li className="page-item active cursorPointer" ><span className="page-link">$</span></li>
                                                                            </ul>
                                                                            <span className="mx-1"></span>
                                                                            <input type="number" autoComplete="off" className="form-control" placeholder="Enter discount" />
                                                                        </div>
                                                                        <div className="col-12 p-3">
                                                                            <button type="button" className="btn btn-block btn-success btn-lg" data-dismiss="modal" >Add Discount</button>
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
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MemberInstallmentDetails