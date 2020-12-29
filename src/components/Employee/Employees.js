import React, { Component } from 'react'
import CreateEmployeeForm from './CreateEmployeeForm'
import EmployeeList from './EmployeeList'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class Employees extends Component {

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Employees">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Employee')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              <span>{t('Employee')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/employee'>
                      <Link to='/employee' className="nav-item nav-link active" role="tab">{t('Add Employee')}</Link>
                      <Link to='/employee/employee-list' className="nav-item nav-link" role="tab">{t('Employee List')}</Link>
                    </Route>
                    <Route path='/employee/employee-list'>
                      <Link to='/employee' className="nav-item nav-link" role="tab">{t('Add Employee')}</Link>
                      <Link to='/employee/employee-list' className="nav-item nav-link active" role="tab">{t('Employee List')}</Link>
                    </Route>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/employee' component={CreateEmployeeForm} />
                  <Route path='/employee/employee-list' component={EmployeeList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(connect()(Employees))