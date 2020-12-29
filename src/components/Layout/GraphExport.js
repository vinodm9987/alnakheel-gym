import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Doughnut } from 'react-chartjs-2'
import { calculateDays, countHoursGraph, dateToDDMMYYYY, setTime } from '../../utils/apis/helpers'
import { connect } from 'react-redux'

class GraphExport extends Component {

  generateGraph(datas, reportName) {
    if (reportName === 'New Members') {
      return this.graphForNewMembers(datas)
    } else if (reportName === 'Active Members') {
      return this.graphForActiveMembers(datas)
    } else if (reportName === 'Pending Members') {
      return this.graphForPendingMembers(datas)
    } else if (reportName === 'Upcoming Expiry') {
      return this.graphForUpcomingExpiry(datas)
    } else if (reportName === 'Expired Members') {
      return this.graphForExpiredMembers(datas)
    } else if (reportName === 'Members Attendance') {
      return this.graphForMembersAttendances(datas)
    } else if (reportName === 'Freezed Members') {
      return this.graphForFreezedMembers(datas)
    } else if (reportName === 'Package Renewal') {
      return this.graphForPackageRenewal(datas)
    } else if (reportName === 'Package Type') {
      return this.graphForPackageType(datas)
    } else if (reportName === 'Assigned Trainers') {
      return this.graphForAssignedTrainers(datas)
    } else if (reportName === 'General Sales') {
      return this.graphForGeneralSales(datas)
    } else if (reportName === 'Package Sales') {
      return this.graphForPackageSales(datas)
    } else if (reportName === 'Item Sales') {
      return this.graphForItemSales(datas)
    } else if (reportName === 'Classes Sales') {
      return this.graphForClassesSales(datas)
    } else if (reportName === 'End of Shift Report') {
      // return this.graphForClassesSales(datas)
    } else if (reportName === 'Current Stock Details') {
      return this.graphForCurrentStockDetails(datas)
    } else if (reportName === 'Product Expiry Details') {
      return this.graphForProductExpiryDetails(datas)
    } else if (reportName === 'POS Profit and Loss') {
      return this.graphForPOSProfitAndLoss(datas)
    } else if (reportName === 'Sales By Payment Method') {
      return this.graphForSalesByPaymentMethod(datas)
    } else if (reportName === 'Expired Product Details') {
      return this.graphForExpiredProductDetails(datas)
    } else if (reportName === 'Classes Registration Details') {
      return this.graphForClassesRegistrationDetails(datas)
    } else if (reportName === 'Employee Details') {
      return this.graphForEmployeeDetails(datas)
    } else if (reportName === 'Employee Shift Details') {
      return this.graphForEmployeeShiftDetails(datas)
    } else if (reportName === 'Booked Appointments By Members') {
      return this.graphForBookedAppointmentsByMembers(datas)
    } else if (reportName === 'Booked Appointments Status') {
      return this.graphForBookedAppointmentsStatus(datas)
    } else if (reportName === 'Booked Appointments By Visitors') {
      return this.graphForBookedAppointmentsByVisitors(datas)
    }
  }

