
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getStocksById, updateStockStatus } from '../../../actions/pos.action'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom'

class StockDetails extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(getStocksById(this.props.match.params.id))
  }

  handleCheckBox(e, stockId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateStockStatus(stockId, obj))
  }

  render() {
    const { t } = this.props
    if (this.props.stockById) {
      const { itemName, quantity, sellingPrice, costPerUnit, supplierName: { supplierName }, expiryDate, purchaseDate,
        branch: { branchName }, description, image, status, _id, vat: { vatName, taxPercent } } = this.props.stockById
      return (
        <div className="mainPage p-3 StockDetails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Sales')}</span>
              <span className="mx-2">/</span><span className="crumbText">{t('Stock')}</span>
            </div>
            <div className="col-12 pageHead">
              <h1>
                <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                <span className="px-1"></span>
                <span>{t('Stock Details')}</span>
              </h1>
              <div className="pageHeadLine"></div>
            </div>
            <div className="container-fluid mt-3">
              <div className="row px-3">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 border bg-light rounded">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2 py-3">
                          <img src={`/${image.path}`} className="w-100" alt="" />
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10">
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-end pb-3">
                              <div className="d-flex px-3 pt-3 align-items-center">
                                <span className="mx-2 mb-2">{t('Status')}</span>
                                <span className="mx-2">
                                  <label className="switch">
                                    <input type="checkbox" checked={status} onChange={(e) => this.handleCheckBox(e, _id)} />
                                    <span className="slider round"></span>
                                  </label>
                                </span>
                              </div>
                              <div className="px-3 pt-3">
                                <Link to={{ pathname: "/stock", stockData: JSON.stringify(this.props.stockById) }} className="btn btn-primary text-white linkHoverDecLess">
                                  <span className="iconv1 iconv1-edit mx-1"></span><span className="mx-1">{t('Edit')}</span>
                                </Link>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4">
                              <label>{t('Item Name')}</label>
                              <h5>{itemName}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2">
                              <label>{t('Purchase Date')}</label>
                              <h5>{dateToDDMMYYYY(purchaseDate)}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2">
                              <label>{t('Expiry Date')}</label>
                              <h5>{dateToDDMMYYYY(expiryDate)}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2">
                              <label>{t('Cost Per Unit')}</label>
                              <h4 className="text-warning dirltrtar">{this.props.defaultCurrency} {costPerUnit}</h4>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2">
                              <label>{t('Selling Price')}</label>
                              <h4 className="text-warning dirltrtar">{this.props.defaultCurrency} {sellingPrice}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th colSpan="2" className="bg-white border-bottom">{t('Other Details')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="bg-white border-bottom" style={{ width: "25%" }}>{t('Supplier Name')}</td>
                              <td className="bg-white border-bottom">{supplierName}</td>
                            </tr>
                            <tr>
                              <td className="bg-white border-bottom" style={{ width: "25%" }}>{t('Quantity')}</td>
                              <td className="bg-white border-bottom">{quantity}</td>
                            </tr>
                            <tr>
                              <td className="bg-white border-bottom" style={{ width: "25%" }}>{t("Stock Location")}</td>
                              <td className="bg-white border-bottom">{branchName}</td>
                            </tr>
                            <tr>
                              <td className="bg-white border-bottom" style={{ width: "25%" }}>{t('Description')}</td>
                              <td className="bg-white border-bottom">{description}</td>
                            </tr>
                            <tr>
                              <td className="bg-white border-bottom" style={{ width: "25%" }}>{t('VAT')}</td>
                              <td className="bg-white border-bottom">{taxPercent === 0 ? `${vatName}` : `${taxPercent}%`}</td>
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
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ pos: { stockById }, currency: { defaultCurrency } }) {
  return {
    stockById,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(StockDetails))