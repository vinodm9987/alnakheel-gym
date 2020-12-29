
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { generateReport } from '../../utils/pdf'
import { generateExcel } from '../../utils/excel'
import { dateToDDMMYYYY, dateToHHMM, countHours, getPageWiseData, setTime, calculateDays } from '../../utils/apis/helpers'
import Pagination from './Pagination'
import { connect } from 'react-redux'

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
    }
  }

  generatePdfReport(tabledData) {
    const { reportName, fromDate, toDate, branchName, description } = this.props
    const language = this.props.i18n.language
    console.log("TableExport -> generatePdfReport -> language", language)
    if (reportName === 'Current Stock Details' || reportName === 'Upcoming Expiry') {
      generateReport(tabledData, reportName, null, null, branchName, description, language)
    } else {
      generateReport(tabledData, reportName, fromDate, toDate, branchName, description, language)
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
          "Package Start Date": dateToDDMMYYYY(doc.packages.startDate),
          "Package End Date": dateToDDMMYYYY(doc.packages.endDate),
          "Trainer Name": doc.trainer ? doc.trainer.credentialId.userName : 'NA',
          "Paid Amount": doc.totalAmount.toFixed(3)
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
        if (new Date(setTime(endDate)).setDate(new Date(setTime(endDate)).getDate() - 7) <= today && today < new Date(setTime(endDate))) {
          tabledData.push({
            "SNo": count,
            "Member ID": memberId,
            "Member Name": userName,
            "Admission Date": dateToDDMMYYYY(admissionDate),
            "Package": pack.packages.packageName,
            "Expiry Date": dateToDDMMYYYY(endDate),
            "Trainer Name": pack.trainer ? pack.trainer.credentialId.userName : 'NA',
            "Paid Amount": pack.totalAmount.toFixed(3),
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
            "Trainer Name": pack.trainer ? pack.trainer.credentialId.userName : 'NA',
            "Paid Amount": pack.totalAmount.toFixed(3),
            "Any Valid Package": packageDetails.filter(doc => !doc.isExpiredPackage)[0] ? packageDetails.filter(doc => !doc.isExpiredPackage)[0].packages.packageName : 'NA',
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
            "Receipt No.": '',
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
            "Renewed By": ''
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
          "Receipt No.": '',
          "Date & Time": `${dateToDDMMYYYY(doc.dateOfPurchase)} ${dateToHHMM(doc.timeOfPurchase)}`,
          "Member ID": memberId,
          "Member Name": credentialId.userName,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Package": doc.packages.packageName,
          "Start Date": doc.startDate ? dateToDDMMYYYY(doc.startDate) : 'Not Started Yet',
          "End Date": doc.endDate ? doc.extendDate ? dateToDDMMYYYY(doc.extendDate) : dateToDDMMYYYY(doc.endDate) : 'Not Started Yet',
          "Paid Amount": doc.totalAmount.toFixed(3),
          "Renewed By": ''
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
      if (customTrainerId) {
        filteredPackageDetails = packageDetails.filter(pack => pack.trainer && pack.trainer._id === customTrainerId)
      }
      filteredPackageDetails.forEach(doc => {
        if (doc.dateOfPurchase && doc.trainerFees) {
          totalPaidAmount += (doc.trainerFees.amount ? +doc.trainerFees.amount : 0)
          tabledData.push({
            "SNo": count,
            "Receipt No.": '',
            "Date & Time": `${dateToDDMMYYYY(doc.dateOfPurchase)} ${dateToHHMM(doc.timeOfPurchase)}`,
            "Member ID": memberId,
            "Member Name": credentialId.userName,
            "Branch": branch.branchName,
            "Package": doc.packages.packageName,
            "Trainer Name": doc.trainer.credentialId.userName,
            "Period": doc.trainerFees.period.periodName,
            "Start Date": doc.startDate ? dateToDDMMYYYY(doc.startDate) : 'Not Started Yet',
            "End Date": doc.endDate ? doc.extendDate ? dateToDDMMYYYY(doc.extendDate) : dateToDDMMYYYY(doc.endDate) : 'Not Started Yet',
            "Paid Amount": doc.trainerFees.amount.toFixed(3),
            "Done By": ''
          })
        }
        count = count + 1
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
    let totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0
    datas && datas.forEach(data => {
      if (data.transactionType === 'Packages') {
        const { memberId, credentialId: { userName }, branch, packageDetails, admissionDate, mobileNo, transactionType } = data
        packageDetails.forEach(doc => {

          totalPaidAmount += (doc.totalAmount ? +doc.totalAmount : 0)
          totalCash += (doc.cashAmount ? +doc.cashAmount : 0)
          totalCard += (doc.cardAmount ? +doc.cardAmount : 0)
          totalDigital += (doc.digitalAmount ? +doc.digitalAmount : 0)

          tabledData.push({
            "SNo": count,
            "Receipt No.": '',
            "Date & Time": `${dateToDDMMYYYY(doc.startDate ? doc.startDate : admissionDate)} ${dateToHHMM(doc.startDate ? doc.startDate : admissionDate)}`,
            "Member ID": memberId,
            "Member Name": userName,
            "Admission Date": dateToDDMMYYYY(admissionDate),
            "Mobile No": mobileNo,
            // "Email ID": email,
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Paid Amount": `${this.props.defaultCurrency} ${doc.totalAmount.toFixed(3)}`,
            "Cash": doc.cashAmount ? `${this.props.defaultCurrency} ${doc.cashAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
            "Card": doc.cardAmount ? `${this.props.defaultCurrency} ${doc.cardAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
            "Digital": doc.digitalAmount ? `${this.props.defaultCurrency} ${doc.digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
            "Done By": ''
          })
          count = count + 1
        })
      } else if (data.transactionType === 'POS') {
        const { customerDetails: { member }, transactionType, branch, totalAmount, cashAmount, cardAmount, digitalAmount, dateOfPurchase, created_at } = data
        totalPaidAmount += (totalAmount ? +totalAmount : 0)
        totalCash += (cashAmount ? +cashAmount : 0)
        totalCard += (cardAmount ? +cardAmount : 0)
        totalDigital += (digitalAmount ? +digitalAmount : 0)

        if (member) {
          const { memberId, credentialId: { userName }, admissionDate, mobileNo } = member
          tabledData.push({
            "SNo": count,
            "Receipt No.": '',
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": memberId ? memberId : 'NA',
            "Member Name": userName ? userName : 'NA',
            "Admission Date": admissionDate ? dateToDDMMYYYY(admissionDate) : 'NA',
            "Mobile No": mobileNo ? mobileNo : 'NA',
            // "Email ID": email ? email : 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Paid Amount": `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}`,
            "Cash": `${this.props.defaultCurrency} ${cashAmount.toFixed(3)}`,
            "Card": `${this.props.defaultCurrency} ${cardAmount.toFixed(3)}`,
            "Digital": digitalAmount ? `${this.props.defaultCurrency} ${digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
            "Done By": ''
          })
        } else {
          tabledData.push({
            "SNo": count,
            "Receipt No.": '',
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": 'NA',
            "Member Name": 'NA',
            "Admission Date": 'NA',
            "Mobile No": 'NA',
            // "Email ID": 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Paid Amount": `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}`,
            "Cash": `${this.props.defaultCurrency} ${cashAmount.toFixed(3)}`,
            "Card": `${this.props.defaultCurrency} ${cardAmount.toFixed(3)}`,
            "Digital": digitalAmount ? `${this.props.defaultCurrency} ${digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
            "Done By": ''
          })
        }
        count = count + 1
      } else if (data.transactionType === 'Classes') {
        const { member: { memberId, credentialId: { userName }, branch, admissionDate, mobileNo }, transactionType, totalAmount, cashAmount, cardAmount, digitalAmount, dateOfPurchase, created_at } = data
        totalPaidAmount += (totalAmount ? +totalAmount : 0)
        totalCash += (cashAmount ? +cashAmount : 0)
        totalCard += (cardAmount ? +cardAmount : 0)
        totalDigital += (digitalAmount ? +digitalAmount : 0)
        tabledData.push({
          "SNo": count,
          "Receipt No.": '',
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": memberId,
          "Member Name": userName,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Transaction Type": transactionType,
          "Paid Amount": `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}`,
          "Cash": `${this.props.defaultCurrency} ${cashAmount.toFixed(3)}`,
          "Card": `${this.props.defaultCurrency} ${cardAmount.toFixed(3)}`,
          "Digital": digitalAmount ? `${this.props.defaultCurrency} ${digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
          "Done By": ''
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
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForPackageSales(datas) {
    let tabledData = []
    let count = 1
    let totalPackageAmount = 0, totalTrainerAmount = 0, totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0
    datas && datas.forEach(data => {
      const { memberId, credentialId: { userName }, branch, packageDetails, admissionDate, mobileNo, transactionType } = data
      packageDetails.forEach(doc => {

        totalPackageAmount += (doc.packages.amount ? +doc.packages.amount : 0)
        totalTrainerAmount += (doc.trainerFees ? +doc.trainerFees.amount : 0)
        totalPaidAmount += (doc.totalAmount ? +doc.totalAmount : 0)
        totalCash += (doc.cashAmount ? +doc.cashAmount : 0)
        totalCard += (doc.cardAmount ? +doc.cardAmount : 0)
        totalDigital += (doc.digitalAmount ? +doc.digitalAmount : 0)

        tabledData.push({
          "SNo": count,
          "Receipt No.": '',
          "Date & Time": `${dateToDDMMYYYY(doc.startDate ? doc.startDate : admissionDate)} ${dateToHHMM(doc.startDate ? doc.startDate : admissionDate)}`,
          "Member ID": memberId,
          "Member Name": userName,
          "Admission Date": dateToDDMMYYYY(admissionDate),
          "Mobile No": mobileNo,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Package": doc.packages.packageName,
          "Transaction Type": transactionType,
          "Package Amount": `${this.props.defaultCurrency} ${doc.packages.amount.toFixed(3)}`,
          "Trainer Amount": doc.trainerFees ? `${this.props.defaultCurrency} ${doc.trainerFees.amount.toFixed(3)}` : 'NA',
          "Paid Amount": `${this.props.defaultCurrency} ${doc.totalAmount.toFixed(3)}`,
          "Cash": doc.cashAmount ? `${this.props.defaultCurrency} ${doc.cashAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
          "Card": doc.cardAmount ? `${this.props.defaultCurrency} ${doc.cardAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
          "Digital": doc.digitalAmount ? `${this.props.defaultCurrency} ${doc.digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
          "Done By": ''
        })
        count = count + 1
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
      "Package": '',
      "Transaction Type": 'Grand Total',
      "Package Amount": `${this.props.defaultCurrency} ${totalPackageAmount.toFixed(3)}`,
      "Trainer Amount": `${this.props.defaultCurrency} ${totalTrainerAmount.toFixed(3)}`,
      "Paid Amount": `${this.props.defaultCurrency} ${totalPaidAmount.toFixed(3)}`,
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
      "Done By": ''
    })
    return tabledData
  }

  tableForItemSales(datas) {
    let tabledData = []
    let count = 1
    let totalFullAmount = 0, totalDiscountAmount = 0, totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0
    datas && datas.forEach(data => {
      const { customerDetails: { member }, branch, totalAmount, cashAmount, cardAmount, digitalAmount, dateOfPurchase, created_at, actualAmount, discount, purchaseStock } = data
      let itemNames = purchaseStock.map(stock => stock.stockId.itemName).join(', ')
      let quantities = purchaseStock.map(stock => stock.quantity).join(', ')

      totalFullAmount += (actualAmount ? +actualAmount : 0)
      totalDiscountAmount += (discount ? +discount : 0)
      totalPaidAmount += (totalAmount ? +totalAmount : 0)
      totalCash += (cashAmount ? +cashAmount : 0)
      totalCard += (cardAmount ? +cardAmount : 0)
      totalDigital += (digitalAmount ? +digitalAmount : 0)

      if (member) {
        const { memberId, credentialId: { userName }, admissionDate, mobileNo } = member
        tabledData.push({
          "SNo": count,
          "Receipt No.": '',
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": memberId ? memberId : 'NA',
          "Member Name": userName ? userName : 'NA',
          "Admission Date": admissionDate ? dateToDDMMYYYY(admissionDate) : 'NA',
          "Mobile No": mobileNo ? mobileNo : 'NA',
          // "Email ID": email ? email : 'NA',
          "Branch": branch.branchName,
          "Items": itemNames,
          "QTY": quantities,
          "Total Amount": `${this.props.defaultCurrency} ${actualAmount.toFixed(3)}`,
          "Discount Amount": `${this.props.defaultCurrency} ${discount.toFixed(3)}`,
          "Paid Amount": `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}`,
          "Cash": `${this.props.defaultCurrency} ${cashAmount.toFixed(3)}`,
          "Card": `${this.props.defaultCurrency} ${cardAmount.toFixed(3)}`,
          "Digital": digitalAmount ? `${this.props.defaultCurrency} ${digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
          "Done By": ''
        })
      } else {
        tabledData.push({
          "SNo": count,
          "Receipt No.": '',
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": 'NA',
          "Member Name": 'NA',
          "Admission Date": 'NA',
          "Mobile No": 'NA',
          // "Email ID": 'NA',
          "Branch": branch.branchName,
          "Items": itemNames,
          "QTY": quantities,
          "Total Amount": `${this.props.defaultCurrency} ${actualAmount.toFixed(3)}`,
          "Discount Amount": `${this.props.defaultCurrency} ${discount.toFixed(3)}`,
          "Paid Amount": `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}`,
          "Cash": `${this.props.defaultCurrency} ${cashAmount.toFixed(3)}`,
          "Card": `${this.props.defaultCurrency} ${cardAmount.toFixed(3)}`,
          "Digital": digitalAmount ? `${this.props.defaultCurrency} ${digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
          "Done By": ''
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
      "Done By": ''
    })
    return tabledData
  }

  tableForClassesSales(datas) {
    let tabledData = []
    let count = 1
    let totalFullAmount = 0, totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0
    datas && datas.forEach(data => {
      const { member: { memberId, credentialId: { userName }, branch, mobileNo }, amount, totalAmount, cashAmount,
        cardAmount, digitalAmount, dateOfPurchase, created_at, classId: { className, startDate, trainer: { credentialId: { userName: trainerName } } } } = data

      totalFullAmount += (amount ? +amount : 0)
      totalPaidAmount += (totalAmount ? +totalAmount : 0)
      totalCash += (cashAmount ? +cashAmount : 0)
      totalCard += (cardAmount ? +cardAmount : 0)
      totalDigital += (digitalAmount ? +digitalAmount : 0)

      tabledData.push({
        "SNo": count,
        "Receipt No.": '',
        "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
        "Member ID": memberId,
        "Member Name": userName,
        "Mobile No": mobileNo,
        // "Email ID": email,
        "Branch": branch.branchName,
        "Class Name": className,
        "Trainer": trainerName,
        "Start Date": dateToDDMMYYYY(startDate),
        "Amount": `${this.props.defaultCurrency} ${amount.toFixed(3)}`,
        "Paid Amount": `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}`,
        "Cash": `${this.props.defaultCurrency} ${cashAmount.toFixed(3)}`,
        "Card": `${this.props.defaultCurrency} ${cardAmount.toFixed(3)}`,
        "Digital": digitalAmount ? `${this.props.defaultCurrency} ${digitalAmount.toFixed(3)}` : `${this.props.defaultCurrency} 0.000`,
        "Done By": ''
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
      "Cash": `${this.props.defaultCurrency} ${totalCash.toFixed(3)}`,
      "Card": `${this.props.defaultCurrency} ${totalCard.toFixed(3)}`,
      "Digital": `${this.props.defaultCurrency} ${totalDigital.toFixed(3)}`,
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
        "Vat %": taxPercent
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
        "Vat %": taxPercent
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
        "Cost Price": `${this.props.defaultCurrency} ${costPrice.toFixed(3)}`,
        "Selling Price": `${this.props.defaultCurrency} ${actualAmount.toFixed(3)}`,
        "Vat Amount": `${this.props.defaultCurrency} ${vatAmount.toFixed(3)}`,
        "Discount Amount": `${this.props.defaultCurrency} ${discount.toFixed(3)}`,
        "Gift Card": `${this.props.defaultCurrency} ${giftcard.toFixed(3)}`,
        "Paid Amount": `${this.props.defaultCurrency} ${totalAmount.toFixed(3)}`,
        "Profit Amount": `${this.props.defaultCurrency} ${profitAmount.toFixed(3)}`,
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
      "Vat Amount": `${this.props.defaultCurrency} ${totalVatAmount.toFixed(3)}`,
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
        const { memberId, credentialId: { userName }, branch, packageDetails, admissionDate, mobileNo, transactionType, paymentMethod } = data
        packageDetails.forEach(doc => {
          let displayAmount = 0
          if (paymentMethod === 'Cash') {
            displayAmount = (+doc.cashAmount ? +doc.cashAmount : 0)
            totalPaidAmount += (doc.cashAmount ? +doc.cashAmount : 0)
          } else if (paymentMethod === 'Card') {
            displayAmount = (+doc.cardAmount ? doc.cardAmount : 0)
            totalPaidAmount += (doc.cardAmount ? +doc.cardAmount : 0)
          } else {
            displayAmount = (+doc.digitalAmount ? +doc.digitalAmount : 0)
            totalPaidAmount += (doc.digitalAmount ? +doc.digitalAmount : 0)
          }

          tabledData.push({
            "SNo": count,
            "Receipt No.": '',
            "Date & Time": `${dateToDDMMYYYY(doc.startDate ? doc.startDate : admissionDate)} ${dateToHHMM(doc.startDate ? doc.startDate : admissionDate)}`,
            "Member ID": memberId,
            "Member Name": userName,
            "Mobile No": mobileNo,
            // "Email ID": email,
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Payment Method": paymentMethod,
            "Paid Amount": `${this.props.defaultCurrency} ${displayAmount.toFixed(3)}`,
            "Done By": ''
          })
          count = count + 1
        })
      } else if (data.transactionType === 'POS') {
        const { customerDetails: { member }, transactionType, branch, cashAmount, cardAmount, digitalAmount, dateOfPurchase, created_at, paymentMethod } = data
        let displayAmount = 0
        if (paymentMethod === 'Cash') {
          displayAmount = +cashAmount
          totalPaidAmount += (cashAmount ? +cashAmount : 0)
        } else if (paymentMethod === 'Card') {
          displayAmount = +cardAmount
          totalPaidAmount += (cardAmount ? +cardAmount : 0)
        } else {
          displayAmount = (+digitalAmount ? +digitalAmount : 0)
          totalPaidAmount += (digitalAmount ? +digitalAmount : 0)
        }
        if (member) {
          const { memberId, credentialId: { userName }, mobileNo } = member
          tabledData.push({
            "SNo": count,
            "Receipt No.": '',
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": memberId ? memberId : 'NA',
            "Member Name": userName ? userName : 'NA',
            "Mobile No": mobileNo ? mobileNo : 'NA',
            // "Email ID": email ? email : 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Payment Method": paymentMethod,
            "Paid Amount": `${this.props.defaultCurrency} ${displayAmount.toFixed(3)}`,
            "Done By": ''
          })
        } else {
          tabledData.push({
            "SNo": count,
            "Receipt No.": '',
            "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
            "Member ID": 'NA',
            "Member Name": 'NA',
            "Mobile No": 'NA',
            // "Email ID": 'NA',
            "Branch": branch.branchName,
            "Transaction Type": transactionType,
            "Payment Method": paymentMethod,
            "Paid Amount": `${this.props.defaultCurrency} ${displayAmount.toFixed(3)}`,
            "Done By": ''
          })
        }
        count = count + 1
      } else if (data.transactionType === 'Classes') {
        const { member: { memberId, credentialId: { userName }, branch, mobileNo }, transactionType, cashAmount, cardAmount, digitalAmount, dateOfPurchase, created_at, paymentMethod } = data
        let displayAmount = 0
        if (paymentMethod === 'Cash') {
          displayAmount = +cashAmount
          totalPaidAmount += (cashAmount ? +cashAmount : 0)
        } else if (paymentMethod === 'Card') {
          displayAmount = +cardAmount
          totalPaidAmount += (cardAmount ? +cardAmount : 0)
        } else {
          displayAmount = (+digitalAmount ? +digitalAmount : 0)
          totalPaidAmount += (digitalAmount ? +digitalAmount : 0)
        }
        tabledData.push({
          "SNo": count,
          "Receipt No.": '',
          "Date & Time": `${dateToDDMMYYYY(dateOfPurchase)} ${dateToHHMM(created_at)}`,
          "Member ID": memberId,
          "Member Name": userName,
          "Mobile No": mobileNo,
          // "Email ID": email,
          "Branch": branch.branchName,
          "Transaction Type": transactionType,
          "Payment Method": paymentMethod,
          "Paid Amount": `${this.props.defaultCurrency} ${displayAmount.toFixed(3)}`,
          "Done By": ''
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
        "Cost Price": `${this.props.defaultCurrency} ${costPerUnit.toFixed(3)}`,
        "Selling Price": `${this.props.defaultCurrency} ${sellingPrice.toFixed(3)}`,
        "Total Cost Price": `${this.props.defaultCurrency} ${(costPerUnit * quantity).toFixed(3)}`
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
        "Amount": `${this.props.defaultCurrency} ${amount.toFixed(3)}`,
        "Total Amount": `${this.props.defaultCurrency} ${(occupied ? (amount * occupied) : 0).toFixed(3)}`
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

}

function mapStateToProps({ currency: { defaultCurrency } }) {
  return {
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(TableExport))