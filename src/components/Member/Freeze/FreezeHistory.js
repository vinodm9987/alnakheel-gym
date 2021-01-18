import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFreezeHistory } from '../../../actions/freeze.action';
import { dateToDDMMYYYY, getPageWiseData, validator } from '../../../utils/apis/helpers';
import Pagination from '../../Layout/Pagination';

class FreezeHistory extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      search: '',
      date: new Date(),
    }
    this.state = this.default
    this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date, typeOfFreeze: 'Froze' }))
  }

  handleDate(e) {
    this.setState({ ...validator(e, 'date', 'date', []) }, () => {
      this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date, typeOfFreeze: 'Froze' }))
    })
  }

  resetDate() {
    this.setState({ date: '' }, () => {
      this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date, typeOfFreeze: 'Froze' }))
    })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getFreezeHistory)({ search: this.state.search, date: this.state.date, typeOfFreeze: 'Froze' })
    })
  }

  render() {
    const { t } = this.props
    return (
      <div className={this.state.url === '/freeze-members/freeze-history' ? "tab-pane fade show active" : "tab-pane fade"} id="menu3" role="tabpanel">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup flex-nowrap">
                      <span onClick={() => this.resetDate()} className="btn btn-warning btn-sm text-white my-1">{t('ALL')}</span>
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
                {this.props.freezeHistory && getPageWiseData(this.state.pageNumber, this.props.freezeHistory, this.state.displayNum).map((freeze, i) => {
                  const { fromDate, toDate, reactivationDate, memberId: { _id: member, credentialId: { userName, avatar }, memberId }, reason, noOfDays, totalAmount } = freeze
                  return (
                    <tr key={i}>
                      <td>
                        <div className="d-flex">
                          <img alt='' src={`/${avatar.path}`} className="mx-1 rounded-circle w-50px h-50px" />
                          <div className="mx-1">
                            <h5 className="m-0">{userName}</h5>
                            <span className="text-primary d-flex"><span>{t('ID')}</span><span className="mx-1">:</span><span> {memberId}</span></span>
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
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.freezeHistory &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.freezeHistory}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/*Pagination End*/}
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

export default withTranslation()(connect(mapStateToProps)(FreezeHistory))