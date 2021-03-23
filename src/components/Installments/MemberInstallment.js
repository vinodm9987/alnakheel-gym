import React, { Component } from 'react'

class MemberInstallment extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="mainPage p-3 membersInstallment">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Members')}</span><span className="mx-2">/</span><span className="crumbText">{t('Member Installments')}</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-12 pageHead">
                                <h1>{t('Member Installments')}</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <form className="form-inline row">
                                    <div className="col-12">
                                        <div className="row d-block d-sm-flex justify-content-between pt-5">
                                            <div className="col w-auto px-1 flexBasis-auto flex-grow-1"><h4 className="px-3">{t('Members List')}</h4></div>
                                            <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                                                <div className="form-group inlineFormGroup">
                                                    <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" placeholder="Search" />
                                                    <span className="iconv1 iconv1-search searchBoxIcon"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="borderRoundSeperateTable tdGray">
                                        <thead>
                                            <tr>
                                                <th>{t('Member Name')}</th>
                                                <th>{t('Package Name')}</th>
                                                <th>{t('Total Amount')}</th>
                                                <th>{t('Paid Amount')}</th>
                                                <th>{t('Remaining Amount')}</th>
                                                <th className="text-center">{t('Action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className="d-flex">
                                                        <img alt='' src="https://www.w3schools.com/bootstrap/paris.jpg"
                                                            className="mx-1 rounded-circle w-50px h-50px" />
                                                        <div className="mx-1">
                                                            <h5 className="m-0 text-muted">Ansar A</h5>
                                                            <span className="text-muted">ID : 325</span>
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="m-0 mnw-200px mxw-250px whiteSpaceNormal">1 Month Gold Plan</div>
                                                </td>
                                                <td className="text-danger"><h4 className="m-0">$ 500</h4></td>
                                                <td className="text-danger"><h4 className="m-0">$ 300</h4></td>
                                                <td className="text-danger"><h4 className="m-0">$ 200</h4></td>
                                                <td className="text-center">
                                                    <a href="/#" type="button" className="btn btn-primary btn-sm w-100px rounded-50px" >{t('Details')}</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/*Pagination*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MemberInstallment