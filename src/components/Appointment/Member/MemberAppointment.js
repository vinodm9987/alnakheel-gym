import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Route, Link } from 'react-router-dom'
import MemberBookAppointment from './MemberBookAppointment'
import MemberAppointmentHistory from './MemberAppointmentHistory'

class MemberAppointment extends Component {

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 MemberAppointment">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Book Appointment')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12  pageHead">
                <h1>{t('Book Appointment')}</h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/appointment'>
                      <Link to='/appointment' className="nav-item nav-link active" role="tab">{t('Book Appointment')}</Link>
                      <Link to='/appointment/appointment-history' className="nav-item nav-link" role="tab">{t('Appointment History')}</Link>
                    </Route>
                    <Route exact path='/appointment/appointment-history'>
                      <Link to='/appointment' className="nav-item nav-link" role="tab">{t('Book Appointment')}</Link>
                      <Link to='/appointment/appointment-history' className="nav-item nav-link active" role="tab">{t('Appointment History')}</Link>
                    </Route>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/appointment' component={MemberBookAppointment} />
                  <Route path='/appointment/appointment-history' component={MemberAppointmentHistory} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(MemberAppointment)