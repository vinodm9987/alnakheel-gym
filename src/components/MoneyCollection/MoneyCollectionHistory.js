import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Pagination from '../Layout/Pagination'
import { dateToDDMMYYYY, getPageWiseData } from '../../utils/apis/helpers'
import { getAllBranch } from '../../actions/branch.action'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { getMoneyCollectionHistory } from '../../actions/moneyCollection.action'
import { Link } from 'react-router-dom'

class MoneyCollectionHistory extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      branch: ''
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getMoneyCollectionHistory({ branch: this.state.branch, date: this.state.date }))
  }

  handleFilter(branch, date) {
    this.setState({ branch, date }, () => {
      this.props.dispatch(getMoneyCollectionHistory({ branch: this.state.branch, date: this.state.date }))
    })
  }

  render() {
    const { t } = this.props
    const { branch, date } = this.state
    return (
      <div className={this.state.url ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="d-flex flex-wrap justify-content-between mt-1 px-2">
          <h5 className="font-weight-bold pt-3">{t('Collection History')}</h5>
          <div className="form row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-wrap align-items-center justify-content-end pageHeadRight">
              {/* Call Me When You Do This Area */}
              <div className="position-relative w-200px mw-100 pr-15px mt-1">
                <label className="mx-sm-2 pb-1">{t('Select Date')}</label>
                <div className="form-group mx-sm-2 position-relative d-flex mb-2">
                  <span onClick={() => this.handleFilter(branch, '')} className="btn btn-warning btn-sm text-white all-btn">{t('ALL')}</span>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      variant='inline'
                      InputProps={{
                        disableUnderline: true,
                      }}
                      autoOk
                      className="form-control mx-sm-2 inlineFormInputs"
                      maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                      invalidDateMessage=''
                      minDateMessage=''
                      format="dd/MM/yyyy"
                      value={this.state.date}
                      onChange={(e) => this.handleFilter(branch, e)}
                    />
                  </MuiPickersUtilsProvider>
                  <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                </div>
              </div>
              {/* Call Me When You Do This Area */}
              <div className="position-relative mw-100">
                <label className="mx-sm-2 d-block">{t('Select Branch')}</label>
                <span className="position-relative mw-100">
                  <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.handleFilter(e.target.value, date)}>
                    <option value="">{t('Select Branch')}</option>
                    {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3" style={{ top: '0', left: '0' }}>
                    <span className="iconv1 iconv1-fill-navigation"></span>
                    <span className="iconv1 iconv1-arrow-down"></span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="borderRoundSeperateTable tdGray">
            <thead>
              <tr>
                <th>{t('Collection Date')}</th>
                <th>{t('Branch')}</th>
                <th>{t('Total Amount')}</th>
                <th>{t('Collected Amount')}</th>
                <th>{t('Remaining Amount')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.props.moneyCollectionHistory && getPageWiseData(this.state.pageNumber, this.props.moneyCollectionHistory, this.state.displayNum).map((collection, i) => {
                const remainAmount = (collection.original.totalAmount - collection.remain.totalAmount)
                return (
                  <tr key={i}>
                    <td>{dateToDDMMYYYY(collection.date)}</td>
                    <td>{collection.branch.branchName}</td>
                    <td>{this.props.defaultCurrency} {collection.original.totalAmount.toFixed(3)}</td>
                    <td>{this.props.defaultCurrency} {remainAmount.toFixed(3)}</td>
                    <td>{this.props.defaultCurrency} {collection.remain.totalAmount.toFixed(3)}</td>
                    <td className="text-center">
                      <Link type="button" className="btn btn-primary btn-sm w-100px rounded-50px" to={`/money-collection-details/${collection._id}`}>{t('Details')}</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.moneyCollectionHistory &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.moneyCollectionHistory}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/* Pagination End // displayNumber={5} */}
      </div>
    )
  }
}

function mapStateToProps({ moneyCollection: { moneyCollectionHistory }, branch: { activeResponse }, currency: { defaultCurrency } }) {
  return {
    moneyCollectionHistory,
    activeResponse,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(MoneyCollectionHistory))