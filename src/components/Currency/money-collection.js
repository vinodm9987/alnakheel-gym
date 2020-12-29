import React, { Component } from 'react'
class moneyCollection extends Component {
    render() {
        return (
            <div className="mainPage p-3">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Finance</span>
                        <span className="mx-2">/</span><span className="crumbText">Money Collections</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 pageHead">
                                <h1>Money Collections</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <nav className="commonNavForTab">
                                    <div class="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">Money Collection</a>
                                        <a class="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">Money Collection History</a>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="menu1" role="tabpanel">
                                        <div className="d-xl-flex flex-wrap justify-content-end my-4">
                                            <div className="row px-3">
                                                <div className="form-group position-relative MCTabWidth">
                                                    <label htmlFor="SelectBranch" className="inlineFormLabel">Select Branch</label>
                                                    <select className="form-control  inlineFormInputs" id="SelectBranch">
                                                        <option value="">Please Select</option>
                                                    </select>
                                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>
                                                </div>
                                                <div className="form-group position-relative MCTabWidth">
                                                    <label htmlFor="SelectDate" className="inlineFormLabel">Select Date</label>
                                                    <select className="form-control  inlineFormInputs" id="SelectDate">
                                                        <option value="">Please Select</option>
                                                    </select>
                                                    <span className="iconv1 iconv1-calander timeBoxIcon r27px"></span>
                                                </div>
                                                <div className="">
                                                    <label for="SearchMembers">Total Value</label>
                                                    <h2 className="text-danger"><b>BHD 15,0000.00</b></h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div class=" d-flex flex-wrap px-2 py-4 mt-1">
                                                    <h6 class="my-2">Do you want to Collect Money?</h6>
                                                    <div class="position-relative mx-3">
                                                        <select class="bg-warning rounded w-140px px-3 py-1 border border-warning text-white">
                                                            <option value="Partially">Partially</option><option value="Fully">Fully</option>
                                                        </select>
                                                        <span class="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                                                    <div className="m-1">
                                                        <h5 className="font-weight-bold">Point Of Sales</h5>
                                                    </div>
                                                    <div className="m-1">
                                                        <h6 className="text-muted m-0">Total Value</h6>
                                                        <h5 className="text-danger font-weight-bold">BHD 50.00</h5>
                                                    </div>
                                                    <div className="col-12 underline"></div>
                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Payments Methods</h5>
                                                    <div className="d-flex flex-wrap justify-content-between w-100">
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Cash Amount</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Card Amount</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Digital</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                                                    <div className="m-1">
                                                        <h5 className="font-weight-bold">Packages</h5>
                                                    </div>
                                                    <div className="m-1">
                                                        <h6 className="text-muted m-0">Total Value</h6>
                                                        <h5 className="text-danger font-weight-bold">BHD 50.00</h5>
                                                    </div>
                                                    <div className="col-12 underline"></div>
                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Payments Methods</h5>
                                                    <div className="d-flex flex-wrap justify-content-between w-100">
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Cash Amount</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Card Amount</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Digital</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                                                    <div className="m-1">
                                                        <h5 className="font-weight-bold">Classes</h5>
                                                    </div>
                                                    <div className="m-1">
                                                        <h6 className="text-muted m-0">Total Value</h6>
                                                        <h5 className="text-danger font-weight-bold">BHD 50.00</h5>
                                                    </div>
                                                    <div className="col-12 underline"></div>
                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Payments Methods</h5>
                                                    <div className="d-flex flex-wrap justify-content-between w-100">
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Cash Amount</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Card Amount</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                        <div className="m-1">
                                                            <h6 className="text-muted m-0 fs13px">Digital</h6>
                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <h4 className="font-weight-bold col-12 my-4">Collecting Amount</h4>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                                                    <div className="m-1">
                                                        <h5 className="font-weight-bold">Point Of Sales</h5>
                                                    </div>
                                                    <div className="m-1">
                                                        <h6 className="text-muted m-0">Total Value</h6>
                                                        <h5 className="text-danger font-weight-bold">BHD 50.00</h5>
                                                    </div>
                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Enter Amount</h5>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Cash Amount</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Card Amount</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Digital</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                                                    <div className="m-1">
                                                        <h5 className="font-weight-bold">Packages</h5>
                                                    </div>
                                                    <div className="m-1">
                                                        <h6 className="text-muted m-0">Total Value</h6>
                                                        <h5 className="text-danger font-weight-bold">BHD 50.00</h5>
                                                    </div>
                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Enter Amount</h5>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Cash Amount</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Card Amount</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Digital</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                                                    <div className="m-1">
                                                        <h5 className="font-weight-bold">Classes</h5>
                                                    </div>
                                                    <div className="m-1">
                                                        <h6 className="text-muted m-0">Total Value</h6>
                                                        <h5 className="text-danger font-weight-bold">BHD 50.00</h5>
                                                    </div>
                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Enter Amount</h5>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Cash Amount</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Card Amount</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                            <div className="form-group position-relative">
                                                                <label htmlFor="CollectFromCash" className="inlineFormLabel fs13px">Digital</label>
                                                                <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                                                                    <label for="CollectFromCash" className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">BHD</label>
                                                                    <input type="text" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id="CollectFromCash" />
                                                                </div>
                                                                <div className="errorMessageWrapper">
                                                                    <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        {/* ------------Show Only this For Fully Drop Down---------- */}
                                        <div className="row mt-4">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                <div className="form-group inlineFormGroup">
                                                    <label htmlFor="CollectedBY" className="mx-sm-2 inlineFormLabel">Collected By</label>
                                                    <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="CollectedBY">
                                                        <option value="">Please Select</option>
                                                    </select>
                                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                                    <div className="errorMessageWrapper">
                                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="justify-content-sm-end d-flex pt-3">
                                                    <button type="button" className="btn btn-success mx-1 px-4">Submit</button>
                                                    <button type="button" className="btn btn-danger mx-1 px-4">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ------------Show Only this For Fully Drop Down---------- */}
                                    <div className="tab-pane fade" id="menu2" role="tabpanel">
                                        <div className="d-flex flex-wrap justify-content-between mt-5 px-2">
                                            <h5 className="font-weight-bold">Collection History</h5>
                                            <div class="form row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                    <div className="form-group position-relative">
                                                        <label htmlFor="SelectBranch" className="mx-sm-2 inlineFormLabel">Select Branch</label>
                                                        <select className="form-control  inlineFormInputs" id="SelectBranch">
                                                            <option value="">Please Select</option>
                                                        </select>
                                                        <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                    <div className="form-group position-relative">
                                                        <label htmlFor="CollectedBy" className="mx-sm-2 inlineFormLabel">Collected By</label>
                                                        <select className="form-control  inlineFormInputs" id="CollectedBy">
                                                            <option value="">Please Select</option>
                                                        </select>
                                                        <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                                                    <div class="col w-auto px-1 flexBasis-auto flex-grow-0">
                                                        <label htmlFor="SelectDate" className="mx-sm-2 inlineFormLabel">Select Date</label>
                                                        <div class="form-group inlineFormGroup flex-nowrap d-flex">
                                                            <span class="btn btn-warning btn-sm text-white my-1">ALL</span>
                                                            <div class=" form-control mx-sm-2 inlineFormInputs" format="dd/MM/yyyy">
                                                                <input aria-invalid="false" readonly="" type="text" autoComplete="off" class="bg-light border-0 w-100" value="12/10/2020" />
                                                            </div>
                                                            <span class="iconv1 iconv1-calander dateBoxIcon"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="borderRoundSeperateTable tdGray">
                                                <thead>
                                                    <tr>
                                                        <th>Collection Date</th>
                                                        <th>Collected By</th>
                                                        <th>Total Amount</th>
                                                        <th>Collected Amount</th>
                                                        <th>Remaning Amount</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>10/20/2020</td>
                                                        <td>
                                                            <div class="tb">
                                                                <div class="tb-img">
                                                                    <div class="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            class="up-img" alt="image" />
                                                                    </div>
                                                                </div>
                                                                <div class="tb-title">
                                                                    <span class="stud-name noID">Mohammed Al Mulla</span>
                                                                    <p class="stud-id">ID: 2345</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>BHD 500.00</td>
                                                        <td>BHD 500.00</td>
                                                        <td>BHD 500.00</td>
                                                        <td>
                                                            <span class="iconv1 iconv1-arrow-down cursor-pointer" data-toggle="collapse" data-target="#demo"></span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="6" id="demo" class="collapse">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className="my-1 mx-2">
                                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Collected Amount</h5>
                                                                    <div className="d-flex flex-wrap justify-content-between w-100">
                                                                        <div className="my-1 mx-2">
                                                                            <h6 className="text-muted m-0 fs13px">Cash Amount</h6>
                                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                                        </div>
                                                                        <div className="my-1 mx-2">
                                                                            <h6 className="text-muted m-0 fs13px">Card Amount</h6>
                                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                                        </div>
                                                                        <div className="my-1 mx-2">
                                                                            <h6 className="text-muted m-0 fs13px">Digital</h6>
                                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="my-1 mx-2">
                                                                    <h6 className="m-0">Branch</h6>
                                                                    <h5 className="text-warning font-weight-bold">Muharraq</h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>10/20/2020</td>
                                                        <td>
                                                            <div class="tb">
                                                                <div class="tb-img">
                                                                    <div class="tb-img">
                                                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                                                            class="up-img" alt="image" />
                                                                    </div>
                                                                </div>
                                                                <div class="tb-title">
                                                                    <span class="stud-name noID">Mohammed Al Mulla</span>
                                                                    <p class="stud-id">ID: 2345</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>BHD 500.00</td>
                                                        <td>BHD 500.00</td>
                                                        <td>BHD 500.00</td>
                                                        <td>
                                                            <span class="iconv1 iconv1-arrow-down cursor-pointer" data-toggle="collapse" data-target="#demo1"></span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="6" id="demo1" class="collapse">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className="my-1 mx-2">
                                                                    <h5 className="font-weight-bold col-12 pt-2 px-0">Collected Amount</h5>
                                                                    <div className="d-flex flex-wrap justify-content-between w-100">
                                                                        <div className="my-1 mx-2">
                                                                            <h6 className="text-muted m-0 fs13px">Cash Amount</h6>
                                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                                        </div>
                                                                        <div className="my-1 mx-2">
                                                                            <h6 className="text-muted m-0 fs13px">Card Amount</h6>
                                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                                        </div>
                                                                        <div className="my-1 mx-2">
                                                                            <h6 className="text-muted m-0 fs13px">Digital</h6>
                                                                            <h6 className="text-danger font-weight-bold">BHD 50.00</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="my-1 mx-2">
                                                                    <h6 className="m-0">Branch</h6>
                                                                    <h5 className="text-warning font-weight-bold">Test Center</h5>
                                                                </div>
                                                            </div>
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
        )
    }
}

export default moneyCollection