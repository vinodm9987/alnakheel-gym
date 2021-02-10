import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getAllManualBackup } from '../../actions/backupRestore.action'
import { dateToDDMMYYYY, dateToHHMM, getPageWiseData } from '../../utils/apis/helpers'
import Pagination from '../Layout/Pagination'

class BackupHistory extends Component {

  constructor(props) {
    super(props)
    this.default = {
      backupType: 'Manual',
      url: this.props.match.url,
    }
    this.state = this.default
    this.props.dispatch(getAllManualBackup())
  }

  handleFilter(backupType) {
    this.setState({ backupType }, () => {
      this.state.backupType === 'Manual' && this.props.dispatch(getAllManualBackup())
    })
  }

  render() {
    const { t } = this.props
    const { backupType } = this.state
    return (
      <div className={this.state.url === '/backup/backup-history' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        {/* <div className="d-flex w-100 my-3">
          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
            <input type="radio" className="custom-control-input" id="ManualHistory" name="ManualOrAutomaticHistory"
              checked={backupType === "Manual"} onChange={() => this.handleFilter('Manual')}
            />
            <label className="custom-control-label" htmlFor="ManualHistory">{t('Manual')}</label>
          </div>
          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
            <input type="radio" className="custom-control-input" id="AutomaticHistory" name="ManualOrAutomaticHistory"
              checked={backupType === "Automatic"} onChange={() => this.handleFilter('Automatic')}
            />
            <label className="custom-control-label" htmlFor="AutomaticHistory">Automatic</label>
          </div>
        </div> */}
        {/* --------------Manual backup table history------------ */}
        {backupType === "Manual" &&
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray">
              <thead>
                <tr>
                  <th>{t('Backup Name')}</th>
                  <th>{t('Date & Time')}</th>
                  <th>{t('Destination')}</th>
                  <th>{t('Status')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.manualBackups && getPageWiseData(this.state.pageNumber, this.props.manualBackups, this.state.displayNum).map((manualBackup, i) => {
                  const { backupName, dateOfBackup, timeOfBackup, backupDestination, status } = manualBackup
                  return (
                    <tr key={i}>
                      <td>
                        <div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">{backupName}</div>
                      </td>
                      <td><div className="m-0 mxw-85px mnw-85px whiteSpaceNormal">{dateToDDMMYYYY(dateOfBackup)}, {dateToHHMM(timeOfBackup)}</div></td>
                      <td>
                        <div className="m-0 mxw-150px mnw-100px whiteSpaceNormal">{backupDestination}</div>
                      </td>
                      <td className={status === 'Success' ? "text-primary" : "text-danger"}>{status}</td>
                      {/* <td className="text-danger">{t('Failed')}</td> */}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {/*Pagination Start*/}
            {this.props.manualBackups &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={this.props.manualBackups}
                displayNumber={(displayNum) => this.setState({ displayNum })}
                displayNum={this.state.displayNum ? this.state.displayNum : 5}
              />
            }
            {/* Pagination End // displayNumber={5} */}
          </div>
        }
        {/* --------------Manual backup table history Ends------------ */}

        {/* --------------Automatic backup table history------------ */}
        {backupType === "Automatic" &&
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray">
              <thead>
                <tr>
                  <th>{t('Backup Name')}</th>
                  <th>{t('Type')}</th>
                  <th>{t('Days')}</th>
                  <th>{t('Elapse Time')}</th>
                  <th>{t('Created On')}</th>
                  <th>{t('Size')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">Alnakheel MAnual backup</div>
                  </td>
                  <td>Daily/Weekly</td>
                  <td><div className="m-0 mxw-150px mnw-100px whiteSpaceNormal">Tuesday, Monday</div></td>
                  <td>3:25 Mins</td>
                  <td><div className="m-0 mxw-85px mnw-85px whiteSpaceNormal">10/02/2020, 10:05 AM</div></td>
                  <td>619 KB</td>
                  <td><a href='/#' type="button" className="btn btn-primary btn-sm w-100px text-white rounded-50px" data-toggle="modal" data-target="#JobDetailsAutomatic">{t('Details')}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
        {/* ------------Pop up Automatic table details------------ */}

        <div className="modal fade commonYellowModal" id="JobDetailsAutomatic">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Job Details')}</h4>
                <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
              </div>
              <div className="modal-body px-4">
                <div className="d-flex flex-wrap justify-content-between p-1">
                  <div className="m-1">
                    <h6 className="font-weight-bold mb-1">{t('Backup Name')}</h6>
                    <h6 className="">Alnakheel Manual Backup</h6>
                  </div>
                  <div className="m-1">
                    <h6 className="font-weight-bold mb-1">{t('Created On')}</h6>
                    <h6 className="">02/20/2020, 10:20 AM</h6>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-start p-1">
                  <div className="m-1 widBox">
                    <h6 className="font-weight-bold mb-1">{t('Type')}</h6>
                    <h6 className="">Daily/Weekly</h6>
                  </div>
                  <div className="m-1 widBox">
                    <h6 className="font-weight-bold mb-1">{t('From Date')}</h6>
                    <h6 className="">02/20/2020</h6>
                  </div>
                  <div className="m-1 widBox">
                    <h6 className="font-weight-bold mb-1">{t('To Date')}</h6>
                    <h6 className="">02/20/2020</h6>
                  </div>
                  <div className="m-1 widBox">
                    <h6 className="font-weight-bold mb-1">{t('Backup Start Time')}</h6>
                    <h6 className="">11:15 AM</h6>
                  </div>
                  <div className="m-1 widBox">
                    <h6 className="font-weight-bold mb-1">{t('Days')}</h6>
                    <h6 className="">Monday, Tuesday</h6>
                  </div>
                  <div className="m-1 widBox">
                    <h6 className="font-weight-bold mb-1">{t('Size')}</h6>
                    <h6 className="">613 KB</h6>
                  </div>
                  <div className="m-1 widBox">
                    <h6 className="font-weight-bold mb-1">{t('Destination')}</h6>
                    <h6 className="">C:\program\backup</h6>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ------------Pop up Automatic table details Ends------------ */}

        {/* --------------Automatic backup table history Ends------------ */}
      </div>
    )
  }
}

function mapStateToProps({ backupRestore: { manualBackups } }) {
  return {
    manualBackups
  }
}

export default withTranslation()(connect(mapStateToProps)(BackupHistory))