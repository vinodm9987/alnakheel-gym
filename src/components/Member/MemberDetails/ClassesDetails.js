import React, { Component } from 'react'
import { DonutChart } from '../../Layout'
import { connect } from 'react-redux'
import { dateToDDMMYYYY, calculateDays } from '../../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import { getCustomerClassesDetails } from '../../../actions/classes.action'

class ClassesDetails extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(getCustomerClassesDetails({ member: this.props.memberId }))
  }

  render() {
    const { t } = this.props
    if (this.props.customerClassesDetails) {
      const { customerClassesDetails } = this.props
      return (
        <div className="tab-pane fade" id="menu5" role="tabpanel">
          <div className="col-12">
            <ul className="row px-0">
              {customerClassesDetails && customerClassesDetails.map((classes, i) => {
                const { classId: { startDate, endDate, className, trainer: { credentialId: { userName, avatar }, mobileNo } } } = classes
                if (new Date().setHours(0, 0, 0, 0) <= new Date(endDate).setHours(0, 0, 0, 0)) {
                  return (
                    <li key={i} className="d-block col-12 px-0">
                      <div className="row">
                        <div className="col-12 col-lg-5">
                          <h5 className="">{className}</h5>
                          <div className="d-flex justify-content-between align-items-start flex-wrap">
                            <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                              <span className="text-secondary">{t('Start Date')}</span>
                              <span className="text-danger w-100">{dateToDDMMYYYY(startDate)}</span>
                            </div>
                            <div className="d-flex justify-content-end flex-wrap flexBasis-0">
                              <span className="text-secondary whiteSpaceNoWrap">{t('End Date')}</span>
                              <span className="text-danger w-100 text-right">{dateToDDMMYYYY(endDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center flex-column">
                          <DonutChart
                            dataValue={calculateDays(new Date(), endDate)}
                            value={calculateDays(new Date(), endDate) / calculateDays(startDate, endDate) * 100}
                            size={90}
                            strokewidth={12}
                            text1={t('Days')}
                            text2={t('Left')}
                          />
                        </div>
                        <div className="col-12 col-lg-5 d-flex align-items-stretch">
                          <div className="border border-info rounded alert-primary w-100 d-flex align-items-center">
                            <div className="d-flex p-2 w-100 flex-wrap">
                              <h6 className="pb-1 w-100 font-weight-bold text-black">{t('Trainer Details')}</h6>
                              <div className="d-flex align-items-center w-100">
                                <img alt='' src={`${avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                                <div className="mx-1">
                                  <p className="m-0 text-black">{userName}</p>
                                  {/* <span className="wordBreakBreakAll text-black">{email}</span> */}
                                  {/* Tusar phone added */}
                                  <small className="dirltrtar d-inline-block text-black">{mobileNo}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
            <h5 className="text-secondary">{t('Classes History')}</h5>
          </div>
          <div className="col-12 tableTypeStriped">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Class Name')}</th>
                    <th>{t('From Date')}</th>
                    <th>{t('To Date')}</th>
                    <th>{t('Amount')}</th>
                    <th>{t('Trainer')}</th>
                    {/* <th className="text-center">{t('Action')}</th> */}
                  </tr>
                </thead>
                <tbody>
                  {customerClassesDetails && customerClassesDetails.map((pack, i) => {
                    const { classId: { className, startDate, endDate, trainer }, totalAmount } = pack

                    return (
                      <tr key={i}>
                        <td>{className}</td>
                        <td>{dateToDDMMYYYY(startDate)}</td>
                        <td>{dateToDDMMYYYY(endDate)}</td>
                        <td className="text-danger font-weight-bold"><span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span>{totalAmount.toFixed(3)}</span></td>
                        <td>{trainer ? trainer.credentialId.userName : 'NA'}</td>
                        {/* <td className="text-center">
                          <span className="bg-warning action-icon"><span className="iconv1 iconv1-download"></span></span>
                        </td> */}
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

function mapStateToProps({ member: { memberById }, currency: { defaultCurrency }, classes: { customerClassesDetails } }) {
  return {
    memberById,
    defaultCurrency,
    customerClassesDetails
  }
}

export default withTranslation()(connect(mapStateToProps)(ClassesDetails))