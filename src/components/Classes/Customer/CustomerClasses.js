import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getAllClassesByBranch } from '../../../actions/classes.action'
import { dateToDDMMYYYY, dateToHHMM, validator } from '../../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
// import $ from 'jquery'
// import { findDOMNode } from 'react-dom';

class CustomerClasses extends Component {

  constructor(props) {
    super(props)
    this.state = {
      branch: '',
      date: '',
      mode: 'Online',
      amount: '',
      classId: '',
    }
  }

  componentDidMount() {
    const branch = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch
    this.setState({ branch }, () => {
      this.state.branch && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date }))
    })
  }

  selectDate(e) {
    this.setState(validator(e, 'date', 'date', []), () => {
      this.state.branch && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date }))
    })
  }

  resetDate() {
    this.setState({ date: '' }, () => {
      this.state.branch && this.props.dispatch(getAllClassesByBranch({ branch: this.state.branch, date: this.state.date }))
    })
  }

  handleSubmit(e, amount, classId) {
    e.preventDefault()
    // const el = findDOMNode(this.refs.paymethodclose);
    const { mode } = this.state
    const member = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    const bookClassInfo = {
      member,
      paymentStatus: 'Paid',
      mode,
      amount,
      classId
    }
    console.log("handleSubmit -> bookClassInfo", bookClassInfo)
    // this.props.dispatch(purchaseClassByMember(bookClassInfo))
    // $(el).click();
  }

  // onClickBookClass(e, amount, classId) {
  //   e.preventDefault()
  //   this.setState({
  //     amount,
  //     classId
  //   })
  // }

  render() {
    const { t } = this.props
    // const { mode } = this.state
    return (
      <div className="mainPage p-3 CustomerClasses">
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
              </div>
              <div className="col-12 pageHeadDown">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row mx-0 w-100">
              {this.props.classesByBranch && this.props.classesByBranch.map((classes, i) => {
                const { image, className, description, amount, startTime, endTime, startDate, endDate, occupied, capacity, color, _id, vat: { taxPercent } } = classes
                let totalAmount = amount + amount * taxPercent / 100
                return (
                  <div key={i} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex pt-4">
                    <Link to={`/customer-classes-details/${_id}`} className="card h-100 w-100 overflow-hidden border-white linkHoverDecLess" style={{ borderRadius: '10px' }}>
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
                              <span className="SegoeSemiBold">{totalAmount.toFixed(3)}</span>
                            </h2>
                          </div>
                          <div className="d-flex flex-wrap justify-content-between">
                            <span className="px-3 pb-2 dirltrtar"><span className="iconv1 iconv1-clock px-1"></span><span className="d-inline-block">{`${dateToHHMM(startTime)} - ${dateToHHMM(endTime)}`}</span></span>
                            <span className="w-100"></span>
                            <span className="px-3 pb-2"><span className="iconv1 iconv1-calander px-1"></span><span>{`${dateToDDMMYYYY(startDate)} - ${dateToDDMMYYYY(endDate)}`}</span></span>
                          </div>
                          <div className="border-top w-100 border-white"></div>
                        </div>
                        <div className="cardFootClass d-flex flex-wrap justify-content-between align-items-center">
                          <button disabled={(capacity - (occupied ? occupied : 0)) === 0} type="button" onClick={(e) => this.handleSubmit(e, totalAmount, _id)} className=" btn btn-light ml-3 mr-2 my-3">{t('Book a class')}</button>
                          <div className="d-flex align-items-center mx-3 my-3">
                            <h1 className="iconv1 iconv1-capacity m-0 font-weight-bold"> </h1>
                            <div>
                              <small>{t('Remaining Seats')}</small>
                              <p className="SegoeBold m-0">{`${capacity - (occupied ? occupied : 0)}/${capacity}`}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* <div className="modal fade commonYellowModal" id="paymethod">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Payment Method')}</h4>
                <button type="button" className="close" ref="paymethodclose" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
              </div>
              <div className="modal-body px-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-center">
                      <div className="px-3">
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                          <input type="radio" className="custom-control-input" id="payOnline" name="paymethod"
                            checked={mode === 'Online'} onChange={() => this.setState({ mode: 'Online' })} />
                          <label className="custom-control-label" htmlFor="payOnline">{t('Pay Online')}</label>
                        </div>
                      </div>
                      <div className="px-3">
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                          <input type="radio" className="custom-control-input" id="payatGym" name="paymethod"
                            checked={mode === 'Pay at Gym'} onChange={() => this.setState({ mode: 'Pay at Gym' })} />
                          <label className="custom-control-label" htmlFor="payatGym">{t('Pay at Gym')}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-center">
                      <button type="button" className="btn btn-success px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, classes: { classesByBranch }, currency: { defaultCurrency } }) {
  return {
    loggedUser,
    classesByBranch,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(CustomerClasses))