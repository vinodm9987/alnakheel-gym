import React, { Component } from 'react'
import { validator } from '../../utils/apis/helpers'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'
import Calendar from '../Layout/Calendar'
import { processBackup } from '../../actions/backupRestore.action'

class CreateBackup extends Component {

  constructor(props) {
    super(props)
    this.default = {
      backupType: 'Manual',
      backupName: '',
      backupNameE: '',
      backupDestination: '',
      backupDestinationE: '',
      url: this.props.match.url,
    }
    this.state = this.default
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
    const { backupType, backupName, backupDestination } = this.state
    if (backupType === 'Manual') {
      if (backupName && backupDestination) {
        const backupInfo = {
          backupName,
          backupDestination
        }
        this.props.dispatch(processBackup(backupInfo))
      } else {
        if (!backupName) this.setState({ backupNameE: t('Enter backup name') })
        if (!backupDestination) this.setState({ backupDestinationE: t('Enter backup destination') })
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  selectDestination(e) {
    if (e.target.files && e.target.files[0]) {
      console.log("CreateBackup -> selectDestination -> e.target.files[0]", e.target.files[0])
      document.getElementById(e.target.id).value = ''
    }
  }

  render() {
    const { t } = this.props
    const { backupType, backupName, backupDestination } = this.state
    return (
      <div className={this.state.url === '/backup' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <div className="d-flex w-100 my-3">
          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
            <input type="radio" className="custom-control-input" id="Manual" name="ManualOrAutomatic" checked={backupType === 'Manual'}
              onChange={() => this.setState({ ...this.default, ...{ backupType: 'Manual' } })}
            />
            <label className="custom-control-label" htmlFor="Manual">Manual</label>
          </div>
          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
            <input type="radio" className="custom-control-input" id="Automatic" name="ManualOrAutomatic" checked={backupType === 'Automatic'}
              onChange={() => this.setState({ ...this.default, ...{ backupType: 'Automatic' } })}
            />
            <label className="custom-control-label" htmlFor="Automatic">Automatic</label>
          </div>
        </div>
        {backupType === 'Manual' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group position-relative">
              <label htmlFor="BackupName">Backup Name</label>
              <input type="text" autoComplete="off" className={this.state.backupNameE ? "form-control bg-white FormInputsError" : "form-control bg-white"} id="BackupName"
                value={backupName} onChange={(e) => this.setState(validator(e, 'backupName', 'text', [t('Enter backup name')]))}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.backupNameE}</small>
              </div>
            </div>
          </div>
        }
        {backupType === 'Manual' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group position-relative">
              <label htmlFor="BackupDestination">Backup Destination</label>
              {/* <div className="custom-file-gym form-control">
                <input type="file" className="custom-file-input-gym" id="customFile" webkitdirectory="" directory=""
                  onChange={(e) => this.selectDestination(e)}
                />
                <label className="rightBrowserLabel" htmlFor="customFile">Upload Image</label>
              </div> */}
              <input type="text" autoComplete="off" className={this.state.backupDestinationE ? "form-control bg-white FormInputsError" : "form-control bg-white"} id="BackupDestination"
                value={backupDestination} onChange={(e) => this.setState(validator(e, 'backupDestination', 'text', [t('Enter backup destination')]))}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.backupDestinationE}</small>
              </div>
            </div>
          </div>
        }
        {backupType === 'Manual' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="justify-content-sm-end d-flex pt-3">
              <button disabled={disableSubmit(this.props.loggedUser, 'Backup and Restore', 'Backup')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>
                <span className="iconv1 iconv1-sync"></span> <span className="px-1">Run Backup</span>
              </button>
              <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>Cancel</button>
            </div>
          </div>
        }
        {/* <div className="p-3">
          <div className="my-4">
            <h6 className="font-weight-bold mb-3">Backup in progres. please wait..</h6>
            <div className="d-flex bg-light p-2">
              <div className="align-self-center m-1">Here comes the progress bar</div>
              <h6 className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center
                                                     justify-content-center m-2 text-white cursor-pointer" data-toggle="modal" data-target="#backupStopModal">
                <span className="iconv1 iconv1-close"></span>
              </h6>
            </div>
          </div>
          <div className="modal" id="backupStopModal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 bg-white">
                <div className="modal-body text-center p-5">
                  <h6 className=""><b>Do you want to close backup ?</b></h6>
                  <button type="button" className="btn btn-success px-4 py-1 m-1">Yes</button>
                  <button type="button" className="btn btn-danger px-4 py-1 m-1">No</button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* ----------------------Tushar this for Automatic when selected----------------------- */}

        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group position-relative">
              <label htmlFor="BackupName">Backup Name</label>
              <input disabled="" type="number" autoComplete="off" className="form-control bg-white" id="BackupName" />
            </div>
          </div>
        }
        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group position-relative">
              <label htmlFor="BackupDestination">Backup Destination</label>
              <div className="custom-file-gym form-control">
                <input type="file" className="custom-file-input-gym" id="customFile" />
                <label className="rightBrowserLabel" htmlFor="customFile">Upload Image</label>
              </div>
            </div>
          </div>
        }
        {/* ------------This is for Monthly Backup------------- */}
        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3">
            <div className="form-group position-relative">
              <label htmlFor="Type">Type</label>
              <select className="form-control bg-white" id="Type">
                <option value="" hidden="">Monthly</option>
              </select>
              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger errorMessage"></small>
              </div>
            </div>
          </div>
        }
        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-4 py-4">
            <Calendar />
          </div>
        }
        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-2">
            <div className="form-group position-relative">
              <label htmlFor="BackupTime">Backup Start Time</label>
              <input disabled="" type="number" autoComplete="off" className="form-control bg-white" id="BackupTime" />
              <span className="iconv1 iconv1-clock timeBoxIcon"></span>
            </div>
          </div>
        }
        {/* ------------This is for Monthly Backup End------------- */}

