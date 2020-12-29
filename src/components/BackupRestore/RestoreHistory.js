import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getAllRestore } from '../../actions/backupRestore.action'
import { dateToDDMMYYYY, dateToHHMM, getPageWiseData } from '../../utils/apis/helpers'
import Pagination from '../Layout/Pagination'

class RestoreHistory extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
    }
    this.state = this.default
    this.props.dispatch(getAllRestore())
  }

  render() {
    const { t } = this.props
    return (
      <div className={this.state.url === '/restore/restore-history' ? "tab-pane fade show active mt-4" : "tab-pane fade mt-4"} id="menu2" role="tabpanel">
        {/* --------------Manual backup table history------------ */}
        <div className="table-responsive">
          <table className="borderRoundSeperateTable tdGray">
            <thead>
              <tr>
                <th>Restore Name</th>
                <th>Date & Time</th>
                <th>Source</th>
                <th>{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.restores && getPageWiseData(this.state.pageNumber, this.props.restores, this.state.displayNum).map((manualRestore, i) => {
                const { restoreName, dateOfRestore, timeOfRestore, restoreDestination, status } = manualRestore
                return (
                  <tr key={i}>
                    <td>
                      <div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">{restoreName}</div>
                    </td>
                    <td><div className="m-0 mxw-85px mnw-85px whiteSpaceNormal">{dateToDDMMYYYY(dateOfRestore)}, {dateToHHMM(timeOfRestore)}</div></td>
                    <td>
                      <div className="m-0 mxw-150px mnw-100px whiteSpaceNormal">{restoreDestination}</div>
                    </td>
                    <td className={status === 'Success' ? "text-primary" : "text-danger"}>{status}</td>
                    {/* <td className="text-danger">Failed</td> */}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/*Pagination Start*/}
          {this.props.restores &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.restores}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/* Pagination End // displayNumber={5} */}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ backupRestore: { restores } }) {
  return {
    restores
  }
}

export default withTranslation()(connect(mapStateToProps)(RestoreHistory))