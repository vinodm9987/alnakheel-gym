import React, { Component } from 'react'
class earningsdeductions extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="mainPage p-3">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Finance</span>
                        <span className="mx-2">/</span><span className="crumbText">Earnings & Deductions</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 pageHead">
                                <h1>Earnings & Deductions</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <nav className="commonNavForTab">
                                    <div class="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">Earnings & Deductions</a>
                                        <a class="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">Earnings & Deductions Details</a>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="menu1" role="tabpanel">
                                        <div class="d-flex w-100 my-3">
                                            <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" class="custom-control-input" id="earnings" name="earningsOrDeductions" checked />
                                                <label class="custom-control-label" for="earnings">Earnings</label>
                                            </div>
                                            <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" class="custom-control-input" id="Deductions" name="earningsOrDeductions" />
                                                <label class="custom-control-label" for="Deductions">Deductions</label>
                                            </div>
                                        </div>
                                        {/* ---------Tushar This is for Earnings------------- */}
                                        <div className="row pt-4">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="EarningType" className="mx-sm-2 inlineFormLabel">Earning Type</label>
                                                    <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="EarningType">
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
                                                    <label htmlFor="Value" className="mx-sm-2 inlineFormLabel">Value</label>
                                                    <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center">
                                                        <label for="Value" className="text-white bg-danger my-0 pt-1 px-2 font-weight-bold h-100 align-self-center">BHD</label>
                                                        <input type="text" autoComplete="off" placeholder="Enter Amount" className="form-control mx-sm-2 inlineFormInputs FormInputsError border-0" id="CollectFromCash" />
                                                    </div>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="FromDate" className="mx-sm-2 inlineFormLabel">From Date</label>
                                                    <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white">
                                                        <input type="text" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="FromDate" />
                                                        <span class="iconv1 iconv1-calander dateBoxIcon"></span>
                                                    </div>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="ToDate" className="mx-sm-2 inlineFormLabel">ToDate</label>
                                                    <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white">
                                                        <input type="text" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="ToDate" />
                                                        <span class="iconv1 iconv1-calander dateBoxIcon"></span>
                                                    </div>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="ApplyOn" className="mx-sm-2 inlineFormLabel">Apply On</label>
                                                    <div class="d-flex w-100 my-2">
                                                        <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                            <input type="radio" class="custom-control-input" id="All" name="AllOrIndividual" />
                                                            <label class="custom-control-label" for="All">All</label>
                                                        </div>
                                                        <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                            <input type="radio" class="custom-control-input" id="Individual" name="earningsOrIndividual" />
                                                            <label class="custom-control-label" for="Individual">Individual</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="Employees" className="mx-sm-2 inlineFormLabel">Employees</label>
                                                    <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="Employees">
                                                        <option value="">Please Select</option>
                                                    </select>
                                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="justify-content-sm-end d-flex pt-3 col-12">
                                                <button type="button" className="btn btn-success mx-1 px-4">Submit</button>
                                                <button type="button" className="btn btn-danger mx-1 px-4">{t('Cancel')}</button>
                                            </div>
                                        </div>
                                        {/* ---------Tushar This is for Earnings Ends------------- */}

                                        {/* ---------Tushar This is for Deductions------------- */}
                                        <div className="row pt-4">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="DeductionType" className="mx-sm-2 inlineFormLabel">DeductionType</label>
                                                    <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="DeductionType">
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
                                                    <label htmlFor="Value" className="mx-sm-2 inlineFormLabel">Value</label>
                                                    <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center">
                                                        <label for="Value" className="text-white bg-danger my-0 pt-1 px-2 font-weight-bold h-100 align-self-center">BHD</label>
                                                        <input type="text" autoComplete="off" placeholder="Enter Amount" className="form-control mx-sm-2 inlineFormInputs FormInputsError border-0" id="CollectFromCash" />
                                                    </div>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="FromDate" className="mx-sm-2 inlineFormLabel">From Date</label>
                                                    <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white">
                                                        <input type="text" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="FromDate" />
                                                        <span class="iconv1 iconv1-calander dateBoxIcon"></span>
                                                    </div>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="ToDate" className="mx-sm-2 inlineFormLabel">ToDate</label>
                                                    <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white">
                                                        <input type="text" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="ToDate" />
                                                        <span class="iconv1 iconv1-calander dateBoxIcon"></span>
                                                    </div>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="ApplyOn" className="mx-sm-2 inlineFormLabel">Apply On</label>
                                                    <div class="d-flex w-100 my-2">
                                                        <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                            <input type="radio" class="custom-control-input" id="All" name="AllOrIndividual" />
                                                            <label class="custom-control-label" for="All">All</label>
                                                        </div>
                                                        <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                            <input type="radio" class="custom-control-input" id="Individual" name="earningsOrIndividual" />
                                                            <label class="custom-control-label" for="Individual">Individual</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="Employees" className="mx-sm-2 inlineFormLabel">Employees</label>
                                                    <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="Employees">
                                                        <option value="">Please Select</option>
                                                    </select>
                                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="justify-content-sm-end d-flex pt-3 col-12">
                                                <button type="button" className="btn btn-success mx-1 px-4">Submit</button>
                                                <button type="button" className="btn btn-danger mx-1 px-4">{t('Cancel')}</button>
                                            </div>
                                        </div>
                                        {/* ---------Tushar This is for Deductions Ends------------- */}
                                    </div>

                                    <div className="tab-pane fade" id="menu2" role="tabpanel">
                                        <div class="d-flex w-100 my-3">
                                            <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" class="custom-control-input" id="earnings" name="earningsOrDeductions" checked />
                                                <label class="custom-control-label" for="earnings">Earnings</label>
                                            </div>
                                            <div class="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="radio" class="custom-control-input" id="Deductions" name="earningsOrDeductions" />
                                                <label class="custom-control-label" for="Deductions">Deductions</label>
                                            </div>
                                        </div>




                                        {/* ---------Tushar This is for Earning------------- */}
                                        <div className="table-responsive">
                                            <table className="borderRoundSeperateTable tdGray">
                                                <thead>
                                                    <tr>
                                                        <th>Added Date</th>
                                                        <th>Employee</th>
                                                        <th>Earning Type</th>
                                                        <th>Value</th>
                                                        <th>From Date</th>
                                                        <th>To Date</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><div className="m-0 mxw-85px mnw-85px whiteSpaceNormal">10/20/2020, 10:50 AM</div></td>
                                                        <td>
                                                            <div class="tb">
                                                                <div class="tb-img">
                                                                    <div class="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            class="up-img" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div class="tb-title">
                                                                    <span class="stud-name noID">Mohammed Al Mulla</span>
                                                                    <p class="stud-id">ID: 2345</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><div className="m-0 mxw-100px mnw-150px whiteSpaceNormal">Medical Allowances</div></td>
                                                        <td>$ 50.00</td>
                                                        <td>12/05/2020</td>
                                                        <td>12/05/2020</td>
                                                        <td class="text-center">
                                                            <label class="switch">
                                                                <input type="checkbox" />
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <div class="d-inline-flex">
                                                                <a href="#abc" class="linkHoverDecLess">
                                                                    <span class="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center text-white">
                                                                        <span class="iconv1 iconv1-edit"></span></span></a></div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* ---------Tushar This is for Earnings Ends------------- */}
                                        {/* ---------Tushar This is for Deductions------------- */}
                                        <div className="table-responsive">
                                            <table className="borderRoundSeperateTable tdGray">
                                                <thead>
                                                    <tr>
                                                        <th>Added Date</th>
                                                        <th>Employee</th>
                                                        <th>Deduction Type</th>
                                                        <th>Value</th>
                                                        <th>From Date</th>
                                                        <th>To Date</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><div className="m-0 mxw-85px mnw-85px whiteSpaceNormal">10/20/2020, 10:50 AM</div></td>
                                                        <td>
                                                            <div class="tb">
                                                                <div class="tb-img">
                                                                    <div class="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            class="up-img" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div class="tb-title">
                                                                    <span class="stud-name noID">Mohammed Al Mulla</span>
                                                                    <p class="stud-id">ID: 2345</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><div className="m-0 mxw-100px mnw-150px whiteSpaceNormal">Medical Allowances</div></td>
                                                        <td>$ 50.00</td>
                                                        <td>12/05/2020</td>
                                                        <td>12/05/2020</td>
                                                        <td class="text-center">
                                                            <label class="switch">
                                                                <input type="checkbox" />
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <div class="d-inline-flex">
                                                                <a href="#abc" class="linkHoverDecLess">
                                                                    <span class="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center text-white">
                                                                        <span class="iconv1 iconv1-edit"></span></span></a></div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* ---------Tushar This is for Deductions Ends------------- */}
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

export default earningsdeductions