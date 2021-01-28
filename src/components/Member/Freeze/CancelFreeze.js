import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { cancelFreeze, getFreezeHistory } from '../../../actions/freeze.action';
import { calculateDays, dateToDDMMYYYY, getPageWiseData, validator } from '../../../utils/apis/helpers';

class CancelFreeze extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      search: '',
      date: new Date(),
      returningDate: new Date(),
      reason: '',
      freezeHistory: [],
      selectAll: false,
      isUpdated: false
    }
    this.state = this.default
    this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date }))
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
    if (props.freezeHistory && !state.isUpdated) {
      if (props.freezeHistory.length) {
        const freezeHistory = []
        props.freezeHistory.forEach(freeze => {
          freezeHistory.push({ ...freeze, ...{ check: false } })
        })
        return {
          freezeHistory
        }
      } else {
        return {
          freezeHistory: []
        }
      }
    }
    return null;
  }

  handleDate(e) {
    this.setState({ ...validator(e, 'date', 'date', []), ...{ isUpdated: false, selectAll: false } }, () => {
      this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date }))
    })
  }

  resetDate() {
    this.setState({ date: '', isUpdated: false, selectAll: false }, () => {
      this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date }))
    })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value, isUpdated: false, selectAll: false }, () => {
      window.dispatchWithDebounce(getFreezeHistory)({ search: this.state.search, date: this.state.date })
    })
  }

  // handleSelectAll(type, freezeId) {
  //   const { freezeHistory, selectAll } = this.state
  //   this.setState({ isUpdated: true })
  //   if (type === 'All') {
  //     if (selectAll) {
  //       freezeHistory.forEach(freeze => {
  //         freeze.check = false
  //       })
  //       this.setState({ freezeHistory, selectAll: false })
  //     } else {
  //       freezeHistory.forEach(freeze => {
  //         if (setTime(freeze.toDate) >= setTime(new Date())) {
  //           freeze.check = true
  //         }
  //       })
  //       this.setState({ freezeHistory, selectAll: true })
  //     }
  //   } else {
  //     if (selectAll) {
  //       this.setState({ selectAll: false })
  //     }
  //     freezeHistory.map(freeze => {
  //       if (freeze._id === freezeId) {
  //         freeze.check = !freeze.check
  //         return freeze
  //       }
  //       return freeze
  //     })
  //     this.setState({ freezeHistory })
  //   }
  // }

  handleSubmit(memberId) {
    const { returningDate, reason } = this.state
    const cancelInfo = {
      returningDate, reason, memberId
    }
    this.props.dispatch(cancelFreeze(cancelInfo))
  }

  render() {
    const { freezeHistory } = this.state
    const { t } = this.props
    return (
      <div className={this.state.url === '/freeze-members/cancel-freeze' ? "tab-pane fade show active" : "tab-pane fade"} id="menu4" role="tabpanel">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup flex-nowrap">
                      <span onClick={() => this.resetDate()} className="btn btn-warning btn-sm text-white all-btn">{t('ALL')}</span>
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
                  {/* <th>
                    <div className="d-flex w-100">
                      <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                        <input type="checkbox" className="custom-control-input" id="SelAll"
                          checked={this.state.selectAll} onChange={() => this.handleSelectAll('All')}
                        />
                        <label className="custom-control-label" htmlFor="SelAll"></label>
                      </div>
                    </div>
                  </th> */}
                  <th>{t('Member')}</th>
                  <th>{t('From Date')}</th>
                  <th>{t('To Date')}</th>
                  <th>{t('No of Days')}</th>
                  <th>{t('Reactivation Date')}</th>
                  <th>{t('Remaining Days')}</th>
                  <th>{t('Returning Date')}</th>
                  <th>{t('Reason')}</th>
                  <th>{t('Status')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {freezeHistory && getPageWiseData(this.state.pageNumber, freezeHistory, this.state.displayNum).map((freeze, i) => {
                  const { fromDate, toDate, reactivationDate, memberId: { _id: member, credentialId: { userName, avatar }, memberId }, reason, noOfDays, returningDate, typeOfFreeze } = freeze
                  return (
                    <tr key={i}>
                      {/* <td>
                        <div className="d-flex w-100">
                          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                            <input type="checkbox" className="custom-control-input" id={`check-${i}`}
                              checked={check} onChange={() => this.handleSelectAll('Individual', _id)}
                            />
                            <label className="custom-control-label" htmlFor="check"></label>
                          </div>
                        </div>
                      </td> */}
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
                      <td>{calculateDays(new Date(), toDate)}</td>
                      <td>{dateToDDMMYYYY(returningDate)}</td>
                      <td><span className="mx-200-normalwrap">{reason}</span></td>
                      <td>{typeOfFreeze}</td>
                      <td className="text-center">
                        <button disabled={calculateDays(new Date(), toDate) === 0 ? true : false} type="button" className="btn btn-danger btn-sm w-100px text-white"
                          data-toggle="modal" data-target="#CancelFreeze">Cancel</button>
                      </td>
                      {/* <!-- ---------pop up---------- --> */}
                      <div className="modal fade commonYellowModal" id="CancelFreeze">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h4 className="modal-title">Cancel Freeze</h4>
                              <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                            </div>
                            <div className="modal-body px-4">
                              <div className="row">
                                <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
                                  <div className="form-group position-relative">
                                    <label>Returning Date</label>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                      <DatePicker
                                        variant='inline'
                                        InputProps={{
                                          disableUnderline: true,
                                        }}
                                        autoOk
                                        minDate={new Date()}
                                        className="form-control mx-sm-2 inlineFormInputs"
                                        invalidDateMessage=''
                                        minDateMessage=''
                                        format="dd/MM/yyyy"
                                        value={this.state.returningDate}
                                        onChange={(e) => this.setState(validator(e, 'returningDate', 'date', []))}
                                      />
                                    </MuiPickersUtilsProvider>
                                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group position-relative">
                                    <label>Reason</label>
                                    <textarea type="text" autoComplete="off" rows="5" className="form-control"
                                      value={this.state.reason} onChange={(e) => this.setState({ reason: e.target.value })}
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-end">
                                  <button type="button" className="btn btn-success px-4" onClick={() => this.handleSubmit(member)}>{t('Submit')}</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <!-- ------------pop up End----------- --> */}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ freeze: { freezeHistory }, currency: { defaultCurrency } }) {
  return {
    freezeHistory: freezeHistory && freezeHistory.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate)),
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(CancelFreeze))