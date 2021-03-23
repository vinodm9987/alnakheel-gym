import React, { Component } from 'react'
// import PackageDetails from './PackageDetails'
// import BioMetric from './BioMetric'
import Workout from './Workout'
import DietPlan from './DietPlan'
import MemberSideBar from './MemberSideBar'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'


class TrainerMyDetails extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 TrainerMyDetails">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span>
            <span className="mx-2">/</span>
            <span className="crumbText">{t('My Members')}</span>
            <span className="mx-2">/</span>
            <span className="crumbText">{t('Member Details')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Member Details')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 mt-4">
            <div className="row mx-0">
              <div className="col-12 px-2 bg-light d-flex flex-wrap">
                <div className="MemberDetailsSpecialStart mx-2 my-3 p-15px bg-white">
                  <MemberSideBar memberId={this.props.match.params.id} />
                </div>
                <div className="MemberDetailsSpecialEnd mx-2 my-3 px-15px">
                  <div className="row">
                    <div className="col-12 p-3 bg-white d-flex flex-wrap justify-content-between">
                      {/* <div className="d-flex px-4">
                        <img alt="" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQMS_OhsklLosBTyOPZs_fTt90EzBeJWTZoZWNRXlhqUoRXSlaK&usqp=CAU" className="mx-2 " width="60" height="60" />
                        <div className="mx-1">
                          <h5 className="m-0 font-weight-bold text-danger">Upcoming Classes</h5>
                          <small className="d-inline-block dirltrtar">05/02/2020, 02:30 PM</small>
                        </div>
                      </div> */}
                      <div className="px-4">
                        <Link to={{ pathname: "/manage-workouts", memberData: JSON.stringify(this.props.memberById && this.props.memberById) }}>
                          <button className="btn btn-success badge-pill m-2 py-2 px-4 text-white" href="">+ {t('Add Workouts')}</button>
                        </Link>
                        <Link to={{ pathname: "/manage-diet-plans", memberData: JSON.stringify(this.props.memberById && this.props.memberById) }}>
                          <button className="btn btn-primary badge-pill m-2  py-2 px-4 text-white" href="">+ {t('Add Dietplans')}</button>
                        </Link>
                      </div>
                    </div>

                    <div className="col-12 bg-white my-3">
                      <div className=" cal-7-days pb-3">
                        {/* <div className="pb-2 d-flex align-items-center justify-content-between arrow-7-display-and-datechange">
                          <div className="d-flex align-items-center arrow-7-and-display text-warning">
                            <div className="mx-1 d-flex align-items-center arrow-7">
                              <span className="iconv1 iconv1-left-arrow mx-1 cursorPointer arabicFlip"></span>
                              <span className="iconv1 iconv1-right-arrow mx-1 cursorPointer arabicFlip"></span>
                            </div>
                            <div className="mx-1 d-flex align-items-center arrow-display">
                              <span>3 May 2020</span><span className="mx-1">-</span><span>9 May 2020</span>
                            </div>
                          </div>
                          <div className="w-30px h-30px position-relative d-flex align-items-center justify-content-center arrow-7-datechange"><span className="iconv1 iconv1-calander text-warning"></span>
                          </div>
                        </div> */}
                        <nav className="commonNavForTab">
                          <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active font-weight-bold" data-toggle="tab" href="#menu1" role="tab">{t('Workouts')}</a>
                            <a className="nav-item nav-link font-weight-bold" data-toggle="tab" href="#menu2" role="tab">{t('Dietplans')}</a>
                          </div>
                        </nav>
                        <div className="col-12">
                          <div className="tab-content">
                            <Workout memberId={this.props.match.params.id} />
                            <DietPlan memberId={this.props.match.params.id} />
                          </div>
                        </div>
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

function mapStateToProps({ member: { memberById } }) {
  return {
    memberById
  }
}

export default withTranslation()(connect(mapStateToProps)(TrainerMyDetails))