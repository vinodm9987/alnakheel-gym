import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getAllBranch } from '../../../actions/branch.action'
import { getAllClassesByBranch } from '../../../actions/classes.action'
import { dateToDDMMYYYY, dateToHHMM, validator } from '../../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';

class AdminClasses extends Component {

  constructor(props) {
    super(props)
    this.state = {
      branch: '',
      date: '',
    }
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date }))
  }

  selectBranch(e) {
    this.setState({ branch: e.target.value }, () => {
      this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date }))
    })
  }

  selectDate(e) {
    this.setState(validator(e, 'date', 'date', []), () => {
      this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date }))
    })
  }

  resetDate() {
    this.setState({ date: '' }, () => {
      this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date }))
    })
  }

  render() {
    const { t } = this.props
    const { branch } = this.state
    return (
      <div className="mainPage p-3 AdminClasses">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 pageHead">
                <h1>{t('Classes')}</h1>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8 d-flex flex-wrap align-items-center justify-content-end pageHeadRight">
                <span onClick={() => this.resetDate()} className="btn btn-warning btn-sm text-white my-1">{t('ALL')}</span>
                {/* Call Me When You Do This Area */}
                <div className="position-relative w-200px mw-100 pr-15px">
                  <div className="form-group m-2 position-relative">
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
                        onChange={(e) => this.selectDate(e)}
                      />
                    </MuiPickersUtilsProvider>
                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                  </div>
                </div>
                {/* Call Me When You Do This Area */}
                <span className="position-relative mw-100">
                  <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.selectBranch(e)}>
                    <option value="">{t('All Branch')}</option>
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
              <div className="col-12 pageHeadDown">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row mx-0 w-100">
              {/* loop Here */}
              {this.props.classesByBranch && this.props.classesByBranch.map((classes, i) => {
                const { image, className, description, amount, startTime, endTime, startDate, endDate, occupied, capacity, color, _id } = classes
                return (
                  <div key={i} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex pt-4 px-2">
                    <Link to={`/classes-details/${_id}`} className="card h-100 w-100 overflow-hidden border-white linkHoverDecLess" style={{ borderRadius: '10px' }}>
                      <img alt='' src={`/${image.path}`} className="w-100" />
                      <div className="text-white" style={{ backgroundColor: color }}>
                        <div className="cardBodyClass">
                          <h6 className="mt-3 mb-0 px-3 SegoeSemiBold">{className}</h6>
                          <div className="d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap">
                            <p className="w-100 m-0 px-3 py-1 ellipsis">
                              <small>{description}</small>
                            </p>
                            <h2 className="text-white m-0 px-3 py-1">
                              <span>{this.props.defaultCurrency}</span>
                              <span className="pl-1"></span>
                              <span className="SegoeSemiBold">{amount.toFixed(3)}</span>
                            </h2>
                          </div>
                          <div className="d-flex flex-wrap justify-content-between">
                            <span className="px-3 pb-2"><span className="iconv1 iconv1-clock px-1"></span><span>{`${dateToHHMM(startTime)} - ${dateToHHMM(endTime)}`}</span></span>
                            <span className="px-3 pb-2"><span className="iconv1 iconv1-calander px-1"></span><span>{`${dateToDDMMYYYY(startDate)} - ${dateToDDMMYYYY(endDate)}`}</span></span>
                          </div>
                          <div className="border-top w-100 border-white"></div>
                        </div>
                        <div className="cardFootClass d-flex flex-wrap justify-content-end align-items-center">
                          <div className="d-flex align-items-center mx-3 my-3">
                            <h1 className="iconv1 iconv1-capacity m-0"> </h1>
                            <div>
                              <small>{t('Total Bookings')}</small>
                              <p className="SegoeBold m-0 dirltrtar">{`${occupied ? occupied : 0} / ${capacity}`}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
              {/* loop Here End*/}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, branch: { activeResponse }, classes: { classesByBranch }, currency: { defaultCurrency } }) {
  return {
    loggedUser,
    activeResponse,
    classesByBranch,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(AdminClasses))