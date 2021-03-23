import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getClassById } from '../../../actions/classes.action'
import { dateToHHMM, dateToDDMMYYYY } from '../../../utils/apis/helpers'

class CustomerClassesDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: 'Online',
      amount: '',
      classId: '',
    }
    this.props.dispatch(getClassById(this.props.match.params.id))
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
    if (this.props.classById) {

      const { t } = this.props

      const { className, description, branch: { branchName }, room: { roomName }, capacity, startTime, amount,
        endTime, startDate, endDate, classDays, trainer: { credentialId: { userName, avatar } }, occupied, _id, vat: { vatName, taxPercent } } = this.props.classById
      let totalAmount = amount + amount * taxPercent / 100
      return (
        <div className="mainPage p-3 CustomerClassesDeatails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes Details')}</span>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pageHead">
                  <h1>
                    <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                    <span className="px-1"></span>
                    <span>{t('Classes Details')}</span>
                  </h1>
                  <div className="pageHeadLine"></div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row mx-0 w-100">
                <div className="col-12">
                  <div className="card bg-light text-dark mt-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <h3 className="SegoeBold text-body">{className}</h3>
                          <p className="text-body">{description}</p>
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 p-0 d-flex flex-wrap justify-content-lg-between pt-3">

                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-location mr-1  text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Branch')}</p>
                                  <p className="SegoeBold m-0">{branchName}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-capacity mr-1 text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Capacity')}</p>
                                  <p className="SegoeBold m-0">{capacity}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-clock mr-2 text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Time')}</p>
                                  <p className="SegoeBold m-0 d-flex flex-wrap dirltrtar"><span>{dateToHHMM(startTime)}</span><span className="mx-1">-</span><span>{dateToHHMM(endTime)}</span></p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-calendar mr-2  text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Date')}</p>
                                  <p className="SegoeBold m-0 d-flex flex-wrap"><span>{dateToDDMMYYYY(startDate)}</span><span className="mx-1">-</span><span>{dateToDDMMYYYY(endDate)}</span></p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mx-3">
                                <h1 className="iconv1 iconv1-room mr-1  text-warning m-0 font-weight-bold"> </h1>
                                <div>
                                  <p className="mb-0">{t('Room')}</p>
                                  <p className="SegoeBold m-0">{roomName}</p>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row pt-5">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-4">
                              <p className="mb-2">{t('Days')}</p>
                              <div className="position-relative">
                                <select className="form-control SegoeBold">
                                  {classDays.map((day, i) => {
                                    return (
                                      <option disabled={!(i === 0)} key={i}>{dateToDDMMYYYY(day)}</option>
                                    )
                                  })}
                                </select>
                                <div className="d-flex align-items-center justify-content-end h-30px w-100 position-absolute pointerEventsNone px-2 pt-2"
                                  style={{ top: '0', left: '0' }} >
                                  <span className="iconv1 iconv1-arrow-down font-weight-bold"></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-4">
                              <p className="mb-2">{t('Trainer')}</p>
                              <div className="d-flex flex-wrap flex-sm-nowrap align-items-center">
                                <img alt='' src={`/${avatar.path}`} className="w-50px h-50px rounded-circle" />
                                <p className="SegoeBold p-2 mb-0">{userName}</p>
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-4">
                              <p className="m-0">{t('amount')}</p>
                              {/* <h3 className="iconv1 iconv1-money  text-warning mb-0 mt-2 mx-2 font-weight-bold" style={{ fontSize: '50px' }}> </h3> */}
                              <p className="SegoeBold" >
                                <span>{this.props.defaultCurrency}</span>
                                <span className="pl-1"></span>
                                <span>{amount.toFixed(3)}</span>
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-4">
                              <p className="m-0">{t('VAT')}</p>
                              <h6 className="SegoeBold">{taxPercent === 0 ? `${vatName}` : `${taxPercent}%`}</h6>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-end">
                              <button disabled={(capacity - (occupied ? occupied : 0)) === 0} type="button" onClick={(e) => this.handleSubmit(e, totalAmount, _id)} className="btn btn-success">{t('Book a Class')}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
    } else {
      return null
    }
  }
}

function mapStateToProps({ auth: { loggedUser }, currency: { defaultCurrency }, classes: { classById } }) {
  return {
    loggedUser,
    defaultCurrency,
    classById
  }
}

export default withTranslation()(connect(mapStateToProps)(CustomerClassesDetails))