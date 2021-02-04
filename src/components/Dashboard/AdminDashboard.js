import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Doughnut } from 'react-chartjs-2';
import { getAllBranch } from '../../actions/branch.action'
// import Calendar from 'react-calendar';
import { withTranslation } from 'react-i18next'
// import { getEventsByDate, getAllAnnouncement } from '../../actions/communication.action';
import {
  getMemberDashBoard, getMostSellingStock, getPackageDistribution, getSystemYear, getMemberAttendanceDashboard, getDashboardTotalSales, getPendingInstallments
  // getAllBranchSales,   getRevenueDetails 
} from '../../actions/dashboard.action';
import { monthFullNames, monthSmallNamesCaps, dateToDDMMYYYY } from '../../utils/apis/helpers';
// import { CSVLink } from "react-csv";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
// import { Link } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';

class AdminDashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      branch: '',
      yearSales: new Date().getFullYear(),
      yearRevenue: new Date().getFullYear(),
      month: new Date().getMonth(),
      category: '',
      salesDate: new Date(),
      paymentType: 'all',
      transactionType: 'all',
      pendingMonth: new Date().getMonth(),
      pendingYear: new Date().getFullYear(),
    }
    this.props.dispatch(getSystemYear())
    this.props.dispatch(getAllBranch())
    // this.props.dispatch(getEventsByDate({ month: this.state.date }))
    // this.props.dispatch(getAllAnnouncement())
    this.props.dispatch(getMemberDashBoard({}))
    this.props.dispatch(getMostSellingStock({}))
    this.props.dispatch(getPackageDistribution({}))
    this.props.dispatch(getMemberAttendanceDashboard({ month: this.state.month }))
    // this.props.dispatch(getAllBranchSales({ year: parseInt(this.state.yearSales) }))
    // this.props.dispatch(getRevenueDetails({ year: parseInt(this.state.yearRevenue), category: this.state.category }))
    this.props.dispatch(getDashboardTotalSales({ date: new Date(), type: 'all', category: 'all' }))
    this.props.dispatch(getPendingInstallments({ month: parseInt(this.state.pendingMonth), day: this.state.pendingYear }))
  }

  onChangeCalendarDate = date => this.setState({ date }, () => {
    // const getDate = new Date(this.state.date)
    // this.props.dispatch(getEventsByDate({ date: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
  })

  onChangeCalendarMonth = date => {
    if (this.state.date.getMonth() === date.activeStartDate.getMonth() && this.state.date.getFullYear() === date.activeStartDate.getFullYear()) {
      // const getDate = new Date(this.state.date)
      // this.props.dispatch(getEventsByDate({ date: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
    } else {
      // const getDate = new Date(date.activeStartDate)
      // this.props.dispatch(getEventsByDate({ month: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
    }
  }


  setBranch(e) {
    this.setState({ branch: e.target.value }, () => {
      this.props.dispatch(getMemberDashBoard({ branch: this.state.branch }))
      this.props.dispatch(getPackageDistribution({ branch: this.state.branch }))
      this.props.dispatch(getMostSellingStock({ branch: this.state.branch }))
      // this.props.dispatch(getAllBranchSales({ year: parseInt(this.state.yearSales), branch: this.state.branch }))
      // this.props.dispatch(getRevenueDetails({ year: parseInt(this.state.yearRevenue), category: this.state.category, branch: this.state.branch }))
      this.props.dispatch(getMemberAttendanceDashboard({ branch: this.state.branch, month: parseInt(this.state.month) }))
    })
  }



  memberDetails = () => {
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
                  <h1 className="d-flex align-items-center justify-content-between text-primary m-0 SegoeBold w-100"><span>{total}</span><span className="iconv1 iconv1-total-members"></span></h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
              <div className="w-100 d-flex flex-wrap align-items-center justify-content-start justify-content-sm-center">
                <div>
                  <h5 className="m-0 font-weight-bold">{t('New Members')}</h5>
                  <h1 className="d-flex align-items-center justify-content-between text-warning m-0 SegoeBold w-100"><span>{newMember}</span><span className="iconv1 iconv1-new-members" style={{ zoom: "0.7" }}></span></h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
              <div className="w-100 d-flex flex-wrap align-items-center justify-content-start justify-content-sm-center">
                <div>
                  <h5 className="m-0 font-weight-bold">{t('Active Members')}</h5>
                  <h1 className="d-flex align-items-center justify-content-between text-success m-0 SegoeBold w-100"><span>{activeMember}</span><span className="iconv1 iconv1-active-members" style={{ zoom: "0.7" }}></span></h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
              <div className="w-100 d-flex flex-wrap align-items-center justify-content-start justify-content-sm-center">
                <div>
                  <h5 className="m-0 font-weight-bold">{t('Pending Members')}</h5>
                  <h1 className="d-flex align-items-center justify-content-between text-danger m-0 SegoeBold w-100"><span>{pending}</span><span className="iconv1 iconv1-pending-members" style={{ zoom: "0.7" }}></span></h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  branchList = () => {
    const { t } = this.props
    const { activeResponse } = this.props.branch
    const { branch } = this.state
    return (
      <div className="col-12 col-sm-12 col-md-12 d-flex align-items-center justify-content-end pageHeadRight">
        <span className="position-relative mw-100">
          <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.setBranch(e)}>
            <option value="">{t('All Branch')}</option>
            {
              activeResponse && activeResponse.map((doc, i) => {
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

  downloadPdf() {
    const doc = new jsPDF()
    doc.autoTable({ html: '#myTable' })
    doc.save('table.pdf')
  }

  packageDetails = () => {
    const { t } = this.props
    if (this.props.packageDistribution) {
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
  };


  setYearRevenue(e) {
    this.setState({ yearRevenue: e.target.value }, () => {
      // this.props.dispatch(getRevenueDetails({ year: parseInt(this.state.yearRevenue), category: this.state.category, branch: this.state.branch }))
    })
  }

  setRevenueCategory(e) {
    this.setState({ category: e.target.value }, () => {
      // this.props.dispatch(getRevenueDetails({ year: parseInt(this.state.yearRevenue), category: this.state.category, branch: this.state.branch }))
    })
  }

  setMonth(e) {
    this.setState({ month: e.target.value }, () => {
      this.props.dispatch(getMemberAttendanceDashboard({ month: parseInt(this.state.month), branch: this.state.branch }))
    })
  }

  memberAttendance = () => {
    const { t } = this.props
    if (this.props.dashboardAttendance) {
      const data = {
        labels: this.props.dashboardAttendance.map(a => a.name),
        datasets: [{ data: this.props.dashboardAttendance.map(a => a.data), backgroundColor: ['#00cb46', '#e92344'], hoverBackgroundColor: ['#00cb46', '#e92344'] }],
        text: this.props.memberDashboard ? `${t('Total')} ${this.props.memberDashboard.activeMember}` : ''
      };

      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-flex align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('Members Attendance')}</h6>
              <div className="d-flex flex-wrap align-items-center">
                <span className="position-relative mx-1 my-2">
                  <select className="bg-white border-secondary border-secondary pr-4 pl-1 mw-100" style={{ fontSize: "13px" }} value={this.state.month} onChange={(e) => this.setMonth(e)}>
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
                <div className="row pt-3 pb-2">
                  <div className="col-12 px-0 d-flex flex-wrap">
                    <div className="col overflow-auto mxh-200px full-width-576-down">
                      <div className="row">
                        {this.props.dashboardAttendance.map((type, i) => {
                          return (
                            <div key={i} className="px-3 d-flex">
                              <span className="h-15px w-15px mr-1 my-1 flex-0-0-15px" style={{ backgroundColor: data.datasets[0].backgroundColor[i] }}></span>
                              <label className="my-0 dirltrtar">{type.name}</label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {/* tusar button */}
                    {/* <Link to='/admin-attendance' className="linkHoverDecLess">
                      <div className="col text-right full-width-576-down">
                        <button className="btn btn-warning br-50px text-white px-3 btn-sm text-nowrap mt-3 mt-sm-0">{t('View All Attendance')}</button>
                      </div>
                    </Link> */}
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

  setYearSales(e) {
    this.setState({ yearSales: e.target.value }, () => {
      // this.props.dispatch(getAllBranchSales({ year: parseInt(this.state.yearSales), branch: this.state.branch }))
    })
  }

  mostSelling = () => {
    if (this.props.mostSellingStock) {
      const { t } = this.props
      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('Most Selling Products')}</h6>
              <div className="underline w-100"></div>
            </div>

            {/* tushar if data */}
            {this.props.mostSellingStock.length > 0 ?
              <div className="col-12 d-flex flex-wrap pb-3 align-items-start">
                <div className="table-responsive scrollbarchrome" style={{ maxHeight: "400px" }}>
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
                      {this.props.mostSellingStock.slice(0, 3).map((stock, i) => {
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
                              <p className="m-0"><span className="text-warning SegoeBold">{this.props.defaultCurrency} {((originalQuantity - quantity) * sellingPrice).toFixed(3)}</span></p>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              : <div className="col-12 px-0 text-center pt-5 pb-3">
                <h4 className="text-orange">
                  <span className="iconv1 iconv1-info"></span>
                </h4>
                <h5 className="text-body">There is no data to show you</h5>
              </div>
            }
            {/* <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto">
              <a href="/#" className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer"><small>View All</small></a>
            </div> */}
          </div>
        </div>
      )
    }
  }

  setDatePaymentTransaction(salesDate, paymentType, transactionType) {
    this.setState({ salesDate, paymentType, transactionType }, () => {
      this.props.dispatch(getDashboardTotalSales({ date: salesDate, type: paymentType, category: transactionType }))
    })
  }

  totalSales = () => {
    const { t } = this.props
    if (this.props.dashboardTotalSales) {
      const { salesDate, paymentType, transactionType } = this.state
      const { totalStockSells, totalClassSells, totalPackageSells, branches } = this.props.dashboardTotalSales
      const totalSells = (totalStockSells ? totalStockSells : 0) + (totalClassSells ? totalClassSells : 0) + (totalPackageSells ? totalPackageSells : 0)
      const data = {
        labels: ['POS', 'Classes', 'Packages'],
        datasets: [{ data: [(totalStockSells ? totalStockSells : 0), (totalClassSells ? totalClassSells : 0), (totalPackageSells ? totalPackageSells : 0)], backgroundColor: ['orange', 'red', 'blue'], hoverBackgroundColor: ['orange', 'red', 'blue'] }],
        text: `${t('Total')} ${totalSells.toFixed(3)}`
      };
      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-8 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-flex align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">Total Sales</h6>
              <div className="underline w-100"></div>
            </div>

            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                  <div className="d-flex flex-wrap align-items-center">
                    <span className="position-relative mx-1 my-2">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          invalidDateMessage=''
                          minDateMessage=''
                          className="bg-white border-secondary border border-secondary pr-4 pl-1 mw-100 form-control"
                          format="dd/MM/yyyy"
                          value={salesDate}
                          onChange={(e) => this.setDatePaymentTransaction(e, paymentType, transactionType)}
                          style={{ fontSize: "13px" }}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                        <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      </span>
                    </span>
                  </div>
                  <div className="d-flex flex-wrap align-items-center justify-content-center">
                    <Doughnut
                      data={data}
                      options={{
                        legend: {
                          display: false,
                          position: 'right',
                          align: 'start'
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-9 pt-2">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 pb-2">
                      <h6>Total Amount</h6>
                      <h4 className="font-weight-bold dirltrtar text-success">{this.props.defaultCurrency} {totalSells.toFixed(2)}</h4>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 pb-2">
                      <h6>Payment Type</h6>
                      <div className="d-flex flex-wrap align-items-center">
                        <span className="position-relative w-100">
                          <select className="bg-white border-secondary border-secondary pr-4 pl-1 w-100" style={{ fontSize: "13px" }}
                            value={paymentType} onChange={(e) => this.setDatePaymentTransaction(salesDate, e.target.value, transactionType)}>
                            <option value="all">{t('All')}</option>
                            <option value="digital">{t('Digital')}</option>
                            <option value="cash">{t('Cash')}</option>
                            <option value="card">{t('Card')}</option>
                            <option value="cheque">{t('Cheque')}</option>
                          </select>
                          <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                            <span className="iconv1 iconv1-arrow-down"></span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 pb-2">
                      <h6>Transaction Type</h6>
                      <div className="d-flex flex-wrap align-items-center">
                        <span className="position-relative w-100">
                          <select className="bg-white border-secondary border-secondary pr-4 pl-1 w-100" style={{ fontSize: "13px" }}
                            value={transactionType} onChange={(e) => this.setDatePaymentTransaction(salesDate, paymentType, e.target.value)}>
                            <option value="all">{t('All')}</option>
                            <option value="PackageSells">{t('Packages')}</option>
                            <option value="ClassSell">{t('Classes')}</option>
                            <option value="StockSell">{t('POS')}</option>
                          </select>
                          <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                            <span className="iconv1 iconv1-arrow-down"></span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 pb-2">
                      <h6>Packages Amount</h6>
                      <h4 className="font-weight-bold dirltrtar text-orange">{this.props.defaultCurrency} {totalPackageSells ? totalPackageSells.toFixed(2) : 0}</h4>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 pb-2">
                      <h6>POS Amount</h6>
                      <h4 className="font-weight-bold dirltrtar text-danger">{this.props.defaultCurrency} {totalStockSells ? totalStockSells.toFixed(2) : 0}</h4>
                    </div>
                    {/* <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 pb-2">
                                <h6>Classes Amount</h6>
                                <h4 className="font-weight-bold dirltrtar text-danger">{this.props.defaultCurrency} 87511</h4>
                              </div> */}
                    <div className="col-12">
                      <div className="underline w-100 mt-2 mb-1"></div>
                    </div>
                    <div className="col-12">
                      <p><small className="font-weight-bold">Sales By Branches</small></p>
                      <div className="d-flex flex-wrap pb-3">
                        {branches.map((branch, i) => {
                          return (
                            <div key={i} className="d-flex align-items-center mr-3">
                              <div className="dbd-blueblock"></div>
                              <small className="dbd-blueblock-txt mx-1">{branch.branchName}</small>
                              <div className="dbd-blueblock-amt text-success font-weight-bold">{this.props.defaultCurrency} {branch.amount ? branch.amount.toFixed(2) : 0}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
                        <div className="col-12 px-0">
                          <div className="row pt-3 pb-2">
                            <div className="col-12 px-0 d-flex flex-wrap justify-content-end">
                              <Link to='/admin-attendance' className="linkHoverDecLess">
                                <div className="col text-right full-width-576-down">
                                  <button className="btn btn-warning br-50px text-white px-3 btn-sm text-nowrap mt-3 mt-sm-0">{t('View All Attendance')}</button>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div> */}

          </div>
        </div>
      )
    }
  }

  setMonthYear(pendingMonth, pendingYear) {
    this.setState({ pendingMonth, pendingYear }, () => {
      this.props.dispatch(getPendingInstallments({ month: parseInt(this.state.pendingMonth), year: parseInt(this.state.pendingYear) }))
    })
  }

  pendingInstallments = () => {
    const { t } = this.props
    if (this.props.pendingInstallments) {
      const { pendingMonth, pendingYear } = this.state
      let systemYears = [], totalPendingAmount = 0
      if (this.props.systemYear) {
        for (let i = new Date(this.props.systemYear.year).getFullYear(); i <= new Date().getFullYear(); i++) {
          systemYears.push(i)
        }
      }
      this.props.pendingInstallments.forEach(installment => {
        totalPendingAmount += installment.packageAmount ? installment.packageAmount : 0
      })
      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-flex align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">Pending Installments</h6>
              <div className="d-flex flex-wrap align-items-center">
                <span className="position-relative mx-1 my-2">
                  <select className="bg-white border-secondary border-secondary pr-4 pl-1 mw-100" style={{ fontSize: "13px" }} value={this.state.pendingYear} onChange={(e) => this.setMonthYear(pendingMonth, e.target.value)}>
                    {systemYears.map(year => {
                      return (<option key={year} value={year}>{year}</option>)
                    })}
                  </select>
                  <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                    <span className="iconv1 iconv1-arrow-down"></span>
                  </span>
                </span>
                <span className="position-relative mx-1 my-2">
                  <select className="bg-white border-secondary border-secondary pr-4 pl-1 mw-100" style={{ fontSize: "13px" }}
                    value={pendingMonth} onChange={(e) => this.setMonthYear(e.target.value, pendingYear)} >
                    {monthSmallNamesCaps.map((month, i) => {
                      return (
                        <option key={i} value={i}>{t(month)}</option>
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

            <div className="col-12 d-flex flex-wrap align-items-start justify-content-between py-1 inner-head-down">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      {/* <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                        <h6>Total Pending Amount</h6>
                        <h6 className="font-weight-bold dirltrtar text-danger">$ 87511</h6>
                      </div> */}
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="row d-block d-sm-flex justify-content-start">
                          {/* <div className="col w-auto px-1 flexBasis-auto flex-grow-0" >
                            <div className="d-flex flex-wrap align-items-center">
                              <span className="position-relative mx-1 my-1">
                                <select className="bg-white border-secondary border-secondary pr-4 pl-1 w-100" style={{ fontSize: "13px" }}
                                  value={pendingMonth} onChange={(e) => this.setMonthYear(e.target.value, pendingYear)} >
                                  {monthSmallNamesCaps.map((month, i) => {
                                    return (
                                      <option key={i} value={i}>{t(month)}</option>
                                    )
                                  })}
                                </select>
                                <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                                  <span className="iconv1 iconv1-arrow-down"></span>
                                </span>
                              </span>
                            </div>
                          </div> */}
                          {/* <div className="col w-auto px-1 flexBasis-auto flex-grow-0" >
                            <div className="d-flex flex-wrap align-items-center">
                              <span className="position-relative mx-1 my-1">
                                <select className="bg-white border-secondary border-secondary pr-4 pl-1 w-100" style={{ fontSize: "13px" }} value={this.state.pendingYear} onChange={(e) => this.setMonthYear(pendingMonth, e.target.value)}>
                                  {systemYears.map(year => {
                                    return (<option key={year} value={year}>{year}</option>)
                                  })}
                                </select>
                                <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                                  <span className="iconv1 iconv1-arrow-down"></span>
                                </span>
                              </span>
                            </div>
                          </div> */}
                          <div className="col w-auto px-2">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <h6>Total Amount</h6>
                                <h5 className="font-weight-bold dirltrtar text-success">{this.props.defaultCurrency} {totalPendingAmount.toFixed(3)}</h5>
                              </div>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>
                  {/* tushar if data */}
                  {this.props.pendingInstallments.length > 0 ?
                    <div className="col-12 px-0 pb-3">
                      <div className="table-responsive scrollbarchrome" style={{ maxHeight: "400px" }}>
                        <table className="borderRoundSeperateTable tdWhite">
                          <thead>
                            <tr>
                              <th><small>Member Name</small></th>
                              <th><small>Amount</small></th>
                              <th><small>Due Date</small></th>
                              <th><small>Type</small></th>
                              {/* <th></th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {this.props.pendingInstallments.map((pendingInstallment, i) => {
                              const { credentialId: { avatar, userName, email }, packageAmount, dueDate, type } = pendingInstallment
                              return (
                                <tr key={i}>
                                  <td>
                                    <div className="d-flex">
                                      <img alt='' src={`/${avatar.path}`} className="mx-1 rounded-circle w-40px h-40px" />
                                      <div className="mx-1">
                                        <p className="m-0 font-weight-bold fz-14px" >{userName}</p>
                                        <span className="text-body font-weight-light fz-14px">{email}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td><p className="text-warning SegoeBold m-0 dirltrtar">{this.props.defaultCurrency} {packageAmount}</p></td>
                                  <td>{dateToDDMMYYYY(dueDate)}</td>
                                  <td>{type}</td>
                                  {/* <td className="text-center">
                              <a href="/#" className="dboard-btn-icon-primary">
                                <span className="iconv1 iconv1-right-small-arrow"></span>
                              </a>
                            </td> */}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    : <div className="col-12 px-0 text-center pt-5 pb-3">
                      <h4 className="text-orange">
                        <span className="iconv1 iconv1-info"></span>
                      </h4>
                      <h5 className="text-body">There is no data to show you</h5>
                    </div>
                  }
                  {/* tushar if no-data */}
                </div>
              </div>
              {/* <div className="col-12 px-0">
                          <div className="row pt-3 pb-2">
                            <div className="col-12 px-0 d-flex flex-wrap justify-content-end">
                              <Link to='/pending-installments' className="linkHoverDecLess">
                                <div className="col text-right full-width-576-down">
                                  <button className="btn btn-warning br-50px text-white px-3 btn-sm text-nowrap mt-3 mt-sm-0">View All</button>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div> */}
            </div>

          </div>
        </div>
      )
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 AdminDashboard">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Dashboard')}</span>
          </div>
          {/* <div className="col-12 pageHead">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 pageHead">
                <h1>Dashboard</h1>
              </div>

              {this.branchList()}

              <div className="col-12 pageHeadBottom">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div> */}

          <div className="col-12 pageHead">
            <div className="row">
              <div className="col flex-basis-0 flex-grow-0 mw-100">
                <h1 className="text-nowrap">{t('Dashboard')}</h1>
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

                  {this.packageDetails()}

                  {this.totalSales()}

                  {this.mostSelling()}

                  {this.pendingInstallments()}

                  {this.memberAttendance()}

                  {/* {this.revenueDetails()}

                  {this.branchSale()}

                  {this.calendar()} */}

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    )
  }
}



function mapStateToProps({
  branch, communication: { eventsByDate, activeAnnouncements },
  dashboard: { memberDashboard, mostSellingStock, packageDistribution, branchSales, systemYear, dashboardAttendance, revenueDetails, dashboardTotalSales, pendingInstallments },
  currency: { defaultCurrency }
}) {
  return {
    branch,
    eventsByDate: eventsByDate && eventsByDate.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    activeAnnouncements: activeAnnouncements && activeAnnouncements.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    memberDashboard, mostSellingStock,
    defaultCurrency, packageDistribution, branchSales, systemYear, dashboardAttendance, revenueDetails, dashboardTotalSales, pendingInstallments
  }
}


export default withTranslation()(connect(mapStateToProps)(AdminDashboard))