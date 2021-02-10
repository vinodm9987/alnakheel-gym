import React, { Component } from 'react'
class payroll extends Component {
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
                                <h1>{t('Payroll Components')}</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row my-4">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                <div className="form-group inlineFormGroup">
                                    <label htmlFor="ComponentName" className="mx-sm-2 inlineFormLabel">{t('Component Name')}</label>
                                    <input type="text" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="ComponentName" />
                                    <div className="errorMessageWrapper">
                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                <div className="form-group inlineFormGroup">
                                    <label htmlFor="ComponentType" className="mx-sm-2 inlineFormLabel">{t('Component Type')}</label>
                                    <input type="text" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs FormInputsError" id="ComponentType" />
                                    <div className="errorMessageWrapper">
                                        <small className="text-danger mx-sm-2 errorMessage">Err</small>
                                    </div>
                                </div>
                            </div>
                            <div className="justify-content-sm-end d-flex pt-3 col-12">
                                <button type="button" className="btn btn-success mx-1 px-4">{t('Submit')}</button>
                                <button type="button" className="btn btn-danger mx-1 px-4">{t('Cancel')}</button>
                            </div>
                        </div>
                        <h5 className="mb-4"><b>Component Details</b></h5>
                        <div className="table-responsive BckupTable">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>{t('Component Name')}</th>
                                        <th>{t('Component Type')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Basic</td>
                                        <td>{t('Earnings')}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                                                    <span className="iconv1 iconv1-edit"></span></span>
                                            </div>
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

export default payroll