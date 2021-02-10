import React, { Component } from 'react'
import PackageInstallment from './PackageInstallment'
import TrainerInstallment from './TrainerInstallment'

class PendingInstallments extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 membersInstallment">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Pending Installments')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-12 pageHead">
                <h1>
                  <span className="px-1"></span>
                  <span>{t('Pending Installments')}</span>
                </h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <a href='#menu1' className="nav-item nav-link active" role="tab" data-toggle="tab">{t('Package Installment')}</a>
                    <a href='#menu2' className="nav-item nav-link" role="tab" data-toggle="tab">{t('Trainer Installment')}</a>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <PackageInstallment />
                  <TrainerInstallment />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PendingInstallments