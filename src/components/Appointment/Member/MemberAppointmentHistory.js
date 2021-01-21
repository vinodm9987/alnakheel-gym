import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getMemberAppointmentHistory } from '../../../actions/appointment.action';
import { dateToHHMM, dateToDDMMYYYY, getPageWiseData, setTime } from '../../../utils/apis/helpers';
import Pagination from '../../Layout/Pagination';

class MemberAppointmentHistory extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      date: new Date(),
      memberId: '',
    }
    this.state = this.default
  }

  componentDidMount() {
    if (this.props.loggedUser && this.props.loggedUser.userId) {
      this.setState({ memberId: this.props.loggedUser.userId._id }, () => {
        this.props.dispatch(getMemberAppointmentHistory({ date: this.state.date, memberId: this.state.memberId }));
      })
    }
  }

  handleFilter(date) {
    this.setState({ date }, () => {
      this.props.dispatch(getMemberAppointmentHistory({ date, memberId: this.state.memberId }))
    });
  }

  render() {
    const { t } = this.props
    const { date } = this.state
    return (
      <div className={this.state.url === '/appointment/appointment-history' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <form className="form-inline row">
            <div className="col-12">
              <div className="row d-block d-sm-flex justify-content-between pt-5">
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0 subHead">
                  {/* <h4 className="mb-3 SegoeSemiBold">Head</h4> */}
                </div>
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0 d-flex flex-wrap">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <span onClick={() => this.handleFilter('')} className="btn btn-warning btn-sm text-white all-btn">{t('ALL')}</span>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{ disableUnderline: true }}
                          autoOk
                          invalidDateMessage=''
                          className={"form-control mx-sm-2 inlineFormInputs"}
                          minDateMessage=''
                          format="dd/MM/yyyy"
                          value={date}
                          onChange={(e) => this.handleFilter(e)}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    </div>
                  </div>
                  {/* <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">From Time</label>
                      <input className="form-control mx-sm-2 inlineFormInputs" type="text" autoComplete="off" />
                    </div>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">To Time</label>
                      <input className="form-control mx-sm-2 inlineFormInputs" type="text" autoComplete="off" />
                    </div>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" />
                      <span className="iconv1 iconv1-search searchBoxIcon"></span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-12">
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray">
              <thead>
                <tr>
                  <th>{t('Date')}</th>
                  <th>{t('From Time')}</th>
                  <th>{t('To Time')}</th>
                  <th>{t('Trainer')}</th>
                  <th>{t('Status')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.memberAppointmentHistory && getPageWiseData(this.state.pageNumber, this.props.memberAppointmentHistory, this.state.displayNum).map((appointment, i) => {
                  const { fromTime, toTime, date,
                    trainer, status } = appointment
                  let resultedStatus = ''
                  if (status) resultedStatus = t(status)
                  else if (setTime(date) > setTime(new Date())) resultedStatus = t('Yet to Come')
                  else if (setTime(date) === setTime(new Date()) && new Date(toTime).setFullYear(2020, 11, 9) >= new Date().setFullYear(2020, 11, 9)) resultedStatus = t('Yet to Come')
                  else resultedStatus = t('Missed')
                  return (
                    <tr key={i}>
                      <td><span className="d-inline-block dirltrtar">{dateToDDMMYYYY(date)}</span></td>
                      <td><span className="d-inline-block dirltrtar">{dateToHHMM(fromTime)}</span></td>
                      <td><span className="d-inline-block dirltrtar">{dateToHHMM(toTime)}</span></td>
                      <td>
                        {trainer
                          ? <div className="d-flex align-items-center">
                            <img src={`/${trainer.credentialId.avatar.path}`} alt='' className="mx-1 rounded-circle w-50px h-50px" />
                            <div className="mx-1">
                              <h5 className="m-0 SegoeSemiBold">{trainer.credentialId.userName}</h5>
                            </div>
                          </div>
                          : <span>NA</span>
                        }
                      </td>
                      <td>
                        <span
                          className={resultedStatus !== 'Missed' ? "text-success" : "text-danger"}>
                          {resultedStatus}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.memberAppointmentHistory &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.memberAppointmentHistory}
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

function mapStateToProps({ auth: { loggedUser }, branch, appointment: { memberAppointmentHistory } }) {
  return {
    branch, memberAppointmentHistory, loggedUser
  }
}

export default withTranslation()(connect(mapStateToProps)(MemberAppointmentHistory))