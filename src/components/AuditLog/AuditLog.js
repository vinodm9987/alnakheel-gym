import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import $ from 'jquery';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getAuditLogs } from '../../actions/auditLog.action';
import { dateToDDMMYYYY, dateToHHMM, getPageWiseData } from '../../utils/apis/helpers';
import Pagination from '../Layout/Pagination';

class AuditLog extends Component {

  constructor(props) {
    super(props)
    this.default = {
      fromDate: new Date(),
      toDate: new Date(),
      search: '',
    }
    this.state = this.default
    this.props.dispatch(getAuditLogs({ fromDate: this.state.fromDate, toDate: this.state.toDate, search: this.state.search }))
  }

  handleFilter(fromDate, toDate, search) {
    this.setState({ fromDate, toDate, search }, () => {
      window.dispatchWithDebounce(getAuditLogs)({ fromDate: this.state.fromDate, toDate: this.state.toDate, search: this.state.search })
    })
  }

  componentDidUpdate() {
    this.windowResize()
    window.addEventListener('resize', this.windowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResize)
  }

  windowResize = () => {
    this.ModernTablefunc();
    this.ModernTableScrollfunc();
  }

  // If still not working, use 1st this
  // windowResize() {
  //   this.ModernTablefunc();
  //   this.ModernTableScrollfunc();
  // }


  // If still not working, use 2nd this
  // $("body").on("resize","window", function() {
  //       this.test();
  //   }).bind(this);


  // If still not working, use 2nd this
  // $( window ).resize(function() {
  //   Stuff Here
  // }).bind(this);

  // The example taken from below function
  // clickSolarSystem() {
  //   $("body").on("click",".hex", function() {
  //       this.test();
  //   }).bind(this);
  // }



  ModernTablefunc() {
    let $windowHeight = $(window).height();
    let $windowHeightminus150 = $windowHeight - 150;
    $('#ModernTableResponsive').css("max-height", $windowHeightminus150);
    $('#ModernTableResponsive thead').css("position", 'static');
    var ThItems = $("#ModernTableResponsive tr th");
    var TrItems = $("#ModernTableResponsive tr td");
    ThItems.each(function (idx, th) {
      var ThItem = $(th);
      $(ThItem).css({ 'width': 'unset', 'max-width': 'unset', 'min-width': 'unset' });
    });
    TrItems.each(function (idx, td) {
      var TrItem = $(td);
      $(TrItem).css({ 'width': 'unset', 'max-width': 'unset', 'min-width': 'unset' });
    });
    ThItems.each(function (idx, th) {
      var ThItem = $(th);
      var ThItemWidth = ThItem.width();
      $(ThItem).css({ 'width': ThItemWidth + 30, 'max-width': ThItemWidth + 30, 'min-width': ThItemWidth + 30 });
    });
    TrItems.each(function (idx, td) {
      var TrItem = $(td);
      var TrItemWidth = TrItem.width();
      $(TrItem).css({ 'width': TrItemWidth + 30, 'max-width': TrItemWidth + 30, 'min-width': TrItemWidth + 30 });
    });
    $('#ModernTableResponsive thead').css("position", 'absolute');
  }

  ModernTableScrollfunc() {
    var ModernTableResponsive = document.getElementById("ModernTableResponsive");
    var ModernTableResponsiveScrollTop = ModernTableResponsive.scrollTop;
    $('#ModernTableResponsive thead').css("top", ModernTableResponsiveScrollTop);
  }


