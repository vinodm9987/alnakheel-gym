import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getASuppliersById } from '../../../actions/asset.action'

class SupplierDetails extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(getASuppliersById(this.props.match.params.id))
  }

  render() {
    if (this.props.supplierById) {
      const { t } = this.props
      const { supplierName, mobileNumber, phoneNumber, address, email, supplierCode, bankName, accountNumber, ibanCode, swiftCode, currency } = this.props.supplierById
      return (
        <div className="mainPage p-3 Supplier">
          <div className="row">
            <span className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Assets')}</span><span className="mx-2">/</span><span className="crumbText">{t('Supplier')}</span>
            </span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 pageHead">
                <h1>
                  <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                  <span className="px-1"></span>
                  <span>{t('Supplier Details')}</span>
                </h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 subHead py-3 px-4 text-primary">
            <h4><b>Supplier Code {supplierCode}</b></h4>
          </div>
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-lg-between">
              <div className="m-3">{t('Supplier Name')}<h6><b>{supplierName}</b></h6></div>
              <div className="m-3">{t('Mobile Number')}<h6><b className="dirltrtar">{mobileNumber}</b></h6></div>
              <div className="m-3">{t('Phone Number')}<h6><b className="dirltrtar">{phoneNumber}</b></h6></div>
              <div className="m-3">{t('Email')}<h6><b>{email}</b></h6></div>
              <div className="m-3">{t('Address')}<h6><b>{address}</b></h6></div>
            </div>
          </div>
          <div className="col-12 my-5">
            <div className="card bg-light text-dark">
              <div className="card-body">
                <h4>Bank Details</h4>
                <div className="d-flex flex-wrap justify-content-md-between">
                  <div className="m-3">{t('Bank Name')}<h6><b>{bankName}</b></h6></div>
                  <div className="m-3">{t('Account Number')}<h6><b>{accountNumber}</b></h6></div>
                  <div className="m-3">{t('IBAN Number')}<h6><b>{ibanCode}</b></h6></div>
                  <div className="m-3">{t('Swift Code')}<h6><b>{swiftCode}</b></h6></div>
                  <div className="m-3">{t('Currency')}<h6><b>{currency}</b></h6></div>
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

function mapStateToProps({ asset: { supplierById } }) {
  return {
    supplierById
  }
}

export default withTranslation()(connect(mapStateToProps)(SupplierDetails))
