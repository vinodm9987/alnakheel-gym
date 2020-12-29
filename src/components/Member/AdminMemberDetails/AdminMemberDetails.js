import React, { Component } from 'react'
import PackageDetails from './PackageDetails'
import BioMetric from './BioMetric'
import Workout from './Workout'
import DietPlan from './DietPlan'
import ClassesDetails from './ClassesDetails'
import MemberSideBar from './MemberSideBar'
import { withTranslation } from 'react-i18next'
import { getMemberById } from '../../../actions/member.action'
import { connect } from 'react-redux'


class AdminMemberDetails extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 MemberDetails">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Member Details')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              <small><span className="iconv1 iconv1-left-arrow  cursorPointer" onClick={() => this.props.history.goBack()}></span></small><span className="px-1"></span>
              <span>{t('Member Details')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 mt-4">
            <div className="row mx-0">
              <div className="col-12 px-2 bg-light d-flex flex-wrap">

                <div className="MemberDetailsSpecialStart mx-2 my-3 p-15px bg-white">
                  <MemberSideBar memberId={this.props.match.params.id} />
                </div>

                <div className="MemberDetailsSpecialEnd mx-2 my-3 px-15px bg-white">
                  <div className="row">
                    <div className="col-12 py-15px px-0 bg-light">
                      <nav className="commonNavForPill">
                        <div className="nav nav-pills flex-nowrap overflow-auto whiteSpaceNoWrap" role="tablist" style={{zoom: '0.9'}}>
                          <a className="borderRound mx-2 px-4 nav-item nav-link active" data-toggle="tab" href="#menu1" role="tab"
                            onClick={() => this.props.dispatch(getMemberById(this.props.match.params.id))}>{t('Package Details')}</a>
                          <a className="borderRound mx-2 px-4 nav-item nav-link" data-toggle="tab" href="#menu2" role="tab">{t('Biomatrics')}</a>
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
                        <BioMetric memberId={this.props.match.params.id} />
                        <Workout memberId={this.props.match.params.id} />
                        <DietPlan memberId={this.props.match.params.id} />
                        {/* (the below is extra added on 27-aug -2020) */}
                        <ClassesDetails memberId={this.props.match.params.id} />
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

export default withTranslation()(connect()(AdminMemberDetails))