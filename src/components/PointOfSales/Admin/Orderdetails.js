import $ from 'jquery'
import QRCode from 'qrcode.react'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getStockSellById } from '../../../actions/pos.action'
// import instaimg from '../../../assets'
import instaimg from '../../../assets/img/insta.jpg'
import { dateToDDMMYYYY, dateToHHMM } from '../../../utils/apis/helpers'

class Orderdetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      orderById: ''
    }
    this.props.dispatch(getStockSellById(this.props.match.params.id))
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
    const { t } = this.props
    const { orderById } = this.state
    if (this.props.stockSellById) {
      const { dateOfPurchase, created_at, actualAmount, discount, giftcard, vatAmount, totalAmount, purchaseStock, orderNo } = this.props.stockSellById
      return (
        <div className="mainPage p-3 Orderdetails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">Home</span>
              <span className="mx-2">/</span>
              <span className="crumbText">Sales</span>
              <span className="mx-2">/</span>
              <span className="crumbText">Order History</span>
            </div>
            <div className="col-12 pageHead">
              <h1>
                <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                <span className="px-1"></span>
                <span>{t('Order Details')}</span>
              </h1>
              <div className="pageHeadLine"></div>
            </div>
            <div className="col-12 d-flex justify-content-between align-items-center pt-4">
              <h4 className="mr-3 my-1"><span className="font-weight-bold">Order</span><span className="px-2 text-primary font-weight-bold">#{orderNo}</span><small className="text-body">{dateToDDMMYYYY(dateOfPurchase)}, {dateToHHMM(created_at)}</small></h4>
              {/* <div className="d-flex my-1">
                <span>Delivery</span>
                <div className="position-relative px-3">
                  <select className="pl-3 pr-4 py-1 bg-danger text-white">
                    <option>Pending</option>
                  </select>
                  <div className="d-flex px-3 justify-content-end align-items-center position-absolute pointerEventsNone" style={{ top: "0", right: "0", left: "0", bottom: "0" }}>
                    <span className="iconv1 iconv1-arrow-down text-white mr-2" style={{ fontSize: "14px" }}></span>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="col-12 col-lg-7 col-xl-6 py-3">
              <div className="table-responsive">
                <table className="table table-borderless ">
                  <thead>
                    <tr>
                      <th><span className="px-3">Item</span></th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseStock.map((stock, i) => {
                      const { quantity, amount, stockId: { itemName, image } } = stock
                      return (
                        <tr key={i}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img alt='' src={`/${image.path}`} className="objectFitContain w-50px h-50px bg-light mx-1" />
                              <span className="mx-1">{itemName}</span>
                            </div>
                          </td>
                          <td>
                            <p className="text-danger m-0 font-weight-bold whiteSpaceNoWrap">{this.props.defaultCurrency} {amount.toFixed(3)}</p>
                          </td>
                          <td>{quantity}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-12 col-lg-1 col-xl-2"></div>
            <div className="col-12 col-lg-4 pt-3">
              {/* <div className="bg-light p-3">
                <h4 className="border-bottom py-1">Payment Information</h4>
                <h6 className="font-weight-bold text-primary">Credit Card</h6>
                <div className="d-flex">
                  <span className="iconv1 iconv1-eye mr-2"></span>
                  <span>Ending is 2526</span>
                </div>
              </div> */}
              <div className="bg-light mt-2 p-2">
                <table className="table table-borderless ">
                  <thead>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sub Total:</td>
                      <td className="text-right">{this.props.defaultCurrency} {parseFloat(actualAmount).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td>Discount:</td>
                      <td className="text-right">{parseFloat(discount).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td>Gift Card:</td>
                      <td className="text-right">{parseFloat(giftcard).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td>VAT:</td>
                      <td className="text-right text-primary">{parseFloat(vatAmount).toFixed(3)}</td>
                    </tr>
                    <tr className="border-top">
                      <td className="font-weight-bold"><h3>Total</h3></td>
                      <td className="text-right text-danger font-weight-bold"><h3>{this.props.defaultCurrency} {parseFloat(totalAmount).toFixed(3)}</h3></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center mt-4">
                <div className="btn d-flex justify-content-center align-items-center border rounded border-success" data-toggle="modal" data-target="#ReceiptModal" onClick={() => this.setState({ orderById: this.props.stockSellById })}>
                  <h5 className="mr-2 my-0">Invoice</h5>
                  {/* <span className="w-30px h-30px rounded-circle bg-warning mr-2 d-flex align-items-center justify-content-center">
                    <span className="iconv1 iconv1-eye text-white"></span>
                  </span> */}
                  <span className="iconv1 iconv1-eye bg-success tableDownloadViewIcons"></span>
                </div>
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
                        <img alt='' src={orderById.branch.avatar ? `/${orderById.branch.avatar.path}` : ''} className="" width="100" />
                      </div>
                      <h4 class="border-bottom border-dark text-center font-weight-bold pb-1">Tax Invoice</h4>
                      <div className="row px-5 justify-content-between">
                        <div className="col-free p-3">
                          <div className="mb-3">
                            <label className="m-0 font-weight-bold">Address</label>
                            <p className="whiteSpaceNormal mnw-150px mxw-200px">{orderById.branch.address}</p>
                          </div>
                          <div className="">
                            <label className="m-0 font-weight-bold">VAT Reg Number</label>
                            <p className="">{orderById.branch.vatRegNo}</p>
                          </div>
                        </div>
                        <div className="col-free p-3">
                          <div className="mb-3">
                            <label className="m-0 font-weight-bold">Tax Invoice No</label>
                            <p className="">{orderById.orderNo}</p>
                          </div>
                          <div className="">
                            <label className="m-0 font-weight-bold">Date & Time</label>
                            <p className="">{dateToDDMMYYYY(orderById.dateOfPurchase)} {dateToHHMM(orderById.created_at)}</p>
                          </div>
                        </div>
                        <div className="col-free p-3">
                          <div className="">
                            <label className="m-0 font-weight-bold">Receipt Total</label>
                            <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(orderById.totalAmount).toFixed(3)}</p>
                          </div>
                          <div className="">
                            <label className="m-0 font-weight-bold">Telephone</label>
                            <p className="">{orderById.branch.telephone}</p>
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
                                {parseFloat(orderById.discount) ?
                                  <div className="text-right my-1">Discount :</div>
                                  : <div></div>}
                                {parseFloat(orderById.giftcard) ?
                                  <div className="text-right my-1">Gift Card :</div>
                                  : <div></div>}
                                {parseFloat(orderById.vatAmount) ?
                                  <div className="text-right my-1">VAT :</div>
                                  : <div></div>}
                                {parseFloat(orderById.digitalAmount) ?
                                  <div className="text-right my-1">Digital :</div>
                                  : <div></div>}
                                {parseFloat(orderById.cashAmount) ?
                                  <div className="text-right my-1">Cash :</div>
                                  : <div></div>}
                                {parseFloat(orderById.cardAmount) ?
                                  <div className="text-right my-1">Card :</div>
                                  : <div></div>}
                                <div className="text-right my-1">Grand Total :</div>
                                <div className="text-right my-1">Paid Amount :</div>
                                {orderById.cardNumber ?
                                  <div className="text-right my-1">Card last four digit :</div>
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
                                <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.totalAmount).toFixed(3)}</span></div>
                                <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(orderById.totalAmount).toFixed(3)}</span></div>

                                {orderById.cardNumber ?
                                  <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{orderById.cardNumber}</span></div>
                                  : <div></div>}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex flex-wrap justify-content-between my-2">
                        <div className="d-flex align-items-center">
                          <div className="mr-3 text-center">
                            <img src={instaimg} alt="" className="w-30px" />
                            <h6 className="font-weight-bold mb-0 mt-1">Follow Us</h6>
                          </div>
                          <div className="w-50px mr-3">
                            <QRCode value={`http://instagram.com/${orderById.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                          </div>
                        </div>
                        {orderById.doneBy && <h6 className="font-weight-bold">Served by: {orderById.doneBy.userName}</h6>}
                      </div>
                      <div className="d-flex justify-content-center">
                        <div className="text-center">
                          <h6 className="font-weight-bold" >Membership cannot be refunded or transferred to others.</h6>
                          <h6 className="font-weight-bold">Thank You</h6>
                        </div>
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
    } else {
      return null
    }
  }
}

function mapStateToProps({ pos: { stockSellById }, currency: { defaultCurrency } }) {
  return {
    stockSellById,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(Orderdetails))
