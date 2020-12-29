import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getClassById } from '../../../actions/classes.action'
import { dateToHHMM, dateToDDMMYYYY } from '../../../utils/apis/helpers'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class ScheduleClassDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
    this.props.dispatch(getClassById(this.props.match.params.id))
  }

  render() {
    const { t } = this.props
    if (this.props.classById) {

      const { search } = this.state

      const { className, description, branch: { branchName }, room: { roomName }, capacity, startTime, members,
        endTime, startDate, endDate, classDays, trainer: { credentialId: { userName, avatar } }, occupied } = this.props.classById

      const memberClasses = []
      members.forEach(memberClass => {
        if (search) {
          let temp1 = memberClass.member.credentialId.userName.toLowerCase()
          let temp2 = memberClass.member.memberId.toString();
          if (temp1.includes(search.toLowerCase()) || temp2.includes(search.toLowerCase())) {
            memberClasses.push(memberClass)
          }
        } else {
          memberClasses.push(memberClass)
        }
      })
      return (
        <div className="mainPage p-3 ScheduleClassDetails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span>
              <span className="mx-2 whiteSpaceNoWrap">/</span>
              <span className="crumbText">{t('My Classes')}</span>
            </div>
            <div className="col-12 pageHead">
              <h1>{t('Classes Details')}</h1>
              <div className="pageHeadLine"></div>
            </div>
            <div className="col-12">

              <div className="bg-light mt-4 p-4">
                <h5><b>{className}</b></h5>
                <p>{description}</p>
                <div className="d-flex flex-wrap justify-content-start">
                  <div className="d-flex col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2 my-3">
                    <span className="iconv1 iconv1-fill-navigation h1 m-0 text-warning"></span>
                    <div className="mx-2 whiteSpaceNoWrap"><h6 className="m-0">{t('Branch')}</h6>
                      <span className="font-weight-bold">{branchName}</span>
                    </div>
                  </div>
                  <div className="d-flex col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2 my-3">
                    <span className="k-icon k-i-clock text-warning h1 m-0"></span>
                    <div className="mx-2 whiteSpaceNoWrap"><h6 className="m-0">{t('Time')}</h6>
                      <span className="font-weight-bold">{dateToHHMM(startTime)} - {dateToHHMM(endTime)}</span>
                    </div>
                  </div>
                  <div className="d-flex col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 my-3">
                    <span className="iconv1 iconv1-calander text-warning h1 m-0"></span>
                    <div className="mx-2 whiteSpaceNoWrap"><h6 className="m-0">{t('Date')}</h6>
                      <span className="font-weight-bold">{dateToDDMMYYYY(startDate)} - {dateToDDMMYYYY(endDate)}</span>
                    </div>
                  </div>
                  <div className="d-flex col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2 my-3">
                    <span className="iconv1 iconv1-fill-navigation text-warning h1 m-0"></span>
                    <div className="mx-2 whiteSpaceNoWrap"><h6 className="m-0">{t('Room')}</h6>
                      <span className="font-weight-bold">{roomName}</span>
                    </div>
                  </div>
                  <div className="d-flex col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2 my-3">
                    <span className="iconv1 iconv1-user text-warning h1 m-0"></span>
                    <div className="mx-2 whiteSpaceNoWrap"><h6 className="m-0">{t('Total Members')}</h6>
                      <span className="font-weight-bold bg-warning badge-pill text-white px-2 ">{`${(occupied ? occupied : 0)}/${capacity}`}</span>
                    </div>
                  </div>

                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 my-3">
                    <div className="form-group inlineFormGroup">
                      <label for="Days" className="mx-sm-2 inlineFormLabel">{t('Days')}</label>
                      <select className="form-control mx-sm-2 inlineFormInputs bg-white w-100" id="Days">
                        {classDays.map((day, i) => {
                          return (
                            <option disabled={!(i === 0)} key={i}>{dateToDDMMYYYY(day)}</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down text-warning selectBoxIcon"></span>
                      <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage"></small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 my-3">

                    <label for="Trainer" className="mx-sm-2 inlineFormLabel">{t('Trainer')}</label>
                    <div className="d-flex py-2 bg-white"><img alt="" src={`/${avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                      <div className="m-2"><h6 className="mt-2"><b>{userName}</b></h6></div>
                    </div>


                  </div>
                </div>
              </div>

            </div>
            <div className="col-12 m-4">
              <h5><b>{t('My Members')}</b></h5>
              <div className="table-responsive">
                <table className="borderRoundSeperateTable tdGray">
                  <thead>
                    <tr>
                      <th>{t('Member')}</th>
                      <th>{t('Email')}</th>
                      <th>{t('Mobile')}</th>
                      <th>{t('Admission Date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPageWiseData(this.state.pageNumber, memberClasses, this.state.displayNum).map((memberClass, i) => {
                      const { member: { credentialId, memberId, mobileNo }, dateOfPurchase } = memberClass
                      return (
                        <tr key={i}>
                          <td>
                            <div className="d-flex">
                              <img alt="" src={`/${credentialId.avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                              <div className="m-2">
                                <h6 className="m-0"><b>{credentialId.userName}</b></h6>
                                <span className="text-primary font-weight-bold">ID : {memberId}</span>
                              </div>
                            </div>
                          </td>
                          <td>{credentialId.email}</td>
                          <td className="dirltrtar">{mobileNo}</td>
                          <td>{dateToDDMMYYYY(dateOfPurchase)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {memberClasses &&
                <Pagination
                  pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                  getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                  fullData={memberClasses}
                  displayNumber={(displayNum) => this.setState({ displayNum })}
                  displayNum={this.state.displayNum ? this.state.displayNum : 5}
                />
              }
              {/*Pagination End*/}
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ auth: { loggedUser }, currency: { defaultCurrency }, classes: { classById } }) {
  return {
    loggedUser,
    defaultCurrency,
    classById
  }
}

export default withTranslation()(connect(mapStateToProps)(ScheduleClassDetails))