import React, { Component } from 'react'
import AddStock from './AddStock'
import StockList from './StockList'
import { Link, Route } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class Stock extends Component {

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 AddStock">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Sales')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Stock')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Add Stock')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          {/* Changes Tab  */}
          <div className="col-12">
            <nav className="commonNavForTab">
              <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                <Route exact path='/stock'>
                  <Link to='/stock' className="nav-item nav-link active" role="tab">{t('Add Stock')}</Link>
                  <Link to='/stock/stock-list' className="nav-item nav-link" role="tab">{t('Stock List')}</Link>
                </Route>
                <Route exact path='/stock/stock-list'>
                  <Link to='/stock' className="nav-item nav-link" role="tab">{t('Add Stock')}</Link>
                  <Link to='/stock/stock-list' className="nav-item nav-link active" role="tab">{t('Stock List')}</Link>
                </Route>
              </div>
            </nav>
          </div>
          {/* Changes Tab ended */}
          <div className="tab-content w-100" id="nav-tabContent">
            <Route exact path='/stock' component={AddStock} />
            <Route path='/stock/stock-list' component={StockList} />
          </div>
        </div>
      </div>

    )
  }
}


export default withTranslation()(Stock)
