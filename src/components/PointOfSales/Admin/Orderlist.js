import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { dateToDDMMYYYY, dateToHHMM, getPageWiseData } from '../../../utils/apis/helpers'
import Pagination from '../../Layout/Pagination'
import { getOrderHistory } from '../../../actions/pos.action'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import image from '../../../assets/img/al-main-logo.png'

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
    var printOne = $('#ReceiptModal2').html();
    w.document.write('<html><head><title></title>');
    w.document.write('<link rel="stylesheet" href="css/style.css" type="text/css" />');
    w.document.write('<link rel="stylesheet" href="css/style2.css" type="text/css" />');
    w.document.write('<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" />');
    w.document.write('<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" />');
    w.document.write('</head><body >');
    w.document.write(printOne)
    w.document.write('</body></html>');
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
            <span className="crumbText">Home</span>
            <span className="mx-2">/</span>
            <span className="crumbText">Sales</span>
            <span className="mx-2">/</span>
            <span className="crumbText">Order History</span>
          </div>
          <div className="col-12 pageHead">
            <h1>Order History</h1>
            <div className="pageHeadLine"></div>
          </div>
        </div>


        <form className="form-inline row">
          <div className="col-12">
            <div className="row d-block d-sm-flex justify-content-end pt-5">
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
                  <th>Receipt No</th>
                  <th>Member</th>
                  <th>Date Of Purchase</th>
                  <th>Mode Of Purchase</th>
                  {/* <th>Delivery Status</th> */}
                  {/* <th>Payment</th> */}
                  <th>Invoice</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.orderHistories && getPageWiseData(this.state.pageNumber, this.props.orderHistories, this.state.displayNum).map((order, i) => {
                  const { customerDetails: { member }, _id, dateOfPurchase, paymentType } = order
                  if (member) {
                    const { credentialId: { userName, avatar, email } } = member

                    return (
                      <tr key={i}>
                        <td className="text-primary font-weight-bold"></td>
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
                        {/* <td className="text-danger">Pending</td> */}
                        {/* <td>Paid</td> */}
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
                        <td className="text-primary font-weight-bold"></td>
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
                        {/* <td className="text-danger">Pending</td> */}
                        {/* <td>Paid</td> */}
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
                  <h4 className="modal-title">Receipt</h4>
                  <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="text-center my-3">
                      {/* tushar image changedc here */}
                      <img alt='' src={image} className="mb-2" width="100" />
                      <h4 className="border-bottom border-dark text-center font-weight-bold pb-1">Tax Invoice</h4>
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
                      <h5 className="text-muted">The recepit amount will not be refunded in any case.</h5>
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