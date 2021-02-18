import $ from 'jquery'
import QRCode from 'qrcode.react'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getOrderHistory } from '../../../actions/pos.action'
import instaimg from '../../../assets/img/insta.jpg'
import { dateToDDMMYYYY, dateToHHMM, getPageWiseData } from '../../../utils/apis/helpers'
import Pagination from '../../Layout/Pagination'

class Orderlist extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: '',
      search: '',
      orderById: ''
    }
    this.props.dispatch(getOrderHistory(this.state))
  }

  handleFilter(mode, search) {
    this.setState({ mode, search }, () => {
      window.dispatchWithDebounce(getOrderHistory)(this.state)
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

  // handleDownload() {
  //   var doc = new jsPDF();
  //   doc.fromHTML($('#ReceiptModal2').html(), 15, 15, {
  //     'width': 170
  //   });
  //   doc.save('sample-file.pdf');
  // }

  render() {
    const { mode, search, orderById } = this.state
    const { t } = this.props
    return (
      <div className="mainPage p-3 Orderlist">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span>
            <span className="mx-2">/</span>
            <span className="crumbText">{t('Sales')}</span>
            <span className="mx-2">/</span>
            <span className="crumbText">{t('Order History')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Order History')}</h1>
            <div className="pageHeadLine"></div>
          </div>
        </div>


        <form className="form-inline row">
          <div className="col-12">
            <div className="row d-block d-sm-flex justify-content-end pt-5">
              <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                <div className="form-group inlineFormGroup">
                  <label className="mx-sm-2 inlineFormLabel">{t('Mode')}</label>
                  <select className="form-control mx-sm-2 inlineFormInputs" value={mode} onChange={(e) => this.handleFilter(e.target.value, search)}>
                    <option value="">{t('All')}</option>
                    <option value="POS">{t('POS')}</option>
                    <option value="Online">{t('Online')}</option>
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                </div>
              </div>
              <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                <div className="form-group inlineFormGroup">
                  <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs"
                    value={search} onChange={(e) => this.handleFilter(mode, e.target.value)}
                  />
                  <span className="iconv1 iconv1-search searchBoxIcon"></span>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="col-12">
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray">
              <thead>
                <tr>
                  <th>{t('Receipt No')}</th>
                  <th>{t('Member')}</th>
                  <th>{t('Date of Purchase')}</th>
                  <th>{t('Mode Of Purchase')}</th>
                  {/* <th>Delivery Status</th> */}
                  {/* <th>{t('Payment')}</th> */}
                  <th>{t('Invoice')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.orderHistories && getPageWiseData(this.state.pageNumber, this.props.orderHistories, this.state.displayNum).map((order, i) => {
                  const { customerDetails: { member }, _id, dateOfPurchase, paymentType, orderNo } = order
                  if (member) {
                    const { credentialId: { userName, avatar, email } } = member

                    return (
                      <tr key={i}>
                        <td className="text-primary font-weight-bold">#{orderNo}</td>
                        <td>
                          <div className="d-flex">
                            <img alt='' src={`/${avatar.path}`}
                              className="mx-1 rounded-circle w-50px h-50px" />
                            <div className="mx-1">
                              <h6 className="m-0 font-weight-bold">{userName}</h6>
                              <span className="text-muted">{email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{dateToDDMMYYYY(dateOfPurchase)}</td>
                        <td>{paymentType}</td>
                        {/* <td className="text-danger">{t('Pending')}</td> */}
                        {/* <td>{t('Paid')}</td> */}
                        <td>
                          {/* <span className="iconv1 iconv1-download bg-warning tableDownloadViewIcons" onClick={() => this.handleDownload()}></span> */}
                          <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                            onClick={() => this.setState({ orderById: order })}></span>
                        </td>
                        <td className="text-center">
                          <Link to={`/order-details/${_id}`} className="linkHoverDecLess">
                            <div type="button" className="btn btn-primary btn-sm w-100px rounded-50px">{t('Details')}</div>
                          </Link>
                        </td>
                      </tr>
                    )
                  } else {
                    return (
                      <tr key={i}>
                        <td className="text-primary font-weight-bold">#{orderNo}</td>
                        <td>
                          <div className="d-flex">
                            <div className="mx-1">
                              <h6 className="m-0 font-weight-bold">{t('General')}</h6>
                              {/* <span className="text-muted">NA</span> */}
                            </div>
                          </div>
                        </td>
                        <td>{dateToDDMMYYYY(dateOfPurchase)}</td>
                        <td>{paymentType}</td>
                        {/* <td className="text-danger">{t('Pending')}</td> */}
                        {/* <td>{t('Paid')}</td> */}
                        <td>
                          {/* <span className="iconv1 iconv1-download bg-warning tableDownloadViewIcons"></span> */}
                          <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons" data-toggle="modal" data-target="#ReceiptModal"
                            onClick={() => this.setState({ orderById: order })}></span>
                        </td>
                        <td className="text-center">
                          <Link to={`/order-details/${_id}`} className="linkHoverDecLess">
                            <div type="button" className="btn btn-primary btn-sm w-100px rounded-50px">{t('Details')}</div>
                          </Link>
                        </td>
                      </tr>
                    )
                  }
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.orderHistories &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.orderHistories}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/* Pagination End // displayNumber={5} */}
        </div>
        {/* --------------Receipt Modal-=--------------- */}
        {orderById &&
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
                      <img alt='' src={orderById.branch.avatar ? `/${orderById.branch.avatar.path}` : ''} className="mb-2" width="100" />
                    </div>
                    <h4 className="border-bottom border-dark text-center font-weight-bold pb-1">{t('Tax Invoice')}</h4>
                    <div className="row px-5 justify-content-between">
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">{t('VAT Reg Number')}</label>
                          <p className="">{orderById.branch.vatRegNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Address')}</label>
                          <p className="whiteSpaceNormal mnw-150px mxw-200px">{orderById.branch.address}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">{t('Tax Invoice No')}</label>
                          <p className="">{orderById.orderNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Date & Time')}</label>
                          <p className="">{dateToDDMMYYYY(orderById.dateOfPurchase)} {dateToHHMM(orderById.created_at)}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Receipt Total')}</label>
                          <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(orderById.totalAmount).toFixed(3)}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Telephone')}</label>
                          <p className="">{orderById.branch.telephone}</p>
                        </div>
                      </div>
                    </div>
                    {orderById.customerDetails.member &&
                      <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">{t('ID')}:</span>
                            <span className="px-1">{orderById.customerDetails.member.memberId}</span>
                          </h6>
                        </div>
                        <h6 className="font-weight-bold m-1">{orderById.customerDetails.member.credentialId.userName}</h6>
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">{t('Mob')}:</span>
                            <span className="px-1">{orderById.customerDetails.member.mobileNo}</span>
                          </h6>
                        </div>
                      </div>
                    }
                    <div className="table-responsive RETable">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t('No')}</th>
                            <th>{t('Description')}</th>
                            <th>{t('Price')}</th>
                            <th>{t('Qty')}</th>
                            <th>{t('Total')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderById.purchaseStock.map((stock, i) => {
                            const { quantity, amount, stockId } = stock
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{stockId.itemName}</td>
                                <td>{this.props.defaultCurrency} {(parseFloat(amount) / quantity).toFixed(3)}</td>
                                <td>{quantity}</td>
                                <td>{this.props.defaultCurrency} {parseFloat(amount).toFixed(3)}</td>
                              </tr>
                            )
                          })}
                          <tr>
                            <td colSpan="4">
                              <div className="text-right my-1">{t('Amount Total')} :</div>
                              {parseFloat(orderById.discount) ?
                                <div className="text-right my-1">{t('Discount')} :</div>
                                : <div></div>}
                              {parseFloat(orderById.giftcard) ?
                                <div className="text-right my-1">{t('Gift Card')} :</div>
                                : <div></div>}
                              {parseFloat(orderById.vatAmount) ?
                                <div className="text-right my-1">{t('VAT(5%)')} :</div>
                                : <div></div>}
                              {parseFloat(orderById.digitalAmount) ?
                                <div className="text-right my-1">{t('Digital')} :</div>
                                : <div></div>}
                              {parseFloat(orderById.cashAmount) ?
                                <div className="text-right my-1">{t('Cash')} :</div>
                                : <div></div>}
                              {parseFloat(orderById.cardAmount) ?
                                <div className="text-right my-1">{t('Card')} :</div>
                                : <div></div>}
                              {parseFloat(orderById.chequeAmount) ?
                                <div className="text-right my-1">{t('Cheque')} :</div>
                                : <div></div>}
                              {orderById.bankName ?
                                <div className="text-right my-1">{t('Bank Name')} :</div>
                                : <div></div>}
                              {orderById.chequeNumber ?
                                <div className="text-right my-1">{t('Cheque Number')} :</div>
                                : <div></div>}
                              {orderById.chequeDate ?
                                <div className="text-right my-1">{t('Cheque Date')} :</div>
                                : <div></div>}
                              <div className="text-right my-1">{t('Grand Total')} :</div>
                              <div className="text-right my-1">{t('Paid Amount')} :</div>
                              {orderById.cardNumber ?
                                <div className="text-right my-1">{t('Card last four digit')} :</div>
                                : <div></div>}
                            </td>
                            <td className="">
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.actualAmount).toFixed(3)}</span></div>
                              {parseFloat(orderById.discount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.discount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(orderById.giftcard) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.giftcard).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(orderById.vatAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.vatAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(orderById.digitalAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.digitalAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(orderById.cashAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.cashAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(orderById.cardAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.cardAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(orderById.chequeAmount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.chequeAmount).toFixed(3)}</span></div>
                                : <div></div>}
                              {orderById.bankName ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{orderById.bankName}</span></div>
                                : <div></div>}
                              {orderById.chequeNumber ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{orderById.chequeNumber}</span></div>
                                : <div></div>}
                              {orderById.chequeDate ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{dateToDDMMYYYY(orderById.chequeDate)}</span></div>
                                : <div></div>}
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.totalAmount).toFixed(3)}</span></div>
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.totalAmount).toFixed(3)}</span></div>
                              {orderById.cardNumber ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{orderById.cardNumber}</span></div>
                                : <div></div>}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* {orderById.cardNumber ?
                        <div className="my-1"><span className="px-1">Card last four digit {orderById.cardNumber}</span></div>
                        : <div></div>} */}
                    </div>
                    {/* <div className="d-flex justify-content-center">
                      <QRCode value={`http://instagram.com/${orderById.branch.instaId}/`} renderAs='svg' />
                    </div> */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center my-4">
                      <div className="d-flex">
                        <div className="mr-3 text-center">
                          <img src={instaimg} alt="" className="w-30px" />
                          <h6 className="font-weight-bold mb-0 mt-1">{t('Follow Us')}</h6>
                        </div>
                        <div className="w-50px mr-3">
                          <QRCode value={`http://instagram.com/${orderById.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                        </div>
                      </div>
                      {/* <h6 className="font-weight-bold">{t('Paid Amount')}: {this.props.defaultCurrency} {parseFloat(orderById.totalAmount).toFixed(3)}</h6> */}
                      {orderById.doneBy && <h6 className="font-weight-bold">{t('Served by')}: {orderById.doneBy.userName}</h6>}
                    </div>
                    {/* <div className="text-center px-5">
                      <h5 className="text-muted">{t('Membership cannot be refunded or transferred to others.')}</h5>
                      <h5 className="font-weight-bold">{t('Thank You')}</h5>
                    </div> */}
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

        {orderById &&
          <div className="PageBillWrapper d-none">
            <div style={{ width: "450px", padding: "15px", margin: "auto" }} id="newPrint">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={orderById.branch.avatar ? `/${orderById.branch.avatar.path}` : ''} width="200" style={{ width: "100px" }} alt="" />
              </div>
              <h5 style={{ textAlign: "center", margin: "19px 0" }}>{t('Tax Invoice')}</h5>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>
                <span>{orderById.branch.branchName}</span><br />
                <span>{orderById.branch.address}</span><br />
                {/* <span>Road/Street 50, Samaheej,</span><br /> */}
                {/* <span>Block 236, Bahrain,</span><br /> */}
                <span>{t('Tel')} : {orderById.branch.telephone}</span><br />
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>{t('VAT Reg No')} - {orderById.branch.vatRegNo}</p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0" }}>
                <span style={{ paddingRight: "4px", fontSize: "14px", whiteSpace: "nowrap" }}>{dateToDDMMYYYY(orderById.dateOfPurchase)} {dateToHHMM(orderById.created_at)}</span>
                <span style={{ paddingLeft: "4px", fontSize: "14px", whiteSpace: "nowrap" }}>{t('Bill No')}:{orderById.orderNo}</span>
              </p>
              {orderById.customerDetails.member &&
                <div>
                  <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between" }}>
                    <span>{t('ID:')} <span style={{ padding: "10px" }}>{orderById.customerDetails.member.memberId}</span></span>
                    <span>{t('Mob:')} <span style={{ padding: "10px" }}>{orderById.customerDetails.member.mobileNo}</span></span>
                  </p>
                  <p style={{ display: "flex", textAlign: "center", justifyContent: "center", marginTop: "0" }}>
                    <span>{orderById.customerDetails.member.credentialId.userName}</span>
                  </p>
                </div>
              }
              {/* <p style={{ textAlign: "right", margin: "0 0 10px 0" }}>66988964</p> */}
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr style={{ borderTop: "1px dashed #000" }}>
                    <td>{t('No.')}</td>
                    <td>{t('Description')}</td>
                    <td>{t('Price')}</td>
                    <td>{t('Qty')}</td>
                    <td>{t('Total')}</td>
                  </tr>
                  {/* <tr style={{ borderTop: "1px dashed #000" }}>
                  <td>1</td>
                  <td>3 Month</td>
                  <td>26-Dec-19</td>
                  <td>13-Sep-20</td>
                </tr> */}
                  {orderById.purchaseStock.map((stock, i) => {
                    const { quantity, amount, stockId } = stock
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{stockId.itemName}</td>
                        <td>{this.props.defaultCurrency} {(parseFloat(amount) / quantity).toFixed(3)}</td>
                        <td>{quantity}</td>
                        <td>{this.props.defaultCurrency} {parseFloat(amount).toFixed(3)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <table style={{ width: "100%", textAlign: "right", borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>{t('Amount Total')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(orderById.actualAmount).toFixed(3)}</td>
                  </tr>
                  {parseFloat(orderById.discount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Discount')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.discount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.giftcard) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Giftcard')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.giftcard).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.vatAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('VAT')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.vatAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.digitalAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Digital')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.digitalAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.cashAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Cash')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.cashAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.cardAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.cardAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.cheque) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.cheque).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {orderById.bankName ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Bank Name')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{orderById.bankName}</td>
                    </tr>
                    : <tr></tr>}
                  {orderById.chequeNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Number')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{orderById.chequeNumber}</td>
                    </tr>
                    : <tr></tr>}
                  {orderById.chequeDate ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Date')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{dateToDDMMYYYY(orderById.chequeDate)}</td>
                    </tr>
                    : <tr></tr>}
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Grand Total')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.totalAmount).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Paid Amount')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.totalAmount).toFixed(3)}</td>
                  </tr>
                  {orderById.cardNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card last four digit')} :</td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{orderById.cardNumber}</td>
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
                  <QRCode value={`http://instagram.com/${orderById.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                </div>
                {orderById.doneBy && <span>{t('Served by')}: {orderById.doneBy.userName}</span>}
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

function mapStateToProps({ pos: { orderHistories }, currency: { defaultCurrency } }) {
  return {
    orderHistories,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(Orderlist))