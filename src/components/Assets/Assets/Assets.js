import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import AddAsset from './AddAsset'
import AssetList from './AssetList'
import { Route, Link } from 'react-router-dom'

class Assets extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Assets">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Assets')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Assets')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">

            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/asset'>
                      <Link to='/asset' className="nav-item nav-link active" role="tab">{t('Add Assets')}</Link>
                      <Link to='/asset/asset-list' className="nav-item nav-link" role="tab">{t('Assets List')}</Link>
                    </Route>
                    <Route exact path='/asset/asset-list'>
                      <Link to='/asset' className="nav-item nav-link" role="tab">{t('Add Assets')}</Link>
                      <Link to='/asset/asset-list' className="nav-item nav-link active" role="tab">{t('Assets List')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" data-toggle="tab" href="#menu1">{t('Add Assets')}</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu2">{t('Assets List')}</a> */}
                  </div>
                </nav>
                <div className="tab-content">
                  <Route exact path='/asset' component={AddAsset} />
                  <Route path='/asset/asset-list' component={AssetList} />
                  {/* <AddAsset />
                  <AssetList /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Assets)