
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { generateExcel } from '../../utils/excel'
import { dateToDDMMYYYY, dateToHHMM, countHours, getPageWiseData, setTime, calculateDays, getDataUri } from '../../utils/apis/helpers'
import Pagination from './Pagination'
import { connect } from 'react-redux'
import { generateReport } from '../../utils/pdf'
import gymlogo from '../../assets/img/al-main-logo.png';

class TableExport extends Component {

  state = {}

  generateTable(datas, reportName) {
    if (reportName === 'New Members') {
      return this.tableForNewMembers(datas)
    } else if (reportName === 'Active Members') {
      return this.tableForActiveMembers(datas)
    } else if (reportName === 'Pending Members') {
      return this.tableForPendingMembers(datas)
    } else if (reportName === 'Upcoming Expiry') {
      return this.tableForUpcomingExpiry(datas)
    } else if (reportName === 'Expired Members') {
      return this.tableForExpiredMembers(datas)
    } else if (reportName === 'Members Attendance') {
      return this.tableForMembersAttendance(datas)
    } else if (reportName === 'Freezed Members') {
      return this.tableForFreezedMembers(datas)
    } else if (reportName === 'Package Renewal') {
      return this.tableForPackageRenewal(datas)
    } else if (reportName === 'Package Type') {
      return this.tableForPackageType(datas)
    } else if (reportName === 'Assigned Trainers') {
      return this.tableForAssignedTrainers(datas)
    } else if (reportName === 'General Sales') {
      return this.tableForGeneralSales(datas)
    } else if (reportName === 'Package Sales') {
      return this.tableForPackageSales(datas)
    } else if (reportName === 'Item Sales') {
      return this.tableForItemSales(datas)
    } else if (reportName === 'Classes Sales') {
      return this.tableForClassesSales(datas)
    } else if (reportName === 'End of Shift Report') {
      // return this.tableForEndOfShiftReport(datas)
    } else if (reportName === 'Current Stock Details') {
      return this.tableForCurrentStockDetails(datas)
    } else if (reportName === 'Product Expiry Details') {
      return this.tableForProductExpiryDetails(datas)
    } else if (reportName === 'POS Profit and Loss') {
      return this.tableForPOSProfitAndLoss(datas)
    } else if (reportName === 'Sales By Payment Method') {
      return this.tableForSalesByPaymentMethod(datas)
    } else if (reportName === 'Today Sales By Staff') {
      return this.tableForTodaySalesByStaff(datas)
    } else if (reportName === 'Expired Product Details') {
      return this.tableForExpiredProductDetails(datas)
    } else if (reportName === 'Classes Registration Details') {
      return this.tableForClassesRegistrationDetails(datas)
    } else if (reportName === 'Employee Details') {
      return this.tableForEmployeeDetails(datas)
    } else if (reportName === 'Employee Shift Details') {
      return this.tableForEmployeeShiftDetails(datas)
    } else if (reportName === 'Booked Appointments By Members') {
      return this.tableForBookedAppointmentsByMembers(datas)
    } else if (reportName === 'Booked Appointments Status') {
      return this.tableForBookedAppointmentsStatus(datas)
    } else if (reportName === 'Booked Appointments By Visitors') {
      return this.tableForBookedAppointmentsByVisitors(datas)
    } else if (reportName === 'Vat Report') {
      return this.tableForVatReport(datas)
    }
  }

  generatePdfReport(tabledData) {
    const { reportName, fromDate, toDate, branchName, description, branchImage } = this.props
    const language = this.props.i18n.language
    if (reportName === 'Current Stock Details' || reportName === 'Upcoming Expiry') {
      branchImage
        ? getDataUri(branchImage, tabledData, reportName, null, null, branchName, description, language, generateReport)
        : generateReport(gymlogo, tabledData, reportName, null, null, branchName, description, language)
    } else {
      branchImage
        ? getDataUri(branchImage, tabledData, reportName, fromDate, toDate, branchName, description, language, generateReport)
        : generateReport(gymlogo, tabledData, reportName, fromDate, toDate, branchName, description, language)

    }
  }

  render() {
    const { headers, datas, reportName } = this.props
    const { t } = this.props
    if (datas && datas.length > 0) {
      const getData = this.generateTable(datas, reportName)
      const tabledData = getData ? getData : []
      return (
        <div className="col-12 tableHead">
          <div className="headName d-flex justify-content-between py-3">
            <h5><b>{t(reportName)}</b></h5>
            {/* <button type="button" className="btn exportOutlinebtn"> */}
            <span className="d-flex align-items-center">
              <span className="iconv1 iconv1-download mx-2 cursor-pointer btn px-0"></span> <span>{t('Export')}</span>
              <span className="iconv1 iconv1-pdf px-1 cursorPointer" onClick={() => this.generatePdfReport(tabledData)}><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span></span>
              <span className="iconv1 iconv1-excel px-1 cursorPointer" onClick={() => generateExcel(tabledData, reportName)}><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span></span>
            </span>
            {/* </button> */}
          </div>

          <div className="table-responsive">
            <table className="table table-striped" id="exportTable">
              <thead>
                <tr>
                  {headers && headers.map((header, i) => {
                    return (
                      <th key={i} className="text-nowrap" style={{ color: '#3075be' }}>{t(header)}</th>
                    )
                  })}
                </tr>
              </thead>

              <tbody>
                {tabledData && getPageWiseData(this.state.pageNumber, tabledData, this.state.displayNum).map((data, i) => {
                  return (
                    <tr key={i}>
                      {headers && headers.map((header, j) => {
                        return (
                          <td className="dirltrtar" key={j}>{data[header]}</td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {tabledData &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={tabledData}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/* Pagination End // displayNumber={5} */}
        </div>
      )
    } else {
      return null
    }
  }

  tableForNewMembers(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId, credentialId: { userName, email }, packageDetails, admissionDate, mobileNo } = data
      packageDetails.forEach(doc => {
        tabledData.push({
          "SNo": count,
          "Member ID": memberId,
          "Member Name": userName,
          "Package": doc.packages.packageName,
          "Payment Status": doc.paidStatus,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          "Email ID": email
        })
        count = count + 1
      })
    })
    return tabledData
  }

  tableForActiveMembers(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId, credentialId: { userName, email }, packageDetails, admissionDate, mobileNo } = data
      packageDetails.forEach(doc => {
        tabledData.push({
          "SNo": count,
          "Member ID": memberId,
          "Member Name": userName,
          "Package": doc.packages.packageName,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          "Email ID": email,
          "Package Start Date": dateToDDMMYYYY(doc.startDate),
          "Package End Date": dateToDDMMYYYY(doc.endDate),
          "Trainer Name": (doc.trainerDetails && doc.trainerDetails.length && doc.trainerDetails[doc.trainerDetails.length - 1]) ? doc.trainerDetails[doc.trainerDetails.length - 1].trainer.credentialId.userName : 'NA',
          "To Be Paid": doc.packages.amount.toFixed(3)
        })
        count = count + 1
      })
    })
    return tabledData
  }

  tableForPendingMembers(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { credentialId: { userName, email }, admissionDate, mobileNo } = data
      tabledData.push({
        "SNo": count,
        "Member Name": userName,
        "Admission Date": dateToDDMMYYYY(admissionDate),
        "Mobile No": mobileNo,
        "Email ID": email
      })
      count = count + 1
    })
    return tabledData
  }

