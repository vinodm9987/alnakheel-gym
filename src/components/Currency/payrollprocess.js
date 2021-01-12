import React, { Component } from 'react'
class payrollprocess extends Component {
    render() {
        return (
            <div className="mainPage p-3">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Finance</span>
                        <span className="mx-2">/</span><span className="crumbText">Payroll</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 pageHead">
                                <h1>Payroll Processing</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <nav className="commonNavForTab">
                                    <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                                        <a className="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">Generate Payroll</a>
                                        <a className="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">Payroll History</a>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="menu1" role="tabpanel">
                                        <div className="d-flex flex-wrap justify-content-between bg-light rounded p-3 my-4 border">
                                            <div className="form-group position-relative m-1">
                                                <label htmlFor="FromeDate" className="mx-sm-2 inlineFormLabel">Frome Date</label>
                                                <select className="form-control  inlineFormInputs bg-white" id="FromeDate">
                                                    <option value="">Please Select</option>
                                                </select>
                                                <span className="iconv1 iconv1-calander selectBoxIcon r27px"></span>
                                            </div>
                                            <div className="form-group position-relative m-1">
                                                <label htmlFor="ToDate" className="mx-sm-2 inlineFormLabel">To Date</label>
                                                <select className="form-control  inlineFormInputs bg-white" id="ToDate">
                                                    <option value="">Please Select</option>
                                                </select>
                                                <span className="iconv1 iconv1-calander selectBoxIcon r27px"></span>
                                            </div>
                                            <div className="form-group m-1">
                                                <label htmlFor="NoofDays" className="mx-sm-2 inlineFormLabel">No Of Days</label>
                                                <h3 className="mb-0 text-danger text-center"><b>30</b></h3>
                                            </div>
                                            <div className="align-self-center m-1">
                                                <h4 className="mb-0"><b>October 2020</b></h4>
                                            </div>
                                            <div className="align-self-center m-1">
                                                <button type="button" className="btn btn-success mx-1 px-4"><span className="mx-1 iconv1 iconv1-sync"></span><span className="mx-1">Run Payroll</span></button>
                                            </div>
                                        </div>
                                        <div className="d-flex w-100 my-3">
                                            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" className="custom-control-input" id="FullTime" name="FullTimeOrPartTime" checked />
                                                <label className="custom-control-label" for="FullTime">Full Time</label>
                                            </div>
                                            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" className="custom-control-input" id="PartTime" name="FullTimeOrPartTime" />
                                                <label className="custom-control-label" for="PartTime">Working Hours</label>
                                            </div>
                                        </div>
                                        <div className="row border">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3 p-0 bgGray">
                                                <ul className="list-group PrPLI">
                                                    <li className="headingLI list-group-item font-weight-bold"><b>Employes</b></li>
                                                    <li className="list-group-item active d-flex justify-content-between">
                                                        <h6 className="">First item </h6>
                                                        <h6 className="iconv1 iconv1-right-small-arrow"> </h6>
                                                    </li>
                                                    <li className="list-group-item">Second item</li>
                                                    <li className="list-group-item">Third item</li>
                                                </ul>

                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-9 p-0 bgLightaqublue">
                                                <div className="table-responsive">
                                                    <table className="table table-bordered prpTable">
                                                        <thead>
                                                            <tr>
                                                                <th>Earnings</th>
                                                                <th>Amount</th>
                                                                <th>Deductions</th>
                                                                <th>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Basic</td>
                                                                <td>$ 1500.00</td>
                                                                <td>Loan</td>
                                                                <td>$ 20.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Basic</td>
                                                                <td>$ 1500.00</td>
                                                                <td>Loan</td>
                                                                <td>$ 20.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Basic</td>
                                                                <td>$ 1500.00</td>
                                                                <td>Loan</td>
                                                                <td>$ 20.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td></td>
                                                                <td className="text-danger font-weight-bold">Total $ 25.00</td>
                                                                <td></td>
                                                                <td className="text-danger font-weight-bold">Total $ 25.00</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div className="text-right mx-3">
                                                        <h6 className="font-weight-bold text-muted">Net Pay:<span className="mx-2 text-dark">$ 2500.00</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="menu2" role="tabpanel">
                                        <div className="d-xl-flex flex-wrap justify-content-between mt-5">
                                            <h5 className="font-weight-bold align-self-center">Payroll history</h5>
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                    <div className="form-group position-relative">
                                                        <label htmlFor="JobType" className="mx-sm-2 inlineFormLabel">Job Type</label>
                                                        <select className="form-control  inlineFormInputs" id="JobType">
                                                            <option value="">Please Select</option>
                                                        </select>
                                                        <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                    <div className="form-group position-relative">
                                                        <label htmlFor="Month" className="mx-sm-2 inlineFormLabel">Month</label>
                                                        <select className="form-control  inlineFormInputs" id="Month">
                                                            <option value="">Please Select</option>
                                                        </select>
                                                        <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                    <div className="form-group position-relative">
                                                        <label for="SearchMembers">Search Members</label>
                                                        <input type="text" autocomplete="off" className="form-control  badge-pill inlineFormInputs" />
                                                        <span className="iconv1 iconv1-search searchBoxIcon r27px"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive mt-3">
                                            <table className="borderRoundSeperateTable tdGray">
                                                <thead>
                                                    <tr>
                                                        <th>Employee</th>
                                                        <th>Designation</th>
                                                        <th>Month</th>
                                                        <th>NO Of Days</th>
                                                        <th>Earnings Total</th>
                                                        <th>Deductions Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="tb">
                                                                <div className="tb-img">
                                                                    <div className="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            className="up-img" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="tb-title align-self-center">
                                                                    <span className="stud-name noID text-muted">Mohammed Al Mulla</span>
                                                                    <p className="stud-id text-primary">ID: 2345</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>IT Manager</td>
                                                        <td>October</td>
                                                        <td>30</td>
                                                        <td>$ 15000.00</td>
                                                        <td><button type="button" className="btn btn-success mx-1 px-4">Details</button></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default payrollprocess