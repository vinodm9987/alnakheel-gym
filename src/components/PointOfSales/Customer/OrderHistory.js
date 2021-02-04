import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getCustomerOrderHistory } from '../../../actions/pos.action'
import { dateToDDMMYYYY, dateToHHMM } from '../../../utils/apis/helpers'
import $ from 'jquery'
import QRCode from 'qrcode.react';
import instaimg from '../../../assets/img/insta.jpg'
class OrderHistory extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: '',
      search: '',
      memberId: '',
      orderById: ''
    }
  }

  componentDidMount() {
    const memberId = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    this.setState({ memberId }, () => {
      this.props.dispatch(getCustomerOrderHistory(this.state))
    })
  }

  handleFilter(mode, search) {
    this.setState({ mode, search }, () => {
      window.dispatchWithDebounce(getCustomerOrderHistory)(this.state)
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

  render() {
    const { mode, search, orderById } = this.state
    const { t } = this.props
    return (
      <div className="mainPage p-3 Shopping">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Sales</span><span className="mx-2">/</span><span className="crumbText">Order History</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              <span>Order History</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12 pt-1 px-4 d-flex flex-wrap justify-content-between">
            <h4 className="text-muted mt-4 mb-3">Order History</h4>
            <form class="form-inline row">
              <div className="col-12">
                <div class="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">Mode</label>
                      <select className="form-control mx-sm-2 inlineFormInputs" value={mode} onChange={(e) => this.handleFilter(e.target.value, search)}>
                        <option value="">{t('All')}</option>
                        <option value="POS">{t('POS')}</option>
                        <option value="Online">{t('Online')}</option>
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    </div>
                  </div>
                  {/* <div class="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div class="form-group inlineFormGroup">
                      <input type="text" autoComplete="off" class="form-control mx-sm-2 badge-pill inlineFormInputs" />
                      <span class="iconv1 iconv1-search searchBoxIcon"></span>
                    </div>
                  </div> */}
                </div>
              </div>
            </form>
          </div>
          <div className="col-12 px-4">
            <div id="accordion">

              {/*  one card loop */}
              {this.props.customerOrderHistories && this.props.customerOrderHistories.map((order, i) => {
                const { dateOfPurchase, paymentType, created_at, actualAmount, discount, giftcard, vatAmount, totalAmount, purchaseStock } = order
                return (
                  <div className="card mb-3" key={i}>
                    <div className="card-header" style={{ backgroundColor: '#cceaea' }}>
                      <div className="d-flex flex-sm-nowrap flex-wrap justify-content-between align-items-center">
                        <div className="d-flex flex-wrap justify-content-start align-items-center w-100">
                          <h5 className="mx-2 mb-0 SegoeBold text-secondary">Order</h5>
                          <h5 className="mx-2 mb-0 SegoeSemiBold text-info">#98657455</h5>
                          <h5 className="mx-1 mb-0 text-muted d-flex flex-wrap"><small className="mx-1">{dateToHHMM(created_at)}</small><small className="mx-1">-</small><small className="mx-1">{dateToDDMMYYYY(dateOfPurchase)}</small></h5>
                        </div>
                        <div className="d-flex justify-content-end align-items-center w-100">
                          <div className="mx-1 d-flex py-1">
                            <h6 className="mx-2 mb-0 SegoeBold text-secondary">{paymentType}</h6>
                            {/* <h6 className="mx-2 mb-0 SegoeBold text-danger">Pending</h6> */}
                            {/* <h6 className="mx-2 mb-0 SegoeBold text-primary">Delivered</h6> */}

                            <span className="w-30px h-30px d-flex justify-content-center align-items-center bg-success text-white mx-1 rounded-circle" data-toggle="modal" data-target="#ReceiptModal"
                              onClick={() => this.setState({ orderById: order })}><span className="iconv1 iconv1-eye"></span></span>
                            {/* <span className="w-30px h-30px d-flex justify-content-center align-items-center bg-danger text-white mx-1 rounded-circle"><span className="iconv1 iconv1-download"></span></span> */}
                          </div>
                          <button className="btn p-0" data-toggle="collapse" data-target={`#OrderNum-${i}`} style={{ backgroundColor: '#cceaea' }}>
                            <h4 className="iconv1 iconv1-arrow-down m-0"> </h4>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div id={`OrderNum-${i}`} className="collapse" data-parent="#accordion">
                      <div className="card-body" style={{ backgroundColor: '#f4f4f4' }}>
                        <div className="row">
                          <div className="col-12 col-lg-7">
                            <div className="table-responsive">
                              <table className="table table-borderless whiteSpaceNoWrap">
                                <thead className="text-secondary">
                                  <tr>
                                    <th>Item</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-center">Qty</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {purchaseStock.map((stock, j) => {
                                    const { quantity, amount, stockId: { itemName, image } } = stock
                                    return (
                                      <tr key={`${i}-${j}`}>
                                        <td>
                                          <div className="d-flex justify-content-start align-items-center">
                                            <img alt='' src={`/${image.path}`} className="w-75px h-50px objectFitCover" />
                                            <span className="mx-1"></span>
                                            <h5><small className="mx-1">{itemName}</small></h5>
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          <span className="text-danger"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{amount.toFixed(3)}</span></span>
                                        </td>
                                        <td className="text-center text-secondary">{quantity}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-12 col-lg-5">
                            <div className="row">



                              {/* <div className="col-12 pb-2">
                            <div className="card px-3 bg-white w-100 border-light mt-1">
                              <div className="row mx-0">
                                <div className="col-12 border-bottom border-secondary">
                                  <h5 className="text-secondary my-2"><small>Payment Information</small></h5>
                                </div>
                                <div className="col-12 pt-2 pb-2">
                                  <h5 className="text-info my-1 fot-weight-bold"><small>Credit Card</small></h5>
                                  <div className="d-flex justify-content-start align-items-center">
                                    <span className="iconv1 iconv1-email" style={{ fontSize: '38px' }}></span>
                                    <span className="mx-2"></span>
                                    <h6 className="text-muted fot-weight-bold"><small>Visa ending is 2526</small></h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}



                              <div className="col-12">
                                <div className="card px-2 bg-white w-100 border-light mt-1">
                                  <div className="table-responsive">
                                    <table className="table table-borderless table-sm">
                                      <thead>
                                        <tr>
                                          <td></td>
                                          <td></td>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <p className="m-0">Sub Total</p>
                                          </td>
                                          <td>
                                            <p className="m-0"><small className="d-flex justify-content-end dirltrtaljcfs"><span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span>{parseFloat(actualAmount).toFixed(3)}</span></small></p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <p className="m-0">Discount</p>
                                          </td>
                                          <td>
                                            <p className="m-0"><small className="d-flex justify-content-end">{parseFloat(discount).toFixed(3)}</small></p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <p className="m-0">Gift Card</p>
                                          </td>
                                          <td>
                                            <p className="m-0"><small className="d-flex justify-content-end">{parseFloat(giftcard).toFixed(3)}</small></p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <p className="m-0">Tax</p>
                                          </td>
                                          <td>
                                            <p className="m-0"><small className="d-flex justify-content-end text-primary">{parseFloat(vatAmount).toFixed(3)}</small></p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td colspan="2">
                                            <div className="bg-secondary border-top w-100 border-secondary"></div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <h3 className="m-0">Total</h3>
                                          </td>
                                          <td>
                                            <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold dirltrtaljcfs"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{parseFloat(totalAmount).toFixed(3)}</span></h5>
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
                    </div>
                  </div>
                )
              })}
              {/* /- one card loop end */}
            </div>
          </div>
        </div>
        {/* --------------Receipt Modal-=--------------- */}
        {orderById &&
          <div className="modal fade commonYellowModal" id="ReceiptModal">
            <div className="modal-dialog modal-lg" id="ReceiptModal2">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Receipt</h4>
                  <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="text-center my-3">
                      <img alt='' src="/static/media/gymnago.8cf7122d.png" className="" width="250" />
                    </div>
                    <div className="row px-5">
                      <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 p-3">
                        <label className="m-0 font-weight-bold">Address</label>
                        <p className="whiteSpaceNormal mnw-150px mxw-200px">{orderById.branch.address}</p>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">Receipt No</label>
                          <p className="">{ }</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">Date & Time</label>
                          <p className="">{dateToDDMMYYYY(orderById.dateOfPurchase)} {dateToHHMM(orderById.created_at)}</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 p-3">
                        <div className="text-md-right">
                          <label className="m-0">Receipt Total</label>
                          <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(orderById.totalAmount).toFixed(3)}</p>
                        </div>
                      </div>
                    </div>
                    {orderById.customerDetails.member &&
                      <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">ID:</span>
                            <span className="px-1">{orderById.customerDetails.member.memberId}</span>
                          </h6>
                        </div>
                        <h6 className="font-weight-bold m-1">{orderById.customerDetails.member.credentialId.userName}</h6>
                        <div className="">
                          <h6 className="font-weight-bold m-1">
                            <span className="px-1">Mob:</span>
                            <span className="px-1">{orderById.customerDetails.member.mobileNo}</span>
                          </h6>
                        </div>
                      </div>
                    }
                    <div className="table-responsive RETable">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
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
                              <div className="text-right my-1">Amount Total :</div>
                              <div className="text-right my-1">Discount :</div>
                              <div className="text-right my-1">Gift Card :</div>
                              <div className="text-right my-1">Tax :</div>
                              <div className="text-right my-1">Grand Total :</div>
                            </td>
                            <td className="">
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.actualAmount).toFixed(3)}</span></div>
                              <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.discount).toFixed(3)}</span></div>
                              <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.giftcard).toFixed(3)}</span></div>
                              <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.vatAmount).toFixed(3)}</span></div>
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.totalAmount).toFixed(3)}</span></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between my-4">
                      <h6 className="font-weight-bold">Paid Amount: {this.props.defaultCurrency} {parseFloat(orderById.totalAmount).toFixed(3)}</h6>
                      {orderById.doneBy && <h6 className="font-weight-bold">Done by: {orderById.doneBy.userName}</h6>}
                    </div>
                    <div className="text-center px-5">
                      <h5 className="text-muted">The receipt amount will not be refunded in any case.</h5>
                      <h5 className="font-weight-bold">Thank You</h5>
                    </div>
                    <div className="text-center">
                      <button type="button" className="btn btn-success px-4 py-1 my-2" data-dismiss="modal" onClick={() => this.handlePrint()}>Print Receipt</button>
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
              <h5 style={{ textAlign: "center", margin: "19px 0" }}>Tax Invoice</h5>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>
                <span>{orderById.branch.branchName}</span><br />
                <span>{orderById.branch.address}</span><br />
                {/* <span>Road/Street 50, Samaheej,</span><br /> */}
                {/* <span>Block 236, Bahrain,</span><br /> */}
                <span>Tel : {orderById.branch.telephone}</span><br />
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>VAT - {orderById.branch.vatRegNo}</p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0" }}>
                <span style={{ padding: "2px", fontSize: "14px" }}>{dateToDDMMYYYY(orderById.dateOfPurchase)} {dateToHHMM(orderById.created_at)}</span>
                <span style={{ padding: "2px", fontSize: "14px" }}>Bill No:{orderById.orderNo}</span>
              </p>
              {orderById.customerDetails.member &&
                <div>
                  <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between" }}>
                    <span>ID: <span style={{ padding: "10px" }}>{orderById.customerDetails.member.memberId}</span></span>
                    <span>Mob: <span style={{ padding: "10px" }}>{orderById.customerDetails.member.mobileNo}</span></span>
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
                    <td>No.</td>
                    <td>DESCRIPTION</td>
                    <td>PRICE</td>
                    <td>QTY</td>
                    <td>TOTAL</td>
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
                    <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>Amount Total {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(orderById.actualAmount).toFixed(3)}</td>
                  </tr>
                  {parseFloat(orderById.discount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Discount {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.discount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.giftcard) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Giftcard {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.giftcard).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.vatAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>VAT {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.vatAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.digitalAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Digital {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(orderById.digitalAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.cashAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>Cash {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>5{parseFloat(orderById.cashAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(orderById.cardAmount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Card {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.cardAmount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Grand Total {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.totalAmount).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Paid Amount {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.totalAmount).toFixed(3)}</td>
                  </tr>
                  {orderById.cardNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>Card last four digit :</td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{orderById.cardNumber}</td>
                    </tr>
                    : <tr></tr>}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ marginRight: "10px", justifyContent: "center" }}>
                    <img src={instaimg} alt="" style={{ width: "30px", height: "30px" }} />
                    {/* <h6>Follow Us</h6> */}
                  </div>
                  <QRCode value={`http://instagram.com/${orderById.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                </div>
                {orderById.doneBy && <span>Served by: {orderById.doneBy.userName}</span>}
              </div>
              <p style={{ display: "flex", margin: "0 0 10px 0" }}>
                <span>NB:</span>
                <span style={{ flexGrow: "1", textAlign: "center" }}>Membership cannot be refunded or transferred to others.</span>
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>Thank You</p>
            </div>
          </div>
        }
      </div>
    )
  }
}


function mapStateToProps({ auth: { loggedUser }, pos: { customerOrderHistories }, currency: { defaultCurrency } }) {
  return {
    loggedUser,
    defaultCurrency,
    customerOrderHistories
  }
}

export default withTranslation()(connect(mapStateToProps)(OrderHistory))