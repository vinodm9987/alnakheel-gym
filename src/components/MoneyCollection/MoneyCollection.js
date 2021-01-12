import React, { Component } from 'react'
import AddMoneyCollection from './AddMoneyCollection'
import MoneyCollectionHistory from './MoneyCollectionHistory'
import { Link, Route } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class MoneyCollection extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Finance')}</span>
            <span className="mx-2">/</span><span className="crumbText">{t('Money Collections')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 pageHead">
                <h1>{t('Money Collections')}</h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/money-collection'>
                      <Link to='/money-collection' className="nav-item nav-link active" role="tab">{t('Money Collection')}</Link>
                      <Link to='/money-collection/money-collection-list' className="nav-item nav-link" role="tab">{t('Money Collection History')}</Link>
                    </Route>
                    <Route exact path='/money-collection/money-collection-list'>
                      <Link to='/money-collection' className="nav-item nav-link" role="tab">{t('Money Collection')}</Link>
                      <Link to='/money-collection/money-collection-list' className="nav-item nav-link active" role="tab">{t('Money Collection History')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">Money Collection</a>
                    <a className="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">Money Collection History</a> */}
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/money-collection' component={AddMoneyCollection} />
                  <Route path='/money-collection/money-collection-list' component={MoneyCollectionHistory} />
                  {/* ------------Show Only this For Fully Drop Down---------- */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(MoneyCollection)