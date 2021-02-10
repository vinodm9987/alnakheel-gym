import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getMemberTransaction, cancelRedeem } from '../../../actions/reward.action'
import { dateToDDMMYYYY, getPageWiseData } from '../../../utils/apis/helpers'
import Pagination from '../../Layout/Pagination'

class CustomerRewardTransactionHistory extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const data = {
      member: this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    }
    this.props.dispatch(getMemberTransaction(data))
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        const data = {
          member: this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
        }
        this.props.dispatch(getMemberTransaction(data))
      }
    }
  }

  handleCross(transactionId) {
    this.props.dispatch(cancelRedeem({ transactionId }))
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 CustomerRewardTransactionHistory">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Rewards')}</span><span className="mx-2">/</span><span className="crumbText">{t('Reward Transaction History')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Reward Transaction History')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12">
            {/* <div className="col-12">
              <form className="form-inline row">
                <div className="col-12">
                  <div className="row d-block d-sm-flex justify-content-end pt-5">
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <label className="mx-sm-2 inlineFormLabel">Reward Type</label>
                        <select className="form-control mx-sm-2 inlineFormInputs">
                          <option value="">{t('ALL')}</option>
                          <option value="">Other</option>
                        </select>
                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      </div>
                    </div>
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <input type="text" autoComplete="off" placeholder="Search" className="form-control mx-sm-2 badge-pill inlineFormInputs" />
                        <span className="iconv1 iconv1-search searchBoxIcon"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div> */}
            <div className="table-responsive">
              <table className="borderRoundSeperateTable tdGray">
                <thead>
                  <tr>
                    <th>{t('Date')}</th>
                    <th>{t('Rewards Type')}</th>
                    <th>{t('Points')}</th>
                    <th>{t('Description')}</th>
                    <th><span className="mx-1">{t('Balance Points')}</span></th>
                    <th>{t('Redeem Code')}</th>
                    <th><span className="mx-2">{t('Status')}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.memberTransactions && getPageWiseData(this.state.pageNumber, this.props.memberTransactions, this.state.displayNum).map((transaction, i) => {
                    const { date, pointType, rewardType, balancePoint, point, redeemStatus, giftCard, policy, redeemCode, _id } = transaction
                    return (
                      <tr key={i}>
                        <td>{dateToDDMMYYYY(date)}</td>
                        <td>{(rewardType === 'Redeem' && pointType === '+') ? t('Refunded') : rewardType}</td>
                        <td>
                          <p className="d-flex m-0 align-items-center">
                            <span className={pointType === '+' ? "text-success pb-1" : "text-danger pb-1"} style={{ zoom: "2" }}>{pointType}</span>
                            {/* <span className="text-danger pb-1" style={{ zoom: "2" }}>-</span> */}
                            <span className="mx-1">{point} {t('Points')}</span>
                          </p>
                        </td>
                        <td>
                          <p className="m-0 whiteSpaceNormal w-300px">{rewardType === 'Redeem' ? giftCard.title : policy.policyName}</p>
                        </td>
                        <td>
                          <p className="d-flex m-0 align-items-center">
                            <span className="mx-1">{balancePoint} {t('Points')}</span>
                          </p>
                        </td>
                        <td>
                          <p className="d-flex m-0 align-items-center">
                            <span className="mx-1">{redeemCode ? redeemCode : '-'}</span>
                          </p>
                        </td>
                        {rewardType === 'Redeem'
                          ? <td>
                            {redeemStatus === 'Pending'
                              ? <p className="d-flex m-0 align-items-center">
                                <span className="text-danger mx-2"><b>{t('Pending')}</b></span>
                                <button onClick={() => this.handleCross(_id)} className="bg-warning border-0 px-2 py-2 d-inline-flex mx-2 rounded-circle">
                                  <span className="iconv1 iconv1-close text-white" style={{ fontSize: "10px" }}></span>
                                </button>
                              </p>
                              : <p className="d-flex m-0 align-items-center">
                                <span className="text-success mx-2"><b>{(rewardType === 'Redeem' && pointType === '+') ? t('Cancelled') : t('Completed')}</b></span>
                              </p>
                            }
                          </td>
                          : <td><p className="d-flex m-0 align-items-center">
                            <span className="text-success mx-2"><b>{t('Completed')}</b></span>
                          </p></td>
                        }
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/*Pagination Start*/}
            {this.props.memberTransactions &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={this.props.memberTransactions}
                displayNumber={(displayNum) => this.setState({ displayNum })}
                displayNum={this.state.displayNum ? this.state.displayNum : 5}
              />
            }
            {/* Pagination End // displayNumber={5} */}
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, reward: { memberTransactions } }) {
  return {
    loggedUser,
    errors,
    memberTransactions
  }
}

export default withTranslation()(connect(mapStateToProps)(CustomerRewardTransactionHistory))