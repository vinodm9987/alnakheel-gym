import React, { Component } from 'react'
import AddFreeze from './AddFreeze'
import FreezeHistory from './FreezeHistory'
import CancelFreeze from './CancelFreeze'
import { Route, Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class FreezeMembers extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 FreezeMembers">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Members')}</span><span className="mx-2">/</span><span className="crumbText">{t('Freeze Members')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 pageHead">
                <h1>{t('Freeze Members')}</h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/freeze-members'>
                      <Link to='/freeze-members' className="nav-item nav-link active" role="tab">{t('Freeze')}</Link>
                      <Link to='/freeze-members/freeze-history' className="nav-item nav-link" role="tab">{t('Freeze History')}</Link>
                      <Link to='/freeze-members/cancel-freeze' className="nav-item nav-link" role="tab">{t('Cancel Freeze')}</Link>
                    </Route>
                    <Route exact path='/freeze-members/freeze-history'>
                      <Link to='/freeze-members' className="nav-item nav-link" role="tab">{t('Freeze')}</Link>
                      <Link to='/freeze-members/freeze-history' className="nav-item nav-link active" role="tab">{t('Freeze History')}</Link>
                      <Link to='/freeze-members/cancel-freeze' className="nav-item nav-link" role="tab">{t('Cancel Freeze')}</Link>
                    </Route>
                    <Route exact path='/freeze-members/cancel-freeze'>
                      <Link to='/freeze-members' className="nav-item nav-link" role="tab">{t('Freeze')}</Link>
                      <Link to='/freeze-members/freeze-history' className="nav-item nav-link" role="tab">{t('Freeze History')}</Link>
                      <Link to='/freeze-members/cancel-freeze' className="nav-item nav-link active" role="tab">{t('Cancel Freeze')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" data-toggle="tab" href="#menu1" role="tab">Freeze</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu2" role="tab">Pending Freeze</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu3" role="tab">Freeze History</a> */}
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/freeze-members' component={AddFreeze} />
                  <Route path='/freeze-members/freeze-history' component={FreezeHistory} />
                  <Route path='/freeze-members/cancel-freeze' component={CancelFreeze} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withTranslation()(FreezeMembers)