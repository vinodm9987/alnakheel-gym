import React, { Component } from 'react'
import NewMember from './NewMember'
import ActiveMember from './ActiveMember'
import PendingMember from './PendingMember'
import { NavLink, Route, Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import ExpiryMember from './ExpiryMember'
import AllMember from './AllMember'
import ClassesMember from './ClassesMember'

class Members extends Component {


  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 members">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Members')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-6 pageHead">
                <h1>{t('Members')}</h1>
              </div>
              <div className="col-12 col-sm-6 d-none d-sm-flex pageRightBtn">
                <div className="d-flex justify-content-end w-100 h-40px">
                  <NavLink to={`/add-member`} className="btn btn-warning badge-pill  px-2 text-white">{t('Add Member')}</NavLink>
                </div>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/members'>
                      <Link to='/members' className="nav-item nav-link active" role="tab">{t('All Members')}</Link>
                      <Link to='/members/pending-members' className="nav-item nav-link" role="tab">{t('Pending Members')}</Link>
                      <Link to='/members/new-members' className="nav-item nav-link" role="tab">{t('New Members')}</Link>
                      <Link to='/members/active-members' className="nav-item nav-link" role="tab">{t('Active Members')}</Link>
                      <Link to='/members/expiry-members' className="nav-item nav-link" role="tab">{t('Expiry Members')}</Link>
                      <Link to='/members/classes-members' className="nav-item nav-link" role="tab">{t('Classes Members')}</Link>
                    </Route>
                    <Route exact path='/members/pending-members'>
                      <Link to='/members' className="nav-item nav-link" role="tab">{t('All Members')}</Link>
                      <Link to='/members/pending-members' className="nav-item nav-link active" role="tab">{t('Pending Members')}</Link>
                      <Link to='/members/new-members' className="nav-item nav-link" role="tab">{t('New Members')}</Link>
                      <Link to='/members/active-members' className="nav-item nav-link" role="tab">{t('Active Members')}</Link>
                      <Link to='/members/expiry-members' className="nav-item nav-link" role="tab">{t('Expiry Members')}</Link>
                      <Link to='/members/classes-members' className="nav-item nav-link" role="tab">{t('Classes Members')}</Link>
                    </Route>
                    <Route exact path='/members/new-members'>
                      <Link to='/members' className="nav-item nav-link" role="tab">{t('All Members')}</Link>
                      <Link to='/members/pending-members' className="nav-item nav-link" role="tab">{t('Pending Members')}</Link>
                      <Link to='/members/new-members' className="nav-item nav-link active" role="tab">{t('New Members')}</Link>
                      <Link to='/members/active-members' className="nav-item nav-link" role="tab">{t('Active Members')}</Link>
                      <Link to='/members/expiry-members' className="nav-item nav-link" role="tab">{t('Expiry Members')}</Link>
                      <Link to='/members/classes-members' className="nav-item nav-link" role="tab">{t('Classes Members')}</Link>
                    </Route>
                    <Route exact path='/members/active-members'>
                      <Link to='/members' className="nav-item nav-link" role="tab">{t('All Members')}</Link>
                      <Link to='/members/pending-members' className="nav-item nav-link" role="tab">{t('Pending Members')}</Link>
                      <Link to='/members/new-members' className="nav-item nav-link" role="tab">{t('New Members')}</Link>
                      <Link to='/members/active-members' className="nav-item nav-link active" role="tab">{t('Active Members')}</Link>
                      <Link to='/members/expiry-members' className="nav-item nav-link" role="tab">{t('Expiry Members')}</Link>
                      <Link to='/members/classes-members' className="nav-item nav-link" role="tab">{t('Classes Members')}</Link>
                    </Route>
                    <Route exact path='/members/expiry-members'>
                      <Link to='/members' className="nav-item nav-link" role="tab">{t('All Members')}</Link>
                      <Link to='/members/pending-members' className="nav-item nav-link" role="tab">{t('Pending Members')}</Link>
                      <Link to='/members/new-members' className="nav-item nav-link" role="tab">{t('New Members')}</Link>
                      <Link to='/members/active-members' className="nav-item nav-link" role="tab">{t('Active Members')}</Link>
                      <Link to='/members/expiry-members' className="nav-item nav-link active" role="tab">{t('Expiry Members')}</Link>
                      <Link to='/members/classes-members' className="nav-item nav-link" role="tab">{t('Classes Members')}</Link>
                    </Route>
                    <Route exact path='/members/classes-members'>
                      <Link to='/members' className="nav-item nav-link" role="tab">{t('All Members')}</Link>
                      <Link to='/members/pending-members' className="nav-item nav-link" role="tab">{t('Pending Members')}</Link>
                      <Link to='/members/new-members' className="nav-item nav-link" role="tab">{t('New Members')}</Link>
                      <Link to='/members/active-members' className="nav-item nav-link" role="tab">{t('Active Members')}</Link>
                      <Link to='/members/expiry-members' className="nav-item nav-link" role="tab">{t('Expiry Members')}</Link>
                      <Link to='/members/classes-members' className="nav-item nav-link active" role="tab">{t('Classes Members')}</Link>
                    </Route>
                    {/* <a className="nav-item nav-link active" data-toggle="tab" href="#menu3" role="tab">{t('Pending Members')}</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu1" role="tab">{t('New Members')}</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu2" role="tab">{t('Active Members')}</a>
                    <a className="nav-item nav-link" data-toggle="tab" href="#menu4" role="tab">{t('Expiry Members')}</a> */}
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/members' component={AllMember} />
                  <Route exact path='/members/pending-members' component={PendingMember} />
                  <Route path='/members/new-members' component={NewMember} />
                  <Route path='/members/active-members' component={ActiveMember} />
                  <Route path='/members/expiry-members' component={ExpiryMember} />
                  <Route path='/members/classes-members' component={ClassesMember} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Members)