import React, { Component } from 'react'
import RestoreHistory from './RestoreHistory'
import CreateRestore from './CreateRestore'
import { Link, Route } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
class Restore extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 FreezeMembers">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Backup and Restore')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 pageHead">
                <h1>{t('Backup and Restore')}</h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/restore'>
                      <Link to='/restore' className="nav-item nav-link active" role="tab">{t('Create Restore')}</Link>
                      <Link to='/restore/restore-history' className="nav-item nav-link" role="tab">{t('Restore History')}</Link>
                    </Route>
                    <Route exact path='/restore/restore-history'>
                      <Link to='/restore' className="nav-item nav-link" role="tab">{t('Create Restore')}</Link>
                      <Link to='/restore/restore-history' className="nav-item nav-link active" role="tab">{t('Restore History')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">Create Restore</a>
                    <a className="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">Restore History</a> */}
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/restore' component={CreateRestore} />
                  <Route path='/restore/restore-history' component={RestoreHistory} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Restore)