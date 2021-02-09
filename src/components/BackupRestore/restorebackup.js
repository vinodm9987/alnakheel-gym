import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
class restorebackup extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="mainPage p-3 FreezeMembers">
                <div className="row">
                    <div className="col-12 pageBreadCrumbs">
                        <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Backup and Restore')}</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 pageHead">
                                <h1>{t('Backup and Restore')}</h1>
                            </div>
                        </div>
                        <div className="pageHeadLine"></div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <nav className="commonNavForTab">
                                    <div class="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">{t('Create Restore')}</a>
                                        <a class="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">{t('Restore History')}</a>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane fade show active mt-4" id="menu1" role="tabpanel">
                                        <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                            <div class="form-group position-relative">
                                                <label for="RestoreName">{t('Restore Name')}</label>
                                                <input disabled="" type="number" autoComplete="off" class="form-control bg-white" id="RestoreName" />
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                            <div class="form-group position-relative">
                                                <label for="Source">{t('Source')}</label>
                                                <div class="custom-file-gym form-control">
                                                    <input type="file" class="custom-file-input-gym" id="customFile" />
                                                    <label class="rightBrowserLabel" for="customFile">{t('Upload Image')}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <div class="justify-content-sm-end d-flex pt-3">
                                                <button type="button" class="btn btn-success mx-1 px-4"><span className="iconv1 iconv1-sync"></span> <span className="px-1">{t('Run Restore')}</span></button>
                                                <button type="button" class="btn btn-danger mx-1 px-4">{t('Cancel')}</button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="my-4">
                                                <h6 className="font-weight-bold mb-3">{t('Restore in progres. please wait..')}</h6>
                                                <div className="d-flex bg-light p-2">
                                                    <div className="align-self-center m-1">Here comes the progress bar</div>
                                                    <h6 className="bg-danger action-icon w-30px h-30px rounded-circle d-flex align-items-center
                                                     justify-content-center m-2 text-white cursor-pointer" data-toggle="modal" data-target="#backupStopModal">
                                                        <span className="iconv1 iconv1-close"></span>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade mt-4" id="menu2" role="tabpanel">
                                        <div className="table-responsive">
                                            <table className="borderRoundSeperateTable tdGray">
                                                <thead>
                                                    <tr>
                                                        <th>{t('Restore Name')}</th>
                                                        <th>{t('Date & Time')}</th>
                                                        <th>{t('Source')}</th>
                                                        <th>{t('Elapse Time')}</th>
                                                        <th>{t('Size')}</th>
                                                        <th>{t('Status')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">Alnakheel MAnual backup</div>
                                                        </td>
                                                        <td><div className="m-0 mxw-85px mnw-85px whiteSpaceNormal">10/20/2020, 10:50 AM</div></td>
                                                        <td>
                                                            <div className="m-0 mxw-150px mnw-100px whiteSpaceNormal">c:\backup\files\system-name</div>
                                                        </td>
                                                        <td>3:25 Mins</td>
                                                        <td>619 KB</td>
                                                        <td className="text-primary">{t('Success')}</td>
                                                        {/* <td className="text-danger">{t('Failed')}</td> */}
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div className="m-0 mxw-200px mnw-100px whiteSpaceNormal">Alnakheel MAnual backup</div>
                                                        </td>
                                                        <td><div className="m-0 mxw-85px mnw-85px whiteSpaceNormal">10/20/2020, 10:50 AM</div></td>
                                                        <td>
                                                            <div className="m-0 mxw-150px mnw-100px whiteSpaceNormal">c:\backup\files\system-name</div>
                                                        </td>
                                                        <td>3:25 Mins</td>
                                                        <td>619 KB</td>
                                                        <td className="text-primary">{t('Success')}</td>
                                                        {/* <td className="text-danger">{t('Failed')}</td> */}
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

export default restorebackup