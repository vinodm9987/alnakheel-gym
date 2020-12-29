import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getAssetsById, addNewRepair } from '../../../actions/asset.action'
import { dateToDDMMYYYY, validator, dateToHHMM } from '../../../utils/apis/helpers'
import $ from 'jquery'
import { findDOMNode } from 'react-dom';
import { CSVLink } from "react-csv";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'
import { PRODIP } from '../../../config'

class AssetDetails extends Component {

  constructor(props) {
    super(props)
    this.default = {
      technicianName: '',
      mobileNo: '',
      contractRepair: true,
      maintainStatus: '',
      amount: '',
      comments: '',
      technicianNameE: '',
      mobileNoE: '',
      maintainStatusE: '',
      amountE: '',
    }
    this.state = this.default
    this.props.dispatch(getAssetsById(this.props.match.params.id))
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
      }
    }
  }

  handleSubmit() {
    const el = findDOMNode(this.refs.repairAssetsClose);
    const { t } = this.props
    const { technicianName, mobileNo, contractRepair, maintainStatus, amount, comments, technicianNameE, mobileNoE, maintainStatusE, amountE } = this.state
    if (technicianName && mobileNo && maintainStatus && !technicianNameE && !mobileNoE && !maintainStatusE) {
      const repairInfo = { technicianName, mobileNo, maintainStatus, comments, contractRepair }
      if (!contractRepair) {
        if (amount && !amountE) {
          repairInfo.amount = amount
          this.props.dispatch(addNewRepair(this.props.assetById._id, repairInfo))
          $(el).click();
        } else {
          if (!amount) this.setState({ amountE: t('Enter amount') })
        }
      } else {
        this.props.dispatch(addNewRepair(this.props.assetById._id, repairInfo))
        $(el).click();
      }
    } else {
      if (!technicianName) this.setState({ technicianNameE: t('Enter technician name') })
      if (!mobileNo) this.setState({ mobileNoE: t('Enter mobile number') })
      if (!maintainStatus) this.setState({ maintainStatusE: t('Enter maintenance status') })
    }
  }

  downloadPdf() {
    const doc = new jsPDF()
    doc.autoTable({ html: '#myTable' })
    doc.save('table.pdf')
  }

  render() {
    if (this.props.assetById) {
      const { t } = this.props
      const { assetsCode, assetName, originalValue, brandName, assetBranch: { branchName }, supplierName: { supplierName },
        serialNumber, modelNumber, warranty, description, dateOfPurchase, contractor, repairLog, assetImage, } = this.props.assetById
      const { technicianName, mobileNo, contractRepair, maintainStatus, amount, comments } = this.state
      const contractDetails = contractor.filter(contract => contract.current)[0]
      const headers = [
        { label: 'Technician Name', key: 'technicianName' },
        { label: 'Mobile Number', key: 'mobileNo' },
        { label: 'Amount', key: 'amount' },
        { label: 'Status', key: 'maintainStatus' },
        { label: 'Comments', key: 'comments' },
        { label: 'Date/Time', key: 'repairDateTime' },
      ]
      repairLog.forEach(log => {
        delete log._id
      })
      return (
        <div className="mainPage p-3 StockDetails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Assets')}</span>
              <span className="mx-2">/</span><span className="crumbText">{t('Assets Details')}</span>
            </div>
            <div className="col-12 pageHead">
              <h1>
                <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                <span className="px-1"></span>
                <span>{t('Assets Details')}</span>
              </h1>
              <div className="col-12 col-sm-6 d-flex pageRightBtn">
                <div className="d-flex justify-content-end align-items-center w-100">
                  <a href="/#" className="btn btn-warning px-4 text-white" data-toggle="modal" data-target="#RAssets">{t('Repair Assets')}</a>
                </div>
              </div>
              <div className="pageHeadLine"></div>
            </div>
            <div className="container-fluid mt-3">
              <div className="row px-3">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 border bg-light rounded">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="row align-items-center">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2 py-3">
                          <img src={`/${assetImage.path}`} className="w-100" alt="" />
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10">
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2">
                              <label>{t('Asset Number')}</label>
                              <h5>{assetsCode}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                              <label>{t('Asset Name')}</label>
                              <h5>{assetName}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2">
                              <label>{t('Brand Name')}</label>
                              <h5>{brandName}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                              <label>{t('Model Name')}</label>
                              <h5>{modelNumber}</h5>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2">
                              <label>{t('Original value')}</label>
                              <h4 className="text-warning dirltrtar">{this.props.defaultCurrency} {originalValue}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pt-3">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th colSpan="2" className="bg-white border-bottom">{t('Other Details')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Serial Number')}</td>
                              <td className="bg-white border-bottom">{serialNumber}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Date Of Purchase')}</td>
                              <td className="bg-white border-bottom">{dateToDDMMYYYY(dateOfPurchase)}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Supplier Name')}</td>
                              <td className="bg-white border-bottom">{supplierName}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Asset Location')}</td>
                              <td className="bg-white border-bottom">{branchName}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Warranty')}</td>
                              <td className="bg-white border-bottom">{warranty}</td>
                            </tr>
                            <tr>
                              <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Description')}</td>
                              <td className="bg-white border-bottom">{description}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pt-3">
                      {contractDetails &&
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th colSpan="2" className="bg-white border-bottom">{t('Contractor Details')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Contracter Name')}</td>
                                <td className="bg-white border-bottom">{contractDetails.contractId.contractName}</td>
                              </tr>
                              <tr>
                                <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('PO Number')}</td>
                                <td className="bg-white border-bottom">{contractDetails.contractId.poNumber}</td>
                              </tr>
                              <tr>
                                <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Contractar Period')}</td>
                                <td className="bg-white border-bottom">{dateToDDMMYYYY(contractDetails.contractId.contractStart)} - {dateToDDMMYYYY(contractDetails.contractId.contractEnd)}</td>
                              </tr>
                              <tr>
                                <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Contract Amount')}</td>
                                <td className="bg-white border-bottom dirltrtar">{this.props.defaultCurrency} {contractDetails.contractId.contractAmount}</td>
                              </tr>
                              <tr>
                                <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Contract Document')}</td>
                                {/* Make downloadable */}
                                <td className="bg-white border-bottom cursorPointer" onClick={() => window.open(`${PRODIP}/${contractDetails.contractId.document.path}`)}>
                                  <span className="icon-edit mr-1"></span>
                                  <span>{contractDetails.contractId.document.originalname}</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                {repairLog.length > 0 &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pt-3">
                    <h3>{t('Repair History')}</h3>
                  </div>
                }

                {repairLog.length > 0 &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pt-3 tableTypeStriped">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead className="border bg-light">
                          <tr>
                            {/* <th className="text-dark">Supplier</th> */}
                            <th className="text-dark">{t('Technician Name')}</th>
                            <th className="text-dark">{t('Mobile Number')}</th>
                            <th className="text-dark">{t('Amount')}</th>
                            <th className="text-dark">{t('Status')}</th>
                            <th className="text-dark">{t('Comments')}</th>
                            <th className="text-dark">{t('Date/Time')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPageWiseData(this.state.pageNumber, repairLog, this.state.displayNum).map((repair, i) => {
                            const { technicianName, mobileNo, contractRepair, maintainStatus, amount, comments, repairDateTime } = repair
                            return (
                              <tr key={i}>
                                {/* <td>{Techno LLc}</td> */}
                                <td>{technicianName}</td>
                                <td className="dirltrtar">{mobileNo}</td>
                                <td>
                                  {contractRepair
                                    ? <span className="d-flex align-items-center">
                                      <span className="iconv1 iconv1-tick text-success mr-1"></span>
                                      <span>Contract</span>
                                    </span>
                                    : <h5 className="text-warning dirltrtar">{this.props.defaultCurrency} {amount}</h5>}
                                </td>
                                <td>
                                  {maintainStatus === 'Pending' && <span className="text-danger">{t(maintainStatus)}</span>}
                                  {maintainStatus === 'Completed' && <span className="text-success">{t(maintainStatus)}</span>}
                                  {maintainStatus === 'Under Repair' && <span className="text-warning">{t(maintainStatus)}</span>}
                                  {/* <span className="text-success">Completed</span>
                            <span className="text-warning">Under Repair</span> */}
                                </td>
                                <td>
                                  <span className="d-block text-wrap" style={{ minWidth: "150px", maxWidth: "200px" }}>{comments}</span>
                                </td>
                                <td className="text-nowrap dirltrtar">{dateToDDMMYYYY(repairDateTime)}, {dateToHHMM(repairDateTime)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                }

                {/*Pagination Start*/}
                {
                  repairLog.length > 0 &&
                  <Pagination
                    pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                    getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                    fullData={repairLog}
                    displayNumber={(displayNum) => this.setState({ displayNum })}
                    displayNum={this.state.displayNum ? this.state.displayNum : 5}
                  />
                }
                {/*Pagination End*/}

                {repairLog.length > 0 &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex align-items-center justify-content-end">
                    <div className="d-flex align-items-center pt-1">
                      <span className="mr-1">{t('Export')}</span>
                      <CSVLink data={repairLog} headers={headers}>
                        <span className="iconv1 iconv1-excel mr-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span></span>
                      </CSVLink>
                      <span className="iconv1 iconv1-pdf" onClick={() => this.downloadPdf()}><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span></span>
                    </div>
                  </div>
                }

                <div className="modal fade commonYellowModal" id="RAssets">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4 className="modal-title">{t('Repair Asset')}</h4>
                        <button type="button" className="close" ref="repairAssetsClose" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                      </div>
                      <div className="modal-body px-0">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group position-relative">
                                <label htmlFor="TechnicianName" className="mx-sm-2 inlineFormLabel">{t('Technician Name')}</label>
                                <input type="text" autoComplete="off" className={this.state.technicianNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                                  id="TechnicianName" value={technicianName} onChange={(e) => this.setState(validator(e, 'technicianName', 'text', [t('Enter technician name')]))} />
                                <div className="errorMessageWrapper">
                                  <small className="text-danger mx-sm-2 errorMessage">{this.state.technicianNameE}</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group position-relative">
                                <label htmlFor="MobNumber" className="mx-sm-2 inlineFormLabel">{t('Mobile Number')}</label>
                                <input type="text" autoComplete="off" className={this.state.mobileNoE ? "form-control dirltrtar mx-sm-2 inlineFormInputs FormInputsError" : "form-control dirltrtar mx-sm-2 inlineFormInputs"}
                                  id="MobNumber" value={mobileNo} onChange={(e) => this.setState(validator(e, 'mobileNo', 'text', [t('Enter mobile number')]))} />
                                <div className="errorMessageWrapper">
                                  <small className="text-danger mx-sm-2 errorMessage">{this.state.mobileNoE}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group inlineFormGroup">
                                <label className="mx-sm-2 inlineFormLabel"><b>{t('Is it under Contract?')}</b></label>
                                <div className="d-flex">
                                  <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                    <input type="radio" className="custom-control-input" id="yes" name="YesorNo" checked={contractRepair}
                                      onChange={(e) => this.setState({ contractRepair: true })}
                                    />
                                    <label className="custom-control-label" htmlFor="yes">{t('Yes')}</label>
                                  </div>
                                  <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                    <input type="radio" className="custom-control-input" id="no" name="YesorNo" checked={!contractRepair}
                                      onChange={(e) => this.setState({ contractRepair: false })}
                                    />
                                    <label className="custom-control-label" htmlFor="no">{t('No')}</label>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group position-relative">
                                <label htmlFor="maintenstatus" className="mx-sm-2 inlineFormLabel">{t('Maintenance Status')}</label>
                                <select className={this.state.maintainStatusE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                                  id="maintenstatus" value={maintainStatus} onChange={(e) => this.setState(validator(e, 'maintainStatus', 'text', [t('Select maintenance status')]))}>
                                  <option value="" hidden>{t('Please Select')}</option>
                                  <option value="Pending">{t('Pending')}</option>
                                  <option value="Under Repair">{t('Under Repair')}</option>
                                  <option value="Completed">{t('Completed')}</option>
                                </select>
                                <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                <div className="errorMessageWrapper">
                                  <small className="text-danger mx-sm-2 errorMessage">{this.state.maintainStatusE}</small>
                                </div>
                              </div>
                              {!contractRepair &&
                                <div className="form-group position-relative">
                                  <label htmlFor="Amount" className="mx-sm-2 inlineFormLabel">{t('Amount')}</label>
                                  <input type="number" autoComplete="off" className={this.state.amountE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                                    id="Amount" value={amount} onChange={(e) => this.setState(validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]))} />
                                  <div className="errorMessageWrapper">
                                    <small className="text-danger mx-sm-2 errorMessage">{this.state.amountE}</small>
                                  </div>
                                </div>
                              }
                            </div>
                            <div className="col-6">
                              <div className="form-group position-relative">
                                <div className="form-group inlineFormGroup align-items-start">
                                  <label htmlFor="Comments" className="mx-sm-2 inlineFormLabel">{t('Comments')}</label>
                                  <textarea className="form-control mx-sm-2 inlineFormInputs " rows="4" id="Comments"
                                    value={comments} onChange={(e) => this.setState({ comments: e.target.value })}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-end">
                            <button type="button" className="btn btn-success px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
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
    } else {
      return null
    }
  }
}

function mapStateToProps({ asset: { assetById }, currency: { defaultCurrency }, errors }) {
  return {
    assetById,
    defaultCurrency,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(AssetDetails))
