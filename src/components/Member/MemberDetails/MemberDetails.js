import React, { Component } from 'react'
import PackageDetails from './PackageDetails'
import Workout from './Workout'
import DietPlan from './DietPlan'
import ClassesDetails from './ClassesDetails'
import MemberSideBar from './MemberSideBar'
import { getItemFromStorage } from '../../../utils/localstorage';
import jwt_decode from 'jwt-decode'
import { withTranslation } from 'react-i18next'

class MyDetails extends Component {

  state = {
    memberId: jwt_decode(getItemFromStorage('jwtToken')).userId
  }
  render() {
    const { t } = this.props

    return (
      <div className="mainPage p-3 MyDetails">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Member Details')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              <span>{t('My Details')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 mt-4">
            <div className="row mx-0">
              <div className="col-12 px-2 bg-light d-flex flex-wrap">

                <div className="MemberDetailsSpecialStart mx-2 my-3 p-15px bg-white">
                  <MemberSideBar memberId={this.state.memberId} />
                </div>

                <div className="MemberDetailsSpecialEnd mx-2 my-3 px-15px bg-white">
                  <div className="row">
                    <div className="col-12 py-15px px-0 bg-light">
                      <nav className="commonNavForPill">
                        <div className="nav nav-pills flex-nowrap overflow-auto whiteSpaceNoWrap" role="tablist" style={{zoom: '0.9'}}>
                          <a className="borderRound mx-2 px-4 nav-item nav-link active" data-toggle="tab" href="#menu1" role="tab">{t('Package Details')}</a>
                          <a className="borderRound mx-2 px-4 nav-item nav-link" data-toggle="tab" href="#menu3" role="tab">{t('Workouts')}</a>
                          <a className="borderRound mx-2 px-4 nav-item nav-link" data-toggle="tab" href="#menu4" role="tab">{t('Diet Plans')}</a>
                          {/* (the below is extra added on 27-aug -2020) */}
                          <a className="borderRound mx-2 px-4 nav-item nav-link" data-toggle="tab" href="#menu5" role="tab">{t('Classes Details')}</a>
                        </div>
                      </nav>
                    </div>
                    <div className="col-12 py-15px">
                      <div className="tab-content">
                        <PackageDetails />
                        <Workout memberId={this.state.memberId} />
                        <DietPlan memberId={this.state.memberId} />
                        {/* (the below is extra added on 27-aug -2020) */}
                        <ClassesDetails memberId={this.state.memberId} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default withTranslation()(MyDetails)