  renderDoughnutChart(name, graphData, i) {
    return (
      <div key={`exportGraph${i}`} className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-4 bg-light my-4 mx-1">
        <h5 className="text-center py-3"><b>{name}</b></h5>
        <div id={`exportGraph${i}`}>
          <Doughnut
            data={graphData}
            options={{
              legend: {
                display: false,
                position: 'right',
                align: 'start'
              }
            }}
          />
          {/* <div className="chartcenterData">
                <p className="m-0">Total</p>
                <p className="m-0">{total}</p>
              </div> */}
          <div className="col-12 px-0">
            <div className="row py-3">
              <div className="col-12 overflow-auto mxh-200px" id={`exportGraphLabel${i}`}>
                <div className="row">
                  {graphData.labels && graphData.labels.map((label, j) => {
                    return (
                      <div key={`exportGraph${i}-${j}`} className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 d-flex">
                        <span className="h-15px w-15px mr-1 my-1 flex-0-0-15px" style={{ backgroundColor: graphData.datasets[0].backgroundColor[j] }}></span>
                        <label className="my-0 dirltrtar">{label}</label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { datas, reportName } = this.props
    if (Object.keys(datas).length > 0 && datas.response && datas.response.length > 0) {
      const getData = this.generateGraph(datas, reportName)
      const graphDatas = getData ? getData : []
      return (
        <div className="row px-2" id="exported">
          {graphDatas.map((graphData, i) => {
            if (graphData.type === 'doughnut') {
              return this.renderDoughnutChart(graphData.name, graphData.data, i)
            } else if (graphData.type === 'bar') {
              return this.renderBarChart(graphData.name, graphData.data, graphData.total, i)
            } else {
              return null
            }
          })}
        </div>
      )
    } else {
      return null
    }
  }

  graphForNewMembers(datas) {
    const { t } = this.props
    let { packages, paidCount, unPaidCount, response } = datas
    let graphDatas = []
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: ['Paid', 'Not Paid'],
      datasets: [{ data: [paidCount, unPaidCount], backgroundColor: ['#28a745', '#dc3545'], hoverBackgroundColor: ['#28a745', '#dc3545'] }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForActiveMembers(datas) {
    const { t } = this.props
    let { packages, branches, response } = datas
    let graphDatas = [], total = 0, colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')} ${response.length}`
    }
    branches.forEach(branch => total = total + branch.amount)
    const data2 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.amount), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')}`,
      text2: `${total.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total })
    return graphDatas
  }

  graphForPendingMembers(datas) {
    const { t } = this.props
    let { branches, response } = datas
    let graphDatas = [], week = 0, month = 0, moreMonth = 0, colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    response.forEach(member => {
      const days = Math.abs(calculateDays(member.admissionDate, new Date()))
      if (days <= 7) {
        week++
      } else if (days <= 30) {
        month++
      } else {
        moreMonth++
      }
    })
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: ['One Week', 'One Month', 'More than One Month'],
      datasets: [{ data: [week, month, moreMonth], backgroundColor: ['#28a745', '#dc3545', 'yellow'], hoverBackgroundColor: ['#28a745', '#dc3545', 'yellow'] }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForUpcomingExpiry(datas) {
    const { t } = this.props
    let { packages, response } = datas
    let graphDatas = [], week = 0
    response.forEach(member => {
      member.packageDetails.forEach(pack => {
        let endDate = pack.endDate
        let today = new Date(new Date().setHours(0, 0, 0, 0));
        if (pack.extendDate) {
          endDate = pack.extendDate;
        }
        if (new Date(setTime(endDate)).setDate(new Date(setTime(endDate)).getDate() - 7) <= today && today < new Date(setTime(endDate))) {
          const days = calculateDays(endDate, new Date())
          if (days <= 7) {
            week++
          }
        }
      })
    })
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: ['Within A Week'],
      datasets: [{ data: [week], backgroundColor: ['#28a745'], hoverBackgroundColor: ['#28a745'] }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForExpiredMembers(datas) {
    const { t } = this.props
    let { packages, response } = datas
    let graphDatas = [], week = 0, month = 0, moreMonth = 0
    response.forEach(member => {
      const filteredPackage = member.packageDetails.filter(doc => doc.isExpiredPackage)[0]
      if (filteredPackage) {
        const days = filteredPackage.extendDate ? calculateDays(filteredPackage.extendDate, new Date()) : calculateDays(filteredPackage.endDate, new Date())
        if (days <= 7) {
          week++
        } else if (days <= 30) {
          month++
        } else {
          moreMonth++
        }
      }
    })
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: ['One Week', 'One Month', 'More than One Month'],
      datasets: [{ data: [week, month, moreMonth], backgroundColor: ['#28a745', '#dc3545', 'yellow'], hoverBackgroundColor: ['#28a745', '#dc3545', 'yellow'] }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForMembersAttendances(datas) {
    const { t } = this.props
    let { response } = datas
    let graphDatas = [], colors = [], formatedData = [], formatedData2 = []
    response.forEach(res => {
      let timeOut = res.timeOut ? (parseInt(countHoursGraph(res.timeIn, res.timeOut).split(':')[0]) + parseInt(countHoursGraph(res.timeIn, res.timeOut).split(':')[1]) / 60) : 0
      let index = formatedData.findIndex(ele => ele.date === res.date);
      if (index === -1) {
        formatedData.push({ date: res.date, totalHrs: timeOut })
      } else {
        formatedData[index].totalHrs = formatedData[index].totalHrs + timeOut
      }
    })
    response.forEach(res => {
      let timeOut = res.timeOut ? (parseInt(countHoursGraph(res.timeIn, res.timeOut).split(':')[0]) + parseInt(countHoursGraph(res.timeIn, res.timeOut).split(':')[1]) / 60) : 0
      let index = formatedData2.findIndex(ele => ele.name === res.memberId.credentialId.userName);
      if (index === -1) {
        formatedData2.push({ name: res.memberId.credentialId.userName, totalHrs: timeOut })
      } else {
        formatedData2[index].totalHrs = formatedData2[index].totalHrs + timeOut
      }
    })
    for (let i = 0; i < 5; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let formatedDataSplit = formatedData.sort(function (a, b) {
      return b.totalHrs - a.totalHrs
    }).slice(0, 5)
    let formatedDataSplit2 = formatedData2.sort(function (a, b) {
      return b.totalHrs - a.totalHrs
    }).slice(0, 5)
    const data1 = {
      labels: formatedDataSplit.map(r => dateToDDMMYYYY(r.date)),
      datasets: [{ data: formatedDataSplit.map(f => Math.ceil(f.totalHrs * 60)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${formatedData2.length}`
    }
    const data2 = {
      labels: formatedDataSplit2.map(r => r.name),
      datasets: [{ data: formatedDataSplit2.map(f => Math.ceil(f.totalHrs * 60)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${formatedData2.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForFreezedMembers(datas) {
    const { t } = this.props
    let { days, packages, response } = datas
    let graphDatas = [], daysColors = []
    for (let i = 0; i < days.length; i++) {
      daysColors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: days.map(d => d.day),
      datasets: [{ data: days.map(d => d.count), backgroundColor: daysColors.map(color => color), hoverBackgroundColor: daysColors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1 })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2 })
    return graphDatas
  }

  graphForPackageRenewal(datas) {
    const { t } = this.props
    let { packages, branches, response } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForPackageType(datas) {
    const { t } = this.props
    let { packages, branches, response } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.count), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForAssignedTrainers(datas) {
    let { trainers, periods, response } = datas
    let graphDatas = [], trainerColors = [], periodColors = []
    for (let i = 0; i < trainers.length; i++) {
      trainerColors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    for (let i = 0; i < periods.length; i++) {
      periodColors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let totalTrainer = 0, totalPeriod = 0
    trainers.forEach(t => totalTrainer += t.amount)
    periods.forEach(t => totalPeriod += t.amount)
    const data1 = {
      labels: trainers.map(trainer => trainer.credentialId.userName),
      datasets: [{ data: trainers.map(t => t.amount), backgroundColor: trainerColors.map(color => color), hoverBackgroundColor: trainerColors.map(color => color) }],
      text: `${this.props.defaultCurrency} ${totalTrainer.toFixed(3)}`
    }
    const data2 = {
      labels: periods.map(period => period.periodName),
      datasets: [{ data: periods.map(p => p.amount), backgroundColor: periodColors.map(color => color), hoverBackgroundColor: periodColors.map(color => color) }],
      text: `${this.props.defaultCurrency} ${totalPeriod.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForGeneralSales(datas) {
    const { t } = this.props
    let { response, transactionType, branches } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let totalTransaction = 0, totalBranch = 0
    transactionType.forEach(t => totalTransaction += t.amount)
    branches.forEach(t => totalBranch += t.amount)
    const data1 = {
      labels: transactionType.map(transaction => transaction.transactionName),
      datasets: [{ data: transactionType.map(transaction => transaction.amount.toFixed(3)), backgroundColor: ['#28a745', '#dc3545', 'yellow'], hoverBackgroundColor: ['#28a745', '#dc3545', 'yellow'] }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalTransaction.toFixed(3)}`
    }
    const data2 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.amount.toFixed(3)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalBranch.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForPackageSales(datas) {
    const { t } = this.props
    let { packages, branches, response } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let totalPackage = 0, totalBranch = 0
    packages.forEach(t => totalPackage += t.amount)
    branches.forEach(t => totalBranch += t.amount)
    const data1 = {
      labels: packages.map(pack => pack.packageName),
      datasets: [{ data: packages.map(pack => pack.amount.toFixed(3)), backgroundColor: packages.map(pack => pack.color), hoverBackgroundColor: packages.map(pack => pack.color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalPackage.toFixed(3)}`
    }
    const data2 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.amount.toFixed(3)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalBranch.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForItemSales(datas) {
    const { t } = this.props
    let { branches, response, paymentType } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let totalBranch = 0, totalPayment = 0
    branches.forEach(t => totalBranch += t.amount)
    paymentType.forEach(t => totalPayment += t.amount)
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.amount.toFixed(3)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalBranch.toFixed(3)}`
    }
    const data2 = {
      labels: paymentType.map(payment => payment.name),
      datasets: [{ data: paymentType.map(payment => payment.amount.toFixed(3)), backgroundColor: ['#28a745', '#dc3545'], hoverBackgroundColor: ['#28a745', '#dc3545'] }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalPayment.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForClassesSales(datas) {
    const { t } = this.props
    let { branches, response, graphClasses } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let totalBranch = 0, totalPayment = 0
    branches.forEach(t => totalBranch += t.amount)
    graphClasses.forEach(t => totalPayment += t.amount)
    const data1 = {
      labels: graphClasses.map(classes => classes.className),
      datasets: [{ data: graphClasses.map(classes => classes.amount.toFixed(3)), backgroundColor: graphClasses.map(classes => classes.color), hoverBackgroundColor: graphClasses.map(classes => classes.color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalPayment.toFixed(3)}`
    }
    const data2 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.amount.toFixed(3)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalBranch.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForCurrentStockDetails(datas) {
    const { t } = this.props
    let { response } = datas
    let graphDatas = [], colors = [], formatedData = [], formatedData2 = []
    for (let i = 0; i < 5; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    formatedData = response.sort(function (a, b) {
      return b.quantity - a.quantity
    }).slice(0, 5)
    formatedData2 = response.sort(function (a, b) {
      return a.quantity - b.quantity
    }).slice(0, 5)
    const data1 = {
      labels: formatedData.map(r => r.itemName),
      datasets: [{ data: formatedData.map(f => f.quantity), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: formatedData2.map(r => r.itemName),
      datasets: [{ data: formatedData2.map(f => f.quantity), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForProductExpiryDetails(datas) {
    const { t } = this.props
    let { response } = datas
    let graphDatas = [], colors = [], formatedData = [], formatedData2 = []
    for (let i = 0; i < 5; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    formatedData = response.sort(function (a, b) {
      return calculateDays(b.expiryDate, a.expiryDate)
    }).slice(0, 5)
    formatedData2 = response.sort(function (a, b) {
      return calculateDays(b.expiryDate, a.expiryDate)
    }).slice(0, 5)
    const data1 = {
      labels: formatedData.map(r => r.itemName),
      datasets: [{ data: formatedData.map(f => calculateDays(new Date(), f.expiryDate)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: formatedData2.map(r => r.itemName),
      datasets: [{ data: formatedData2.map(f => f.quantity), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForPOSProfitAndLoss(datas) {
    const { t } = this.props
    let { branches, response, paymentType } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let totalBranch = 0, totalPayment = 0
    branches.forEach(t => totalBranch += t.amount)
    paymentType.forEach(t => totalPayment += t.amount)
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.amount.toFixed(3)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalBranch.toFixed(3)}`
    }
    const data2 = {
      labels: paymentType.map(payment => payment.name),
      datasets: [{ data: paymentType.map(payment => payment.amount.toFixed(3)), backgroundColor: ['#28a745', '#dc3545'], hoverBackgroundColor: ['#28a745', '#dc3545'] }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalPayment.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForSalesByPaymentMethod(datas) {
    const { t } = this.props
    let { response, transactionType, branches } = datas
    let graphDatas = [], colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    let totalTransaction = 0, totalBranch = 0
    transactionType.forEach(t => totalTransaction += t.amount)
    branches.forEach(t => totalBranch += t.amount)
    const data1 = {
      labels: transactionType.map(transaction => transaction.transactionName),
      datasets: [{ data: transactionType.map(transaction => transaction.amount.toFixed(3)), backgroundColor: ['#28a745', '#dc3545', 'yellow'], hoverBackgroundColor: ['#28a745', '#dc3545', 'yellow'] }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalTransaction.toFixed(3)}`
    }
    const data2 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.amount.toFixed(3)), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')}`,
      text2: `${this.props.defaultCurrency} ${totalBranch.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }


  graphForExpiredProductDetails(datas) {
    const { t } = this.props
    let { response } = datas
    let graphDatas = [], colors = [], formatedData = [], formatedData2 = [], totalCostPrice = 0
    response.forEach(r => totalCostPrice += +(r.costPerUnit * r.quantity))
    for (let i = 0; i < 5; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    formatedData = response.sort(function (a, b) {
      return b.quantity - a.quantity
    }).slice(0, 5)
    formatedData2 = response.sort(function (a, b) {
      return b.costPerUnit * b.quantity - a.costPerUnit * a.quantity
    }).slice(0, 5)
    const data1 = {
      labels: formatedData.map(r => r.itemName),
      datasets: [{ data: formatedData.map(f => f.quantity), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: formatedData2.map(r => r.itemName),
      datasets: [{ data: formatedData2.map(f => f.costPerUnit * f.quantity), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${totalCostPrice.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForClassesRegistrationDetails(datas) {
    const { t } = this.props
    let { response } = datas
    let graphDatas = [], colors = [], formatedData = [], formatedData2 = [], totalFullAmount = 0
    response.forEach(r => totalFullAmount += +(r.amount * (r.occupied ? r.occupied : 0)))
    for (let i = 0; i < 5; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    formatedData = response.sort(function (a, b) {
      return b.occupied - a.occupied
    }).slice(0, 5)
    formatedData2 = response.sort(function (a, b) {
      return b.amount * b.occupied - a.amount * a.occupied
    }).slice(0, 5)
    const data1 = {
      labels: formatedData.map(r => r.className),
      datasets: [{ data: formatedData.map(f => f.occupied), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: formatedData2.map(r => r.className),
      datasets: [{ data: formatedData2.map(f => f.amount * f.occupied), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${totalFullAmount.toFixed(3)}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total: response.length })
    return graphDatas
  }

  graphForEmployeeDetails(datas) {
    const { t } = this.props
    let { designations, branches, response } = datas
    let graphDatas = [], total = 0, colors = [], designationColors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    for (let i = 0; i < designations.length; i++) {
      designationColors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: designations.map(d => d.designationName),
      datasets: [{ data: designations.map(d => d.count), backgroundColor: designationColors.map(color => color), hoverBackgroundColor: designationColors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total })
    return graphDatas
  }

  graphForEmployeeShiftDetails(datas) {
    const { t } = this.props
    let { shifts, branches, response, employeeResponse } = datas
    let graphDatas = [], total = 0, colors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${employeeResponse.length}`
    }
    const data2 = {
      labels: shifts.map(d => d.shiftName),
      datasets: [{ data: shifts.map(d => d.count), backgroundColor: shifts.map(d => d.color), hoverBackgroundColor: shifts.map(d => d.color) }],
      text: `${t('Total')} ${employeeResponse.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1, total: response.length })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2, total })
    return graphDatas
  }

  graphForBookedAppointmentsByMembers(datas) {
    const { t } = this.props
    let { dates, branches, response } = datas
    let graphDatas = [], colors = [], datesColors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    for (let i = 0; i < dates.length; i++) {
      datesColors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: dates.map(d => dateToDDMMYYYY(d.date)),
      datasets: [{ data: dates.map(d => d.count), backgroundColor: datesColors.map(color => color), hoverBackgroundColor: datesColors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1 })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2 })
    return graphDatas
  }

  graphForBookedAppointmentsStatus(datas) {
    const { t } = this.props
    let { statuses, branches, response } = datas
    let graphDatas = [], colors = [], statusesColors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    for (let i = 0; i < statuses.length; i++) {
      statusesColors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: statuses.map(d => d.name),
      datasets: [{ data: statuses.map(d => d.count), backgroundColor: statusesColors.map(color => color), hoverBackgroundColor: statusesColors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1 })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2 })
    return graphDatas
  }

  graphForBookedAppointmentsByVisitors(datas) {
    const { t } = this.props
    let { dates, branches, response } = datas
    let graphDatas = [], colors = [], datesColors = []
    for (let i = 0; i < branches.length; i++) {
      colors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    for (let i = 0; i < dates.length; i++) {
      datesColors.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    }
    const data1 = {
      labels: branches.map(branch => branch.branchName),
      datasets: [{ data: branches.map(branch => branch.count), backgroundColor: colors.map(color => color), hoverBackgroundColor: colors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    const data2 = {
      labels: dates.map(d => dateToDDMMYYYY(d.date)),
      datasets: [{ data: dates.map(d => d.count), backgroundColor: datesColors.map(color => color), hoverBackgroundColor: datesColors.map(color => color) }],
      text: `${t('Total')} ${response.length}`
    }
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data1 })
    graphDatas.push({ name: 'Names Choice', type: 'doughnut', data: data2 })
    return graphDatas
  }

}

function mapStateToProps({ currency: { defaultCurrency } }) {
  return {
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(GraphExport))