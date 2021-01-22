import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getContractById } from '../../../actions/asset.action'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'
import { PRODIP } from '../../../config'

class ContractDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
    this.props.dispatch(getContractById(this.props.match.params.id))
  }

  render() {
    const { t } = this.props
    if (this.props.contractById) {
      const { contractName, poNumber, contractStart, contractEnd, contractAmount, contractor: { supplierName, mobileNumber, email, address }, document, assets } = this.props.contractById
      return (
        <div className="mainPage p-3 ContractDetails">
          <div className="row">
            <span className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Assets')}</span><span className="mx-2">/</span><span className="crumbText">{t('Contract Details')}</span>
            </span>
          </div>

          <div className="row">
            <div className="col-12 pageHead">
              <h1>
                <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                <span className="px-1"></span>
                <span>{t('Contract Details')}</span>
              </h1>
            </div>
          </div>
          <div className="pageHeadLine"></div>

          <div className="col-12 my-4">
            <div className="row">
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">{t('Contract Name')}<h6><b>{contractName}</b></h6></div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-2">{t('PO Number')}<h6><b>{poNumber}</b></h6></div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-2">{t('Contract Start Date')}<h6><b>{dateToDDMMYYYY(contractStart)}</b></h6></div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-2">{t('Contract End Date')}<h6><b>{dateToDDMMYYYY(contractEnd)}</b></h6></div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">{t('Contract Amount')}<h6><b>{this.props.defaultCurrency}{contractAmount}</b></h6></div>


            </div>
          </div>
          <br />
          <div className="col-12 my-4">
            <div className="row">
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">{t('Contractor')}<h6><b>{supplierName}</b></h6></div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-2">{t('Mobile Number')}<h6><b className="dirltrtar">{mobileNumber}</b></h6></div>
              <div onClick={() => window.open(`${PRODIP}/${document.path}`)} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-2">
                {t('Attachment')}
                <div className="d-flex align-items-start">
                  <h4 className="iconv1 iconv1-pdf mx-1 my-0 ellipsis d-inline-block flex-shrink-0 pointer">
                    <span className="path1"></span>
                    <span className="path2"></span><span className="path3"></span><span className="path4"></span>
                    <span className="patdiv"></span><span className="path6"></span><span className="path7"></span>
                  </h4>
                  <label className="pointer"><h6><u>{document.originalname}</u></h6></label>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 text-break">{t('Email')}<h6><b>{email}</b></h6></div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">{t('Address')}<h6><b>{address}</b></h6></div>
            </div>
          </div>
          <div className="row bg-light text-dark pb-4 px-4 mx-3" >
            <div><h4 className="ml-5 mt-4 "><b>{t('Items Included')}</b></h4></div>
            <div className="col-12 pageHeadLine"></div>
            <div className="table-responsive">
              <table className="borderRoundSeperateTable tdWhite">
                <thead className="text-warning">
                  <tr>
                    <th>{t('Asset Name')}</th>
                    <th>{t('Serial Number')}</th>
                    <th>{t('Model Name')}</th>
                    <th>{t('Brand Name')}</th>
                    <th>{t('Asset Location')}</th>
                  </tr>
                </thead>
                <tbody>

                  {assets && getPageWiseData(this.state.pageNumber, assets, this.state.displayNum).map((asset, i) => {
                    const { assetName, serialNumber, modelNumber, brandName, assetBranch: { branchName }, assetImage } = asset
                    return (
                      <tr key={i}>
                        <td>
                          <img alt='' src={`/${assetImage.path}`} className="w-50px h-50px" />
                          <label>{assetName}</label>
                        </td>
                        <td>{serialNumber}</td>
                        <td>{modelNumber}</td>
                        <td>{brandName}</td>
                        <td>{branchName}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/*Pagination Start*/}
            {assets &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={assets}
                displayNumber={(displayNum) => this.setState({ displayNum })}
                displayNum={this.state.displayNum ? this.state.displayNum : 5}
              />
            }
            {/*Pagination End*/}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ asset: { contractById }, currency: { defaultCurrency } }) {
  return {
    contractById,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(ContractDetails))