  render() {
    const { t } = this.props
    const { fromDate, toDate, search } = this.state

    return (
      <div className="mainPage p-3 BookAClass">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Audit Log')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Audit Log')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="InnerBody bg-white p-4">
                <div className="d-flex flex-wrap justify-content-between">
                  <h2 className="font-weight-normal align-self-center mx-2">{t('Audit Logs Data')}</h2>

                  <div className="w-100 d-flex flex-wrap justify-content-end mx-1">
                    <div className="d-flex mx-1">
                      <label className="mx-2 mt-1">{t('From Date')}</label>
                      <div className="form-group position-relative widthSize w-150px">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            variant='inline'
                            InputProps={{
                              disableUnderline: true,
                            }}
                            autoOk
                            className="form-control w-100 inlineFormInputs"
                            maxDate={new Date()}
                            invalidDateMessage=''
                            minDateMessage=''
                            format="dd/MM/yyyy"
                            value={fromDate}
                            onChange={(e) => this.handleFilter(e, toDate, search)}
                          />
                        </MuiPickersUtilsProvider>
                        <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      </div>
                    </div>
                    <div className="d-flex mx-1">
                      <label className="mx-2 mt-1">{t('To Date')}</label>
                      <div className="form-group position-relative widthSize w-150px">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            variant='inline'
                            InputProps={{
                              disableUnderline: true,
                            }}
                            autoOk
                            className="form-control w-100 inlineFormInputs"
                            minDate={fromDate}
                            invalidDateMessage=''
                            minDateMessage=''
                            format="dd/MM/yyyy"
                            value={toDate}
                            onChange={(e) => this.handleFilter(fromDate, e, search)}
                          />
                        </MuiPickersUtilsProvider>
                        <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      </div>
                    </div>
                    {/* <div className="d-flex mx-1">
                      <label className="mx-2 mt-1">Time</label>
                      <div className="form-group position-relative widthSize w-150px">
                        <input type="text" autoComplete="off"
                          className="form-control w-100 inlineFormInputs" /><span
                            className="icon-search searchBoxIcon"></span>
                      </div>
                    </div> */}
                    <div className="form-group position-relative widthSize w-200px mx-1">
                      <input type="text" autoComplete="off" className="form-control w-100 inlineFormInputs" placeholder={t("Search")}
                        value={search} onChange={(e) => this.handleFilter(fromDate, toDate, e.target.value)}
                      />
                      <span className="icon-search searchBoxIcon"></span>
                    </div>
                  </div>
                </div>

                <div className="AuditLogTableWrapper">
                  <div className="table-responsive w-100 mt-3" id="ModernTableResponsive" onScroll={this.ModernTableScrollfunc}>
                    <table className="borderRoundSeperateTable tdGray action-table">
                      <thead>
                        <tr>
                          <th>{t('User Name')}</th>
                          <th>{t('Designation')}</th>
                          <th>{t('Date')}</th>
                          <th>{t('Time')}</th>
                          <th>{t('IP Address')}</th>
                          <th>{t('IP Location')}</th>
                          <th>{t('Action')}</th>
                          <th>{t('Event')}</th>
                          <th>{t('New Data')}</th>
                          <th>{t('Old Data')}</th>
                          <th>{t('Status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.auditLogs && getPageWiseData(this.state.pageNumber, this.props.auditLogs, this.state.displayNum).map((log, i) => {
                          const { userId: { userName, designation: { designationName }, avatar }, date, time, ip, ipLocation, method, event, requestData, responseData, status } = log
                          let color = '', action = '', formattedIp = 'NA'
                          if (ipLocation) {
                            try {
                              let parseIpLocation = JSON.parse(ipLocation)
                              const { range, region, eu, ll, metro, area, ...updatedObject } = parseIpLocation
                              formattedIp = JSON.stringify(updatedObject)
                              formattedIp = formattedIp.slice(1, -1).split('"').join('')
                            } catch (e) {
                              formattedIp = 'NA'
                            }
                          }
                          if (method === 'POST' && event !== '/api/credential/login' && event !== '/api/credential/logout') {
                            color = 'success'
                            action = 'Created'
                          }
                          else if (method === 'DELETE' && event !== '/api/credential/login' && event !== '/api/credential/logout') {
                            color = 'danger'
                            action = 'Deleted'
                          }
                          else if (method === 'PUT' && event !== '/api/credential/login' && event !== '/api/credential/logout') {
                            color = 'warning'
                            action = 'Edited'
                          }
                          else if (event === '/api/credential/login') {
                            color = 'info'
                            action = 'Logged In'
                          }
                          else if (event === '/api/credential/logout') {
                            color = 'primary'
                            action = 'Logged Out'
                          }
                          return (
                            <tr key={i}>
                              <td>
                                <div className="tb">
                                  <div className="tb-img">
                                    <img src={`http://${avatar ? avatar.ip : ''}:5600/${avatar ? avatar.path : ''}`} alt="" className="up-img" />
                                  </div>
                                  <div className="tb-title dirltrtar">
                                    <span className="stud-name noID">{userName}</span>
                                    {/* <p className="stud-id">1</p> */}
                                  </div>
                                </div>
                              </td>
                              <td className="dirltrtar">{designationName}</td>
                              <td className="dirltrtar">{dateToDDMMYYYY(date)}</td>
                              <td className="dirltrtar">{dateToHHMM(time)}</td>
                              <td className="dirltrtar">{ip}</td>
                              <td>
                                <span className="ObjectDataInTable dirltrtar">{formattedIp}</span>
                              </td>
                              <td>
                                <div className={`mx-auto w-100px bg-${color} text-white align-items-center d-flex justify-content-center h-30px rounded`}>{action}</div>
                              </td>
                              <td className="dirltrtar">{event ? event.split('/')[3] : 'NA'}</td>
                              <td>
                                <span className="ObjectDataInTable dirltrtar">{requestData ? JSON.stringify(requestData).split(',').join(', ').slice(1, -1).split('"').join('') : 'NA'}</span>
                              </td>
                              <td>
                                <span className="ObjectDataInTable dirltrtar">{responseData ? JSON.stringify(responseData).split(',').join(', ').slice(1, -1).split('"').join('') : 'NA'}</span>
                              </td>
                              <td>
                                <span className={status === 'Success' ? "text-success dirltrtar" : "text-danger dirltrtar"}>{status}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/*Pagination Start*/}
                  {this.props.auditLogs &&
                    <Pagination
                      pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                      getPageNumber={(pageNumber) => this.setState({ pageNumber }, () => this.windowResize)}
                      fullData={this.props.auditLogs}
                      displayNumber={(displayNum) => this.setState({ displayNum }, () => this.windowResize)}
                      displayNum={this.state.displayNum ? this.state.displayNum : 5}
                    />
                  }
                  {/* Pagination End // displayNumber={5} */}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auditLog: { auditLogs } }) {
  return {
    auditLogs
  }
}

export default withTranslation()(connect(mapStateToProps)(AuditLog))