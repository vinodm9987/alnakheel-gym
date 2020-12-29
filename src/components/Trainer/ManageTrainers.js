
import React, { Component } from 'react'

class ManageTrainers extends Component {
    render() {
        return (
            <div className="mainPage p-3 ManageTrainers">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Human Resources</span>
                    </div>
                    <div className="col-12 pageHead">
                        <h1>Manage Trainers</h1>
                        <div className="pageHeadLine"></div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group inlineFormGroup">
                            <label htmlFor="Member" className="mx-sm-2 inlineFormLabel">Select Member</label>
                            <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="Member">
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
                            <label htmlFor="Trainer" className="mx-sm-2 inlineFormLabel">Select Trainer</label>
                            <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="Trainer">
                                <option value="">Please Select</option>
                            </select>
                            <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                            <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                        <div className="form-group inlineFormGroup">
                            <label htmlFor="Period" className="mx-sm-2 inlineFormLabel">Select Period</label>
                            <select className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="Period">
                                <option value="">Please Select</option>
                            </select>
                            <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                            <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2">
                        <div className="form-group inlineFormGroup">
                            <label htmlFor="Amount" className="mx-sm-2 inlineFormLabel">Amount</label>
                            <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white">
                                <label for="Amount" className="text-danger my-0 mx-1 font-weight-bold">BHD</label>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="Amount" value="10" />
                            </div>
                            <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                        <div className="form-group inlineFormGroup">
                            <label htmlFor="StartDate" className="mx-sm-2 inlineFormLabel type1">Start Date</label>
                            <input type="text" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="StartDate" />
                            <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                            <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                            </div>
                        </div>
                    </div><div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                        <div className="form-group inlineFormGroup">
                            <label htmlFor="EndDate" className="mx-sm-2 inlineFormLabel type1">End Date</label>
                            <input type="text" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="EndDate" />
                            <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                            <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">Err</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="justify-content-sm-end d-flex pt-3">
                            <button type="button" className="btn btn-success mx-1 px-4">Submit</button>
                            <button type="button" className="btn btn-danger mx-1 px-4">Cancel</button>
                        </div>
                    </div>

                    <div className="col-12 tableTypeStriped px-4">
                        <h4 className="mb-4">Manage Trainers List</h4>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Member</th>
                                        <th>Trainer</th>
                                        <th>Period</th>
                                        <th>Amount</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th className="text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex">
                                                <img alt="" src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png" className="mx-1 rounded-circle w-40px h-40px" />
                                                <div className="mx-1 my-2"><h6 className="m-0">Mohamed Al Mulla</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Rahul</td>
                                        <td>One Month</td>
                                        <td className="text-warning">$10</td>
                                        <td>02/04/2020</td>
                                        <td>02/04/2020</td>
                                        <td className="text-center">
                                            <span className="bg-success action-icon">
                                                <span className="iconv1 iconv1-edit"></span>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex">
                                                <img alt="" src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png" className="mx-1 rounded-circle w-40px h-40px" />
                                                <div className="mx-1 my-2"><h6 className="m-0">Mohamed Al Mulla</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Rahul</td>
                                        <td>One Month</td>
                                        <td className="text-warning">$10</td>
                                        <td>02/04/2020</td>
                                        <td>02/04/2020</td>
                                        <td className="text-center">
                                            <span className="bg-success action-icon">
                                                <span className="iconv1 iconv1-edit"></span>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default (ManageTrainers)