        {/* ------------This is for Weekly Backup------------- */}
        {backupType === 'Automatic' &&
          <div className="row px-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3">
              <div className="form-group position-relative">
                <label htmlFor="Type">Type</label>
                <select className="form-control bg-white" id="Type">
                  <option value="" hidden="">Daily/Weekly</option>
                </select>
                <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                <div className="errorMessageWrapper">
                  <small className="text-danger errorMessage"></small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-2">
              <div className="form-group position-relative">
                <label htmlFor="FromDate">From Date</label>
                <input disabled="" type="number" autoComplete="off" className="form-control bg-white" id="FromDate" />
                <span className="iconv1 iconv1-calendar dateBoxIcon"></span>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-2">
              <div className="form-group position-relative">
                <label htmlFor="ToDate">To Date</label>
                <input disabled="" type="number" autoComplete="off" className="form-control bg-white" id="ToDate" />
                <span className="iconv1 iconv1-calendar dateBoxIcon"></span>
              </div>
            </div>
          </div>
        }
        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 py-4">
            <label htmlFor="DailyWeekly">Daily/Weekly</label>
            <div className="d-flex flex-wrap">
              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="All" name="All" />
                <label className="custom-control-label rounded" htmlFor="All">All</label></div>

              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="Monday" name="Monday" />
                <label className="custom-control-label rounded" htmlFor="Monday">Monday</label></div>

              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="Tuseday" name="Tuseday" />
                <label className="custom-control-label rounded" htmlFor="Tuseday">Tuseday</label></div>

              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="Wednesday" name="Wednesday" />
                <label className="custom-control-label rounded" htmlFor="Wednesday">Wednesday</label></div>

              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="Thursday" name="Thursday" />
                <label className="custom-control-label rounded" htmlFor="Thursday">Thursday</label></div>

              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="Friday" name="Friday" />
                <label className="custom-control-label rounded" htmlFor="Friday">Friday</label></div>

              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="Saturday" name="Saturday" />
                <label className="custom-control-label rounded" htmlFor="Saturday">Saturday</label></div>

