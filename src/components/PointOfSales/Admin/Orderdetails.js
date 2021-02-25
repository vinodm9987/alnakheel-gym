import $ from 'jquery'
import QRCode from 'qrcode.react'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getStockSellById } from '../../../actions/pos.action'
// import instaimg from '../../../assets'
import instaimg from '../../../assets/img/insta.jpg'
import { dateToDDMMYYYY, dateToHHMM } from '../../../utils/apis/helpers'
import { PRODIP } from '../../../config'

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
              <span className="crumbText">{t('Home')}</span>
              <span className="mx-2">/</span>
              <span className="crumbText">{t('Sales')}</span>
              <span className="mx-2">/</span>
              <span className="crumbText">{t('Order History')}</span>
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
              <h4 className="mr-3 my-1 ">
                <span className="font-weight-bold">{t('Order')}</span>
                <span className="px-2 text-primary font-weight-bold d-inline-block dirltrtar">#{orderNo}</span>
                <small className="text-body d-inline-block dirltrtar">{dateToDDMMYYYY(dateOfPurchase)}</small>
                <small className="text-body d-inline-block dirltrtar mr-1">.</small>
                <small className="text-body d-inline-block dirltrtar">{dateToHHMM(created_at)}</small>
              </h4>
              {/* <div className="d-flex my-1">
                <span>Delivery</span>
                <div className="position-relative px-3">
                  <select className="pl-3 pr-4 py-1 bg-danger text-white">
                    <option>{t('Pending')}</option>
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
                      <th><span className="px-3">{t('Item')}</span></th>
                      <th>{t('Price')}</th>
                      <th>{t('Qty')}</th>
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
                      <td>{t('Sub Total')}:</td>
                      <td className="text-right">{this.props.defaultCurrency} {parseFloat(actualAmount).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td>{t('Discount')}:</td>
                      <td className="text-right">{parseFloat(discount).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td>{t('Gift Card')}:</td>
                      <td className="text-right">{parseFloat(giftcard).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td>{t('VAT')}:</td>
                      <td className="text-right text-primary">{parseFloat(vatAmount).toFixed(3)}</td>
                    </tr>
                    <tr className="border-top">
                      <td className="font-weight-bold"><h3>{t('Total')}</h3></td>
                      <td className="text-right text-danger font-weight-bold"><h3>{this.props.defaultCurrency} {parseFloat(totalAmount).toFixed(3)}</h3></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center mt-4">
                <div className="btn d-flex justify-content-center align-items-center border rounded border-success" data-toggle="modal" data-target="#ReceiptModal" onClick={() => this.setState({ orderById: this.props.stockSellById })}>
                  <h5 className="mr-2 my-0">{t('Invoice')}</h5>
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
                    <h4 className="modal-title">{t('Receipt')}</h4>
                    <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                  </div>
                  <div className="modal-body">
                    <div className="container">
                      <div className="text-center my-3">
                        <img alt='' src={orderById.branch.avatar ? `/${orderById.branch.avatar.path}` : ''} className="" width="100" />
                      </div>
                      <h4 class="border-bottom border-dark text-center font-weight-bold pb-1">{t('Tax Invoice')}</h4>
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
                                  <div className="text-right my-1">{t('VAT')}:</div>
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
                      </div>
                      <div className="d-flex flex-wrap justify-content-between my-2">
                        <div className="d-flex align-items-center">
                          <div className="mr-3 text-center">
                            <img src={instaimg} alt="" className="w-30px" />
                            <h6 className="font-weight-bold mb-0 mt-1">{t('Follow Us')}</h6>
                          </div>
                          <div className="w-50px mr-3">
                            <QRCode value={`http://instagram.com/${orderById.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                          </div>
                        </div>
                        {orderById.doneBy && <h6 className="font-weight-bold">{t('Served by')}: {orderById.doneBy.userName}</h6>}
                      </div>
                      <div className="d-flex justify-content-center">
                        <div className="text-center">
                          <h6 className="font-weight-bold" >{t('Membership cannot be refunded or transferred to others.')}</h6>
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
            <div className="PageBillWrapper d-none" id="newPrint">
              <div style={{ width: "80mm", padding: "4px", margin: "auto" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={orderById.branch.avatar ? `${PRODIP}/${orderById.branch.avatar.path}` : ''} width="100" style={{ width: "100px" }} alt="" />
                </div>
                <h5 style={{ textAlign: "center", margin: "19px 0px 9px 0px", fontSize: "19px" }}>{t('Tax Invoice')}</h5>
                <p style={{ textAlign: "center", margin: "0 0 10px 0", fontSize: "14px" }}>
                  <span>{orderById.branch.branchName}</span><br />
                  <span>{orderById.branch.address}</span><br />
                </p>
                <p style={{ textAlign: "center", margin: "0 0 10px 0", fontSize: "14px" }}>
                  <span>{t('Tel')} : {orderById.branch.telephone}</span>
                </p>
                <p style={{ textAlign: "center", margin: "0 0 10px 0", fontSize: "14px" }}>{t('VAT Reg No')} - {orderById.branch.vatRegNo}</p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: "0", fontSize: "14px" }}>
                  <span>{dateToDDMMYYYY(orderById.dateOfPurchase)} {dateToHHMM(orderById.created_at)}</span>
                  <span style={{ width: "4px", height: "4px" }}></span>
                  <span>{t('Bill No')}:{orderById.orderNo}</span>
                </p>
                {orderById.customerDetails.member &&
                  <div>
                    <p style={{ display: "flex", textAlign: "center", justifyContent: "center", margin: "10px 0", fontSize: "14px" }}>
                      <span style={{ display: "flex" }}>
                        <span>{t('Mob')}</span><span style={{ padding: "0 4px" }}>:</span><span>{orderById.customerDetails.member.mobileNo}</span>
                      </span>
                    </p>
                    <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between", margin: "0 0 10px 0", fontSize: "14px" }}>
                      <span style={{ display: "flex" }}>
                        <span>{t('ID')}</span><span style={{ padding: "0 4px" }}>:</span><span>{orderById.customerDetails.member.memberId}</span>
                      </span>
                      <span>{orderById.customerDetails.member.credentialId.userName}</span>
                    </p>
                  </div>
                }
                {/* <p style={{ textAlign: "right", margin: "0 0 10px 0" }}>66988964</p> */}
                <table style={{ width: "100%", fontSize: "14px" }}>
                  <tbody>
                    <tr>
                      <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px" }}>{t('No.')}</td>
                      <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>{t('Description')}</td>
                      <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px", textAlign: "center" }}>{t('Price')}</td>
                      <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px", textAlign: "center" }}>{t('Qty')}</td>
                      <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px", textAlign: "center" }}>{t('Total')}</td>
                    </tr>
                    {orderById.purchaseStock.map((stock, i) => {
                      const { quantity, amount, stockId } = stock
                      return (
                        <tr key={i}>
                          <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px" }}>{i + 1}</td>
                          <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>{stockId.itemName}</td>
                          <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px", textAlign: "center" }}>{this.props.defaultCurrency} {(parseFloat(amount) / quantity).toFixed(3)}</td>
                          <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px", textAlign: "center" }}>{quantity}</td>
                          <td style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", width: "50px", textAlign: "center" }}>{this.props.defaultCurrency} {parseFloat(amount).toFixed(3)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <table style={{ width: "100%", textAlign: "right", borderTop: "1px dashed #000", borderBottom: "1px dashed #000", fontSize: "14px" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>{t('Amount Total')} {this.props.defaultCurrency} : </td>
                      <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(orderById.actualAmount).toFixed(3)}</td>
                    </tr>
                    {parseFloat(orderById.discount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Discount')} {this.props.defaultCurrency} : </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.discount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(orderById.giftcard) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Giftcard')} {this.props.defaultCurrency} : </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.giftcard).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(orderById.vatAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('VAT')} {this.props.defaultCurrency} : </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.vatAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(orderById.digitalAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Digital')} {this.props.defaultCurrency} : </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.digitalAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(orderById.cashAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Cash')} {this.props.defaultCurrency} : </td>
                        <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(orderById.cashAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(orderById.cardAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card')} {this.props.defaultCurrency} : </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.cardAmount).toFixed(3)}</td>
                      </tr>
                      : <tr></tr>}
                    {parseFloat(orderById.chequeAmount) ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque')} {this.props.defaultCurrency} : </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.chequeAmount).toFixed(3)}</td>
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
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Grand Total')} {this.props.defaultCurrency} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.totalAmount).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Paid Amount')} {this.props.defaultCurrency} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(orderById.totalAmount).toFixed(3)}</td>
                    </tr>
                    {orderById.cardNumber ?
                      <tr>
                        <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card last four digit')} : </td>
                        <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{orderById.cardNumber}</td>
                      </tr>
                      : <tr></tr>}
                  </tbody>
                </table>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0", fontSize: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ marginRight: "10px", justifyContent: "center" }}>
                      <img src={instaimg} alt="" style={{ width: "30px", height: "30px" }} />
                    </div>
                    <QRCode value={`http://instagram.com/${orderById.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                  </div>
                  {orderById.doneBy && <span>{t('Served by')} : {orderById.doneBy.userName}</span>}
                </div>
                <p style={{ display: "flex", margin: "0 0 10px 0", fontSize: "14px" }}>
                  <span>{t('NB')}:</span>
                  <span style={{ flexGrow: "1", textAlign: "center" }}>{t('Membership cannot be refunded or transferred to others.')}</span>
                </p>
                <p style={{ textAlign: "center", margin: "0 0 10px 0", fontSize: "14px" }}>{t('Thank You')}</p>
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
