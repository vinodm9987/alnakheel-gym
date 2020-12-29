import React, { Component } from 'react'
import { DonutChart } from '../../Layout'
import { connect } from 'react-redux'
import { dateToDDMMYYYY, calculateDays, setTime } from '../../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

class PackageDetails extends Component {



  render() {
    const { t } = this.props
    if (this.props.memberById) {
      const { packageDetails } = this.props.memberById
      // const formatOptionLabel = ({ credentialId: { userName, avatar, email } }) => {
      //   return (
      //     <div className="d-flex align-items-center">
      //       <img alt='' src={`/${avatar.path}`} className="rounded-circle mx-1 w-30px h-30px" />
      //       <div className="w-100">
      //         <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{userName}</small>
      //         <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1' }}>{email}</small>
      //       </div>
      //     </div>
      //   )
      // }
      // const colourStyles = {
      //   control: styles => ({ ...styles, backgroundColor: 'white' }),
      //   option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
      // };
      return (
        <div className="tab-pane fade show active" id="menu1" role="tabpanel">
          <div className="col-12">
            <ul className="row px-0">
              {packageDetails && packageDetails.reverse().map((pack, i) => {
                const { startDate, endDate, extendDate, reactivationDate, packages: { packageName }, trainer, trainerStart, trainerEnd, trainerExtend } = pack
                if ((extendDate && reactivationDate) ? new Date().setHours(0, 0, 0, 0) <= new Date(extendDate).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0) <= new Date(endDate).setHours(0, 0, 0, 0)) {
                  return (
                    <li key={i} className="d-block col-12 px-0">
                      <div className="row">
                        <div className="col-12 col-lg-5">
                          <h5 className="">{packageName}</h5>
                          <div className="d-flex justify-content-between align-items-start flex-wrap">
                            <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                              <span className="text-secondary">{t('Start Date')}</span>
                              <span className="text-danger w-100">{dateToDDMMYYYY(startDate)}</span>
                            </div>
                            <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                              <span className="text-secondary whiteSpaceNoWrap">{t('End Date')}</span>
                              <span className="text-danger w-100 text-right">{dateToDDMMYYYY(endDate)}</span>
                              {extendDate && <span className="text-secondary whiteSpaceNoWrap">{t('Extended till')}</span>}
                              {extendDate && <span className="text-danger w-100 text-right">{dateToDDMMYYYY(extendDate)}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center flex-column">
                          {(extendDate && reactivationDate)
                            ? <DonutChart
                              dataValue={calculateDays(new Date(reactivationDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? new Date() : reactivationDate, extendDate)}
                              value={
                                calculateDays(new Date(reactivationDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? new Date() : reactivationDate, extendDate) /
                                calculateDays(startDate, endDate) * 100
                              }
                              size={90}
                              strokewidth={12}
                              text1={t('Days')}
                              text2={t('Left')}
                            />
                            : <DonutChart
                              dataValue={calculateDays(new Date(), endDate)}
                              value={calculateDays(new Date(), endDate) / calculateDays(startDate, endDate) * 100}
                              size={90}
                              strokewidth={12}
                              text1={t('Days')}
                              text2={t('Left')}
                            />
                          }
                        </div>
                        {trainer &&
                          <div className="col-12 col-lg-5 d-flex align-items-stretch">
                            <div className="border border-info rounded alert-primary w-100 d-flex align-items-center">
                              <div className="d-flex p-2 w-100 flex-wrap">
                                <div className="d-flex justify-content-between pb-1 w-100">
                                  <h6 className="font-weight-bold text-black">{t('Trainer Details')}</h6>
                                  {(trainerExtend ? (new Date(trainerExtend).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : (new Date(trainerEnd).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))
                                    ? <h5 className="m-0 btn btn-danger px-3 py-0 btn-sm br-50px cursorDefault">{t('Expired')}</h5>
                                    : <span className="d-none"></span>
                                  }
                                </div>
                                <div className="d-flex align-items-center w-100">
                                  <img alt='' src={`${trainer.credentialId.avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                  <div className="mx-1">
                                    <p className="m-0 text-black">{trainer.credentialId.userName}</p>
                                    {/* <span className="wordBreakBreakAll text-black">{trainer.credentialId.email}</span> */}
                                    {/* Tusar phone added */}
                                    <small className="dirltrtar d-inline-block text-black">{trainer.mobileNo}</small>
                                    {(trainerExtend ? (new Date(trainerExtend).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : (new Date(trainerEnd).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))
                                      ? <h5 className="m-0 d-none">{t('Expired')}</h5>
                                      : <div className="d-flex justify-content-between align-items-start flex-wrap">
                                        <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                                          <small className="w-100 text-black">{dateToDDMMYYYY(trainerStart)}</small>
                                        </div>
                                    -
                                    <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                                          <small className="w-100 text-right text-black">{dateToDDMMYYYY(trainerEnd)}</small>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className="underline my-3"></div>
                    </li>
                  )
                } else if (!startDate && !endDate) {
                  return (
                    <li key={i} className="d-block col-12 px-0">
                      <div className="row">
                        <div className="col-12 col-lg-5">
                          <h5 className="">{packageName}</h5>
                        </div>
                        <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center flex-column">

                        </div>
                        {trainer &&
                          <div className="col-12 col-lg-5 d-flex align-items-stretch">
                            <div className="border border-info rounded alert-primary w-100 d-flex align-items-center">
                              <div className="d-flex p-2 w-100 flex-wrap">
                                <h6 className="pb-1 w-100 font-weight-bold text-black">{t('Trainer Details')}</h6>
                                <div className="d-flex align-items-center w-100">
                                  <img alt='' src={`${trainer.credentialId.avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                  <div className="mx-1">
                                    <p className="m-0 text-black">{trainer.credentialId.userName}</p>
                                    {/* <span className="wordBreakBreakAll text-black">{trainer.credentialId.email}</span> */}
                                    {/* Tusar phone added */}
                                    <span className="dirltrtar d-inline-block text-black">{trainer.mobileNo}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className="underline my-3"></div>
                    </li>
                  )
                } else {
                  return null
                }
              })}
            </ul>

          </div>
          <div className="col-12">
            <h5 className="text-secondary">{t('Package History')}</h5>
          </div>
          <div className="col-12 tableTypeStriped">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Package Name')}</th>
                    <th>{t('From Date')}</th>
                    <th>{t('To Date')}</th>
                    <th>{t('Amount')}</th>
                    <th>{t('Trainer')}</th>
                    <th className="text-center">{t('Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {packageDetails && packageDetails.map((pack, i) => {
                    const { startDate, endDate, packages, totalAmount, trainer, isExpiredPackage, packageRenewal, _id } = pack
                    return (
                      <tr key={i}>
                        <td>{packages.packageName}</td>
                        <td>{dateToDDMMYYYY(startDate)}</td>
                        <td>{dateToDDMMYYYY(endDate)}</td>
                        <td className="text-danger font-weight-bold"><span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span>{totalAmount.toFixed(3)}</span></td>
                        <td>{trainer ? trainer.credentialId.userName : 'NA'}</td>
                        <td className="text-center">
                          {isExpiredPackage && !packageRenewal && setTime(packages.endDate) >= setTime(new Date()) &&
                            <Link to={{ pathname: `/package-details/${packages._id}`, oldPackageId: JSON.stringify(_id) }}>
                              <button className="btn btn-success btn-sm px-3 m-1">{t('Renew')}</button>
                            </Link>
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ member: { memberById }, currency: { defaultCurrency } }) {
  return {
    memberById,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(PackageDetails))