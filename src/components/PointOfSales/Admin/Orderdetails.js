import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getStockSellById } from '../../../actions/pos.action'
import { dateToDDMMYYYY, dateToHHMM } from '../../../utils/apis/helpers'

class Orderdetails extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(getStockSellById(this.props.match.params.id))
  }

  render() {
    const { t } = this.props
    if (this.props.stockSellById) {
      const { dateOfPurchase, created_at, actualAmount, discount, giftcard, vatAmount, totalAmount, purchaseStock } = this.props.stockSellById
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
              <h4 className="mr-3 my-1"><span className="font-weight-bold">Order</span><span className="px-2 text-primary font-weight-bold">#3432532</span><small className="text-body">{dateToDDMMYYYY(dateOfPurchase)}, {dateToHHMM(created_at)}</small></h4>
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
                      <td>Tax:</td>
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
                <h3 className="mr-2">Invoice</h3>
                <span className="w-30px h-30px rounded-circle bg-warning mr-2 d-flex align-items-center justify-content-center">
                  <span className="iconv1 iconv1-eye text-white"></span>
                </span>
                <span className="w-30px h-30px rounded-circle bg-success mr-2 d-flex align-items-center justify-content-center">
                  <span className="iconv1 iconv1-eye text-white"></span>
                </span>
              </div>
            </div>
          </div>
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
