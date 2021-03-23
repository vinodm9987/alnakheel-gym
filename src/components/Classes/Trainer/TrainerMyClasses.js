import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getAllClassesByBranch } from '../../../actions/classes.action'
import { dateToDDMMYYYY, dateToHHMM } from '../../../utils/apis/helpers'

class TrainerMyClasses extends Component {

  constructor(props) {
    super(props)
    this.state = {
      branch: '',
      date: '',
    }
  }

  componentDidMount() {
    const trainer = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    this.setState({ trainer })
    if (trainer) {
      this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date, trainer }))
    }
  }

  selectBranch(e) {
    this.setState({ branch: e.target.value }, () => {
      this.state.trainer && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date, trainer: this.state.trainer }))
    })
  }

  // selectDate(e) {
  //   this.setState(validator(e, 'date', 'date', []), () => {
  //     this.state.trainer && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date, trainer: this.state.trainer }))
  //   })
  // }

  // resetDate() {
  //   this.setState({ date: '' }, () => {
  //     this.state.trainer && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date, trainer: this.state.trainer }))
  //   })
  // }

  render() {

    const { t } = this.props
    const { branch } = this.state

    return (
      <div className="mainPage p-3 TrainerMyClasses">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('My Classes')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 pageHead">
                <h1>{t('My Classes')}</h1>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8 d-flex flex-wrap align-items-center justify-content-end pageHeadRight">
                <span className="position-relative mw-100">
                  <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.selectBranch(e)}>
                    <option value="">{t('All Branch')}</option>
                    {this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3" style={{ top: '0', left: '0' }}>
                    <span className="iconv1 iconv1-fill-navigation"></span>
                    <span className="iconv1 iconv1-arrow-down"></span>
                  </span>
                </span>
              </div>
              <div className="col-12 pageHeadDown">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row mx-0 w-100">

              {this.props.classesByBranch && this.props.classesByBranch.map((classes, i) => {
                const { image, className, description, startTime, endTime, startDate, endDate, occupied, capacity, color, _id } = classes
                return (
                  <div key={i} className="col-12 px-0 d-flex flex-wrap flex-lg-nowrap mt-5 pt-3 pt-lg-0 mt-lg-3 overflow-hidden rounded">
                    <div className="h-100 w-250px mnw-200 mxw-300 mx-auto flex-shrink-0 flex-grow-0 TrainerMyClassesImgWrap mb-lg-0 mb-3">
                      <img alt='' src={`/${image.path}`} className="w-100 h-100 objectFitCover" />
                    </div>
                    <div className="p-3 flex-shrink-1 flex-grow-1 w-100" style={{ backgroundColor: color }}>
                      <div className="d-flex justify-content-end align-items-center">
                        <small className="px-1 text-white">{t('Total Members')}</small>
                        <span className="d-flex mx-1 btn btn-warning btn-sm align-items-center borderRound bg-white border-0 dirltrtar">
                          <span className="mx-1 iconv1 iconv1-capacity"></span>
                          <span className="text-body">{`${occupied ? occupied : 0} / ${capacity}`}</span>
                        </span>
                      </div>
                      <h3 className="font-weight-bold mt-0 mb-3 text-white">{className}</h3>
                      <p className="text-white mb-3">{description}</p>
                      <div className="text-white d-flex flex-wrap align-items-center justify-content-between">
                        <span className="d-flex align-items-center mr-3 mb-2 dirltrtar">
                          <span className="iconv1 iconv1-clock mx-2 text-white"></span>
                          <span className="text-white whiteSpaceNoWrap">{`${dateToHHMM(startTime)} - ${dateToHHMM(endTime)}`}</span>
                        </span>
                        <span className="d-flex align-items-center mr-3 mb-2 dirltrtar">
                          <span className="iconv1 iconv1-calander mx-2 text-white"></span>
                          <span className="text-white whiteSpaceNoWrap">{`${dateToDDMMYYYY(startDate)} - ${dateToDDMMYYYY(endDate)}`}</span>
                        </span>
                        <Link to={`/trainer-classes-details/${_id}`}>
                          <button className="btn btn-warning btn-sm text-body bg-white border-0 mb-2">{t('View Details')}</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, classes: { classesByBranch }, currency: { defaultCurrency } }) {
  return {
    loggedUser,
    classesByBranch,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(TrainerMyClasses))