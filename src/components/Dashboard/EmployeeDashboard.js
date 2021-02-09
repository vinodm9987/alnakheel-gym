import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Doughnut } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import { withTranslation } from 'react-i18next'
import { getEventsByDate, getAllAnnouncement } from '../../actions/communication.action';
import { dateToDDMMYYYY, monthFullNames, setTime } from '../../utils/apis/helpers';
import { Link } from 'react-router-dom';
import { getMemberDashBoard, getMostSellingStock, getPackageDistribution, getMemberAttendanceDashboard } from '../../actions/dashboard.action';
import { getAboutToExpireMembers } from '../../actions/member.action';
// import { CSVLink } from 'react-csv';


class EmployeeDashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      branch: '',
      branches: [],
      month: new Date().getMonth(),
      trainer: '',
    }
    this.props.dispatch(getMemberDashBoard({}))
    this.props.dispatch(getEventsByDate({ month: this.state.date }))
    this.props.dispatch(getAllAnnouncement())
    this.props.dispatch(getMostSellingStock({}))
    this.props.dispatch(getPackageDistribution({}))
    this.props.dispatch(getMemberAttendanceDashboard({ month: this.state.month }))
  }

  componentDidMount() {
    const trainer = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    const branches = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch
    this.setState({ trainer, branches })
    if (trainer) {
      this.props.dispatch(getMemberAttendanceDashboard({ month: this.state.month, trainerId: trainer }))
      this.props.dispatch(getAboutToExpireMembers({ trainer }))
    }
  }

  onChangeCalendarDate = date => this.setState({ date }, () => {
    const getDate = new Date(this.state.date)
    this.props.dispatch(getEventsByDate({ date: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
  })

  onChangeCalendarMonth = date => {
    if (this.state.date.getMonth() === date.activeStartDate.getMonth() && this.state.date.getFullYear() === date.activeStartDate.getFullYear()) {
      const getDate = new Date(this.state.date)
      this.props.dispatch(getEventsByDate({ date: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
    } else {
      const getDate = new Date(date.activeStartDate)
      this.props.dispatch(getEventsByDate({ month: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
    }
  }

  setBranch(e) {
    this.setState({ branch: e.target.value }, () => {
      this.props.dispatch(getMemberDashBoard({ branch: this.state.branch }))
      this.props.dispatch(getPackageDistribution({ branch: this.state.branch }))
      this.props.dispatch(getMostSellingStock({ branch: this.state.branch }))
      this.props.dispatch(getMemberAttendanceDashboard({ branch: this.state.branch, month: parseInt(this.state.month) }))
    })
  }

  branchList = () => {
    const { t } = this.props
    const { branch, branches } = this.state
    return (
      <div className="col-12 col-sm-12 col-md-12 d-flex align-items-center justify-content-end pageHeadRight">
        <span className="position-relative mw-100">
          <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.setBranch(e)}>
            <option value="">{t('All Branch')}</option>
            {
              branches && branches.map((doc, i) => {
                return (
                  <option key={i} value={doc._id}>{doc.branchName}</option>
                )
              })
            }
          </select>
          <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3" style={{ top: '0', left: '0' }}>
            <span className="iconv1 iconv1-fill-navigation"></span>
            <span className="iconv1 iconv1-arrow-down"></span>
          </span>
        </span>
      </div>
    )
  }

  memberDetails() {
    if (this.props.memberDashboard) {
      const { t } = this.props
      const { total, pending, newMember, activeMember } = this.props.memberDashboard
      return (
        <div className="col-12 py-3">
          <div className="row d-flex align-items-center">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
              <div className="w-100 d-flex flex-wrap align-items-center justify-content-start justify-content-sm-center">
                <div>
                  <h5 className="m-0 font-weight-bold">{t('Total Members')}</h5>
                  <h1 className="text-primary m-0 SegoeBold w-100">{total}</h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
              <div className="w-100 d-flex flex-wrap align-items-center justify-content-start justify-content-sm-center">
                <div>
                  <h5 className="m-0 font-weight-bold">{t('New Members')}</h5>
                  <h1 className="text-warning m-0 SegoeBold w-100">{newMember}</h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
              <div className="w-100 d-flex flex-wrap align-items-center justify-content-start justify-content-sm-center">
                <div>
                  <h5 className="m-0 font-weight-bold">{t("Active Members")}</h5>
                  <h1 className="text-success m-0 SegoeBold w-100">{activeMember}</h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
              <div className="w-100 d-flex flex-wrap align-items-center justify-content-start justify-content-sm-center">
                <div>
                  <h5 className="m-0 font-weight-bold">{t("Pending Members")}</h5>
                  <h1 className="text-danger m-0 SegoeBold w-100">{pending}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  packageDetails() {
    if (this.props.packageDistribution) {
      const { t } = this.props
      const { packages, total } = this.props.packageDistribution
      const data = {
        labels: packages.map(pack => pack.packageName),
        datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
        text: `${t('Total')} ${total}`
      };

      // const headers = [
      //   { label: 'Package Name', key: 'packageName' },
      //   { label: 'Member Count', key: 'count' }
      // ]
      packages.forEach(log => {
        delete log._id
      })

      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-flex align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('Package Details')}</h6>
              <div className="underline w-100"></div>
            </div>

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
              <Doughnut
                data={data}
                options={{
                  legend: {
                    display: false,
                    position: 'right',
                    align: 'start'
                  }
                }}
              />
              {/* <div className="chartcenterData">
                <p className="m-0">Total</p>
                <p className="m-0">{total}</p>
              </div> */}
              <div className="col-12 px-0">
                <div className="row py-3">
                  <div className="col-12 overflow-auto mxh-200px">
                    <div className="row">
                      {packages.map((pack, i) => {
                        return (
                          <div key={i} className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 d-flex">
                            <span className="h-15px w-15px mr-1 my-1 flex-0-0-15px" style={{ backgroundColor: pack.color }}></span>
                            <label className="my-0 dirltrtar">{pack.packageName}</label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto">
              <h5 className="d-flex align-items-center mx-3 my-3">
                <small><small>Export</small></small>
                <small><small>:</small></small>
                <span className="mx-1"></span>
                <CSVLink data={packages} headers={headers}>
                  <div className="iconv1 iconv1-excel linkHoverDecLess cursorPointer">
                    <span className="path1"></span><span className="path2"></span><span className="path5"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span>
                  </div>
                </CSVLink>
                <span className="mx-1"></span>
                <div className="iconv1 iconv1-pdf linkHoverDecLess cursorPointer" onClick={() => this.downloadPdf()}>
                  <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span>
                </div>
              </h5>
              <a href="/#" className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer" download><small className="iconv1 iconv1-download font-weight-bold"></small><small className="mx-1"></small><small>View Report</small></a>
            </div> */}

          </div>
        </div>
      )
    }
  }

  setMonth(e) {
    this.setState({ month: e.target.value }, () => {
      this.props.dispatch(getMemberAttendanceDashboard({ month: parseInt(this.state.month), trainerId: this.state.trainer }))
    })
  }

  memberAttendance() {
    const { t } = this.props
    if (this.props.dashboardAttendance) {
      const data = {
        labels: this.props.dashboardAttendance.map(a => a.name),
        datasets: [{ data: this.props.dashboardAttendance.map(a => a.data), backgroundColor: ['#28A745', '#c82333'], hoverBackgroundColor: ['#28A745', '#c82333'] }],
        text: this.props.memberDashboard ? `${t('Total')} ${this.props.memberDashboard.activeMember}` : ''
      };

      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-flex align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('Members Attendance')}</h6>
              <div className="d-flex flex-wrap align-items-center">
                <span className="position-relative mx-1 my-2">
                  <select className="bg-white border-secondary border-secondary px-4 mw-100" value={this.state.month} onChange={(e) => this.setMonth(e)}>
                    {monthFullNames.map((month, i) => {
                      return (
                        <option key={i} value={i}>{t(`${month}`)}</option>
                      )
                    })}
                  </select>
                  <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                    <span className="iconv1 iconv1-arrow-down"></span>
                  </span>
                </span>
              </div>
              <div className="underline w-100"></div>
            </div>

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
              <Doughnut
                data={data}
                options={{
                  legend: {
                    display: false,
                    position: 'right',
                    align: 'start'
                  }
                }}
              />
              {/* <div className="chartcenterData">
                  <p className="m-0">Total</p>
                  <p className="m-0">{total}</p>
                </div> */}
              <div className="col-12 px-0">
                <div className="row py-3">
                  <div className="col-12 overflow-auto mxh-200px">
                    <div className="row">
                      {this.props.dashboardAttendance.map((type, i) => {
                        return (
                          <div key={i} className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 d-flex">
                            <span className="h-15px w-15px mr-1 my-1 flex-0-0-15px" style={{ backgroundColor: data.datasets[0].backgroundColor[i] }}></span>
                            <label className="my-0 dirltrtar">{type.name}</label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto">
              <h5 className="d-flex align-items-center mx-3 my-3">
                <small><small>Export</small></small>
                <small><small>:</small></small>
                <span className="mx-1"></span>
                <a href="/#" className="iconv1 iconv1-excel linkHoverDecLess cursorPointer"><span className="path1"></span><span className="path2"></span><span className="path5"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span></a>
                <span className="mx-1"></span>
                <a href="/#" className="iconv1 iconv1-pdf linkHoverDecLess cursorPointer"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span></a>
              </h5>
              <a href="/#" className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer" download><small className="iconv1 iconv1-download font-weight-bold"></small><small className="mx-1"></small><small>View Report</small></a>
            </div> */}

          </div>
        </div>

      )
    }
  }

  calendar = () => {
    const { t } = this.props
    return (
      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
        <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
            <ul className="nav commonNavForTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#cal1">{t('Calendar')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#cal2">{t('Announcement')}</a>
              </li>

            </ul>
            <div className="underline w-100"></div>
          </div>
          {/* <!-- Tab panes --> */}
          <div className="tab-content">
            <div id="cal1" className="container tab-pane active">
              <div className="col-12 d-flex flex-wrap align-items-center justify-content-center py-3 fullDayCalendar">
                <Calendar
                  locale={localStorage.getItem('i18nextLng')}
                  calendarType='US'
                  onActiveDateChange={this.onChangeCalendarMonth}
                  onChange={this.onChangeCalendarDate}
                  value={this.state.date}
                />
              </div>
              {this.props.eventsByDate && this.props.eventsByDate.map((event, i) => {
                if (dateToDDMMYYYY(event.startDate) === dateToDDMMYYYY(event.endDate)) {
                  return (
                    <div key={i} className="px-4 pb-2">
                      <span className="text-warning font-weight-bold">{dateToDDMMYYYY(event.startDate).slice(0, 5)}</span><span> - {event.eventTitle}</span>
                    </div>
                  )
                } else {
                  return (
                    <div key={i} className="px-4 pb-2">
                      <span className="text-warning font-weight-bold">{dateToDDMMYYYY(event.startDate).slice(0, 5)} - {dateToDDMMYYYY(event.endDate).slice(0, 5)}</span><span> - {event.eventTitle}</span>
                    </div>
                  )
                }
              })}
            </div>
            <div id="cal2" className="container tab-pane fade mb-auto"><br />
              <table className="borderRoundSeperateTable tdWhite">
                {/* ----show only three rows----- */}
                <tbody>
                  {this.props.activeAnnouncements && this.props.activeAnnouncements.map((announcement, i) => {
                    const { title, startDate } = announcement
                    if (i < 3) {
                      return (
                        <tr key={i}>
                          <td><small className="mnw-50px whiteSpaceNormal d-inline-block">{title}</small> <div><button type="button" className="btn  btnaccred">{dateToDDMMYYYY(startDate)}</button></div></td>
                          <td>
                            <Link to='/announcement/announcement-list' className="linkHoverDecLess">
                              <span className="iconv1 iconv1-right-arrow text-warning float-right border border-warning rounded-circle p-1"></span>
                            </Link>
                          </td>
                        </tr>
                      )
                    } else {
                      return null
                    }
                  })}
                </tbody>
              </table>
              <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto"><Link to='/announcement/announcement-list' className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer"><small>{t('View All')}</small></Link></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  mostSelling() {
    if (this.props.mostSellingStock) {
      const { t } = this.props
      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('Most Selling Products')}</h6>
              <div className="underline w-100"></div>
            </div>

            <div className="col-12 d-flex flex-wrap hScrollCnt align-items-start">
              <div className="table-responsive">
                <table className="borderRoundSeperateTable tdWhite mostsellingTable">
                  <thead>
                    <tr>
                      <th><small>{t('Product Name')}</small></th>
                      <th><small>{t('Location')}</small></th>
                      <th className="text-center"><small>{t('Sold Qty')}</small></th>
                      <th className="text-center"><small>{t('Total Price')}</small></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.mostSellingStock.map((stock, i) => {
                      const { itemName, sellingPrice, branch: { branchName }, image, originalQuantity, quantity } = stock
                      return (
                        <tr key={i}>
                          <td className="p-0">
                            <div className="d-flex align-items-center">
                              <img alt='' src={`/${image.path}`} className="mx-1 p-1 rounded-circle w-50px h-50px objectFitContain" />
                              <h6 className="mx-1 my-1 whiteSpaceNormal mxw-150px"><small>{itemName}</small></h6>
                            </div>
                          </td>
                          <td><small className="mnw-50px whiteSpaceNormal d-inline-block">{branchName}</small></td>
                          <td><small className="mnw-50px whiteSpaceNormal d-inline-block">{originalQuantity - quantity}</small></td>
                          <td className="text-center">
                            <p className="m-0"><small className="text-warning SegoeBold">{this.props.defaultCurrency} {((originalQuantity - quantity) * sellingPrice).toFixed(3)}</small></p>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto">
              <a href="/#" className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer"><small>View All</small></a>
            </div> */}
          </div>
        </div>
      )
    }
  }

  upcomingExpiryMembers() {
    const { t } = this.props
    return (
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 d-flex mt-3">
        <div className="row m-0 w-100 mw-100 bg-light rounded d-flex align-items-start h-100">

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
            <h6 className="mx-1 my-2 SegoeBold py-1">{t('Upcoming Expiry Members')}</h6>
            <div className="underline w-100"></div>
          </div>

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
            <div className="table-responsive">
              <table className="borderRoundSeperateTable tdWhite">
                <thead>
                  <tr>
                    <th><small>{t('ID')}</small></th>
                    <th><small>{t('Name')}</small></th>
                    <th><small>{t('Plan')}</small></th>
                    <th><small>{t('Admission Date')}</small></th>
                    {/* <th><small>Expiry Date</small></th> */}
                    <th><small>{t('Contact No')}</small></th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.expiredMember && this.props.expiredMember.map((member, i) => {
                    let packagesName = member.packageDetails.filter(pack => {
                      let endDate = pack.endDate
                      let today = new Date(new Date().setHours(0, 0, 0, 0));
                      if (pack.extendDate) {
                        endDate = pack.extendDate;
                      }
                      if (new Date(setTime(endDate)).setDate(new Date(setTime(endDate)).getDate() - 7) <= today && today < new Date(setTime(endDate))) {
                        return true
                      } else {
                        return false
                      }
                    }).map(pack => pack.packages.packageName).join(', ')
                    return (
                      <tr key={i}>
                        <td><small className="text-primary">{member.memberId}</small></td>
                        <td className="py-0">
                          <div className="d-flex align-items-center">
                            <img alt='' src={member.credentialId.avatar.path} className="mx-1 p-1 rounded-circle w-50px h-50px" />
                            <div className="mx-1">
                              <h6 className="my-0"><small>{member.credentialId.userName}</small></h6>
                              <h6 className="my-0 text-muted"><small>{member.credentialId.email}</small></h6>
                            </div>
                          </div>
                        </td>
                        <td className="py-0"><small className="w-150px d-inline-block whiteSpaceNormal">{packagesName}</small></td>
                        <td><small className="text-secondary">{dateToDDMMYYYY(member.admissionDate)}</small></td>
                        <td><small className="text-danger">{member.mobileNo}</small></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto">
            <Link to={'/members/expiry-members'} className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer"><small>{t('View All')}</small></Link>
          </div>

        </div>
      </div>
    )
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 EmployeeDashboard">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Dashboard')}</span>
          </div>
          {/* <div className="col-12 pageHead">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 pageHead">
                <h1>Dashboard</h1>
              </div>
              <div className="col-12 col-sm-12 col-md-6 d-flex align-items-center justify-content-start justify-content-md-end pageHeadRight">
                <h5 className="mb-0"><span className="iconv1 iconv1-fill-navigation text-warning"></span><small className="SegoeBold mx-1">Bangalore</small></h5>
              </div>
              <div className="col-12 pageHeadBottom">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div> */}

          <div className="col-12 pageHead">
            <div className="row">
              <div className="col flex-basis-0 flex-grow-0 mw-100">
                <h1>{t('Dashboard')}</h1>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg pt-3 mw-100">
                {/* <div id="carouselExampleControls" className="carousel slide carousel-fade" data-ride="carousel">
                  <div className="carousel-inner">
                    {this.props.activeAnnouncements && this.props.activeAnnouncements.map((announcement, i) => {
                      return (
                        <div key={i} className={i === 0 ? "carousel-item active" : "carousel-item"}>
                          {announcement.description}
                        </div>
                      )
                    })}
                  </div>
                </div> */}
              </div>
              <div className="col flex-basis-0 flex-grow-0 pt-3 mw-100">
                <div className="row">
                  {this.branchList()}
                </div>
              </div>
              <div className="col-12 pageHeadBottom">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div> 

          <div className="col-12">
            <div className="row mx-0 w-100">

              {this.memberDetails()}

              <div className="col-12">
                <div className="row">

                  {/* Dashb cards */}
                  {this.packageDetails()}
                  {/* Dashb cards ends */}

                  {/* Dashb cards */}
                  {this.memberAttendance()}
                  {/* Dashb cards ends */}

                  {/* Dashb cards */}
                  {this.calendar()}
                  {/* Dashb cards ends */}

                  {/* Dashb cards */}
                  {this.mostSelling()}
                  {/* Dashb cards ends */}

                  {/* Dashb cards */}
                  {this.upcomingExpiryMembers()}
                  {/* Dashb cards ends */}

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    )
  }
}


function mapStateToProps({ member, branch, communication: { eventsByDate, activeAnnouncements },
  dashboard: { memberDashboard, mostSellingStock, packageDistribution, dashboardAttendance }, auth: { loggedUser }, member: { expiredMember },
  currency: { defaultCurrency } }) {
  return {
    member, branch,
    eventsByDate: eventsByDate && eventsByDate.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    activeAnnouncements: activeAnnouncements && activeAnnouncements.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    memberDashboard,
    mostSellingStock, packageDistribution, dashboardAttendance, loggedUser, expiredMember, defaultCurrency
  }
}


export default withTranslation()(connect(mapStateToProps)(EmployeeDashboard))