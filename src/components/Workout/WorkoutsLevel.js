import React, { Component } from 'react'
import AddWorkoutsLevel from './AddWorkoutsLevel';
import WorkoutsLevelList from './WorkoutsLevelList';
import { Link, Route } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class WorkoutsLevel extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 WorkoutsCategory">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Workouts')}</span><span className="mx-2">/</span><span className="crumbText">{t('Workouts Level')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Workouts Level')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/workouts-level'>
                      <Link to='/workouts-level' className="nav-item nav-link active" role="tab">{t('Add Workouts Level')}</Link>
                      <Link to='/workouts-level/workouts-level-list' className="nav-item nav-link" role="tab">{t('Workouts Level List')}</Link>
                    </Route>
                    <Route exact path='/workouts-level/workouts-level-list'>
                      <Link to='/workouts-level' className="nav-item nav-link" role="tab">{t('Add Workouts Level')}</Link>
                      <Link to='/workouts-level/workouts-level-list' className="nav-item nav-link active" role="tab">{t('Workouts Level List')}</Link>
                    </Route>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/workouts-level' component={AddWorkoutsLevel} />
                  <Route path='/workouts-level/workouts-level-list' component={WorkoutsLevelList} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(WorkoutsLevel)