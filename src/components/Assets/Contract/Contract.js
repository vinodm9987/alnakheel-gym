import React, { Component } from 'react'
import AddContract from './AddContract'
import ContractList from './ContractList'
import { withTranslation } from 'react-i18next'
import { Route, Link } from 'react-router-dom'


class Contract extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Contract">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Assets')}</span><span className="mx-2">/</span><span className="crumbText">{t('Contract')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12  pageHead">
                <h1>{t('Contract')}</h1>
              </div>

            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/contract'>
                      <Link to='/contract' className="nav-item nav-link active" role="tab">{t('Add Contract')}</Link>
                      <Link to='/contract/contract-list' className="nav-item nav-link" role="tab">{t('Contract List')}</Link>
                    </Route>
                    <Route exact path='/contract/contract-list'>
                      <Link to='/contract' className="nav-item nav-link" role="tab">{t('Add Contract')}</Link>
                      <Link to='/contract/contract-list' className="nav-item nav-link active" role="tab">{t('Contract List')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" data-toggle="tab" href="#menu1" role="tab">Add Contract</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu2" role="tab">Contracts List </a> */}
                  </div>
                </nav>

              </div>
            </div>

            <div className="tab-content" id="nav-tabContent">
              <Route exact path='/contract' component={AddContract} />
              <Route path='/contract/contract-list' component={ContractList} />
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default withTranslation()(Contract)