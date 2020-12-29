import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import AddSupplier from './AddSupplier'
import SupplierList from './SupplierList'
import { Route, Link } from 'react-router-dom'

class Supplier extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Supplier">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Supplier')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-6 pageHead">
                <h1>{t('Supplier')}</h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/supplier'>
                      <Link to='/supplier' className="nav-item nav-link active" role="tab">{t('Add Supplier')}</Link>
                      <Link to='/supplier/supplier-list' className="nav-item nav-link" role="tab">{t('Supplier List')}</Link>
                    </Route>
                    <Route exact path='/supplier/supplier-list'>
                      <Link to='/supplier' className="nav-item nav-link" role="tab">{t('Add Supplier')}</Link>
                      <Link to='/supplier/supplier-list' className="nav-item nav-link active" role="tab">{t('Supplier List')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" data-toggle="tab" href="#menu1" role="tab">Add Supplier</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu2" role="tab">Supplier List </a> */}
                  </div>
                </nav>

              </div>
            </div>
            <div className="tab-content" id="nav-tabContent">
              <Route exact path='/supplier' component={AddSupplier} />
              <Route path='/supplier/supplier-list' component={SupplierList} />
              {/* <AddSupplier />
              <SupplierList /> */}
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default withTranslation()(Supplier)