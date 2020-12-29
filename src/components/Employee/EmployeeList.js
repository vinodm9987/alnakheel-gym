import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllEmployeeByFilter, updateStatusOfEmployee } from '../../actions/employee.action'
import { Link } from 'react-router-dom'
import { getFilterDesignation } from '../../actions/designation.action'
import { withTranslation } from 'react-i18next'


class EmployeeList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      designationId: '',
      search: '',
      showComponents: false,
      url: this.props.match.url,
    }
    this.props.dispatch(getAllEmployeeByFilter({ search: '', designation: '' }))
    this.props.dispatch(getFilterDesignation())
  }

  handleStatusChange(e, employeeId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateStatusOfEmployee(employeeId, obj))
  }


  handleFilter(search, designation) {
    this.setState({
      search,
      designationId: designation
    }, () =>
      window.dispatchWithDebounce(getAllEmployeeByFilter)({ search, designation })
    )
  }

  render() {
    const { t } = this.props
    return (
      <div className={this.state.url === '/employee/employee-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <form className="form-inline row">
            <div className="col-12">
              <div className="row d-block d-sm-flex justify-content-end pt-5">
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                  <div className="form-group inlineFormGroup">
                    <label className="mx-sm-2 inlineFormLabel">{t('Designation')}</label>
                    <select className="form-control mx-sm-2 inlineFormInputs" value={this.state.designationId} onChange={(e) => this.handleFilter(this.state.search, e.target.value)}>
                      <option value="">{t('All')}</option>
                      {this.props.designations.filterDesignation && this.props.designations.filterDesignation.map((designation, i) => {
                        return (
                          <option key={i} value={designation._id}>{designation.designationName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  </div>
                </div>
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                  <div className="form-group inlineFormGroup">
                    <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" onChange={(event) => this.handleFilter(event.target.value, this.state.designationId)} />
                    <span className="iconv1 iconv1-search searchBoxIcon"></span>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="col-12 px-0">
            <div className="row">
              {this.props.employees && this.props.employees.map((employee, i) => {
                return (
                  <div className="col-12 col-sm-12 col-md-6 col-xl-4 d-flex align-items-stretch" key={i}>
                    <div className="card bg-light mb-4 w-100" >
                      <div className="card-body">
                        <div className="col-12 px-0 d-flex justify-content-end">
                          <label className="switch">
                            <input type="checkbox" checked={employee.status} onChange={(event) => this.handleStatusChange(event, employee._id)} />
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="col-12 px-0">
                          <div className="d-flex align-items-center">
                            <img src={employee.credentialId.avatar.path} alt='' className="mx-1 rounded-circle w-75px h-75px" />
                            <div className="mx-1">
                              <h4 className="m-0">{employee.credentialId.userName}</h4>
                              <span className="text-muted">{t('EMP ID')} : {employee.employeeId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 px-0 pt-3">
                          <div className="d-flex w-100 align-items-center pb-1">
                            <span className="iconv1 iconv1-call text-warning mx-1 font-weight-bold"></span>
                            <span className="text-muted mx-1 dirltrtar d-inline-block">{employee.mobileNo}</span>
                          </div>
                          <div className="d-flex w-100 align-items-center pb-1">
                            <span className="iconv1 iconv1-email text-warning mx-1 font-weight-bold"></span>
                            <span className="text-muted mx-1 wordBreakBreakAll">{employee.credentialId.email}</span>
                          </div>
                          <div className="d-flex w-100 align-items-center pb-1">
                            <span className="iconv1 iconv1-identity text-warning mx-1 font-weight-bold"></span>
                            <span className="text-muted mx-1">{employee.personalId}</span>
                          </div>
                          <div className="d-flex w-100 align-items-center pb-1">
                            <span className="iconv1 iconv1-my-details text-warning mx-1 font-weight-bold"></span>
                            <span className="text-muted mx-1">{employee.gender}</span>
                          </div>
                          <div className="d-flex flex-wrap w-100 align-items-center pb-2">
                            <div className="d-flex align-items-center flex-grow-1">
                              <span className="iconv1 iconv1-location text-warning mx-1 font-weight-bold"></span>
                              <span className="text-muted mx-1">{employee.address}</span>
                            </div>
                            <div className="d-flex align-items-end justify-content-end flex-grow-1">
                              <Link className="text-primary font-weight-bold mx-1" to={`/employee-details/${employee._id}`}>{t('Details')}</Link>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps({ employee: { response }, designation }) {
  return {
    employees: response,
    designations: designation
  }
}

export default withTranslation()(connect(mapStateToProps)(EmployeeList))
