import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAllActivePackage } from '../../../actions/package.action'
import { withTranslation } from 'react-i18next'

class PackagesList extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(getAllActivePackage())
  }

  render() {
    const { t } = this.props
    const packageDetails = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.packageDetails
    let filteredPackages = []
    if (packageDetails) {
      this.props.active.forEach(p => {
        if (packageDetails.filter(pack => pack.packages === p._id && !pack.isExpiredPackage)[0] === undefined) {
          filteredPackages.push({ ...p, ...{ disable: false } })
        } else {
          filteredPackages.push({ ...p, ...{ disable: true } })
        }
      })
    } else {
      this.props.active.forEach(p => {
        filteredPackages.push({ ...p, ...{ disable: false } })
      })
    }
    return (
      <div className="mainPage p-3 CreatePeriod">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Packages')}</span><span className="mx-2">/</span><span className="crumbText">{t('Packages List')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              {/* <small><span className="iconv1 iconv1-left-arrow d-inline"></span></small> */}
              <span className="px-1"></span><span>{t('Packages List')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12 pt-5 pb-1 px-4">
            <div className="row">
              {filteredPackages.map((res, i) => {
                const { packageName, description, period: { periodName }, color, amount, _id, disable } = res
                return (
                  <div key={i} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 d-flex pb-4 mb-2">
                    <div className="card w-100 h-100 mw-100 p-3" style={{ backgroundColor: color, color: '#fff' }}>
                      <h5 className="font-weight-light mb-2">{packageName}</h5>
                      <h2 className="m-0" style={{ fontSize: '2.5rem' }}>
                        <span className="font-weight-light">{this.props.defaultCurrency}</span>
                        <span className="mx-1 font-weight-bold">{amount.toFixed(3)}</span>
                      </h2>
                      <span className="font-weight-light" style={{ fontSize: '1rem' }}>{periodName}</span>
                      <p className="mt-2 mt-lg-3 mt-xl-4 mb-2 mb-lg-3 mb-xl-4 multiLineTexttruncate">{description}</p>
                      {!disable ?
                        <Link to={`/package-details/${_id}`} className="btn btn-default btn-fluid font-weight-bold mt-auto" style={{ backgroundColor: '#fff', color: '#000' }}>{t('Choose Plan')}</Link>
                        : <span>{t('Already Registered')}</span>
                      }
                    </div>
                  </div>
                )
              })
              }
            </div>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ packages: { active }, currency: { defaultCurrency }, auth: { loggedUser } }) {
  return {
    active,
    defaultCurrency,
    loggedUser
  }
}

export default withTranslation()(connect(mapStateToProps)(PackagesList))