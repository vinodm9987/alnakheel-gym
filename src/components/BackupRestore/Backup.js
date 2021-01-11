import React, { Component } from 'react'
import BackupHistory from './BackupHistory'
import CreateBackup from './CreateBackup'
import { Link, Route } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
class Backup extends Component {
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
                    <Route exact path='/backup'>
                      <Link to='/backup' className="nav-item nav-link active" role="tab">{t('Create Backup')}</Link>
                      <Link to='/backup/backup-history' className="nav-item nav-link" role="tab">{t('Backup History')}</Link>
                    </Route>
                    <Route exact path='/backup/backup-history'>
                      <Link to='/backup' className="nav-item nav-link" role="tab">{t('Create Backup')}</Link>
                      <Link to='/backup/backup-history' className="nav-item nav-link active" role="tab">{t('Backup History')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">Create Backup</a>
                    <a className="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">Backup History</a> */}
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/backup' component={CreateBackup} />
                  <Route path='/backup/backup-history' component={BackupHistory} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Backup)