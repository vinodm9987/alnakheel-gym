import React, { Component } from 'react'
class parttimepayroll extends Component {
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
                                <h1>Part-Time Working Details</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <nav className="commonNavForTab">
                                    <div class="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">Add Hourly Working Hours</a>
                                        <a class="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">Add Hourly Working Hours History</a>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="menu1" role="tabpanel">
                                        <div class="d-flex w-100 my-3">
                                            <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" class="custom-control-input" id="HourlyAmount" name="HourlyAmountOrWorkingHours" checked />
                                                <label class="custom-control-label" for="HourlyAmount">Hourly Amount</label>
                                            </div>
                                            <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" class="custom-control-input" id="WorkingHours" name="HourlyAmountOrWorkingHours" />
                                                <label class="custom-control-label" for="WorkingHours">Working Hours</label>
                                            </div>
                                        </div>

                                        {/*----------------------- Tushar this is Hourly Amount Ends ------------------ */}
                                        <div className="row my-4">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="SelectEmployee" className="mx-sm-2 inlineFormLabel">Select Employee</label>
                                                    <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="SelectEmployee">
                                                        <option value="">Please Select</option>
                                                    </select>
                                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="AmountPerHour" className="mx-sm-2 inlineFormLabel">Amount Per Hour</label>
                                                    <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center">
                                                        <label for="AmountPerHour" className="text-white bg-danger my-0 pt-1 px-2 font-weight-bold h-100 align-self-center">BHD</label>
                                                        <input type="text" autoComplete="off" placeholder="Enter Amount" className="form-control mx-sm-2 inlineFormInputs FormInputsError border-0" id="CollectFromCash" />
                                                    </div>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="justify-content-sm-end d-flex pt-3 col-12">
                                                <button type="button" className="btn btn-success mx-1 px-4">Submit</button>
                                                <button type="button" className="btn btn-danger mx-1 px-4">Cancel</button>
                                            </div>
                                        </div>
                                        <h4 className="mb-4 font-weight-bold">Hourly work hours details</h4>
                                        <div className="table-responsive BckupTable">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Added Date</th>
                                                        <th>Employee</th>
                                                        <th>Amount Per Hour</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>10/02/2020</td>
                                                        <td>
                                                            <div class="tb">
                                                                <div class="tb-img">
                                                                    <div class="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            class="up-img" alt="image" />
                                                                    </div>
                                                                </div>
                                                                <div class="tb-title align-self-center">
                                                                    <span class="stud-name noID text-muted">Mohammed Al Mulla</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>BHD 10</td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                                                                    <span className="iconv1 iconv1-edit cursor-pointer"></span></span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/*----------------------- Hourly Amount Ends here------------------ */}
                                        {/*----------------------- Tushar this is for woking hours ------------------ */}

                                        <div className="row my-4">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="SelectEmployee" className="mx-sm-2 inlineFormLabel">Select Employee</label>
                                                    <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="SelectEmployee">
                                                        <option value="">Please Select</option>
                                                    </select>
                                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                <div class="form-group position-relative">
                                                    <label for="Date">Date</label>
                                                    <input disabled="" type="" autoComplete="off" class="form-control mx-sm-2 inlineFormInputs FormInputsError" id="Date" />
                                                    <span class="iconv1 iconv1-calendar dateBoxIcon"></span>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                <div class="form-group position-relative">
                                                    <label for="WorkedHoursPerDay"> Worked Hours Per Day</label>
                                                    <input disabled="" type="" autoComplete="off" class="form-control mx-sm-2 inlineFormInputs FormInputsError" id="Date" />
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="justify-content-sm-end d-flex pt-3 col-12">
                                                <button type="button" className="btn btn-success mx-1 px-4">Submit</button>
                                                <button type="button" className="btn btn-danger mx-1 px-4">Cancel</button>
                                            </div>
                                        </div>

                                        {/*----------------------- Tushar this is for woking hours Ends ------------------ */}
                                    </div>
                                    <div className="tab-pane fade" id="menu2" role="tabpanel">
                                        <div className="d-flex flex-wrap justify-content-between mt-5">
                                            <h5 className="font-weight-bold align-self-center">Hourly work hours history</h5>
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                    <div className="form-group position-relative">
                                                        <label htmlFor="SelectEmployee" className="mx-sm-2 inlineFormLabel">Employee</label>
                                                        <select className="form-control  inlineFormInputs" id="SelectEmployee">
                                                            <option value="">Please Select</option>
                                                        </select>
                                                        <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>

                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                    <div class="form-group position-relative">
                                                        <label for="FromTime">From Time</label>
                                                        <input disabled="" type="" autoComplete="off" class="form-control  inlineFormInputs" id="FromTime" />
                                                        <span class="iconv1 iconv1-calendar dateBoxIcon r27px"></span>

                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                    <div class="form-group position-relative">
                                                        <label for="ToTime">To Time</label>
                                                        <input disabled="" type="" autoComplete="off" class="form-control  inlineFormInputs" id="ToTime" />
                                                        <span class="iconv1 iconv1-calendar dateBoxIcon r27px"></span>

                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                    <div class="form-group position-relative">
                                                        <label for="SearchMembers">Search Members</label>
                                                        <input type="text" autoComplete="off" className="form-control  badge-pill inlineFormInputs" />
                                                        <span className="iconv1 iconv1-search searchBoxIcon r27px"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 mb-3">
                                            <div id="accordion">
                                                <div class="card my-2">
                                                    <div class="card-header" id="headingOne">
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div class="tb m-1">
                                                                <div class="tb-img">
                                                                    <div class="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            class="up-img" alt="image" />
                                                                    </div>
                                                                </div>
                                                                <div class="tb-title">
                                                                    <span class="stud-name noID text-muted">Mohammed Al Mulla</span>
                                                                    <p class="stud-id text-primary">ID: 2345</p>
                                                                </div>
                                                            </div>
                                                            <div className="m-1">
                                                                <h6 className="text-muted m-0">Designation</h6>
                                                                <h5 className="font-weight-bold m-0">IT Manager</h5>
                                                            </div>
                                                            <div className="m-1">
                                                                <h6 className="text-muted m-0">Branch</h6>
                                                                <h5 className="font-weight-bold m-0">Muharraq</h5>
                                                            </div>
                                                            <div class="mb-0 justifiy-content-end">
                                                                <button class="btn" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                    <span class="iconv1 iconv1-arrow-down"></span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                                        <div class="card-body bg-light">
                                                            <div className="table-responsive bg-white">
                                                                <table class="table table-bordered border-0 cardTablePTP text-center">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="text-danger">Date</th>
                                                                            <th className="text-danger">Worked Hours Per Day</th>
                                                                            <th className="text-danger">Total Amount</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td><span class="iconv1 iconv1-calendar"></span> <span className="mx-1">10/20/2020</span></td>
                                                                            <td>4 Hours</td>
                                                                            <td>BHD 20</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><span class="iconv1 iconv1-calendar"></span> <span className="mx-1">10/20/2020</span></td>
                                                                            <td>4 Hours</td>
                                                                            <td>BHD 20</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><span class="iconv1 iconv1-calendar"></span> <span className="mx-1">10/20/2020</span></td>
                                                                            <td>4 Hours</td>
                                                                            <td>BHD 20</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colspan="2" className="border-0"></td>
                                                                            <td className="border-0">
                                                                                <span className="h5 text-muted">Grand Total</span>
                                                                                <span className="h5 text-danger mx-1"><b>BHD 160</b></span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div class="card my-2">
                                                    <div class="card-header" id="headingThree">
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div class="tb m-1">
                                                                <div class="tb-img">
                                                                    <div class="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            class="up-img" alt="image" />
                                                                    </div>
                                                                </div>
                                                                <div class="tb-title">
                                                                    <span class="stud-name noID text-muted">Mohammed Al Mulla</span>
                                                                    <p class="stud-id text-primary">ID: 2345</p>
                                                                </div>
                                                            </div>
                                                            <div className="m-1">
                                                                <h6 className="text-muted m-0">Designation</h6>
                                                                <h5 className="font-weight-bold m-0">IT Manager</h5>
                                                            </div>
                                                            <div className="m-1">
                                                                <h6 className="text-muted m-0">Branch</h6>
                                                                <h5 className="font-weight-bold m-0">Muharraq</h5>
                                                            </div>
                                                            <div class="mb-0 justifiy-content-end">
                                                                <button class="btn" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                                                    <span class="iconv1 iconv1-arrow-down"></span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                                        <div class="card-body bg-light">
                                                            <div className="table-responsive bg-white">
                                                                <table class="table table-bordered border-0 cardTablePTP text-center">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="text-danger">Date</th>
                                                                            <th className="text-danger">Worked Hours Per Day</th>
                                                                            <th className="text-danger">Total Amount</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td><span class="iconv1 iconv1-calendar"></span> <span className="mx-1">10/20/2020</span></td>
                                                                            <td>4 Hours</td>
                                                                            <td>BHD 20</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><span class="iconv1 iconv1-calendar"></span> <span className="mx-1">10/20/2020</span></td>
                                                                            <td>4 Hours</td>
                                                                            <td>BHD 20</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><span class="iconv1 iconv1-calendar"></span> <span className="mx-1">10/20/2020</span></td>
                                                                            <td>4 Hours</td>
                                                                            <td>BHD 20</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colspan="2" className="border-0"></td>
                                                                            <td className="border-0">
                                                                                <span className="h5 text-muted">Grand Total</span>
                                                                                <span className="h5 text-danger mx-1"><b>BHD 160</b></span>
                                                                            </td>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default parttimepayroll