  tableForUpcomingExpiry(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId, credentialId: { userName, email }, packageDetails, admissionDate, mobileNo } = data
      packageDetails.forEach(pack => {
        let endDate = pack.endDate
        let today = new Date(new Date().setHours(0, 0, 0, 0));
        if (pack.extendDate) {
          endDate = pack.extendDate;
        }
        if (today.getTime() === new Date(endDate).setDate(new Date(endDate).getDate() - 1)) {
          tabledData.push({
            "SNo": count,
            "Member ID": memberId,
            "Member Name": userName,
            "Admission Date": dateToDDMMYYYY(admissionDate),
            "Package": pack.packages.packageName,
            "Expiry Date": dateToDDMMYYYY(endDate),
            "Trainer Name": (pack.trainerDetails && pack.trainerDetails.length && pack.trainerDetails[pack.trainerDetails.length - 1]) ? pack.trainerDetails[pack.trainerDetails.length - 1].trainer.credentialId.userName : 'NA',
            "Mobile No": mobileNo,
            "Email ID": email
          })
          count = count + 1
        }
      })
    })
    return tabledData
  }

  tableForExpiredMembers(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId, credentialId: { userName, email }, packageDetails, admissionDate, mobileNo } = data
      packageDetails.forEach(pack => {
        if (pack.isExpiredPackage) {
          tabledData.push({
            "SNo": count,
            "Member ID": memberId,
            "Member Name": userName,
            "Admission Date": dateToDDMMYYYY(admissionDate),
            "Package": pack.packages.packageName,
            "Expired Date": pack.extendDate ? dateToDDMMYYYY(pack.extendDate) : dateToDDMMYYYY(pack.endDate),
            "Trainer Name": (pack.trainerDetails && pack.trainerDetails.length && pack.trainerDetails[pack.trainerDetails.length - 1]) ? pack.trainerDetails[pack.trainerDetails.length - 1].trainer.credentialId.userName : 'NA',
            "To Be Paid": pack.packages.amount.toFixed(3),
            // "Any Valid Package": packageDetails.filter(doc => !doc.isExpiredPackage)[0] ? packageDetails.filter(doc => !doc.isExpiredPackage)[0].packages.packageName : 'NA',
            "Mobile No": mobileNo,
            "Email ID": email
          })
          count = count + 1
        }
      })
    })
    return tabledData
  }

  tableForMembersAttendance(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId: { memberId, credentialId: { userName } }, branch, date, timeIn, timeOut } = data
      tabledData.push({
        "SNo": count,
        "Member ID": memberId,
        "Member Name": userName,
        "Branch": branch.branchName,
        "Date": dateToDDMMYYYY(date),
        "Check-In": dateToHHMM(timeIn),
        "Check-Out": timeOut ? dateToHHMM(timeOut) : 'Not Out Yet',
        "Total Hrs": timeOut ? countHours(timeIn, timeOut) : 'Not Yet Out'
      })
      count = count + 1
    })
    return tabledData
  }

  tableForFreezedMembers(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId: { memberId, credentialId: { userName }, packageDetails, admissionDate, mobileNo }, fromDate, toDate, reactivationDate, noOfDays, reason, totalAmount } = data
      packageDetails.forEach(doc => {
        tabledData.push({
          "SNo": count,
          "Member ID": memberId,
          "Member Name": userName,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          "Package": doc.packages.packageName,
          "Freezed From": dateToDDMMYYYY(fromDate),
          "Freezed To": dateToDDMMYYYY(toDate),
          "Extended Till": dateToDDMMYYYY(reactivationDate),
          "No Of Days": noOfDays,
          "Reason": reason,
          "Amount": totalAmount ? totalAmount.toFixed(3) : 'NA'
        })
        count = count + 1
      })
    })
    return tabledData
  }

  tableForPackageRenewal(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId, credentialId: { userName }, branch, packageDetails, admissionDate, mobileNo } = data
      packageDetails.forEach(doc => {
        if (doc.packageRenewal) {
          tabledData.push({
            "SNo": count,
            "Receipt No.": doc.orderNo,
            "Date & Time": `${dateToDDMMYYYY(doc.dateOfPurchase)} ${dateToHHMM(doc.timeOfPurchase)}`,
            "Member ID": memberId,
            "Member Name": userName,
            "Admission Date": dateToDDMMYYYY(admissionDate),
            "Mobile No": mobileNo,
            // "Email ID": email,
            "Branch": branch.branchName,
            "Package": doc.packages.packageName,
            "Trainer Name": doc.trainer ? doc.trainer.credentialId.userName : 'NA',
            "Start Date": dateToDDMMYYYY(doc.startDate),
            "End Date": doc.extendDate ? dateToDDMMYYYY(doc.extendDate) : dateToDDMMYYYY(doc.endDate),
            "Paid Amount": doc.totalAmount.toFixed(3),
            "Renewed By": doc.doneBy ? doc.doneBy.userName : 'NA'
          })
          count = count + 1
        }
      })
    })
    return tabledData
  }

  tableForPackageType(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { memberId, credentialId, branch, packageDetails, admissionDate, mobileNo, customPackageId } = data
      let filteredPackageDetails = packageDetails
      if (customPackageId) {
        filteredPackageDetails = packageDetails.filter(pack => pack.packages._id === customPackageId)
      }
      filteredPackageDetails.forEach(doc => {
        tabledData.push({
          "SNo": count,
          // "Receipt No.": doc.orderNo,
          "Date & Time": `${dateToDDMMYYYY(doc.dateOfPaid)} ${dateToHHMM(doc.timeOfPaid)}`,
          "Member ID": memberId,
          "Member Name": credentialId.userName,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Package": doc.packages.packageName,
          "Start Date": doc.startDate ? dateToDDMMYYYY(doc.startDate) : 'Not Started Yet',
          "End Date": doc.endDate ? doc.extendDate ? dateToDDMMYYYY(doc.extendDate) : dateToDDMMYYYY(doc.endDate) : 'Not Started Yet',
          "To Be Paid": doc.packages.amount.toFixed(3),
          // "Renewed By": doc.doneBy ? doc.doneBy.userName : 'NA'
        })
        count = count + 1
      })
    })
    return tabledData
  }

  tableForAssignedTrainers(datas) {
    let tabledData = []
    let count = 1, totalPaidAmount = 0
    datas && datas.forEach(data => {
      const { memberId, credentialId, branch, packageDetails, customTrainerId } = data
      let filteredPackageDetails = packageDetails
      filteredPackageDetails.forEach(doc => {
        if (doc.trainerDetails && doc.trainerDetails.length) {
          doc.trainerDetails.forEach(trainerDetail => {
            if (customTrainerId && trainerDetail.trainer._id === customTrainerId) {
              if (trainerDetail.Installments && trainerDetail.Installments.length) {
                trainerDetail.Installments.forEach(installment => {
                  if (installment.paidStatus === 'Paid' && installment.display) {
                    totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
                    tabledData.push({
                      "SNo": count,
                      "Receipt No.": installment.orderNo,
                      "Date & Time": `${dateToDDMMYYYY(installment.dateOfPaid)} ${dateToHHMM(installment.timeOfPaid)}`,
                      "Member ID": memberId,
                      "Member Name": credentialId.userName,
                      "Branch": branch.branchName,
                      "Package": doc.packages.packageName,
                      "Trainer Name": `${trainerDetail.trainer.credentialId.userName} (${installment.installmentName})`,
                      "Period": trainerDetail.trainerFees.period.periodName,
                      "Start Date": trainerDetail.trainerStart ? dateToDDMMYYYY(trainerDetail.trainerStart) : 'Not Started Yet',
                      "End Date": trainerDetail.trainerEnd ? trainerDetail.trainerExtend ? dateToDDMMYYYY(trainerDetail.trainerExtend) : dateToDDMMYYYY(trainerDetail.trainerEnd) : 'Not Started Yet',
                      "Paid Amount": installment.totalAmount ? +installment.totalAmount.toFixed(3) : 0,
                      "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
                    })
                    count = count + 1
                  }
                })
              } else {
                if ((trainerDetail.paidStatus === 'Paid' || trainerDetail.paidStatus === 'Installment') && trainerDetail.display) {
                  totalPaidAmount += (trainerDetail.totalAmount ? +trainerDetail.totalAmount : 0)
                  tabledData.push({
                    "SNo": count,
                    "Receipt No.": trainerDetail.orderNo,
                    "Date & Time": `${dateToDDMMYYYY(trainerDetail.dateOfPaid)} ${dateToHHMM(trainerDetail.timeOfPaid)}`,
                    "Member ID": memberId,
                    "Member Name": credentialId.userName,
                    "Branch": branch.branchName,
                    "Package": doc.packages.packageName,
                    "Trainer Name": trainerDetail.trainer.credentialId.userName,
                    "Period": trainerDetail.trainerFees.period.periodName,
                    "Start Date": trainerDetail.trainerStart ? dateToDDMMYYYY(trainerDetail.trainerStart) : 'Not Started Yet',
                    "End Date": trainerDetail.trainerEnd ? trainerDetail.trainerExtend ? dateToDDMMYYYY(trainerDetail.trainerExtend) : dateToDDMMYYYY(trainerDetail.trainerEnd) : 'Not Started Yet',
                    "Paid Amount": trainerDetail.totalAmount ? +trainerDetail.totalAmount.toFixed(3) : 0,
                    "Done By": trainerDetail.doneBy ? trainerDetail.doneBy.userName : 'NA'
                  })
                  count = count + 1
                }
              }
            } else {
              if (trainerDetail.Installments && trainerDetail.Installments.length) {
                trainerDetail.Installments.forEach(installment => {
                  if (installment.paidStatus === 'Paid' && installment.display) {
                    totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
                    tabledData.push({
                      "SNo": count,
                      "Receipt No.": installment.orderNo,
                      "Date & Time": `${dateToDDMMYYYY(installment.dateOfPaid)} ${dateToHHMM(installment.timeOfPaid)}`,
                      "Member ID": memberId,
                      "Member Name": credentialId.userName,
                      "Branch": branch.branchName,
                      "Package": doc.packages.packageName,
                      "Trainer Name": `${trainerDetail.trainer.credentialId.userName} (${installment.installmentName})`,
                      "Period": trainerDetail.trainerFees.period.periodName,
                      "Start Date": trainerDetail.trainerStart ? dateToDDMMYYYY(trainerDetail.trainerStart) : 'Not Started Yet',
                      "End Date": trainerDetail.trainerEnd ? trainerDetail.trainerExtend ? dateToDDMMYYYY(trainerDetail.trainerExtend) : dateToDDMMYYYY(trainerDetail.trainerEnd) : 'Not Started Yet',
                      "Paid Amount": installment.totalAmount ? +installment.totalAmount.toFixed(3) : 0,
                      "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
                    })
                    count = count + 1
                  }
                })
              } else {
                if ((trainerDetail.paidStatus === 'Paid' || trainerDetail.paidStatus === 'Installment') && trainerDetail.display) {
                  totalPaidAmount += (trainerDetail.totalAmount ? +trainerDetail.totalAmount : 0)
                  tabledData.push({
                    "SNo": count,
                    "Receipt No.": trainerDetail.orderNo,
                    "Date & Time": `${dateToDDMMYYYY(trainerDetail.dateOfPaid)} ${dateToHHMM(trainerDetail.timeOfPaid)}`,
                    "Member ID": memberId,
                    "Member Name": credentialId.userName,
                    "Branch": branch.branchName,
                    "Package": doc.packages.packageName,
                    "Trainer Name": trainerDetail.trainer.credentialId.userName,
                    "Period": trainerDetail.trainerFees.period.periodName,
                    "Start Date": trainerDetail.trainerStart ? dateToDDMMYYYY(trainerDetail.trainerStart) : 'Not Started Yet',
                    "End Date": trainerDetail.trainerEnd ? trainerDetail.trainerExtend ? dateToDDMMYYYY(trainerDetail.trainerExtend) : dateToDDMMYYYY(trainerDetail.trainerEnd) : 'Not Started Yet',
                    "Paid Amount": trainerDetail.totalAmount ? +trainerDetail.totalAmount.toFixed(3) : 0,
                    "Done By": trainerDetail.doneBy ? trainerDetail.doneBy.userName : 'NA'
                  })
                  count = count + 1
                }
              }
            }
          })
        }
      })
    })
    tabledData.push({
      "SNo": '',
      "Receipt No.": '',
      "Date & Time": ``,
      "Member ID": '',
      "Member Name": '',
      "Branch": '',
      "Package": '',
      "Trainer Name": '',
      "Start Date": '',
      "End Date": 'Grant Total',
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForGeneralSales(datas) {
    let tabledData = []
    let count = 1
    let totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0, totalCheque = 0, totalDiscount = 0
    datas && datas.forEach(data => {
      if (data.transactionType === 'Packages') {
        const { memberId, credentialId: { userName }, branch, packageDetails, admissionDate, mobileNo, transactionType } = data
        packageDetails.forEach(doc => {
          if (doc.Installments && doc.Installments.length) {
            doc.Installments.forEach(installment => {
              if (installment.paidStatus === 'Paid' && installment.display) {
                totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
                totalCash += (installment.cashAmount ? +installment.cashAmount : 0)
                totalCard += (installment.cardAmount ? +installment.cardAmount : 0)
                totalDigital += (installment.digitalAmount ? +installment.digitalAmount : 0)
                totalCheque += (installment.chequeAmount ? +installment.chequeAmount : 0)
                totalDiscount += (installment.discount ? +installment.discount : 0)
                tabledData.push({
                  "SNo": count,
                  "Receipt No.": installment.orderNo,
                  "Date & Time": `${dateToDDMMYYYY(installment.dateOfPaid)} ${dateToHHMM(installment.timeOfPaid)}`,
                  "Member ID": memberId,
                  "Member Name": userName,
                  "Admission Date": dateToDDMMYYYY(admissionDate),
                  "Mobile No": mobileNo,
                  // "Email ID": email,
                  "Branch": branch.branchName,
                  "Transaction Type": transactionType,
                  "Name": `${doc.packages.packageName} (${installment.installmentName})`,
                  "Paid Amount": installment.totalAmount ? `${installment.totalAmount.toFixed(3)}` : '0.000',
                  "Discount": installment.discount ? `${installment.discount.toFixed(3)}` : `0.000`,
                  "Cash": installment.cashAmount ? `${installment.cashAmount.toFixed(3)}` : `0.000`,
                  "Card": installment.cardAmount ? `${installment.cardAmount.toFixed(3)}` : `0.000`,
                  "Digital": installment.digitalAmount ? `${installment.digitalAmount.toFixed(3)}` : `0.000`,
                  "Cheque": installment.chequeAmount ? `${installment.chequeAmount.toFixed(3)}` : `0.000`,
                  "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
                })
                count = count + 1
              }
            })
          } else {
            if ((doc.paidStatus === 'Paid' || doc.paidStatus === 'Installment') && doc.display) {
              totalPaidAmount += (doc.totalAmount ? +doc.totalAmount : 0)
              totalCash += (doc.cashAmount ? +doc.cashAmount : 0)
              totalCard += (doc.cardAmount ? +doc.cardAmount : 0)
              totalDigital += (doc.digitalAmount ? +doc.digitalAmount : 0)
              totalCheque += (doc.chequeAmount ? +doc.chequeAmount : 0)
              totalDiscount += (doc.discount ? +doc.discount : 0)
              tabledData.push({
                "SNo": count,
                "Receipt No.": doc.orderNo,
                "Date & Time": `${dateToDDMMYYYY(doc.dateOfPaid)} ${dateToHHMM(doc.timeOfPaid)}`,
                "Member ID": memberId,
                "Member Name": userName,
                "Admission Date": dateToDDMMYYYY(admissionDate),
                "Mobile No": mobileNo,
                // "Email ID": email,
                "Branch": branch.branchName,
                "Transaction Type": transactionType,
                "Name": doc.packages.packageName,
                "Paid Amount": doc.totalAmount ? `${doc.totalAmount.toFixed(3)}` : '0.000',
                "Discount": doc.discount ? `${doc.discount.toFixed(3)}` : `0.000`,
                "Cash": doc.cashAmount ? `${doc.cashAmount.toFixed(3)}` : `0.000`,
                "Card": doc.cardAmount ? `${doc.cardAmount.toFixed(3)}` : `0.000`,
                "Digital": doc.digitalAmount ? `${doc.digitalAmount.toFixed(3)}` : `0.000`,
                "Cheque": doc.chequeAmount ? `${doc.chequeAmount.toFixed(3)}` : `0.000`,
                "Done By": doc.doneBy ? doc.doneBy.userName : 'NA'
              })
              count = count + 1
            }
          }
          if (doc.trainerDetails && doc.trainerDetails.length) {
            doc.trainerDetails.forEach(trainerDetail => {
              if (trainerDetail.Installments && trainerDetail.Installments.length) {
                trainerDetail.Installments.forEach(installment => {
                  if (installment.paidStatus === 'Paid' && installment.display) {
                    totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
                    totalCash += (installment.cashAmount ? +installment.cashAmount : 0)
                    totalCard += (installment.cardAmount ? +installment.cardAmount : 0)
                    totalDigital += (installment.digitalAmount ? +installment.digitalAmount : 0)
                    totalCheque += (installment.chequeAmount ? +installment.chequeAmount : 0)
                    totalDiscount += (installment.discount ? +installment.discount : 0)
                    tabledData.push({
                      "SNo": count,
                      "Receipt No.": installment.orderNo,
                      "Date & Time": `${dateToDDMMYYYY(installment.dateOfPaid)} ${dateToHHMM(installment.timeOfPaid)}`,
                      "Member ID": memberId,
                      "Member Name": userName,
                      "Admission Date": dateToDDMMYYYY(admissionDate),
                      "Mobile No": mobileNo,
                      // "Email ID": email,
                      "Branch": branch.branchName,
                      "Transaction Type": transactionType,
                      "Name": `${trainerDetail.trainer.credentialId.userName} (${installment.installmentName})`,
                      "Paid Amount": installment.totalAmount ? `${installment.totalAmount.toFixed(3)}` : '0.000',
                      "Discount": installment.discount ? `${installment.discount.toFixed(3)}` : `0.000`,
                      "Cash": installment.cashAmount ? `${installment.cashAmount.toFixed(3)}` : `0.000`,
                      "Card": installment.cardAmount ? `${installment.cardAmount.toFixed(3)}` : `0.000`,
                      "Digital": installment.digitalAmount ? `${installment.digitalAmount.toFixed(3)}` : `0.000`,
                      "Cheque": installment.chequeAmount ? `${installment.chequeAmount.toFixed(3)}` : `0.000`,
                      "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
                    })
                    count = count + 1
                  }
                })
              } else {
                if ((trainerDetail.paidStatus === 'Paid' || trainerDetail.paidStatus === 'Installment') && trainerDetail.display) {
                  totalPaidAmount += (trainerDetail.totalAmount ? +trainerDetail.totalAmount : 0)
                  totalCash += (trainerDetail.cashAmount ? +trainerDetail.cashAmount : 0)
                  totalCard += (trainerDetail.cardAmount ? +trainerDetail.cardAmount : 0)
                  totalDigital += (trainerDetail.digitalAmount ? +trainerDetail.digitalAmount : 0)
                  totalCheque += (trainerDetail.chequeAmount ? +trainerDetail.chequeAmount : 0)
                  totalDiscount += (trainerDetail.discount ? +trainerDetail.discount : 0)
                  tabledData.push({
                    "SNo": count,
                    "Receipt No.": trainerDetail.orderNo,
                    "Date & Time": `${dateToDDMMYYYY(trainerDetail.dateOfPaid)} ${dateToHHMM(trainerDetail.timeOfPaid)}`,
                    "Member ID": memberId,
                    "Member Name": userName,
                    "Admission Date": dateToDDMMYYYY(admissionDate),
                    "Mobile No": mobileNo,
                    // "Email ID": email,
                    "Branch": branch.branchName,
                    "Transaction Type": transactionType,
                    "Name": trainerDetail.trainer.credentialId.userName,
                    "Paid Amount": trainerDetail.totalAmount ? `${trainerDetail.totalAmount.toFixed(3)}` : '0.000',
                    "Discount": trainerDetail.discount ? `${trainerDetail.discount.toFixed(3)}` : `0.000`,
                    "Cash": trainerDetail.cashAmount ? `${trainerDetail.cashAmount.toFixed(3)}` : `0.000`,
                    "Card": trainerDetail.cardAmount ? `${trainerDetail.cardAmount.toFixed(3)}` : `0.000`,
                    "Digital": trainerDetail.digitalAmount ? `${trainerDetail.digitalAmount.toFixed(3)}` : `0.000`,
                    "Cheque": trainerDetail.chequeAmount ? `${trainerDetail.chequeAmount.toFixed(3)}` : `0.000`,
                    "Done By": trainerDetail.doneBy ? trainerDetail.doneBy.userName : 'NA'
                  })
                  count = count + 1
                }
              }
            })
          }
        })
      } else if (data.transactionType === 'POS') {
        const { customerDetails: { member }, transactionType, branch, totalAmount, cashAmount, cardAmount, digitalAmount, chequeAmount, discount, dateOfPurchase, created_at } = data
        totalPaidAmount += (totalAmount ? +totalAmount : 0)
        totalCash += (cashAmount ? +cashAmount : 0)
        totalCard += (cardAmount ? +cardAmount : 0)
        totalDigital += (digitalAmount ? +digitalAmount : 0)
        totalCheque += (chequeAmount ? +chequeAmount : 0)
        totalDiscount += (discount ? +discount : 0)
        if (member) {
          const { memberId, credentialId: { userName }, admissionDate, mobileNo } = member
          tabledData.push({
            "SNo": count,
            "Receipt No.": data.orderNo,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": memberId ? memberId : 'NA',
            "Member Name": userName ? userName : 'NA',
            "Admission Date": admissionDate ? dateToDDMMYYYY(admissionDate) : 'NA',
            "Mobile No": mobileNo ? mobileNo : 'NA',
            // "Email ID": email ? email : 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Name": 'NA',
            "Paid Amount": `${totalAmount.toFixed(3)}`,
            "Discount": discount ? `${discount.toFixed(3)}` : `0.000`,
            "Cash": `${cashAmount.toFixed(3)}`,
            "Card": `${cardAmount.toFixed(3)}`,
            "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
            "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        } else {
          tabledData.push({
            "SNo": count,
            "Receipt No.": data.orderNo,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": 'NA',
            "Member Name": 'NA',
            "Admission Date": 'NA',
            "Mobile No": 'NA',
            // "Email ID": 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Name": 'NA',
            "Paid Amount": `${totalAmount.toFixed(3)}`,
            "Discount": discount ? `${discount.toFixed(3)}` : `0.000`,
            "Cash": `${cashAmount.toFixed(3)}`,
            "Card": `${cardAmount.toFixed(3)}`,
            "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
            "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        }
        count = count + 1
      } else if (data.transactionType === 'Classes') {
        const { member: { memberId, credentialId: { userName }, branch, admissionDate, mobileNo }, transactionType, totalAmount, cashAmount, cardAmount, digitalAmount, chequeAmount, discount, dateOfPurchase, created_at } = data
        totalPaidAmount += (totalAmount ? +totalAmount : 0)
        totalCash += (cashAmount ? +cashAmount : 0)
        totalCard += (cardAmount ? +cardAmount : 0)
        totalDigital += (digitalAmount ? +digitalAmount : 0)
        totalCheque += (chequeAmount ? +chequeAmount : 0)
        totalDiscount += (discount ? +discount : 0)
        tabledData.push({
          "SNo": count,
          "Receipt No.": data.orderNo,
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": memberId,
          "Member Name": userName,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Transaction Type": transactionType,
          "Name": 'NA',
          "Paid Amount": totalAmount ? `${totalAmount.toFixed(3)}` : '0.000',
          "Discount": discount ? `${discount.toFixed(3)}` : `0.000`,
          "Cash": cashAmount ? `${cashAmount.toFixed(3)}` : '0.000',
          "Card": cardAmount ? `${cardAmount.toFixed(3)}` : '0.000',
          "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
          "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
          "Done By": data.doneBy ? data.doneBy.userName : 'NA'
        })
        count = count + 1
      }
    })
    tabledData.push({
      "SNo": '',
      "Receipt No.": '',
      "Date & Time": ``,
      "Member ID": '',
      "Member Name": '',
      "Admission Date": '',
      "Mobile No": '',
      // "Email ID": email,
      "Branch": '',
      "Transaction Type": 'Grand Total',
      "Name": '',
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Discount": `${this.props.defaultCurrency} ${totalDiscount.toFixed(3)}`,
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
      "Cheque": `${this.props.defaultCurrency} ${totalCheque.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForPackageSales(datas) {
    let tabledData = []
    let count = 1
    let totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0, totalCheque = 0, totalDiscount = 0
    datas && datas.forEach(data => {
      const { memberId, credentialId: { userName }, branch, packageDetails, admissionDate, mobileNo, transactionType } = data
      packageDetails.forEach(doc => {
        if (doc.Installments && doc.Installments.length) {
          doc.Installments.forEach(installment => {
            if (installment.paidStatus === 'Paid' && installment.display) {
              totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
              totalCash += (installment.cashAmount ? +installment.cashAmount : 0)
              totalCard += (installment.cardAmount ? +installment.cardAmount : 0)
              totalDigital += (installment.digitalAmount ? +installment.digitalAmount : 0)
              totalCheque += (installment.chequeAmount ? +installment.chequeAmount : 0)
              totalDiscount += (installment.discount ? +installment.discount : 0)
              tabledData.push({
                "SNo": count,
                "Receipt No.": installment.orderNo,
                "Date & Time": `${dateToDDMMYYYY(installment.dateOfPaid)} ${dateToHHMM(installment.timeOfPaid)}`,
                "Member ID": memberId,
                "Member Name": userName,
                "Admission Date": dateToDDMMYYYY(admissionDate),
                "Mobile No": mobileNo,
                // "Email ID": email,
                "Branch": branch.branchName,
                "Transaction Type": transactionType,
                "Name": `${doc.packages.packageName} (${installment.installmentName})`,
                "Paid Amount": installment.totalAmount ? `${installment.totalAmount.toFixed(3)}` : '0.000',
                "Discount": installment.discount ? `${installment.discount.toFixed(3)}` : `0.000`,
                "Cash": installment.cashAmount ? `${installment.cashAmount.toFixed(3)}` : `0.000`,
                "Card": installment.cardAmount ? `${installment.cardAmount.toFixed(3)}` : `0.000`,
                "Digital": installment.digitalAmount ? `${installment.digitalAmount.toFixed(3)}` : `0.000`,
                "Cheque": installment.chequeAmount ? `${installment.chequeAmount.toFixed(3)}` : `0.000`,
                "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
              })
              count = count + 1
            }
          })
        } else {
          if ((doc.paidStatus === 'Paid' || doc.paidStatus === 'Installment') && doc.display) {
            totalPaidAmount += (doc.totalAmount ? +doc.totalAmount : 0)
            totalCash += (doc.cashAmount ? +doc.cashAmount : 0)
            totalCard += (doc.cardAmount ? +doc.cardAmount : 0)
            totalDigital += (doc.digitalAmount ? +doc.digitalAmount : 0)
            totalCheque += (doc.chequeAmount ? +doc.chequeAmount : 0)
            totalDiscount += (doc.discount ? +doc.discount : 0)
            tabledData.push({
              "SNo": count,
              "Receipt No.": doc.orderNo,
              "Date & Time": `${dateToDDMMYYYY(doc.dateOfPaid)} ${dateToHHMM(doc.timeOfPaid)}`,
              "Member ID": memberId,
              "Member Name": userName,
              "Admission Date": dateToDDMMYYYY(admissionDate),
              "Mobile No": mobileNo,
              // "Email ID": email,
              "Branch": branch.branchName,
              "Transaction Type": transactionType,
              "Name": doc.packages.packageName,
              "Paid Amount": doc.totalAmount ? `${doc.totalAmount.toFixed(3)}` : '0.000',
              "Discount": doc.discount ? `${doc.discount.toFixed(3)}` : `0.000`,
              "Cash": doc.cashAmount ? `${doc.cashAmount.toFixed(3)}` : `0.000`,
              "Card": doc.cardAmount ? `${doc.cardAmount.toFixed(3)}` : `0.000`,
              "Digital": doc.digitalAmount ? `${doc.digitalAmount.toFixed(3)}` : `0.000`,
              "Cheque": doc.chequeAmount ? `${doc.chequeAmount.toFixed(3)}` : `0.000`,
              "Done By": doc.doneBy ? doc.doneBy.userName : 'NA'
            })
            count = count + 1
          }
        }
        if (doc.trainerDetails && doc.trainerDetails.length) {
          doc.trainerDetails.forEach(trainerDetail => {
            if (trainerDetail.Installments && trainerDetail.Installments.length) {
              trainerDetail.Installments.forEach(installment => {
                if (installment.paidStatus === 'Paid' && installment.display) {
                  totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
                  totalCash += (installment.cashAmount ? +installment.cashAmount : 0)
                  totalCard += (installment.cardAmount ? +installment.cardAmount : 0)
                  totalDigital += (installment.digitalAmount ? +installment.digitalAmount : 0)
                  totalCheque += (installment.chequeAmount ? +installment.chequeAmount : 0)
                  totalDiscount += (installment.discount ? +installment.discount : 0)
                  tabledData.push({
                    "SNo": count,
                    "Receipt No.": installment.orderNo,
                    "Date & Time": `${dateToDDMMYYYY(installment.dateOfPaid)} ${dateToHHMM(installment.timeOfPaid)}`,
                    "Member ID": memberId,
                    "Member Name": userName,
                    "Admission Date": dateToDDMMYYYY(admissionDate),
                    "Mobile No": mobileNo,
                    // "Email ID": email,
                    "Branch": branch.branchName,
                    "Transaction Type": 'Trainers',
                    "Name": `${trainerDetail.trainer.credentialId.userName} (${installment.installmentName})`,
                    "Paid Amount": installment.totalAmount ? `${installment.totalAmount.toFixed(3)}` : '0.000',
                    "Discount": installment.discount ? `${installment.discount.toFixed(3)}` : `0.000`,
                    "Cash": installment.cashAmount ? `${installment.cashAmount.toFixed(3)}` : `0.000`,
                    "Card": installment.cardAmount ? `${installment.cardAmount.toFixed(3)}` : `0.000`,
                    "Digital": installment.digitalAmount ? `${installment.digitalAmount.toFixed(3)}` : `0.000`,
                    "Cheque": installment.chequeAmount ? `${installment.chequeAmount.toFixed(3)}` : `0.000`,
                    "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
                  })
                  count = count + 1
                }
              })
            } else {
              if ((trainerDetail.paidStatus === 'Paid' || trainerDetail.paidStatus === 'Installment') && trainerDetail.display) {
                totalPaidAmount += (trainerDetail.totalAmount ? +trainerDetail.totalAmount : 0)
                totalCash += (trainerDetail.cashAmount ? +trainerDetail.cashAmount : 0)
                totalCard += (trainerDetail.cardAmount ? +trainerDetail.cardAmount : 0)
                totalDigital += (trainerDetail.digitalAmount ? +trainerDetail.digitalAmount : 0)
                totalCheque += (trainerDetail.chequeAmount ? +trainerDetail.chequeAmount : 0)
                totalDiscount += (trainerDetail.discount ? +trainerDetail.discount : 0)
                tabledData.push({
                  "SNo": count,
                  "Receipt No.": trainerDetail.orderNo,
                  "Date & Time": `${dateToDDMMYYYY(trainerDetail.dateOfPaid)} ${dateToHHMM(trainerDetail.timeOfPaid)}`,
                  "Member ID": memberId,
                  "Member Name": userName,
                  "Admission Date": dateToDDMMYYYY(admissionDate),
                  "Mobile No": mobileNo,
                  // "Email ID": email,
                  "Branch": branch.branchName,
                  "Transaction Type": 'Trainers',
                  "Name": trainerDetail.trainer.credentialId.userName,
                  "Paid Amount": trainerDetail.totalAmount ? `${trainerDetail.totalAmount.toFixed(3)}` : '0.000',
                  "Discount": trainerDetail.discount ? `${trainerDetail.discount.toFixed(3)}` : `0.000`,
                  "Cash": trainerDetail.cashAmount ? `${trainerDetail.cashAmount.toFixed(3)}` : `0.000`,
                  "Card": trainerDetail.cardAmount ? `${trainerDetail.cardAmount.toFixed(3)}` : `0.000`,
                  "Digital": trainerDetail.digitalAmount ? `${trainerDetail.digitalAmount.toFixed(3)}` : `0.000`,
                  "Cheque": trainerDetail.chequeAmount ? `${trainerDetail.chequeAmount.toFixed(3)}` : `0.000`,
                  "Done By": trainerDetail.doneBy ? trainerDetail.doneBy.userName : 'NA'
                })
                count = count + 1
              }
            }
          })
        }
      })
    })
    tabledData.push({
      "SNo": '',
      "Receipt No.": '',
      "Date & Time": ``,
      "Member ID": '',
      "Member Name": '',
      "Admission Date": '',
      "Mobile No": '',
      // "Email ID": email,
      "Branch": '',
      "Transaction Type": 'Grand Total',
      "Name": 'NA',
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Discount": `${this.props.defaultCurrency} ${totalDiscount.toFixed(3)}`,
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
      "Cheque": `${this.props.defaultCurrency} ${totalCheque.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForItemSales(datas) {
    let tabledData = []
    let count = 1
    let totalFullAmount = 0, totalDiscountAmount = 0, totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0, totalCheque = 0
    datas && datas.forEach(data => {
      const { customerDetails: { member }, branch, totalAmount, cashAmount, cardAmount, digitalAmount, chequeAmount, dateOfPurchase, created_at, actualAmount, discount, purchaseStock } = data
      let itemNames = purchaseStock.map(stock => stock.stockId.itemName).join(', ')
      let quantities = purchaseStock.map(stock => stock.quantity).join(', ')

      totalFullAmount += (actualAmount ? +actualAmount : 0)
      totalDiscountAmount += (discount ? +discount : 0)
      totalPaidAmount += (totalAmount ? +totalAmount : 0)
      totalCash += (cashAmount ? +cashAmount : 0)
      totalCard += (cardAmount ? +cardAmount : 0)
      totalDigital += (digitalAmount ? +digitalAmount : 0)
      totalCheque += (chequeAmount ? +chequeAmount : 0)

      if (member) {
        const { memberId, credentialId: { userName }, admissionDate, mobileNo } = member
        tabledData.push({
          "SNo": count,
          "Receipt No.": data.orderNo,
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": memberId ? memberId : 'NA',
          "Member Name": userName ? userName : 'NA',
          "Admission Date": admissionDate ? dateToDDMMYYYY(admissionDate) : 'NA',
          "Mobile No": mobileNo ? mobileNo : 'NA',
          // "Email ID": email ? email : 'NA',
          "Branch": branch.branchName,
          "Items": itemNames,
          "QTY": quantities,
          "Total Amount": `${actualAmount.toFixed(3)}`,
          "Discount Amount": `${discount.toFixed(3)}`,
          "Paid Amount": `${totalAmount.toFixed(3)}`,
          "Cash": `${cashAmount.toFixed(3)}`,
          "Card": `${cardAmount.toFixed(3)}`,
          "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
          "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
          "Done By": data.doneBy ? data.doneBy.userName : 'NA'
        })
      } else {
        tabledData.push({
          "SNo": count,
          "Receipt No.": data.orderNo,
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": 'NA',
          "Member Name": 'NA',
          "Admission Date": 'NA',
          "Mobile No": 'NA',
          // "Email ID": 'NA',
          "Branch": branch.branchName,
          "Items": itemNames,
          "QTY": quantities,
          "Total Amount": `${actualAmount.toFixed(3)}`,
          "Discount Amount": `${discount.toFixed(3)}`,
          "Paid Amount": `${totalAmount.toFixed(3)}`,
          "Cash": `${cashAmount.toFixed(3)}`,
          "Card": `${cardAmount.toFixed(3)}`,
          "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
          "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
          "Done By": data.doneBy ? data.doneBy.userName : 'NA'
        })
      }
      count = count + 1
    })
    tabledData.push({
      "SNo": '',
      "Receipt No.": '',
      "Date & Time": ``,
      "Member ID": '',
      "Member Name": '',
      "Admission Date": '',
      "Mobile No": '',
      // "Email ID": '',
      "Branch": '',
      "Items": '',
      "QTY": 'Grand Total',
      "Total Amount": `${this.props.defaultCurrency} ${totalFullAmount.toFixed(3)}`,
      "Discount Amount": `${this.props.defaultCurrency} ${totalDiscountAmount.toFixed(3)}`,
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
      "Cheque": `${this.props.defaultCurrency} ${totalCheque.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForClassesSales(datas) {
    let tabledData = []
    let count = 1
    let totalFullAmount = 0, totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0, totalCheque = 0, totalDiscount = 0
    datas && datas.forEach(data => {
      const { member: { memberId, credentialId: { userName }, branch, mobileNo }, amount, totalAmount, cashAmount, chequeAmount, discount,
        cardAmount, digitalAmount, dateOfPurchase, created_at, classId: { className, startDate, trainer: { credentialId: { userName: trainerName } } } } = data

      totalFullAmount += (amount ? +amount : 0)
      totalPaidAmount += (totalAmount ? +totalAmount : 0)
      totalCash += (cashAmount ? +cashAmount : 0)
      totalCard += (cardAmount ? +cardAmount : 0)
      totalDigital += (digitalAmount ? +digitalAmount : 0)
      totalCheque += (chequeAmount ? +chequeAmount : 0)
      totalDiscount += (discount ? +discount : 0)

      tabledData.push({
        "SNo": count,
        "Receipt No.": data.orderNo,
        "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
        "Member ID": memberId,
        "Member Name": userName,
        "Mobile No": mobileNo,
        // "Email ID": email,
        "Branch": branch.branchName,
        "Class Name": className,
        "Trainer": trainerName,
        "Start Date": dateToDDMMYYYY(startDate),
        "Amount": `${amount.toFixed(3)}`,
        "Paid Amount": `${totalAmount.toFixed(3)}`,
        "Discount": discount ? `${discount.toFixed(3)}` : `0.000`,
        "Cash": `${cashAmount.toFixed(3)}`,
        "Card": `${cardAmount.toFixed(3)}`,
        "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
        "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
        "Done By": data.doneBy ? data.doneBy.userName : 'NA'
      })
      count = count + 1
    })
    tabledData.push({
      "SNo": '',
      "Receipt No.": '',
      "Date & Time": ``,
      "Member ID": '',
      "Member Name": '',
      "Mobile No": '',
      // "Email ID": email,
      "Branch": '',
      "Class Name": '',
      "Trainer": '',
      "Start Date": `Grand Total`,
      "Amount": `${this.props.defaultCurrency} ${totalFullAmount.toFixed(3)}`,
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Discount": `${this.props.defaultCurrency} ${totalDiscount.toFixed(3)}`,
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
      "Cheque": `${this.props.defaultCurrency} ${totalCheque.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForCurrentStockDetails(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { itemName, itemCode, supplierName: { supplierName }, quantity, purchaseDate, expiryDate, branch: { branchName }, costPerUnit, sellingPrice, vat: { taxPercent } } = data
      tabledData.push({
        "SNo": count,
        "Item Name": itemName,
        "Item Code": itemCode,
        "Supplier": supplierName,
        "QTY on Hand": quantity,
        "Purchase Date": dateToDDMMYYYY(purchaseDate),
        "Expiry Date": dateToDDMMYYYY(expiryDate),
        "Branch": branchName,
        "Cost Price": `${this.props.defaultCurrency} ${costPerUnit.toFixed(3)}`,
        "Selling Price": `${this.props.defaultCurrency} ${sellingPrice.toFixed(3)}`,
        "VAT %": taxPercent
      })
      count = count + 1
    })
    return tabledData
  }

  tableForProductExpiryDetails(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { itemName, itemCode, supplierName: { supplierName }, quantity, expiryDate, branch: { branchName }, costPerUnit, sellingPrice, vat: { taxPercent } } = data
      tabledData.push({
        "SNo": count,
        "Item Name": itemName,
        "Item Code": itemCode,
        "Supplier": supplierName,
        "QTY on Hand": quantity,
        "Expiry Date": dateToDDMMYYYY(expiryDate),
        "Remaining Days": calculateDays(new Date(), expiryDate),
        "Branch": branchName,
        "Cost Price": `${this.props.defaultCurrency} ${costPerUnit.toFixed(3)}`,
        "Selling Price": `${this.props.defaultCurrency} ${sellingPrice.toFixed(3)}`,
        "VAT %": taxPercent
      })
      count = count + 1
    })
    return tabledData
  }

  tableForPOSProfitAndLoss(datas) {
    let tabledData = []
    let count = 1
    let totalCostPrice = 0, totalSellingPrice = 0, totalVatAmount = 0, totalDiscountAmount = 0, totalGiftCard = 0, totalPaidAmount = 0, totalProfitAmount = 0
    datas && datas.forEach(data => {
      const { branch, totalAmount, dateOfPurchase, created_at, actualAmount, discount,
        purchaseStock, costPrice, profitAmount, vatAmount, giftcard, paymentType } = data
      let itemNames = purchaseStock.map(stock => stock.stockId.itemName).join(', ')
      let itemCodes = purchaseStock.map(stock => stock.stockId.itemCode).join(', ')

      totalCostPrice += (costPrice ? +costPrice : 0)
      totalSellingPrice += (actualAmount ? +actualAmount : 0)
      totalVatAmount += (vatAmount ? +vatAmount : 0)
      totalDiscountAmount += (discount ? +discount : 0)
      totalGiftCard += (giftcard ? +giftcard : 0)
      totalPaidAmount += (totalAmount ? +totalAmount : 0)
      totalProfitAmount += (profitAmount ? +profitAmount : 0)

      tabledData.push({
        "SNo": count,
        "Item Code": itemCodes,
        "Item Name": itemNames,
        "Transaction Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
        "Cost Price": `${costPrice.toFixed(3)}`,
        "Selling Price": `${actualAmount.toFixed(3)}`,
        "VAT Amount": `${vatAmount.toFixed(3)}`,
        "Discount Amount": `${discount.toFixed(3)}`,
        "Gift Card": `${giftcard.toFixed(3)}`,
        "Paid Amount": `${totalAmount.toFixed(3)}`,
        "Profit Amount": `${profitAmount.toFixed(3)}`,
        "Branch": branch.branchName,
        "Source": paymentType
      })
      count = count + 1
    })
    tabledData.push({
      "SNo": '',
      "Item Code": '',
      "Item Name": '',
      "Transaction Date & Time": 'Grand Total',
      "Cost Price": `${this.props.defaultCurrency} ${totalCostPrice.toFixed(3)}`,
      "Selling Price": `${this.props.defaultCurrency} ${totalSellingPrice.toFixed(3)}`,
      "VAT Amount": `${this.props.defaultCurrency} ${totalVatAmount.toFixed(3)}`,
      "Discount Amount": `${this.props.defaultCurrency} ${totalDiscountAmount.toFixed(3)}`,
      "Gift Card": `${this.props.defaultCurrency} ${totalGiftCard.toFixed(3)}`,
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Profit Amount": `${this.props.defaultCurrency} ${totalProfitAmount.toFixed(3)}`,
      "Branch": '',
      "Source": ''
    })
    return tabledData
  }

  tableForSalesByPaymentMethod(datas) {
    let tabledData = []
    let count = 1
    let totalPaidAmount = 0
    datas && datas.forEach(data => {
      if (data.transactionType === 'Packages') {
        const { memberId, credentialId: { userName }, branch, packageDetails, mobileNo, paymentMethod } = data
        packageDetails.forEach(doc => {
          let displayAmount = 0
          if (doc.Installments && doc.Installments.length) {
            doc.Installments.forEach(installment => {
              if (installment.paidStatus === 'Paid' && installment.display) {
                if (paymentMethod === 'Cash') {
                  displayAmount = (+installment.cashAmount ? +installment.cashAmount : 0)
                  totalPaidAmount += (installment.cashAmount ? +installment.cashAmount : 0)
                } else if (paymentMethod === 'Card') {
                  displayAmount = (+installment.cardAmount ? installment.cardAmount : 0)
                  totalPaidAmount += (installment.cardAmount ? +installment.cardAmount : 0)
                } else if (paymentMethod === 'Digital') {
                  displayAmount = (+installment.digitalAmount ? +installment.digitalAmount : 0)
                  totalPaidAmount += (installment.digitalAmount ? +installment.digitalAmount : 0)
                } else {
                  displayAmount = (+installment.chequeAmount ? +installment.chequeAmount : 0)
                  totalPaidAmount += (installment.chequeAmount ? +installment.chequeAmount : 0)
                }
                tabledData.push({
                  "SNo": count,
                  "Receipt No.": installment.orderNo,
                  "Date & Time": `${dateToDDMMYYYY(doc.dateOfPaid)} ${dateToHHMM(doc.timeOfPaid)}`,
                  "Member ID": memberId,
                  "Member Name": userName,
                  "Mobile No": mobileNo,
                  // "Email ID": email,
                  "Branch": branch.branchName,
                  "Transaction Type": 'Packages',
                  "Payment Method": paymentMethod,
                  "Paid Amount": `${displayAmount.toFixed(3)}`,
                  "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
                })
                count = count + 1
              }
            })
          } else {
            if ((doc.paidStatus === 'Paid' || doc.paidStatus === 'Installment') && doc.display) {
              if (paymentMethod === 'Cash') {
                displayAmount = (+doc.cashAmount ? +doc.cashAmount : 0)
                totalPaidAmount += (doc.cashAmount ? +doc.cashAmount : 0)
              } else if (paymentMethod === 'Card') {
                displayAmount = (+doc.cardAmount ? doc.cardAmount : 0)
                totalPaidAmount += (doc.cardAmount ? +doc.cardAmount : 0)
              } else if (paymentMethod === 'Digital') {
                displayAmount = (+doc.digitalAmount ? +doc.digitalAmount : 0)
                totalPaidAmount += (doc.digitalAmount ? +doc.digitalAmount : 0)
              } else {
                displayAmount = (+doc.chequeAmount ? +doc.chequeAmount : 0)
                totalPaidAmount += (doc.chequeAmount ? +doc.chequeAmount : 0)
              }
              tabledData.push({
                "SNo": count,
                "Receipt No.": doc.orderNo,
                "Date & Time": `${dateToDDMMYYYY(doc.dateOfPaid)} ${dateToHHMM(doc.timeOfPaid)}`,
                "Member ID": memberId,
                "Member Name": userName,
                "Mobile No": mobileNo,
                // "Email ID": email,
                "Branch": branch.branchName,
                "Transaction Type": 'Packages',
                "Payment Method": paymentMethod,
                "Paid Amount": displayAmount ? `${displayAmount.toFixed(3)}` : '0.000',
                "Done By": doc.doneBy ? doc.doneBy.userName : 'NA'
              })
              count = count + 1
            }
          }
          if (doc.trainerDetails && doc.trainerDetails.length) {
            doc.trainerDetails.forEach(trainerDetail => {
              if (trainerDetail.Installments && trainerDetail.Installments.length) {
                trainerDetail.Installments.forEach(installment => {
                  if (installment.paidStatus === 'Paid' && installment.display) {
                    if (paymentMethod === 'Cash') {
                      displayAmount = (+installment.cashAmount ? +installment.cashAmount : 0)
                      totalPaidAmount += (installment.cashAmount ? +installment.cashAmount : 0)
                    } else if (paymentMethod === 'Card') {
                      displayAmount = (+installment.cardAmount ? installment.cardAmount : 0)
                      totalPaidAmount += (installment.cardAmount ? +installment.cardAmount : 0)
                    } else if (paymentMethod === 'Digital') {
                      displayAmount = (+installment.digitalAmount ? +installment.digitalAmount : 0)
                      totalPaidAmount += (installment.digitalAmount ? +installment.digitalAmount : 0)
                    } else {
                      displayAmount = (+installment.chequeAmount ? +installment.chequeAmount : 0)
                      totalPaidAmount += (installment.chequeAmount ? +installment.chequeAmount : 0)
                    }
                    tabledData.push({
                      "SNo": count,
                      "Receipt No.": installment.orderNo,
                      "Date & Time": `${dateToDDMMYYYY(doc.dateOfPaid)} ${dateToHHMM(doc.timeOfPaid)}`,
                      "Member ID": memberId,
                      "Member Name": userName,
                      "Mobile No": mobileNo,
                      // "Email ID": email,
                      "Branch": branch.branchName,
                      "Transaction Type": 'Trainers',
                      "Payment Method": paymentMethod,
                      "Paid Amount": displayAmount ? `${displayAmount.toFixed(3)}` : '0.000',
                      "Done By": installment.doneBy ? installment.doneBy.userName : 'NA'
                    })
                    count = count + 1
                  }
                })
              } else {
                if ((trainerDetail.paidStatus === 'Paid' || trainerDetail.paidStatus === 'Installment') && trainerDetail.display) {
                  if (paymentMethod === 'Cash') {
                    displayAmount = (+trainerDetail.cashAmount ? +trainerDetail.cashAmount : 0)
                    totalPaidAmount += (trainerDetail.cashAmount ? +trainerDetail.cashAmount : 0)
                  } else if (paymentMethod === 'Card') {
                    displayAmount = (+trainerDetail.cardAmount ? trainerDetail.cardAmount : 0)
                    totalPaidAmount += (trainerDetail.cardAmount ? +trainerDetail.cardAmount : 0)
                  } else if (paymentMethod === 'Digital') {
                    displayAmount = (+trainerDetail.digitalAmount ? +trainerDetail.digitalAmount : 0)
                    totalPaidAmount += (trainerDetail.digitalAmount ? +trainerDetail.digitalAmount : 0)
                  } else {
                    displayAmount = (+trainerDetail.chequeAmount ? +trainerDetail.chequeAmount : 0)
                    totalPaidAmount += (trainerDetail.chequeAmount ? +trainerDetail.chequeAmount : 0)
                  }
                  tabledData.push({
                    "SNo": count,
                    "Receipt No.": trainerDetail.orderNo,
                    "Date & Time": `${dateToDDMMYYYY(doc.dateOfPaid)} ${dateToHHMM(doc.timeOfPaid)}`,
                    "Member ID": memberId,
                    "Member Name": userName,
                    "Mobile No": mobileNo,
                    // "Email ID": email,
                    "Branch": branch.branchName,
                    "Transaction Type": 'Trainers',
                    "Payment Method": paymentMethod,
                    "Paid Amount": displayAmount ? `${displayAmount.toFixed(3)}` : '0.000',
                    "Done By": trainerDetail.doneBy ? trainerDetail.doneBy.userName : 'NA'
                  })
                  count = count + 1
                }
              }
            })
          }
        })
      } else if (data.transactionType === 'POS') {
        const { customerDetails: { member }, transactionType, branch, cashAmount, cardAmount, digitalAmount, chequeAmount, dateOfPurchase, created_at, paymentMethod } = data
        let displayAmount = 0
        if (paymentMethod === 'Cash') {
          displayAmount = (+cashAmount ? +cashAmount : 0)
          totalPaidAmount += (cashAmount ? +cashAmount : 0)
        } else if (paymentMethod === 'Card') {
          displayAmount = (+cardAmount ? +cardAmount : 0)
          totalPaidAmount += (cardAmount ? +cardAmount : 0)
        } else if (paymentMethod === 'Digital') {
          displayAmount = (+digitalAmount ? +digitalAmount : 0)
          totalPaidAmount += (digitalAmount ? +digitalAmount : 0)
        } else {
          displayAmount = (+chequeAmount ? +chequeAmount : 0)
          totalPaidAmount += (chequeAmount ? +chequeAmount : 0)
        }
        if (member) {
          const { memberId, credentialId: { userName }, mobileNo } = member
          tabledData.push({
            "SNo": count,
            "Receipt No.": data.orderNo,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": memberId ? memberId : 'NA',
            "Member Name": userName ? userName : 'NA',
            "Mobile No": mobileNo ? mobileNo : 'NA',
            // "Email ID": email ? email : 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Payment Method": paymentMethod,
            "Paid Amount": `${displayAmount.toFixed(3)}`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        } else {
          tabledData.push({
            "SNo": count,
            "Receipt No.": data.orderNo,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": 'NA',
            "Member Name": 'NA',
            "Mobile No": 'NA',
            // "Email ID": 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Payment Method": paymentMethod,
            "Paid Amount": `${displayAmount.toFixed(3)}`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        }
        count = count + 1
      } else if (data.transactionType === 'Classes') {
        const { member: { memberId, credentialId: { userName }, branch, mobileNo }, transactionType, cashAmount, cardAmount, digitalAmount, chequeAmount, dateOfPurchase, created_at, paymentMethod } = data
        let displayAmount = 0
        if (paymentMethod === 'Cash') {
          displayAmount = (+cashAmount ? +cashAmount : 0)
          totalPaidAmount += (cashAmount ? +cashAmount : 0)
        } else if (paymentMethod === 'Card') {
          displayAmount = (+cardAmount ? +cardAmount : 0)
          totalPaidAmount += (cardAmount ? +cardAmount : 0)
        } else if (paymentMethod === 'Digital') {
          displayAmount = (+digitalAmount ? +digitalAmount : 0)
          totalPaidAmount += (digitalAmount ? +digitalAmount : 0)
        } else {
          displayAmount = (+chequeAmount ? +chequeAmount : 0)
          totalPaidAmount += (chequeAmount ? +chequeAmount : 0)
        }
        tabledData.push({
          "SNo": count,
          "Receipt No.": data.orderNo,
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": memberId,
          "Member Name": userName,
          "Mobile No": mobileNo,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Transaction Type": transactionType,
          "Payment Method": paymentMethod,
          "Paid Amount": `${displayAmount.toFixed(3)}`,
          "Done By": data.doneBy ? data.doneBy.userName : 'NA'
        })
        count = count + 1
      }
    })
    tabledData.push({
      "SNo": '',
      "Receipt No.": '',
      "Date & Time": ``,
      "Member ID": '',
      "Member Name": '',
      "Mobile No": '',
      // "Email ID": email,
      "Branch": '',
      "Transaction Type": '',
      "Payment Method": 'Grand Total',
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForTodaySalesByStaff(datas) {
    let tabledData = []
    let count = 1
    let totalCash = 0, totalCard = 0, totalDigital = 0
    datas && datas.forEach(data => {
      if (data.transactionType === 'Packages') {
        const { memberId, credentialId: { userName }, branch, packageDetails, transactionType } = data
        packageDetails.forEach(doc => {
          totalCash += (doc.cashAmount ? +doc.cashAmount : 0)
          totalCard += (doc.cardAmount ? +doc.cardAmount : 0)
          totalDigital += (doc.digitalAmount ? +doc.digitalAmount : 0)

          tabledData.push({
            "SNo": count,
            "Date & Time": `${dateToDDMMYYYY(doc.dateOfPurchase)} ${dateToHHMM(doc.timeOfPurchase)}`,
            "Receipt No.": doc.orderNo,
            "Member ID": memberId,
            "Member Name": userName,
            // "Email ID": email,
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Digital": doc.digitalAmount ? `${doc.digitalAmount.toFixed(3)}` : `0.000`,
            "Cash": doc.cashAmount ? `${doc.cashAmount.toFixed(3)}` : `0.000`,
            "Card": doc.cardAmount ? `${doc.cardAmount.toFixed(3)}` : `0.000`,
            "Done By": doc.doneBy ? doc.doneBy.userName : 'NA'
          })
          count = count + 1
        })
      } else if (data.transactionType === 'POS') {
        const { customerDetails: { member }, transactionType, branch, cashAmount, cardAmount, digitalAmount, dateOfPurchase, created_at } = data
        totalCash += (cashAmount ? +cashAmount : 0)
        totalCard += (cardAmount ? +cardAmount : 0)
        totalDigital += (digitalAmount ? +digitalAmount : 0)
        if (member) {
          const { memberId, credentialId: { userName } } = member
          tabledData.push({
            "SNo": count,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Receipt No.": data.orderNo,
            "Member ID": memberId ? memberId : 'NA',
            "Member Name": userName ? userName : 'NA',
            // "Email ID": email ? email : 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Cash": `${cashAmount.toFixed(3)}`,
            "Card": `${cardAmount.toFixed(3)}`,
            "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        } else {
          tabledData.push({
            "SNo": count,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Receipt No.": data.orderNo,
            "Member ID": 'NA',
            "Member Name": 'NA',
            // "Email ID": 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Cash": `${cashAmount.toFixed(3)}`,
            "Card": `${cardAmount.toFixed(3)}`,
            "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        }
        count = count + 1
      } else if (data.transactionType === 'Classes') {
        const { member: { memberId, credentialId: { userName }, branch }, transactionType, cashAmount, cardAmount, digitalAmount, dateOfPurchase, created_at } = data
        totalCash += (cashAmount ? +cashAmount : 0)
        totalCard += (cardAmount ? +cardAmount : 0)
        totalDigital += (digitalAmount ? +digitalAmount : 0)
        tabledData.push({
          "SNo": count,
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Receipt No.": data.orderNo,
          "Member ID": memberId,
          "Member Name": userName,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Transaction Type": transactionType,
          "Cash": `${cashAmount.toFixed(3)}`,
          "Card": `${cardAmount.toFixed(3)}`,
          "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
          "Done By": data.doneBy ? data.doneBy.userName : 'NA'
        })
        count = count + 1
      }
    })
    tabledData.push({
      "SNo": '',
      "Date & Time": ``,
      "Receipt No.": '',
      "Member ID": '',
      "Member Name": '',
      // "Email ID": email,
      "Branch": '',
      "Transaction Type": '',
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForExpiredProductDetails(datas) {
    let tabledData = []
    let count = 1
    let totalCostPrice = 0
    datas && datas.forEach(data => {
      const { itemName, itemCode, supplierName: { supplierName }, quantity, purchaseDate, expiryDate, branch: { branchName }, costPerUnit, sellingPrice } = data

      totalCostPrice += (costPerUnit ? +(costPerUnit * quantity) : 0)

      tabledData.push({
        "SNo": count,
        "Item Name": itemName,
        "Item Code": itemCode,
        "Supplier": supplierName,
        "QTY on Hand": quantity,
        "Purchase Date": dateToDDMMYYYY(purchaseDate),
        "Expiry Date": dateToDDMMYYYY(expiryDate),
        "Days Since Expired": calculateDays(expiryDate, new Date()),
        "Branch": branchName,
        "Cost Price": `${costPerUnit.toFixed(3)}`,
        "Selling Price": `${sellingPrice.toFixed(3)}`,
        "Total Cost Price": `${(costPerUnit * quantity).toFixed(3)}`
      })
      count = count + 1
    })
    tabledData.push({
      "SNo": '',
      "Item Name": '',
      "Item Code": '',
      "Supplier": '',
      "QTY on Hand": '',
      "Purchase Date": '',
      "Expiry Date": '',
      "Days Since Expired": '',
      "Branch": '',
      "Cost Price": ``,
      "Selling Price": `Grand Total`,
      "Total Cost Price": `${this.props.defaultCurrency} ${totalCostPrice.toFixed(3)}`
    })
    return tabledData
  }

  tableForClassesRegistrationDetails(datas) {
    let tabledData = []
    let count = 1
    let totalFullAmount = 0
    datas && datas.forEach(data => {
      const { className, startDate, endDate, startTime, endTime, room: { roomName }, branch: { branchName }, capacity, occupied, trainer: { credentialId: { userName } }, amount } = data

      totalFullAmount += (occupied ? +(amount * occupied) : 0)

      tabledData.push({
        "SNo": count,
        "Class Name": className,
        "Class Date": `${dateToDDMMYYYY(startDate)} - ${dateToDDMMYYYY(endDate)}`,
        "Class Time": `${dateToHHMM(startTime)} - ${dateToHHMM(endTime)}`,
        "Room": roomName,
        "Branch": branchName,
        "Capacity": capacity,
        "Total Bookings": occupied ? occupied : 0,
        "Trainer": userName,
        "Amount": `${amount.toFixed(3)}`,
        "Total Amount": `${(occupied ? (amount * occupied) : 0).toFixed(3)}`
      })
      count = count + 1
    })
    tabledData.push({
      "SNo": '',
      "Class Name": '',
      "Class Date": '',
      "Class Time": '',
      "Room": '',
      "Branch": '',
      "Capacity": '',
      "Total Bookings": '',
      "Trainer": '',
      "Amount": 'Grand Total',
      "Total Amount": `${this.props.defaultCurrency} ${totalFullAmount.toFixed(3)}`
    })
    return tabledData
  }

  tableForEmployeeDetails(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { employeeId, credentialId: { userName }, personalId, dateOfBirth, nationality, gender, joiningDate, designation: { designationName }, branch, mobileNo, address } = data
      tabledData.push({
        "SNo": count,
        "Employee ID": employeeId,
        "Employee Name": userName,
        "Personal ID": personalId,
        "Date of Birth": dateToDDMMYYYY(dateOfBirth),
        "Nationality": nationality,
        "Gender": gender,
        "Date of Join": dateToDDMMYYYY(joiningDate),
        "Designation": designationName,
        "Branch": branch.map(b => b.branchName).join(', '),
        "Mobile No.": mobileNo,
        "Address": address
      })
      count = count + 1
    })
    return tabledData
  }

  tableForEmployeeShiftDetails(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { employee: { employeeId, credentialId: { userName }, nationality, gender, joiningDate, designation: { designationName }, mobileNo },
        branch: { branchName }, fromDate, toDate, shift: { shiftName, fromTime, toTime } } = data
      tabledData.push({
        "SNo": count,
        "Employee ID": employeeId,
        "Employee Name": userName,
        "Nationality": nationality,
        "Gender": gender,
        "Date of Join": dateToDDMMYYYY(joiningDate),
        "Designation": designationName,
        "Branch": branchName,
        "Mobile No.": mobileNo,
        "Work Date": `${dateToDDMMYYYY(fromDate)} - ${dateToDDMMYYYY(toDate)}`,
        "Shift Name": shiftName,
        "Shift Timing": `${dateToHHMM(fromTime)} - ${dateToHHMM(toTime)}`
      })
      count = count + 1
    })
    return tabledData
  }

  tableForBookedAppointmentsByMembers(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { member: { memberId, mobileNo, credentialId: { userName } }, fromTime, toTime, date, branch: { branchName },
        trainer, doneBy: { userName: doneUserName } } = data
      tabledData.push({
        "SNo": count,
        "Member ID": memberId,
        "Member Name": userName,
        "Branch": branchName,
        "Mobile Number": mobileNo,
        "Booking Date": dateToDDMMYYYY(date),
        "From Time": dateToHHMM(fromTime),
        "To Time": dateToHHMM(toTime),
        "Trainer Name": trainer ? trainer.credentialId.userName : 'NA',
        "Booked By": doneUserName === userName ? 'Self' : doneUserName
      })
      count = count + 1
    })
    return tabledData
  }

  tableForBookedAppointmentsStatus(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { member: { memberId, mobileNo, credentialId: { userName } }, fromTime, toTime, date, branch: { branchName },
        trainer, doneBy: { userName: doneUserName }, status } = data
      let resultedStatus = ''
      if (status) resultedStatus = status
      else if (setTime(date) > setTime(new Date())) resultedStatus = 'Yet to Come'
      else if (setTime(date) === setTime(new Date()) && new Date(toTime).setFullYear(2020, 11, 9) >= new Date().setFullYear(2020, 11, 9)) resultedStatus = 'Yet to Come'
      else resultedStatus = 'Missed'
      tabledData.push({
        "SNo": count,
        "Member ID": memberId,
        "Member Name": userName,
        "Branch": branchName,
        "Mobile Number": mobileNo,
        "Booking Date": dateToDDMMYYYY(date),
        "From Time": dateToHHMM(fromTime),
        "To Time": dateToHHMM(toTime),
        "Trainer Name": trainer ? trainer.credentialId.userName : 'NA',
        "Status": resultedStatus,
        "Booked By": doneUserName === userName ? 'Self' : doneUserName
      })
      count = count + 1
    })
    return tabledData
  }

  tableForBookedAppointmentsByVisitors(datas) {
    let tabledData = []
    let count = 1
    datas && datas.forEach(data => {
      const { visitorName, mobileNo, branch: { branchName }, fromTime, toTime, date, purposeOfVisit, doneBy: { userName } } = data
      tabledData.push({
        "SNo": count,
        "Visitor Name": visitorName,
        "Mobile Number": mobileNo,
        "Branch": branchName,
        "Booking Date": dateToDDMMYYYY(date),
        "From Time": dateToHHMM(fromTime),
        "To Time": dateToHHMM(toTime),
        "Purpose of Visit": purposeOfVisit,
        "Booked By": userName
      })
      count = count + 1
    })
    return tabledData
  }

  tableForVatReport(datas) {
    let tabledData = []
    let count = 1
    let totalExclVatAmount = 0, totalVatAmount = 0, totalInclVatAmount = 0
    datas && datas.forEach(data => {
      if (data.transactionType === 'Packages') {
        const { memberId, credentialId: { userName }, packageDetails, transactionType } = data
        packageDetails.forEach(doc => {
          const exclVat = doc.vatAmount ? (doc.totalAmount - doc.vatAmount) : doc.totalAmount
          const vatPer = doc.vatAmount ? (doc.vatAmount / (doc.totalAmount - doc.vatAmount) * 100) : 0
          totalExclVatAmount += (exclVat ? +exclVat : 0)
          totalVatAmount += (doc.vatAmount ? +doc.vatAmount : 0)
          totalInclVatAmount += (doc.totalAmount ? +doc.totalAmount : 0)
          tabledData.push({
            "SNo": count,
            "Date & Time": `${dateToDDMMYYYY(doc.dateOfPurchase)} ${dateToHHMM(doc.timeOfPurchase)}`,
            "Tax Invoice No": doc.orderNo,
            "Member ID": memberId,
            "Member Name": userName,
            "Transaction Type": transactionType,
            "Description": doc.packages.packageName,
            "Excl. VAT": `${exclVat.toFixed(3)}`,
            "VAT %": `${vatPer} %`,
            "VAT Amount": doc.vatAmount ? `${doc.vatAmount.toFixed(3)}` : `0.000`,
            "Total Incl. VAT": `${doc.totalAmount.toFixed(3)}`,
            "Done By": doc.doneBy ? doc.doneBy.userName : 'NA'
          })
          count = count + 1
        })
      } else if (data.transactionType === 'POS') {
        const { customerDetails: { member }, transactionType, vatAmount, totalAmount, dateOfPurchase, created_at } = data
        const exclVat = vatAmount ? (totalAmount - vatAmount) : totalAmount
        const vatPer = vatAmount ? (vatAmount / (totalAmount - vatAmount) * 100) : 0
        totalExclVatAmount += (exclVat ? +exclVat : 0)
        totalVatAmount += (vatAmount ? +vatAmount : 0)
        totalInclVatAmount += (totalAmount ? +totalAmount : 0)
        if (member) {
          const { memberId, credentialId: { userName } } = member
          tabledData.push({
            "SNo": count,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Tax Invoice No": data.orderNo,
            "Member ID": memberId ? memberId : 'NA',
            "Member Name": userName ? userName : 'NA',
            "Transaction Type": transactionType,
            "Description": 'NA',
            "Excl. VAT": `${exclVat.toFixed(3)}`,
            "VAT %": `${vatPer} %`,
            "VAT Amount": vatAmount ? `${vatAmount.toFixed(3)}` : `0.000`,
            "Total Incl. VAT": `${totalAmount.toFixed(3)}`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        } else {
          tabledData.push({
            "SNo": count,
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Tax Invoice No": data.orderNo,
            "Member ID": 'NA',
            "Member Name": 'NA',
            "Transaction Type": transactionType,
            "Description": 'NA',
            "Excl. VAT": `${exclVat.toFixed(3)}`,
            "VAT %": `${vatPer} %`,
            "VAT Amount": vatAmount ? `${vatAmount.toFixed(3)}` : `0.000`,
            "Total Incl. VAT": `${totalAmount.toFixed(3)}`,
            "Done By": data.doneBy ? data.doneBy.userName : 'NA'
          })
        }
        count = count + 1
      } else if (data.transactionType === 'Classes') {
        const { member: { memberId, credentialId: { userName } }, transactionType, vatAmount, totalAmount, dateOfPurchase, created_at,
          classId: { className } } = data
        const exclVat = vatAmount ? (totalAmount - vatAmount) : totalAmount
        const vatPer = vatAmount ? (vatAmount / (totalAmount - vatAmount) * 100) : 0
        totalExclVatAmount += (exclVat ? +exclVat : 0)
        totalVatAmount += (vatAmount ? +vatAmount : 0)
        totalInclVatAmount += (totalAmount ? +totalAmount : 0)
        tabledData.push({
          "SNo": count,
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Tax Invoice No": data.orderNo,
          "Member ID": memberId,
          "Member Name": userName,
          "Transaction Type": transactionType,
          "Description": className,
          "Excl. VAT": `${exclVat.toFixed(3)}`,
          "VAT %": `${vatPer} %`,
          "VAT Amount": vatAmount ? `${vatAmount.toFixed(3)}` : `0.000`,
          "Total Incl. VAT": `${totalAmount.toFixed(3)}`,
          "Done By": data.doneBy ? data.doneBy.userName : 'NA'
        })
        count = count + 1
      }
    })
    tabledData.push({
      "SNo": '',
      "Date & Time": ``,
      "Tax Invoice No": '',
      "Member ID": '',
      "Member Name": '',
      "Transaction Type": '',
      "Description": '',
      "Excl. VAT": `${this.props.defaultCurrency} ${totalExclVatAmount.toFixed(3)}`,
      "VAT %": '',
      "VAT Amount": `${this.props.defaultCurrency} ${totalVatAmount.toFixed(3)}`,
      "Total Incl. VAT": `${this.props.defaultCurrency} ${totalInclVatAmount.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

}

function mapStateToProps({ currency: { defaultCurrency } }) {
  return {
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(TableExport))