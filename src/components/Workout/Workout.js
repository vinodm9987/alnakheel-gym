import React, { Component } from 'react'
import AddWorkouts from './AddWorkouts'
import WorkoutsList from './WorkoutsList'
import { Link, Route } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class Workout extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Workout">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Workout')}</span><span className="mx-2">/</span><span className="crumbText">{t('Workouts')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Workouts')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="container-fluid mt-3">

            <div className="row">
              <div className="col-12">
                <nav className="commonNavForTab">
                  <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                    <Route exact path='/workouts'>
                      <Link to='/workouts' className="nav-item nav-link active" role="tab">{t('Add Workouts')}</Link>
                      <Link to='/workouts/workouts-list' className="nav-item nav-link" role="tab">{t('Workouts List')}</Link>
                    </Route>
                    <Route exact path='/workouts/workouts-list'>
                      <Link to='/workouts' className="nav-item nav-link" role="tab">{t('Add Workouts')}</Link>
                      <Link to='/workouts/workouts-list' className="nav-item nav-link active" role="tab">{t('Workouts List')}</Link>
                    </Route>
                    {/* <Link to='/workouts' className={this.state.url === '/workouts' ? "nav-item nav-link active" : "nav-item nav-link"} data-toggle="tab" role="tab">Add Workouts</Link>
                    <Link to='/workouts/workouts-list' className={this.state.url === '/workouts/workouts-list' ? "nav-item nav-link active" : "nav-item nav-link"} data-toggle="tab" role="tab">Workouts List</Link> */}

                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <Route exact path='/workouts' component={AddWorkouts} />
                  <Route path='/workouts/workouts-list' component={WorkoutsList} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default withTranslation()(Workout)