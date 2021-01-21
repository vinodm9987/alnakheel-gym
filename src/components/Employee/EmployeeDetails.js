import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getEmployeeById } from '../../actions/employee.action'
import { dateToDDMMYYYY } from '../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
class EmployeeDetails extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(getEmployeeById(this.props.match.params.id))
  }

  renderVisaDetails(visaDetails) {
    const { t } = this.props
    if (visaDetails) {
      const { visaNumber, issueDate, expiryDate, passportNo } = visaDetails
      return (
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pt-3">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan="2" className="bg-white border-bottom">{t('Visa Detais')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Visa Number')}</td>
                    <td className="bg-white border-bottom">{visaNumber}</td>
                  </tr>
                  <tr>
                    <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Issue Date')}</td>
                    <td className="bg-white border-bottom">{dateToDDMMYYYY(issueDate)}</td>
                  </tr>
                  <tr>
                    <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Expiry Date')}</td>
                    <td className="bg-white border-bottom">{dateToDDMMYYYY(expiryDate)}</td>
                  </tr>
                  <tr>
                    <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Passport Number')}</td>
                    <td className="bg-white border-bottom">{passportNo}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      )
    }
  }
  render() {
    const { t } = this.props
    if (this.props.employees.current) {
      const { credentialId: { userName, email, avatar }, employeeId, mobileNo, personalId, gender, address, joiningDate, visaDetails,
        designation: { designationName }, employeeType, branch, nationality, dateOfBirth } = this.props.employees.current
      return (
        <div className="mainPage p-3 StockDetails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Employee Details')}</span>
            </div>
            <div className="col-12 pageHead">
              <h1>
                <small><span className="iconv1 iconv1-left-arrow  cursorPointer" onClick={() => this.props.history.goBack()}></span></small><span className="px-1"></span>
                <span>{t('Employee Details')}</span>
              </h1>
              <div className="pageHeadLine"></div>
            </div>
            <div className="container-fluid mt-3">
              <div className="row px-3">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 border bg-light rounded">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-3 pt-3">
                              <div className="d-flex">
                                <div className="mr-2">
                                  <img src={`/${avatar.path}`} className="w-75px h-75px rounded-circle" alt="" />
                                </div>
                                <div className="">
                                  <h4 className="font-weight-bold mt-2">{userName}</h4>
                                  <span className="text-secondary">{t('EMP ID')}: {employeeId}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 d-flex justify-content-end pb-3">
                              {/* <div className="d-flex px-3 pt-3 align-items-center" style={{ height: "60px" }}>
                                  <span className="mx-2 mb-2">Status</span>
                                  <span className="mx-2">
                                    <label className="switch">
                                      <input type="checkbox" />
                                      <span className="slider round"></span>
                                    </label>
                                  </span>
                                </div> */}
                              <div className="px-3 pt-3">
                                <Link to={{ pathname: "/employee", aboutProps: true }} className="btn btn-primary">
                                  <span className="iconv1 iconv1-edit mx-1"></span><span className="mx-1">{t('Edit')}</span>
                                </Link>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                              <div className="d-flex">
                                <div className="">
                                  <span className="iconv1 iconv1-cards text-warning mr-2" style={{ fontSize: "45px" }}></span>
                                </div>
                                <div>
                                  <label className="mb-0 font-weight-bold">{t('Designation')}</label>
                                  <h6>{designationName}</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                              <div className="d-flex">
                                <div className="pt-2">
                                  <span className="iconv1 iconv1-biomatric-phone text-warning mr-2" style={{ fontSize: "30px" }}></span>
                                </div>
                                <div>
                                  <label className="mb-0 font-weight-bold">Phone</label>
                                  <h6 className="dirltrtar">{mobileNo}</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                              <div className="d-flex">
                                <div className="pt-1">
                                  <span className="iconv1 iconv1-calander text-warning mr-2" style={{ fontSize: "40px" }}></span>
                                </div>
                                <div>
                                  <label className="mb-0 font-weight-bold">Date of birth</label>
                                  <h6>{dateToDDMMYYYY(dateOfBirth)}</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                              <div className="d-flex">
                                <div className="">
                                  <span className="iconv1 iconv1-email text-warning mr-2" style={{ fontSize: "45px" }}></span>
                                </div>
                                <div>
                                  <label className="mb-0 font-weight-bold">Email</label>
                                  <h6 className="wordBreakBreakAll">{email}</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pt-3">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th colSpan="2" className="bg-white border-bottom">{t('Other Details')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>Personal Id</td>
                              <td className="bg-white border-bottom">{personalId}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>Gender</td>
                              <td className="bg-white border-bottom">{gender}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>Joining Date</td>
                              <td className="bg-white border-bottom">{dateToDDMMYYYY(joiningDate)}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>Address</td>
                              <td className="bg-white border-bottom">{address}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>Employee Type</td>
                              <td className="bg-white border-bottom">{employeeType}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>Branch</td>
                              <td className="bg-white border-bottom">{branch.map(b => b.branchName).join(', ')}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>Nationality</td>
                              <td className="bg-white border-bottom">{nationality}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {this.renderVisaDetails(visaDetails)}

                  </div>
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
}


function mapStateToProps({ employee }) {
  return {
    employees: employee,
  }
}

export default withTranslation()(connect(mapStateToProps)(EmployeeDetails))
