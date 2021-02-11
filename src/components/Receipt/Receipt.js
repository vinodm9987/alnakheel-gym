import React, { Component } from 'react'

class Receipt extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="pr">
                <div className="container-fluid bg-white w-100 overflow-auto h-100">
                    {/* ------Tushar this for Receipt Pop up Print---------- */}
                    {/* <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#receiptModal">{t('Receipt')}</button>
                    <div class="modal" id="receiptModal">
                        <div class="modal-dialog">
                            <div class="modal-content border-0 bg-white">
                                <div class="modal-body text-center">
                                    <h6 className=""><b>Do you want to print a Receipt ?</b></h6>
                                    <button type="button" class="btn btn-success px-4 py-1 m-1">{t('Yes')}</button>
                                    <button type="button" class="btn btn-danger px-4 py-1 m-1">{t('No')}</button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* ------Tushar this for Receipt Pop up Print End---------- */}
                    {/* -------This is for Point of Slaes Receipt------------ */}
                    <div className="container">
                        <div className="text-center my-4">
                            <img alt='' src="/static/media/gymnago.8cf7122d.png" className="" width="300" />
                        </div>
                        <div className="row px-5">
                            <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 p-3">
                                <label className="m-0 font-weight-bold">{t('Address')}</label>
                                <p className="whiteSpaceNormal mnw-150px mxw-250px">GymnaGo Galali, P.O.Box:50839,Kingdom of Bharain PH:342569874</p>
                            </div>
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-3">
                                <div className="mb-3">
                                    <label className="m-0 font-weight-bold">{t('Receipt No')}</label>
                                    <p className="">578941</p>
                                </div>
                                <div className="">
                                    <label className="m-0 font-weight-bold">{t('Date & Time')}</label>
                                    <p className="">20/05/2020 10:05 AM</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 p-3">
                                <div className="text-md-right">
                                    <label className="m-0">{t('Receipt Total')}</label>
                                    <p className="h4 font-weight-bold">BHD 15.00</p>
                                </div>
                            </div>
                        </div>
                        <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                            <div className="">
                                <h6 className="font-weight-bold m-1">
                                    <span className="px-1">{t('ID')}:</span>
                                    <span className="px-1">23154</span>
                                </h6>
                            </div>
                            <h6 className="font-weight-bold m-1">Mohammed Al Mulla</h6>
                            <div className="">
                                <h6 className="font-weight-bold m-1">
                                    <span className="px-1">{t('Mob')}:</span>
                                    <span className="px-1">7894561230</span>
                                </h6>
                            </div>
                        </div>
                        <div className="table-responsive RETable">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>{t('No')}</th>
                                        <th>{t('Description')}</th>
                                        <th>{t('Price')}</th>
                                        <th>{t('Qty')}</th>
                                        <th>{t('Total')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Your Item Name</td>
                                        <td>BHD 1.2</td>
                                        <td>1</td>
                                        <td>BHD 1.2</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Your Item Name</td>
                                        <td>BHD 1.2</td>
                                        <td>1</td>
                                        <td>BHD 1.2</td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <div className="text-right my-1">{t('Amount Total')} :</div>
                                            <div className="text-right my-1">{t('Discount')} :</div>
                                            <div className="text-right my-1">{t('Gift Card')} :</div>
                                            <div className="text-right my-1">{t('VAT')} (5%) :</div>
                                            <div className="text-right my-1">{t('Grand Total')} :</div>
                                        </td>
                                        <td className="">
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">1.2</span></div>
                                            <div className="my-1"><span className="invisible">BHD</span> <span className="px-1">00.12</span></div>
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">0.22</span></div>
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">1.00</span></div>
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">1</span></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex flex-wrap justify-content-between my-4">
                            <h6 className="font-weight-bold">{t('Paid Amount')}: BHD 15.00</h6>
                            <h6 className="font-weight-bold">{t('Served by')}: Bahgabati Rao</h6>
                        </div>
                        <div className="text-center px-5">
                            <h5 className="text-muted">{t('The receipt amount will not be refunded in any case.')}</h5>
                            <h5 className="font-weight-bold">{t('Thank You')}</h5>
                        </div>
                    </div>
                    {/* -------This is for Point of Slaes Receipt ENd------------ */}
                    {/* -------This is for Package Receipt------------ */}

                    <div className="container">
                        <div className="text-center my-4">
                            <img alt='' src="/static/media/gymnago.8cf7122d.png" className="" width="300" />
                        </div>
                        <div className="row px-5">
                            <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 p-3">
                                <label className="m-0 font-weight-bold">{t('Address')}</label>
                                <p className="whiteSpaceNormal mnw-150px mxw-250px">GymnaGo Galali, P.O.Box:50839,Kingdom of Bharain PH:342569874</p>
                            </div>
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-3">
                                <div className="mb-3">
                                    <label className="m-0 font-weight-bold">{t('Receipt No')}</label>
                                    <p className="">578941</p>
                                </div>
                                <div className="">
                                    <label className="m-0 font-weight-bold">{t('Date & Time')}</label>
                                    <p className="">20/05/2020 10:05 AM</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 p-3">
                                <div className="text-md-right">
                                    <label className="m-0">{t('Receipt Total')}</label>
                                    <p className="h4 font-weight-bold">BHD 15.00</p>
                                </div>
                            </div>
                        </div>
                        <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                            <div className="">
                                <h6 className="font-weight-bold m-1">
                                    <span className="px-1">{t('ID')}:</span>
                                    <span className="px-1">23154</span>
                                </h6>
                            </div>
                            <h6 className="font-weight-bold m-1">Mohammed Al Mulla</h6>
                            <div className="">
                                <h6 className="font-weight-bold m-1">
                                    <span className="px-1">{t('Mob')}:</span>
                                    <span className="px-1">7894561230</span>
                                </h6>
                            </div>
                        </div>
                        <div className="table-responsive RETable">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>{t('No')}</th>
                                        <th>{t('Description')}</th>
                                        <th>{t('From Date')}</th>
                                        <th>{t('To Date')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Your Item Name</td>
                                        <td>02/20/2020</td>
                                        <td>02/20/2020</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <div className="text-right my-1">{t('Amount Total')} :</div>
                                            <div className="text-right my-1">{t('Discount')} :</div>
                                            <div className="text-right my-1">{t('Gift Card')} :</div>
                                            <div className="text-right my-1">{t('VAT')} (5%) :</div>
                                            <div className="text-right my-1">{t('Grand Total')} :</div>
                                        </td>
                                        <td className="">
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">1.2</span></div>
                                            <div className="my-1"><span className="invisible">BHD</span> <span className="px-1">00.12</span></div>
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">0.22</span></div>
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">1.00</span></div>
                                            <div className="my-1"><span className="">BHD</span> <span className="px-1">1</span></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex flex-wrap justify-content-between my-4">
                            <h6 className="font-weight-bold">{t('Paid Amount')}: BHD 15.00</h6>
                            <h6 className="font-weight-bold">{t('Served by')}: Bahgabati Rao</h6>
                        </div>
                        <div className="text-center px-5">
                            <h5 className="text-muted">{t('The receipt amount will not be refunded in any case.')}</h5>
                            <h5 className="font-weight-bold">{t('Thank You')}</h5>
                        </div>
                    </div>

                    {/* -------This is for Package Receipt ENd------------ */}

                </div>
            </div>
        )
    }
}

export default Receipt