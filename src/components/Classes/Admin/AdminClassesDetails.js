import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getClassById } from '../../../actions/classes.action'
import { dateToHHMM, dateToDDMMYYYY } from '../../../utils/apis/helpers'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class AdminClassesDetails extends Component {

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

      const { className, description, branch: { branchName }, room: { roomName }, capacity, startTime, amount, members,
        endTime, startDate, endDate, classDays, trainer: { credentialId: { userName, avatar } }, occupied, vat: { vatName, taxPercent } } = this.props.classById

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
        <div className="mainPage p-3 AdminClassesDetails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes Details')}</span>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pageHead">
                  <h1>
                    <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                    <span className="px-1"></span>
                    <span>{t('Classes Details')}</span>
                  </h1>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xs-6 pageHeadRight">
                  <div className="d-flex flex-wrap jusify-content-start align-items-center justify-content-md-end py-2">
                    <Link to={{ pathname: "/book-class", classesProps: this.props.classById }} className="btn btn-warning px-4 text-white">{t('Book a class')}</Link>
                  </div>
                </div>
                <div className="col-12 pageHeadDown">
                  <div className="pageHeadLine"></div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row mx-0 w-100">
                <div className="col-12">
                  <div className="card bg-light text-dark mt-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="SegoeBold text-body">{className}</h4>
                          <p className="text-body">{description}</p>
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 p-0 d-flex flex-wrap justify-content-lg-between pt-3">

                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-location mr-1 text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Branch')}</p>
                                  <p className="SegoeBold m-0">{branchName}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-capacity mr-1 text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Capacity')}</p>
                                  <p className="SegoeBold m-0">{capacity}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-clock mr-2 text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Time')}</p>
                                  <p className="SegoeBold m-0 d-flex flex-wrap"><span>{dateToHHMM(startTime)}</span><span className="mx-1">-</span><span>{dateToHHMM(endTime)}</span></p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-calendar mr-2 text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Date')}</p>
                                  <p className="SegoeBold m-0 d-flex flex-wrap"><span>{dateToDDMMYYYY(startDate)}</span><span className="mx-1">-</span><span>{dateToDDMMYYYY(endDate)}</span></p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-room mr-1 text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Room')}</p>
                                  <p className="SegoeBold m-0">{roomName}</p>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row pt-5">
                            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-4">
                              <p className="mb-2">{t('Days')}</p>
                              <div className="position-relative">
                                <select className="form-control SegoeBold">
                                  {classDays.map((day, i) => {
                                    return (
                                      <option disabled={!(i === 0)} key={i}>{dateToDDMMYYYY(day)}</option>
                                    )
                                  })}
                                </select>
                                <div className="d-flex align-items-center justify-content-end h-30px w-100 position-absolute pointerEventsNone px-2 pt-2"
                                  style={{ top: '0', left: '0' }} >
                                  <span className="iconv1 iconv1-arrow-down font-weight-bold"></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-3 mb-4">
                              <p className="mb-2">{t('Trainer')}</p>
                              <div className="d-flex flex-wrap flex-sm-nowrap align-items-center">
                                <img alt='' src={`/${avatar.path}`} className="w-50px h-50px rounded-circle" />
                                <p className="SegoeBold p-2 mb-0">{userName}</p>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-2 mb-4">
                              <p className="mb-0">{t('Total Bookings')}</p>
                              <p className="SegoeBold">{`${occupied ? occupied : 0} / ${capacity}`}</p>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-2 mb-4">
                              <p className="mb-0">{t('VAT')}</p>
                              <p className="SegoeBold">{taxPercent === 0 ? `${vatName}` : `${taxPercent}%`}</p>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                              {/* <h2 className="iconv1 iconv1-money text-warning mb-0 mt-2 mx-2 font-weight-bold"> </h2> */}
                              <p className="mb-0">{t('Amount')}</p>
                              {/* tushar add translation */}
                              <p className="SegoeBold">
                                <span>{this.props.defaultCurrency}</span>
                                <span className="pl-1"></span>
                                <span>{amount.toFixed(3)}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <div className="col-12">
                        <form className="form-inline row">
                          <div className="col-12">
                            <div className="row d-block d-sm-flex justify-content-between pt-5">
                              <div className="col w-auto px-1 flexBasis-auto flex-grow-0 subHead">
                                <h3 className="mb-3 SegoeSemiBold">{t('Enrolled Members')}</h3>
                              </div>
                              <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                                <div className="form-group inlineFormGroup">
                                  <input type="text" autoComplete="off" placeholder={t('Search')} className="form-control mx-sm-2 badge-pill inlineFormInputs"
                                    value={search} onChange={(e) => this.setState({ search: e.target.value })} />
                                  <span className="iconv1 iconv1-search searchBoxIcon"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="table-responsive">
                        <table className="borderRoundSeperateTable tdGray">
                          <thead>
                            <tr>
                              <th>{t('Member Name')}</th>
                              <th className="text-center">{t('Date')}</th>
                              <th className="text-center">{t('Payment Status')}</th>
                              <th className="text-center">{t('Mode')}</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {getPageWiseData(this.state.pageNumber, memberClasses, this.state.displayNum).map((memberClass, i) => {
                              const { member: { credentialId, _id: memberId }, dateOfPurchase, paymentStatus, mode } = memberClass
                              return (
                                <tr key={i}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img alt='' src={`/${credentialId.avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                      <h6 className="m-0 font-weight-bold">{credentialId.userName}</h6>
                                    </div>
                                  </td>
                                  <td className="text-center">{dateToDDMMYYYY(dateOfPurchase)}</td>
                                  <td className="text-center">
                                    <h6 className={paymentStatus === 'Paid' ? "m-0 text-success font-weight-bold " : "m-0 text-danger font-weight-bold "}>{t(`${paymentStatus}`)}</h6>
                                    {/* <h5 className="m-0 text-danger">Un Paid</h5> */}
                                  </td>
                                  <td className="text-center">
                                    <h6 className="m-0 font-weight-bold text-body">{t(`${mode}`)}</h6>
                                  </td>
                                  <td className="text-center">
                                    <Link className="btn btn-primary btn-sm w-100px rounded-50px text-center" to={`/members-details/${memberId}`}>{t('Details')}</Link>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                      {/*Pagination Start*/}
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
                      {/* <div>Pagination See design</div> */}
                    </div>
                  </div>
                </div>
              </div>
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

export default withTranslation()(connect(mapStateToProps)(AdminClassesDetails))