import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { freezeMember, getPendingFreezeMember, removeMemberFreeze } from '../../../actions/freeze.action';
import { dateToDDMMYYYY, getPageWiseData, setTime, validator } from '../../../utils/apis/helpers';
import { disableSubmit } from '../../../utils/disableButton';
import Pagination from '../../Layout/Pagination';

class PendingFreeze extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      date: new Date(),
      search: '',
      pendingFreeze: [],
      selectAll: false,
      isUpdated: false
    }
    this.state = this.default
    this.props.dispatch(getPendingFreezeMember({ search: this.state.search, date: this.state.date }))
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

  static getDerivedStateFromProps(props, state) {
    if (props.pendingFreeze && !state.isUpdated) {
      if (props.pendingFreeze.length) {
        const pendingFreeze = []
        props.pendingFreeze.forEach(freeze => {
          pendingFreeze.push({ ...freeze, ...{ check: false } })
        })
        return {
          pendingFreeze
        }
      } else {
        return {
          pendingFreeze: []
        }
      }
    }
    return null;
  }

  handleDate(e) {
    this.setState({ ...validator(e, 'date', 'date', []), ...{ isUpdated: false, selectAll: false } }, () => {
      this.props.dispatch(getPendingFreezeMember({ search: this.state.search, date: this.state.date }))
    })
  }

  resetDate() {
    this.setState({ date: '', isUpdated: false, selectAll: false }, () => {
      this.props.dispatch(getPendingFreezeMember({ search: this.state.search, date: this.state.date }))
    })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value, isUpdated: false, selectAll: false }, () => {
      window.dispatchWithDebounce(getPendingFreezeMember)({ search: this.state.search, date: this.state.date })
    })
  }

  handleSelectAll(type, freezeId) {
    const { pendingFreeze, selectAll } = this.state
    this.setState({ isUpdated: true })
    if (type === 'All') {
      if (selectAll) {
        pendingFreeze.forEach(freeze => {
          freeze.check = false
        })
        this.setState({ pendingFreeze, selectAll: false })
      } else {
        pendingFreeze.forEach(freeze => {
          if (setTime(freeze.toDate) >= setTime(new Date())) {
            freeze.check = true
          }
        })
        this.setState({ pendingFreeze, selectAll: true })
      }
    } else {
      if (selectAll) {
        this.setState({ selectAll: false })
      }
      pendingFreeze.map(freeze => {
        if (freeze._id === freezeId) {
          freeze.check = !freeze.check
          return freeze
        }
        return freeze
      })
      this.setState({ pendingFreeze })
    }
  }

  handleFreeze() {
    const { pendingFreeze } = this.state
    const member = []
    pendingFreeze.forEach(freeze => {
      if (freeze.check) {
        member.push({
          _id: freeze._id,
          member: freeze.memberId._id,
          reactivation: freeze.reactivationDate,
          days: freeze.noOfDays,
          memberId: freeze.memberId.memberId,
          packageDetails: freeze.memberId.packageDetails
        })
      }
    })
    member.length > 0 && this.props.dispatch(freezeMember({ member }))
    this.setState({ isUpdated: false, selectAll: false })
  }

  removeMember(_id) {
    this.props.dispatch(removeMemberFreeze({ _id }))
    this.setState({ isUpdated: false, selectAll: false })
  }

  render() {
    const { pendingFreeze } = this.state
    const { t } = this.props
    return (
      <div className={this.state.url === '/freeze-members/pending-freeze' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <span onClick={() => this.resetDate()} className="btn btn-sm btn-warning px-3 text-white all-btn">{t('All')}</span>
                    </div>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          className="form-control mx-sm-2 inlineFormInputs"
                          invalidDateMessage=''
                          minDateMessage=''
                          format="dd/MM/yyyy"
                          value={this.state.date}
                          onChange={(e) => this.handleDate(e)}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    </div>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs"
                        value={this.state.search} onChange={(e) => this.handleSearch(e)}
                      />
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
                  <th>
                    <div className="d-flex w-100">
                      <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                        <input type="checkbox" className="custom-control-input" id="SelAll"
                          checked={this.state.selectAll} onChange={() => this.handleSelectAll('All')}
                        />
                        <label className="custom-control-label" htmlFor="SelAll"></label>
                      </div>
                    </div>
                  </th>
                  <th>{t('Member')}</th>
                  <th>{t('From Date')}</th>
                  <th>{t('To Date')}</th>
                  <th>{t('No of Days')}</th>
                  <th>{t('Reactivation Date')}</th>
                  <th>{t('Reason')}</th>
                  <th>{t('Amount')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendingFreeze && getPageWiseData(this.state.pageNumber, pendingFreeze, this.state.displayNum).map((freeze, i) => {
                  const { fromDate, toDate, reactivationDate, memberId: { _id: member, credentialId: { userName, avatar }, memberId }, reason, noOfDays, check, _id, totalAmount } = freeze
                  return (
                    <tr key={i}>
                      <td>
                        <div className="d-flex w-100">
                          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                            <input disabled={setTime(toDate) < setTime(new Date())} type="checkbox" className="custom-control-input" id={`check-${i}`}
                              checked={check} onChange={() => this.handleSelectAll('Individual', _id)}
                            />
                            <label className="custom-control-label" htmlFor={`check-${i}`}></label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          <img alt='' src={`/${avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                          <div className="mx-1">
                            <h5 className="m-0">{userName}</h5>
                            <span className="text-primary d-flex"><span>ID</span><span className="mx-1">:</span><span> {memberId}</span></span>
                          </div>
                        </div>
                      </td>
                      <td>{dateToDDMMYYYY(fromDate)}</td>
                      <td>{dateToDDMMYYYY(toDate)}</td>
                      <td>{noOfDays} {t('Days')}</td>
                      <td>{dateToDDMMYYYY(reactivationDate)}</td>
                      <td><span className="mx-200-normalwrap">{reason}</span></td>
                      <td>{totalAmount ? `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}` : 'NA'}</td>
                      <td className="text-center">
                        <Link type="button" className="btn btn-primary btn-sm w-100px rounded-50px text-white" to={`/members-details/${member}`}>{t('Details')}</Link>
                      </td>
                      <td><span onClick={() => this.removeMember(_id)} className="btn btn-danger btn-sm br-50 p-2 d-inline-flex align-items-center justify-content-center" style={{ zoom: '0.75' }}><span className="iconv1 iconv1-close"></span></span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {pendingFreeze &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={pendingFreeze}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/*Pagination End*/}
          <div className="d-flex justify-content-end pt-2 pb-4">
            <button disabled={disableSubmit(this.props.loggedUser, 'Members', 'FreezeMembers')} type="button" className="btn btn-success px-4" onClick={() => this.handleFreeze()}>{t('Freeze')}</button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ freeze: { pendingFreeze }, auth: { loggedUser }, currency: { defaultCurrency } }) {
  return {
    pendingFreeze: pendingFreeze && pendingFreeze.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate)),
    loggedUser, defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(PendingFreeze))