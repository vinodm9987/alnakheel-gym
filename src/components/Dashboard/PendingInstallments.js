import React, { Component } from 'react'

class PendingInstallments extends Component {
    render() {
        return (
            <div className="mainPage p-3 membersInstallment">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Dashboard</span><span className="mx-2">/</span><span className="crumbText">Pending Installments</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-12 pageHead">
                                <h1>
                                    <small>
                                        <span className="iconv1 iconv1-left-arrow cursorPointer"></span>
                                    </small>
                                    <span className="px-1"></span>
                                    <span>Pending Installments</span>
                                </h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid px-4 mt-3">
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-5">
                                                <h4>Total Pending Amount</h4>
                                                <h2 className="font-weight-bold dirltrtar text-danger">$ 87511</h2>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-7">
                                                <div class="row d-block d-sm-flex justify-content-end pt-3">
                                                    <div class="col w-auto px-1 flexBasis-auto flex-grow-0">
                                                        <div class="form-group inlineFormGroup">
                                                            <select class="form-control mx-sm-2 inlineFormInputs">
                                                                <option value="">Monthly</option>
                                                            </select>
                                                            <span class="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                                        </div>
                                                    </div>
                                                    <div class="col w-auto px-1 flexBasis-auto flex-grow-0">
                                                        <div class="form-group inlineFormGroup">
                                                            <select class="form-control mx-sm-2 inlineFormInputs">
                                                                <option value="">Jan</option>
                                                                <option value="">Feb</option>
                                                            </select>
                                                            <span class="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="table-responsive">
                                            <table className="borderRoundSeperateTable tdGray">
                                                <thead>
                                                    <tr>
                                                        <th>Member Id</th>
                                                        <th>Name</th>
                                                        <th>Package</th>
                                                        <th>Amount</th>
                                                        <th>Due Date</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-primary font-weight-bold">3656</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <img alt='' src="https://cdn4.iconfinder.com/data/icons/business-conceptual-part1-1/513/business-man-512.png" className="mx-1 rounded-circle w-50px h-50px" />
                                                                <div className="mx-1">
                                                                    <h5 className="m-0 font-weight-bold">Mohammed Al Mulla</h5>
                                                                    <span class="text-body font-weight-light">abcdefg@gmail.com</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><span className="mx-200-normalwrap">1 Month golden membership</span></td>
                                                        <td><h5 className="text-warning font-weight-bold m-0 dirltrtar">$ 200</h5></td>
                                                        <td>12/02/2020</td>
                                                        <td className="text-center">
                                                            <a href="#" className="btn btn-primary br-50px btn-sm px-3">Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-primary font-weight-bold">3656</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <img alt='' src="https://cdn4.iconfinder.com/data/icons/business-conceptual-part1-1/513/business-man-512.png" className="mx-1 rounded-circle w-50px h-50px" />
                                                                <div className="mx-1">
                                                                    <h5 className="m-0 font-weight-bold">Mohammed Al Mulla</h5>
                                                                    <span class="text-body font-weight-light">abcdefg@gmail.com</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><span className="mx-200-normalwrap">1 Month golden membership</span></td>
                                                        <td><h5 className="text-warning font-weight-bold m-0 dirltrtar">$ 200</h5></td>
                                                        <td>12/02/2020</td>
                                                        <td className="text-center">
                                                            <a href="#" className="btn btn-primary br-50px btn-sm px-3">Details</a>
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

export default PendingInstallments