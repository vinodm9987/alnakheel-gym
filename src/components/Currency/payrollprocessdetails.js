import React, { Component } from 'react'
class payrollprocessdetails extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="mainPage p-3">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Finance')}</span>
                        <span className="mx-2">/</span><span className="crumbText">{t('Payroll')}</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 pageHead">
                                <h1>{t('Employee Payroll Details')}</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="d-flex flex-wrap justify-content-between bgLightaqublue border rounded p-3 my-1">
                            <div class="tb m-1">
                                <div class="tb-img">
                                    <div class="tb-img">
                                        <img src="https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png"
                                            class="up-img" alt="" />
                                    </div>
                                </div>
                                <div class="tb-title">
                                    <span class="stud-name noID text-muted">Mohammed Al Mulla</span>
                                    <p class="stud-id text-primary">ID: 2345</p>
                                </div>
                            </div>
                            <div className="m-1">
                                <h6 className="text-muted m-0">{t('Designation')}</h6>
                                <h5 className="font-weight-bold m-0">IT Manager</h5>
                            </div>
                            <div className="m-1">
                                <h6 className="text-muted m-0">{t('Branch')}</h6>
                                <h5 className="font-weight-bold m-0">Muharraq</h5>
                            </div>
                            <div className="m-1">
                                <h6 className="text-muted m-0">{t('Date of Join')}</h6>
                                <h5 className="font-weight-bold m-0">15/02/2020</h5>
                            </div>
                            <div className="m-1">
                                <h6 className="text-muted m-0">{t('Job Type')}</h6>
                                <h5 className="font-weight-bold m-0">{t('Full Time')}</h5>
                            </div>
                        </div>


                        <div className="bgLightaqublue border rounded p-3 my-2">

                            <div className="d-xl-flex flex-wrap justify-content-between">
                                <h5 className="font-weight-bold align-self-center">{t('Employee Payslips')}</h5>
                                <div className="row">
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                        <div className="form-group position-relative">
                                            <label htmlFor="Year" className="mx-sm-2 inlineFormLabel">{t('Year')}</label>
                                            <select className="form-control  inlineFormInputs" id="Year">
                                                <option value="">{t('Please Select')}</option>
                                            </select>
                                            <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                        <div className="form-group position-relative">
                                            <label htmlFor="Month" className="mx-sm-2 inlineFormLabel">{t('Month')}</label>
                                            <select className="form-control  inlineFormInputs" id="Month">
                                                <option value="">{t('Please Select')}</option>
                                            </select>
                                            <span className="iconv1 iconv1-arrow-down selectBoxIcon r27px"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive mt-3">
                                <table className="borderRoundSeperateTable tdGray ppdTable">
                                    <thead>
                                        <tr>
                                            <th>{t('Pay Date')}</th>
                                            <th>{t('Year')}</th>
                                            <th>{t('Month')}</th>
                                            <th>{t('From')}</th>
                                            <th>{t('To')}</th>
                                            <th>{t('Earnings')}</th>
                                            <th>{t('Deductions')}</th>
                                            <th>{t('Net Pay')}</th>
                                            <th>{t('Payslip')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>12/02/2020</td>
                                            <td>2020</td>
                                            <td>October</td>
                                            <td>30/01/2010</td>
                                            <td>30/01/2010</td>
                                            <td>$ 15000.00</td>
                                            <td>$ 15000.00</td>
                                            <td>$ 15000.00</td>
                                            <td><button type="button" className="badge-pill badge-warning mx-1 px-4 text-white border-0 py-1" data-toggle="modal" data-target="#PayslipModalprpd">View</button>
                                                <button type="button" className="badge-pill badge-primary mx-1 px-4 text-white border-0 py-1">{t('Download')}</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* ------------Pop up details------------ */}
                            <div class="modal fade commonYellowModal" id="PayslipModalprpd">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title">{t('Payslip')}</h4>
                                            <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                                        </div>
                                        <div class="modal-body">
                                            <div className="container">
                                                <div className="text-center my-3">
                                                    <img src="/static/media/gymnago.8cf7122d.png" className="" width="250" alt="" />
                                                </div>
                                                <div className="d-flex flex-wrap justify-content-between py-3">
                                                    <div className="">
                                                        <div className="mb-1">
                                                            <label className="m-0 font-weight-bold">{t('Employee Name')}:</label>
                                                            <span className="mx-2">Mohammed Al Mulla</span>
                                                        </div>
                                                        <div className="mb-1">
                                                            <label className="m-0 font-weight-bold">{t('Designation')}:</label>
                                                            <span className="mx-2">IT Manager</span>
                                                        </div>
                                                        <div class="mb-1">
                                                            <label class="m-0 font-weight-bold">{t('Monthly')}:
                                                            <span class="mx-2">July</span></label>
                                                            <label class="m-0 font-weight-bold ml-sm-2">{t('Year')}:
                                                            <span class="mx-2">2020</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div className="text-md-right">
                                                            <label className="m-0 font-weight-bold">{t('Date')}:</label>
                                                            <span className="mx-2">20/05/2020 </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-bordered prpdTable whiteSpaceNoWrap">
                                                        <thead>
                                                            <tr>
                                                                <th class="text-center" colspan="2">{t('Earnings')}</th>
                                                                <th class="text-center" colspan="2">{t('Deductions')}</th>
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
                                                                <td>Medical</td>
                                                                <td>$ 1500.00</td>
                                                                <td>Loan</td>
                                                                <td>$ 20.00</td>
                                                            </tr>
                                                            <tr>

                                                                <td><b>Total Earnings</b></td>
                                                                <td><b>$ 2700.00</b></td>
                                                                <td><b>Total Earnings</b></td>
                                                                <td><b>$ 2700.00</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="4" className="text-right mx-3">
                                                                    <h6 className="font-weight-bold text-muted">Net Salary:<span className="mx-2 text-dark">$ 2500.00</span></h6>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <h6 className="text-muted">{t('In Words')}: <span className="mx-1">Twenty six Thousand Egit Hundered</span></h6>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className="py-3">
                                                        <div className="mb-1">
                                                            <label className="m-0 font-weight-bold text-muted">{t('Ref No')}:</label>
                                                            <span className="mx-2">Bank NEFT</span>
                                                        </div>
                                                        <div className="mb-1">
                                                            <label className="m-0 font-weight-bold text-muted">{t('Payment Transfer Date')}:</label>
                                                            <span className="mx-2">15/05/2020</span>
                                                        </div>
                                                    </div>
                                                    <div className="py-3">
                                                        <div className="text-md-right">
                                                            <label className="m-0 font-weight-bold text-muted">{t('Name Of Bank')}:</label>
                                                            <span className="mx-2">*************</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className="py-3">
                                                        <h6 className="m-0 text-muted font-weight-bold">{t('Signature of Employee')}:</h6>
                                                        <h6 className="m-0 mt-1">trisha</h6>
                                                    </div>
                                                    <div className="py-3">
                                                        <div className="text-md-right">
                                                            <label className="m-0 font-weight-bold text-muted">{t('Director')}:</label>
                                                            <span className="mx-2">*************</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <button type="button" class="btn btn-success px-4 py-1 my-2">{t('Print')}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ------------Pop up details Ends------------ */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default payrollprocessdetails