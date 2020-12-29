import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getAllTransactionsForAdmin } from '../../../actions/reward.action'
import { dateToDDMMYYYY, getPageWiseData } from '../../../utils/apis/helpers'
import { getAllBranch } from '../../../actions/branch.action'
import Pagination from '../../Layout/Pagination'

class RewardTransactionHistory extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rewardType: '',
      branch: '',
      search: '',
    }
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getAllTransactionsForAdmin(this.state))
  }

  setRewardType(e) {
    this.setState({ rewardType: e.target.value }, () => {
      this.props.dispatch(getAllTransactionsForAdmin(this.state))
    })
  }

  setBranch(e) {
    this.setState({ branch: e.target.value }, () => {
      this.props.dispatch(getAllTransactionsForAdmin(this.state))
    })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getAllTransactionsForAdmin)(this.state)
    })
  }

  render() {
    const { t } = this.props
    const { rewardType, branch, search } = this.state
    return (
      <div className="mainPage p-3 RewardTransactionHistory">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Rewards')}</span><span className="mx-2">/</span><span className="crumbText">{t('Reward Transaction History')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Reward Transaction History')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12">
            <div className="col-12">
              <form className="form-inline row">
                <div className="col-12">
                  <div className="row d-block d-sm-flex justify-content-end pt-5">
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <label className="mx-sm-2 inlineFormLabel">{t('Branch')}</label>
                        <select className="form-control mx-sm-2 inlineFormInputs" value={branch} onChange={(e) => this.setBranch(e)}>
                          <option value="">{t('All Branch')}</option>
                          {
                            this.props.activeResponse && this.props.activeResponse.map((doc, i) => {
                              return (
                                <option key={i} value={doc._id}>{doc.branchName}</option>
                              )
                            })
                          }
                        </select>
                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      </div>
                    </div>
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <label className="mx-sm-2 inlineFormLabel">{t('Reward Type')}</label>
                        <select className="form-control mx-sm-2 inlineFormInputs" value={rewardType} onChange={(e) => this.setRewardType(e)}>
                          <option value="">{t('All')}</option>
                          <option value="Redeem">{t('Redeem')}</option>
                          <option value="Earn">{t('Earn')}</option>
                        </select>
                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      </div>
                    </div>
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" value={search} onChange={(e) => this.handleSearch(e)} />
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
                    <th>{t('Date')}</th>
                    <th>{t('Member')}</th>
                    <th>{t('Branch')}</th>
                    <th>{t('Rewards Type')}</th>
                    <th>{t('Description')}</th>
                    <th>{t('Points')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.allTransactions && getPageWiseData(this.state.pageNumber, this.props.allTransactions, this.state.displayNum).map((transaction, i) => {
                    const { date, pointType, member: { credentialId: { userName, avatar } }, branch: { branchName }, rewardType, point, giftCard, policy } = transaction
                    return (
                      <tr key={i}>
                        <td>{dateToDDMMYYYY(date)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={`/${avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" alt="" />
                            <div className="mx-1">
                              <h5 className="m-0">{userName}</h5>
                            </div>
                          </div>
                        </td>
                        <td>{branchName}</td>
                        <td>{(rewardType === 'Redeem' && pointType === '+') ? t('Refunded') : rewardType}</td>
                        <td>
                          <p className="m-0 whiteSpaceNormal w-300px">{rewardType === 'Redeem' ? giftCard.title : policy.policyName}</p>
                        </td>
                        <td>
                          <p className="d-flex m-0 align-items-center">
                            {/* <span className="text-success pb-1" style={{ zoom: "2" }}>+</span> */}
                            <span className={pointType === '+' ? "text-success pb-1" : "text-danger pb-1"} style={{ zoom: "2" }}>{pointType}</span>
                            <span className="mx-1">{point} {t('Points')}</span>
                          </p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/*Pagination Start*/}
            {this.props.allTransactions &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={this.props.allTransactions}
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

function mapStateToProps({ reward: { allTransactions }, branch: { activeResponse } }) {
  return {
    allTransactions,
    activeResponse
  }
}

export default withTranslation()(connect(mapStateToProps)(RewardTransactionHistory))