              <div className="custom-control custom-checkbox roundedBlueRadioCheck m-2">
                <input type="checkbox" className="custom-control-input" id="Sunday" name="Sunday" />
                <label className="custom-control-label rounded" htmlFor="Sunday">Sunday</label></div>
            </div>
          </div>
        }
        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-2">
            <div className="form-group position-relative">
              <label htmlFor="BackupTime">Backup Start Time</label>
              <input disabled="" type="number" autoComplete="off" className="form-control bg-white" id="BackupTime" />
              <span className="iconv1 iconv1-clock timeBoxIcon"></span>
            </div>
          </div>
        }
        {/* ------------This is for Weekly Backup End------------- */}


        {backupType === 'Automatic' &&
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pb-4">
            <div className="justify-content-sm-end d-flex pt-3">
              <button type="button" className="btn btn-success mx-1 px-4">Save</button>
              <button type="button" className="btn btn-danger mx-1 px-4">Cancel</button>
            </div>
          </div>
        }
        {/* ----------Autobackup Details Table---------------- */}
        {/* <h4 className="font-weight-bold mb-3">Automatic Backup Details</h4>
        <nav className="commonNavForTab mb-5">
          <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
            <a className="nav-item nav-link active" role="tab" data-toggle="tab" href="#WDbackup">Create Backup</a>
            <a className="nav-item nav-link" role="tab" data-toggle="tab" href="#MonthBackup">Backup History</a>
          </div>
        </nav> */}
        {/* <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" id="WDbackup" role="tabpanel">
            <div className="table-responsive BckupTable">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Backup Name</th>
                    <th>Days</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Backup Start Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">Alnakheel MAnual backup</div>
                    </td>
                    <td><div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">Tuesday, Friday</div></td>
                    <td>10/02/2020</td>
                    <td>10/02/2020</td>
                    <td>10:00 AM</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                          <span className="iconv1 iconv1-edit"></span></span>
                        <a type="button" className="btn btn-primary btn-sm w-100px text-white rounded-50px" data-toggle="modal" data-target="#JobDetails">Details</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="tab-pane fade" id="MonthBackup" role="tabpanel">
            <div className="table-responsive BckupTable">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Backup Name</th>
                    <th>Monthly</th>
                    <th>Backup Start Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">Alnakheel MAnual backup</div>
                    </td>
                    <td><div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">Every Month at, 15</div></td>
                    <td>10:00 AM</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                          <span className="iconv1 iconv1-edit"></span></span>
                        <a type="button" className="btn btn-primary btn-sm w-100px text-white rounded-50px" data-toggle="modal" data-target="#JobDetails">Details</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
        {/* ------------Pop up details------------ */}

        {/* <div className="modal fade commonYellowModal" id="JobDetails">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Job Details</h4>
                  <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                </div>
                <div className="modal-body px-4">
                  <div className="d-flex flex-wrap justify-content-between p-1">
                    <div className="m-1">
                      <h6 className="font-weight-bold mb-1">Backup Name</h6>
                      <h6 className="">Alnakheel Manual Backup</h6>
                    </div>
                    <div className="m-1">
                      <h6 className="font-weight-bold mb-1">Created On</h6>
                      <h6 className="">02/20/2020, 10:20 AM</h6>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap justify-content-start p-1">
                    <div className="m-1 widBox">
                      <h6 className="font-weight-bold mb-1">Type</h6>
                      <h6 className="">Daily/Weekly</h6>
                    </div>
                    <div className="m-1 widBox">
                      <h6 className="font-weight-bold mb-1">From Date</h6>
                      <h6 className="">02/20/2020</h6>
                    </div>
                    <div className="m-1 widBox">
                      <h6 className="font-weight-bold mb-1">To Date</h6>
                      <h6 className="">02/20/2020</h6>
                    </div>
                    <div className="m-1 widBox">
                      <h6 className="font-weight-bold mb-1">Backup Start Time</h6>
                      <h6 className="">11:15 AM</h6>
                    </div>
                    <div className="m-1 widBox">
                      <h6 className="font-weight-bold mb-1">Days</h6>
                      <h6 className="">Monday, Tuesday</h6>
                    </div>
                    <div className="m-1 widBox">
                      <h6 className="font-weight-bold mb-1">Destination</h6>
                      <h6 className="">C:\program\backup</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        {/* ------------Pop up details Ends------------ */}
        {/* </div> */}
        {/* ----------------------Tushar this for Automatic when selected Ends----------------------- */}
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors }) {
  return {
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateBackup))