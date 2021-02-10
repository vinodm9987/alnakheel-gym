import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import { connect } from 'react-redux'
import { validator, dateToDDMMYYYY, scrollToTop } from '../../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { addNewPolicy, updatePolicy, getAllPolicyForAdmin } from '../../../actions/reward.action'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class RewardPolicy extends Component {

  constructor(props) {
    super(props)
    this.default = {
      policyName: '',
      policyNameE: '',
      startDate: new Date(),
      startDateE: '',
      endDate: new Date(),
      endDateE: '',
      description: '',
      descriptionE: '',
      amount: '',
      amountE: '',
      noOfPoints: '',
      noOfPointsE: '',
      memberDashBoard: 'Yes',
      policyCategory: 'Amount',
      url: this.props.match.url,
      policyId: ''
    }
    this.state = this.default
    this.props.dispatch(getAllPolicyForAdmin())
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { policyId, policyName, noOfPoints, amount, startDate, endDate, description, memberDashBoard, policyCategory, noOfPointsE } = this.state
    if (policyName && parseInt(noOfPoints) && startDate <= endDate && description && !noOfPointsE) {
      const policyInfo = {
        policyName, noOfPoints, startDate, endDate, description, memberDashBoard, policyCategory
      }
      if (policyCategory === 'Amount') {
        if (amount) {
          policyInfo.amount = amount
          if (policyId) {
            this.props.dispatch(updatePolicy(policyId, policyInfo))
          } else {
            this.props.dispatch(addNewPolicy(policyInfo))
          }
        } else {
          if (!amount) this.setState({ amountE: t('Enter amount') })
        }
      } else {
        if (policyId) {
          this.props.dispatch(updatePolicy(policyId, policyInfo))
        } else {
          this.props.dispatch(addNewPolicy(policyInfo))
        }
      }
    } else {
      if (!policyName) this.setState({ policyNameE: t('Enter policy name') })
      if (!parseInt(noOfPoints)) this.setState({ noOfPointsE: t('Enter points') })
      if (!description) this.setState({ descriptionE: t('Enter description') })
      if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, policyId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updatePolicy(policyId, obj))
  }

  handleEdit(c) {
    scrollToTop()
    this.setState({
      policyName: c.policyName,
      noOfPoints: c.noOfPoints,
      amount: c.amount,
      memberDashBoard: c.memberDashBoard,
      policyCategory: c.policyCategory,
      description: c.description,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate),
      policyId: c._id
    })
  }

  render() {
    const { t } = this.props
    const { policyId, policyName, noOfPoints, amount, startDate, endDate, description, memberDashBoard, policyCategory } = this.state
    return (
      <div className="mainPage p-3 RewardPolicy">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Rewards')}</span><span className="mx-2">/</span><span className="crumbText">{t('Reward Policy')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Reward Policy')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12">
            <form className="row form-inline mt-4 pt-3">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="PolicyName" className="mx-sm-2 inlineFormLabel mb-2">{t('Policy Name')}</label>
                      <input type="text" autoComplete="off" className={this.state.policyNameE ? "form-control w-100 mx-sm-2 inlineFormInputs FormInputsError" : "form-control w-100 mx-sm-2 inlineFormInputs"} id="PolicyName"
                        value={policyName} onChange={(e) => this.setState(validator(e, 'policyName', 'text', [t('Enter policy name')]))}
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.policyNameE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel"><b>{t('Policy Category')}</b></label>
                      <div className="d-flex w-100 pt-3">
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input type="radio" className="custom-control-input" id="PolicyCategoryAmount" name="PolicyCategory"
                            checked={policyCategory === 'Amount'} onChange={() => this.setState({ policyCategory: 'Amount' })}
                          />
                          <label className="custom-control-label" htmlFor="PolicyCategoryAmount">{t('Amount')}</label>
                        </div>
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input type="radio" className="custom-control-input" id="PolicyCategoryReferal" name="PolicyCategory"
                            checked={policyCategory === 'Referral'} onChange={() => this.setState({ policyCategory: 'Referral' })}
                          />
                          <label className="custom-control-label" htmlFor="PolicyCategoryReferal">{t('Referral')}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {policyCategory === 'Amount' &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                      <div className="form-group inlineFormGroup">
                        <label htmlFor="amount" className="mx-sm-2 inlineFormLabel mb-2">{t('Amount')}</label>
                        <div className={this.state.amountE ? "form-control w-100 mx-sm-2 inlineFormInputs inlineFormInputPaddingStart FormInputsError p-0 d-flex align-items-center dirltrjcs" : "form-control w-100 mx-sm-2 inlineFormInputs inlineFormInputPaddingStart p-0 d-flex align-items-center dirltrjcs"}>
                          <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                          <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" id="amount"
                            value={amount} onChange={(e) => this.setState(validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]))}
                          />
                        </div>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{this.state.amountE}</small>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="NoOfPoints" className="mx-sm-2 inlineFormLabel mb-2">{t('No of Points')}</label>
                      <input type="number" autoComplete="off" className={this.state.noOfPointsE ? "form-control w-100 mx-sm-2 inlineFormInputs FormInputsError" : "form-control w-100 mx-sm-2 inlineFormInputs"} id="NoOfPoints"
                        value={noOfPoints} onChange={(e) => this.setState(validator(e, 'noOfPoints', 'number', [t('Enter points'), t('Enter valid points')]))}
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.noOfPointsE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="StartDate" className="mx-sm-2 inlineFormLabel mb-2">{t('Start Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          className={this.state.startDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"}
                          invalidDateMessage=''
                          minDateMessage=''
                          minDate={new Date()}
                          format="dd/MM/yyyy"
                          value={startDate}
                          onChange={(e) => this.setState(validator(e, 'startDate', 'date', []))}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.startDateE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="EndDate" className="mx-sm-2 inlineFormLabel mb-2">{t('End Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          className={this.state.endDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"}
                          invalidDateMessage=''
                          minDateMessage=''
                          minDate={startDate}
                          format="dd/MM/yyyy"
                          value={endDate}
                          onChange={(e) => this.setState(validator(e, 'endDate', 'date', []))}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.endDateE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="Description" className="mx-sm-2 inlineFormLabel mb-2">{t('Description')}</label>
                      <textarea rows="4" className={this.state.descriptionE ? "form-control w-100 mx-sm-2 inlineFormInputs FormInputsError" : "form-control w-100 mx-sm-2 inlineFormInputs"} id="Description"
                        value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))}
                      ></textarea>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 d-flex flex-wrap align-items-start py-5">
                    <h5 className="mx-3">{t('Show in Member Dashboard')}</h5>
                    <div className="position-relative mx-3">
                      <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white"
                        value={memberDashBoard} onChange={(e) => this.setState({ memberDashBoard: e.target.value })}
                      >
                        <option value="Yes">{t('Yes')}</option>
                        <option value="No">{t('No')}</option>
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="justify-content-sm-end d-flex pt-3">
                      <button disabled={disableSubmit(this.props.loggedUser, 'Rewards', 'RewardPolicy')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{policyId ? t('Update') : t('Submit')}</button>
                      <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Policy List')}</h5>
          </div>
          {this.renderPolicyList()}

        </div>
      </div>
    )
  }

  renderPolicyList() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Policy Name')}</th>
                <th>{t('Category')}</th>
                <th>{t('Amount')}</th>
                <th>{t('No of Points')}</th>
                <th>{t('Start Date')}</th>
                <th>{t('End Date')}</th>
                <th>{t('Description')}</th>
                <th className="text-center">{t('Status')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.policies && getPageWiseData(this.state.pageNumber, this.props.policies, this.state.displayNum).map((policy, i) => {
                const { _id, policyName, noOfPoints, amount, startDate, endDate, description, status, policyCategory } = policy
                return (
                  <tr key={i}>
                    <td>
                      <p className="whiteSpaceNormal w-150px my-0">{policyName}</p>
                    </td>
                    <td>{policyCategory}</td>
                    <td className="text-danger">{policyCategory === 'Amount' ? `${this.props.defaultCurrency} ${amount}` : '-'}</td>
                    <td>{noOfPoints} {t('Points')}</td>
                    <td>{dateToDDMMYYYY(startDate)}</td>
                    <td>{dateToDDMMYYYY(endDate)}</td>
                    <td>
                      <p className="whiteSpaceNormal w-200px my-0">{description}</p>
                    </td>
                    <td className="text-center">
                      <label className="switch">
                        <input type="checkbox" checked={status} onChange={(e) => this.handleCheckBox(e, _id)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td className="text-center">
                      <span className="bg-success action-icon cursorPointer" onClick={() => this.handleEdit(policy)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.policies &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.policies}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }
}


function mapStateToProps({ auth: { loggedUser }, currency: { defaultCurrency }, errors, reward: { policies } }) {
  return {
    loggedUser,
    errors,
    defaultCurrency,
    policies
  }
}

export default withTranslation()(connect(mapStateToProps)(RewardPolicy))