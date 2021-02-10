import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import PackageInstallment from './PackageInstallment'
import TrainerInstallment from './TrainerInstallment'

class PendingInstallments extends Component {
  render() {
    return (
      <div className="mainPage p-3 membersInstallment">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Dashboard</span><span className="mx-2">/</span><span className="crumbText">Pending Installments</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-12 pageHead">
                <h1>
                  <span className="px-1"></span>
                  <span>Pending Installments</span>
                </h1>
              </div>
            </div>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    {/* <a href='#menu1' className="nav-item nav-link active" role="tab" data-toggle="tab">Package Installment</a>
                    <a href='#menu2' className="nav-item nav-link" role="tab" data-toggle="tab">Trainer Installment</a> */}
                    <Route exact path='/pending-installments'>
                      <Link to='/pending-installments' className="nav-item nav-link active" role="tab">Package Installment</Link>
                      <Link to='/pending-installments/pending-installments-trainer' className="nav-item nav-link" role="tab">Trainer Installment</Link>
                    </Route>
                    <Route exact path='/pending-installments/pending-installments-trainer'>
                      <Link to='/pending-installments' className="nav-item nav-link" role="tab">Package Installment</Link>
                      <Link to='/pending-installments/pending-installments-trainer' className="nav-item nav-link active" role="tab">Trainer Installment</Link>
                    </Route>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/pending-installments' component={PackageInstallment} />
                  <Route path='/pending-installments/pending-installments-trainer' component={TrainerInstallment} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PendingInstallments