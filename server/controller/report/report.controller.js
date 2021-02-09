/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler }, config: { DESIGNATION } } = require('../../../config')

const { Formate: { setTime } } = require('../../utils')

/**
 * models.
*/

const { Member, Package, Branch, MemberAttendance, StockSell, Classes, MemberClass, Stocks,
  Employee, Designation, EmployeeShift, Shift, MemberAppointment, VisitorAppointment, MemberFreezing, Period } = require('../../model');


//Members //////////////////////////////////////////////////////////////////////////////////////////////////////
//Members //////////////////////////////////////////////////////////////////////////////////////////////////////
//Members //////////////////////////////////////////////////////////////////////////////////////////////////////


const getAllMembers = async (body) => {
  let response = await Member.find({})
    .populate('credentialId').lean()
  return { response }
}

const getNewMembers = async (body) => {
  let queryCond = {};
  queryCond["doneFingerAuth"] = false;
  queryCond["isPackageSelected"] = true;
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = [], paidCount = 0, unPaidCount = 0
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ count: 0 } })
  })
  if (body.branch) queryCond["branch"] = body.branch;
  let response = await Member.find(queryCond)
    .populate('credentialId').populate("packageDetails.packages").lean()
  response = response.filter(member => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= member.admissionDate && new Date(setTime(body.toDate)) >= member.admissionDate) {
        return member
      }
    } else {
      return member
    }
  })
  response.forEach(member => {
    member.packageDetails.forEach(doc => {
      let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages._id.toString());
      if (doc.packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
        packages[packageIndex].count++;
      }
    })
    member.packageDetails.filter(doc => doc.paidStatus === 'UnPaid').length > 0 ? unPaidCount++ : paidCount++
  })
  return { response, packages, paidCount, unPaidCount }
}

const getActiveMembers = async (body) => {
  let queryCond = {};
  queryCond["doneFingerAuth"] = true;
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = []
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ count: 0 } })
  })
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ amount: 0 } })
  })
  if (body.branch) queryCond["branch"] = body.branch;
  let response = await Member.find(queryCond)
    .populate('credentialId').populate("packageDetails.packages")
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean()
  response = response.filter(member => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= member.admissionDate && new Date(setTime(body.toDate)) >= member.admissionDate) {
        return member
      }
    } else {
      return member
    }
  })
  response.forEach(member => {
    member.packageDetails.forEach(doc => {
      let branchIndex = branches.findIndex(b => b._id.toString() === member.branch.toString())
      let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages._id.toString());
      if (doc.packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
        packages[packageIndex].count++;
      }
      if (member.branch.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        if (doc.Installments && doc.Installments.length) {
          doc.Installments.forEach(installment => {
            branches[branchIndex].amount += typeof installment.totalAmount === 'number' ? installment.totalAmount : 0
          })
        } else {
          branches[branchIndex].amount += typeof doc.totalAmount === 'number' ? doc.totalAmount : 0
        }
        if (doc.trainerDetails && doc.trainerDetails.length) {
          doc.trainerDetails.forEach(trainerDetail => {
            if (trainerDetail.Installments && trainerDetail.Installments.length) {
              trainerDetail.Installments.forEach(installment => {
                branches[branchIndex].amount += typeof installment.totalAmount === 'number' ? installment.totalAmount : 0
              })
            } else {
              branches[branchIndex].amount += typeof trainerDetail.totalAmount === 'number' ? trainerDetail.totalAmount : 0
            }
          })
        }
      }
    });
  })
  return { response, packages, branches }
}

const getPendingMembers = async (body) => {
  let queryCond = {};
  queryCond["doneFingerAuth"] = false;
  queryCond["isPackageSelected"] = false;
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  if (body.branch) queryCond["branch"] = body.branch
  let response = await Member.find(queryCond).populate('credentialId').populate("packageDetails.packages").lean()
  response = response.filter(member => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= member.admissionDate && new Date(setTime(body.toDate)) >= member.admissionDate) {
        return member
      }
    } else {
      return member
    }
  })
  response.forEach(member => {
    let branchIndex = branches.findIndex(b => b._id.toString() === member.branch.toString())
    if (member.branch.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].count++
    }
  })
  return { response, branches }
}

const getUpcomingExpiry = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch
  const members = await Member.find(queryCond).populate('credentialId packageDetails.packages')
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean();
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = []
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ count: 0 } })
  })
  const response = [];
  for (let i = 0; i < members.length; i++) {
    let aboutToExpire = false;
    for (let j = 0; j < members[i].packageDetails.length; j++) {
      let endDate = members[i].packageDetails[j].endDate
      let today = new Date(new Date().setHours(0, 0, 0, 0));
      if (members[i].packageDetails[j].extendDate) {
        endDate = members[i].packageDetails[j].extendDate;
      }
      if (new Date(setTime(endDate)).setDate(new Date(setTime(endDate)).getDate() - 7) <= today && today < new Date(setTime(endDate))) {
        aboutToExpire = true;
        let packageIndex = packages.findIndex(ele => ele._id.toString() === members[i].packageDetails[j].packages._id.toString());
        if (members[i].packageDetails[j].packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
          packages[packageIndex].count++;
        }
      }
    }
    if (aboutToExpire) {
      response.push(members[i])
    }
  }
  return { response, packages }
}

const getExpiredMembers = async (body) => {
  let queryCond = {};
  queryCond['packageDetails.isExpiredPackage'] = true;
  if (body.branch) queryCond["branch"] = body.branch
  let response = await Member.find(queryCond).populate('credentialId').populate("packageDetails.packages")
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean();
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = []
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ count: 0 } })
  })
  response.forEach(member => {
    member.packageDetails = member.packageDetails.filter(pack => pack.isExpiredPackage)
  })
  response.forEach(member => {
    if (body.fromDate && body.toDate) {
      member.packageDetails = member.packageDetails.filter(pack => {
        if (pack.extendDate) {
          if (new Date(setTime(body.fromDate)) <= pack.extendDate && new Date(setTime(body.toDate)) >= pack.extendDate) {
            return pack
          }
        } else {
          if (new Date(setTime(body.fromDate)) <= pack.endDate && new Date(setTime(body.toDate)) >= pack.endDate) {
            return pack
          }
        }
      })
    }
  })
  response = response.filter(member => member.packageDetails.length > 0)
  response.forEach(member => {
    member.packageDetails.forEach(doc => {
      if (doc.isExpiredPackage) {
        let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages._id.toString());
        if (doc.packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
          packages[packageIndex].count++;
        }
      }
    });
  })
  return { response, packages }
}

const getMembersAttendance = async (body) => {
  let queryCond = {}
  if (body.branch && body.branch !== 'all') queryCond["branch"] = body.branch
  let response = await MemberAttendance.find(queryCond).populate('memberId branch').populate({ path: 'memberId', populate: { path: "credentialId" } }).lean();
  response = response.filter(attendance => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= attendance.date && new Date(setTime(body.toDate)) >= attendance.date) {
        return attendance
      }
    } else {
      return attendance
    }
  })
  return { response }
}

const getFreezedMembers = async (body) => {
  let queryCond = {};
  queryCond["status"] = "Completed";
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = [], days = []
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ count: 0 } })
  })
  let response = await MemberFreezing.find(queryCond).populate('memberId')
    .populate({ path: 'memberId', populate: { path: 'credentialId packageDetails.packages' } }).lean();
  response = response.filter(freezeMember => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= freezeMember.reactivationDate && new Date(setTime(body.toDate)) >= freezeMember.reactivationDate) {
        return freezeMember
      }
    } else {
      return freezeMember
    }
  })
  response = response.filter(freezeMember => {
    if (body.branch && body.branch !== 'all') {
      if (freezeMember.memberId.branch.toString() === body.branch) {
        return freezeMember
      }
    } else {
      return freezeMember
    }
  })
  response.forEach(freezeMember => {
    freezeMember.memberId.packageDetails.forEach(doc => {
      let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages._id.toString());
      if (doc.packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
        packages[packageIndex].count++;
      }
    });
    let index = days.findIndex(ele => ele.day === freezeMember.noOfDays);
    if (index === -1) {
      days.push({ day: freezeMember.noOfDays, count: 1 })
    } else {
      days[index].count++
    }
  })
  return { response, packages, days }
}

const getPackageRenewal = async (body) => {
  let queryCond = {};
  queryCond['packageDetails.packageRenewal'] = true;
  if (body.branch) queryCond["branch"] = body.branch
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = []
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ count: 0 } })
  })
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  let response = await Member.find(queryCond)
    .populate('credentialId branch').populate("packageDetails.packages")
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean()
  response.forEach(member => {
    member.packageDetails = member.packageDetails.filter(pack => pack.packageRenewal)
  })
  response.forEach(member => {
    if (body.fromDate && body.toDate) {
      member.packageDetails = member.packageDetails.filter(pack => {
        if (pack.extendDate) {
          if (new Date(setTime(body.fromDate)) <= pack.extendDate && new Date(setTime(body.toDate)) >= pack.extendDate) {
            return pack
          }
        } else {
          if (new Date(setTime(body.fromDate)) <= pack.endDate && new Date(setTime(body.toDate)) >= pack.endDate) {
            return pack
          }
        }
      })
    }
  })
  response = response.filter(member => member.packageDetails.length > 0)
  response.forEach(member => {
    member.packageDetails.forEach(doc => {
      if (doc.packageRenewal) {
        let branchIndex = branches.findIndex(b => b._id.toString() === member.branch._id.toString())
        let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages._id.toString());
        if (doc.packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
          packages[packageIndex].count++;
        }
        if (member.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
          branches[branchIndex].count++;
        }
      }
    });
  })
  return { response, packages, branches }
}

const getPackageType = async (body) => {
  let queryCond = {};
  queryCond["doneFingerAuth"] = true;
  if (body.branch) queryCond["branch"] = body.branch
  if (body.packageId) queryCond['packageDetails.packages'] = body.packageId
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = []
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ count: 0 } })
  })
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  let response = await Member.find(queryCond)
    .populate('credentialId branch').populate("packageDetails.packages")
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean()
  response = response.filter(member => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= member.admissionDate && new Date(setTime(body.toDate)) >= member.admissionDate) {
        return member
      }
    } else {
      return member
    }
  })
  response.forEach(member => {
    member.packageDetails.forEach(doc => {
      let branchIndex = branches.findIndex(b => b._id.toString() === member.branch.toString())
      let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages._id.toString());
      if (doc.packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
        packages[packageIndex].count++;
      }
      if (member.branch.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        branches[branchIndex].count++
      }
    });
    if (body.packageId) member.customPackageId = body.packageId
  })
  return { response, packages, branches }
}

const getAssignedTrainers = async (body) => {
  let queryCond = {};
  queryCond["doneFingerAuth"] = true;
  queryCond['packageDetails.dateOfPurchase'] = { '$exists': true }
  queryCond['packageDetails.trainerFees'] = { '$exists': true }

  if (body.branch) queryCond["branch"] = body.branch
  if (body.trainerId) queryCond['packageDetails.trainer'] = body.trainerId

  let designation = await Designation.findOne({ designationName: DESIGNATION[4] }).lean()
  let trainersResponse = await Employee.find({ designation: designation._id, status: true }, 'credentialId').populate('credentialId').lean();
  let trainers = []
  trainersResponse.forEach(ele => {
    trainers.push({ ...ele, ...{ amount: 0 } })
  })
  let periodResponse = await Period.find({}, 'periodName').lean();
  let periods = []
  periodResponse.forEach(ele => {
    periods.push({ ...ele, ...{ amount: 0 } })
  })
  let response = await Member.find(queryCond)
    .populate('credentialId branch').populate("packageDetails.packages packageDetails.trainerFees packageDetails.doneBy")
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } })
    .populate({ path: "packageDetails.trainerFees", populate: { path: "period" } }).lean()
  response.forEach(member => {
    if (body.fromDate && body.toDate) {
      member.packageDetails = member.packageDetails.filter(pack => {
        if (new Date(setTime(body.fromDate)) <= pack.dateOfPurchase && new Date(setTime(body.toDate)) >= pack.dateOfPurchase) {
          return pack
        }
      })
    }
  })
  response.forEach(member => {
    member.packageDetails.forEach(doc => {
      if (doc.dateOfPurchase && doc.trainerFees) {
        let periodIndex = periods.findIndex(p => p._id.toString() === doc.trainerFees.period._id.toString())
        let trainerIndex = trainers.findIndex(ele => ele._id.toString() === doc.trainer._id.toString());
        if (doc.trainer._id.toString() === trainers[trainerIndex]._id.toString() && trainerIndex !== -1) {
          trainers[trainerIndex].amount = trainers[trainerIndex].amount + doc.trainerFees.amount
        }
        if (doc.trainerFees.period._id.toString() === periods[periodIndex]._id.toString() && periodIndex !== -1) {
          periods[periodIndex].amount = periods[periodIndex].amount + doc.trainerFees.amount
        }
      }
    });
    if (body.trainerId) member.customTrainerId = body.trainerId
  })
  return { response, trainers, periods }
}

const getMembers = async (body) => {
  if (body.reportName === 'All') {
    const response = await getAllMembers(body)
    return response
  } else if (body.reportName === 'New Members') {
    const response = await getNewMembers(body)
    return response
  } else if (body.reportName === 'Active Members') {
    const response = await getActiveMembers(body)
    return response
  } else if (body.reportName === 'Pending Members') {
    const response = await getPendingMembers(body)
    return response
  } else if (body.reportName === 'Upcoming Expiry') {
    const response = await getUpcomingExpiry(body)
    return response
  } else if (body.reportName === 'Expired Members') {
    const response = await getExpiredMembers(body)
    return response
  } else if (body.reportName === 'Members Attendance') {
    const response = await getMembersAttendance(body)
    return response
  } else if (body.reportName === 'Freezed Members') {
    const response = await getFreezedMembers(body)
    return response
  } else if (body.reportName === 'Package Renewal') {
    const response = await getPackageRenewal(body)
    return response
  } else if (body.reportName === 'Package Type') {
    const response = await getPackageType(body)
    return response
  } else if (body.reportName === 'Assigned Trainers') {
    const response = await getAssignedTrainers(body)
    return response
  }
};



//Sales //////////////////////////////////////////////////////////////////////////////////////////////////////
//Sales //////////////////////////////////////////////////////////////////////////////////////////////////////
//Sales //////////////////////////////////////////////////////////////////////////////////////////////////////

const getGeneralSales = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ amount: 0 } })
  })
  let transactionType = [{ transactionName: "Packages", amount: 0 }, { transactionName: "POS", amount: 0 }, { transactionName: "Classes", amount: 0 }]

  let totalAmountOfStockSell = await StockSell.find(queryCond)
    .populate('branch doneBy')
    .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
  totalAmountOfStockSell = totalAmountOfStockSell.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
        return doc
      }
    } else {
      return doc
    }
  })
  totalAmountOfStockSell.forEach(doc => {
    transactionType[1].amount += +doc.totalAmount
    doc.transactionType = "POS"
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.branch._id.toString())
    if (doc.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].amount += +doc.totalAmount
    }
  })

  let classes = await Classes.find(queryCond, { _id: 1 }).lean()
  const classesArray = classes.map(ele => ele._id.toString());
  let memberClasses = await MemberClass.find({ classId: { $in: classesArray } })
    .populate('doneBy')
    .populate({ path: 'member', populate: { path: "credentialId branch" } }).lean()
  memberClasses = memberClasses.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
        return doc
      }
    } else {
      return doc
    }
  })
  memberClasses.forEach(doc => {
    transactionType[2].amount += +doc.totalAmount
    doc.transactionType = "Classes"
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.member.branch._id.toString())
    if (doc.member.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].amount += +doc.totalAmount
    }
  })

  let totalAmountOfMember = await Member.find(queryCond)
    .populate('credentialId branch').populate("packageDetails.packages packageDetails.doneBy")
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean();
  totalAmountOfMember.forEach(ele => {
    ele.packageDetails = ele.packageDetails.filter(doc => {
      if (doc.paidStatus === 'Paid') {
        if (body.fromDate && body.toDate) {
          if (
            new Date(setTime(body.fromDate)) <= (doc.startDate ? doc.startDate : ele.admissionDate) &&
            new Date(setTime(body.toDate)) >= (doc.startDate ? doc.startDate : ele.admissionDate)
          ) {
            return doc
          }
        } else {
          return doc
        }
      }
    })
    ele.transactionType = "Packages"
    ele.packageDetails.forEach(doc => {
      transactionType[0].amount += +doc.totalAmount
      let branchIndex = branches.findIndex(b => b._id.toString() === ele.branch._id.toString())
      if (ele.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        branches[branchIndex].amount += +doc.totalAmount
      }
    })
  })

  let response = [...totalAmountOfStockSell, ...memberClasses, ...totalAmountOfMember]
  return { response, transactionType, branches }
}

const getPackageSales = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ amount: 0 } })
  })
  let packagesResponse = await Package.find({}, 'packageName color').lean();
  let packages = []
  packagesResponse.forEach(ele => {
    packages.push({ ...ele, ...{ amount: 0 } })
  })

  let totalAmountOfMember = await Member.find(queryCond)
    .populate('credentialId branch packageDetails.trainerFees').populate("packageDetails.packages packageDetails.doneBy")
    .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean();
  totalAmountOfMember.forEach(ele => {
    ele.packageDetails = ele.packageDetails.filter(doc => {
      if (doc.paidStatus === 'Paid') {
        if (body.fromDate && body.toDate) {
          if (
            new Date(setTime(body.fromDate)) <= (doc.startDate ? doc.startDate : ele.admissionDate) &&
            new Date(setTime(body.toDate)) >= (doc.startDate ? doc.startDate : ele.admissionDate)
          ) {
            return doc
          }
        } else {
          return doc
        }
      }
    })
    ele.transactionType = "Packages"
    ele.packageDetails.forEach(doc => {
      let branchIndex = branches.findIndex(b => b._id.toString() === ele.branch._id.toString())
      if (ele.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        branches[branchIndex].amount += +doc.totalAmount
      }
      let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages._id.toString());
      if (doc.packages._id.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
        packages[packageIndex].amount += +doc.totalAmount;
      }
    })
  })

  let response = totalAmountOfMember
  return { response, packages, branches }
}

const getItemSales = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ amount: 0 } })
  })
  let totalAmountOfStockSell = await StockSell.find(queryCond)
    .populate('branch purchaseStock.stockId doneBy')
    .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
  totalAmountOfStockSell = totalAmountOfStockSell.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
        return doc
      }
    } else {
      return doc
    }
  })
  let offline = 0, online = 0
  totalAmountOfStockSell.forEach(doc => {
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.branch._id.toString())
    if (doc.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].amount += +doc.totalAmount
    }
    if (doc.paymentType === 'POS') {
      offline += +doc.totalAmount
    } else {
      online += +doc.totalAmount
    }
  })
  let paymentType = [{ name: 'Online', amount: online }, { name: 'Offline', amount: offline }]
  let response = totalAmountOfStockSell
  return { response, branches, paymentType }
}

const getClassesSales = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ amount: 0 } })
  })
  let classes = await Classes.find(queryCond, { _id: 1, className: 1, color: 1 }).lean()
  let graphClasses = []
  classes.forEach(ele => {
    graphClasses.push({ ...ele, ...{ amount: 0 } })
  })
  const classesArray = classes.map(ele => ele._id.toString());
  let memberClasses = await MemberClass.find({ classId: { $in: classesArray } })
    .populate('doneBy')
    .populate({ path: 'classId', populate: { path: "trainer", populate: { path: "credentialId" } } })
    .populate({ path: 'member', populate: { path: "credentialId branch" } }).lean()
  memberClasses = memberClasses.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
        return doc
      }
    } else {
      return doc
    }
  })
  memberClasses.forEach(doc => {
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.member.branch._id.toString())
    let classIndex = graphClasses.findIndex(b => b._id.toString() === doc.classId._id.toString())
    if (doc.member.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].amount += +doc.totalAmount
    }
    if (doc.classId._id.toString() === graphClasses[classIndex]._id.toString() && classIndex !== -1) {
      graphClasses[classIndex].amount += +doc.totalAmount
    }
  })
  let response = memberClasses
  return { response, branches, graphClasses }
}

const getPOSProfitAndLoss = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ amount: 0 } })
  })
  let totalAmountOfStockSell = await StockSell.find(queryCond)
    .populate('branch purchaseStock.stockId')
    .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
  totalAmountOfStockSell = totalAmountOfStockSell.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
        return doc
      }
    } else {
      return doc
    }
  })
  let offline = 0, online = 0
  totalAmountOfStockSell.forEach(doc => {
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.branch._id.toString())
    let profit = 0, costPrice = 0
    doc.purchaseStock.forEach(ele => {
      profit += (+doc.totalAmount - +doc.vatAmount - +ele.stockId.costPerUnit * +ele.quantity)
      costPrice += (+ele.stockId.costPerUnit * +ele.quantity)
    })
    if (doc.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].amount += profit
    }
    if (doc.paymentType === 'POS') {
      offline += profit
    } else {
      online += profit
    }
    doc.profitAmount = profit
    doc.costPrice = costPrice
  })
  let paymentType = [{ name: 'Online', amount: online }, { name: 'Offline', amount: offline }]
  let response = totalAmountOfStockSell
  return { response, branches, paymentType }
}

const getSalesByPaymentMethod = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ amount: 0 } })
  })
  let transactionType = [{ transactionName: "Packages", amount: 0 }, { transactionName: "POS", amount: 0 }, { transactionName: "Classes", amount: 0 }]

  let totalAmountOfStockSell = [], memberClasses = [], totalAmountOfMember = []

  if (body.transactionType === 'POS' || body.transactionType === '') {
    totalAmountOfStockSell = await StockSell.find(queryCond)
      .populate('branch doneBy')
      .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
    totalAmountOfStockSell = totalAmountOfStockSell.filter(doc => {
      if (body.fromDate && body.toDate) {
        if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
          return doc
        }
      } else {
        return doc
      }
    })
    totalAmountOfStockSell.forEach(doc => {
      transactionType[1].amount += (body.paymentMethod === 'Cash' ? +doc.cashAmount : body.paymentMethod === 'Card' ? +doc.cardAmount : (+doc.digitalAmount ? +doc.digitalAmount : 0))
      doc.transactionType = "POS"
      doc.paymentMethod = body.paymentMethod
      let branchIndex = branches.findIndex(b => b._id.toString() === doc.branch._id.toString())
      if (doc.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        branches[branchIndex].amount += (body.paymentMethod === 'Cash' ? +doc.cashAmount : body.paymentMethod === 'Card' ? +doc.cardAmount : (+doc.digitalAmount ? +doc.digitalAmount : 0))
      }
    })
  }

  if (body.transactionType === 'Classes' || body.transactionType === '') {
    let classes = await Classes.find(queryCond, { _id: 1 }).lean()
    const classesArray = classes.map(ele => ele._id.toString());
    memberClasses = await MemberClass.find({ classId: { $in: classesArray } })
      .populate('doneBy')
      .populate({ path: 'member', populate: { path: "credentialId branch" } }).lean()
    memberClasses = memberClasses.filter(doc => {
      if (body.fromDate && body.toDate) {
        if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
          return doc
        }
      } else {
        return doc
      }
    })
    memberClasses.forEach(doc => {
      transactionType[2].amount += (body.paymentMethod === 'Cash' ? +doc.cashAmount : body.paymentMethod === 'Card' ? +doc.cardAmount : (+doc.digitalAmount ? +doc.digitalAmount : 0))
      doc.transactionType = "Classes"
      doc.paymentMethod = body.paymentMethod
      let branchIndex = branches.findIndex(b => b._id.toString() === doc.member.branch._id.toString())
      if (doc.member.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        branches[branchIndex].amount += (body.paymentMethod === 'Cash' ? +doc.cashAmount : body.paymentMethod === 'Card' ? +doc.cardAmount : (+doc.digitalAmount ? +doc.digitalAmount : 0))
      }
    })
  }

  if (body.transactionType === 'Packages' || body.transactionType === '') {
    totalAmountOfMember = await Member.find(queryCond)
      .populate('credentialId branch').populate("packageDetails.packages packageDetails.doneBy")
      .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean();
    totalAmountOfMember.forEach(ele => {
      ele.packageDetails = ele.packageDetails.filter(doc => {
        if (doc.paidStatus === 'Paid') {
          if (body.fromDate && body.toDate) {
            if (
              new Date(setTime(body.fromDate)) <= (doc.startDate ? doc.startDate : ele.admissionDate) &&
              new Date(setTime(body.toDate)) >= (doc.startDate ? doc.startDate : ele.admissionDate)
            ) {
              return doc
            }
          } else {
            return doc
          }
        }
      })
      ele.transactionType = "Packages"
      ele.paymentMethod = body.paymentMethod
      ele.packageDetails.forEach(doc => {
        transactionType[0].amount += (body.paymentMethod === 'Cash' ? (+doc.cashAmount ? +doc.cashAmount : 0) : body.paymentMethod === 'Card' ? (+doc.cardAmount ? +doc.cardAmount : 0) : (+doc.digitalAmount ? +doc.digitalAmount : 0))
        let branchIndex = branches.findIndex(b => b._id.toString() === ele.branch._id.toString())
        if (ele.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
          branches[branchIndex].amount += (body.paymentMethod === 'Cash' ? (+doc.cashAmount ? +doc.cashAmount : 0) : body.paymentMethod === 'Card' ? (+doc.cardAmount ? +doc.cardAmount : 0) : (+doc.digitalAmount ? +doc.digitalAmount : 0))
        }
      })
    })
  }

  let response = [...totalAmountOfStockSell, ...memberClasses, ...totalAmountOfMember]
  return { response, transactionType, branches }
}

const getTodaySalesByStaff = async (body) => {
  let queryCond = {};
  let transactionType = [{ transactionName: "Packages", amount: 0 }, { transactionName: "POS", amount: 0 }, { transactionName: "Classes", amount: 0 }]
  let paymentMethod = [{ paymentName: "Digital", amount: 0 }, { paymentName: "Cash", amount: 0 }, { paymentName: "Card", amount: 0 }]

  let totalAmountOfStockSell = [], memberClasses = [], totalAmountOfMember = []

  if (body.transactionType === 'POS' || body.transactionType === '') {
    if (body.branch) queryCond["branch"] = body.branch
    if (body.staffName) queryCond["doneBy"] = body.staffName
    totalAmountOfStockSell = await StockSell.find(queryCond)
      .populate('branch doneBy')
      .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
    totalAmountOfStockSell = totalAmountOfStockSell.filter(doc => {
      if (new Date(setTime(new Date)).getTime() === doc.dateOfPurchase.getTime()) {
        return doc
      }
    })
    totalAmountOfStockSell.forEach(doc => {
      transactionType[1].amount += +doc.totalAmount
      paymentMethod[0].amount += (+doc.digitalAmount ? +doc.digitalAmount : 0)
      paymentMethod[1].amount += (+doc.cashAmount ? +doc.cashAmount : 0)
      paymentMethod[2].amount += (+doc.cardAmount ? +doc.cardAmount : 0)
      doc.transactionType = "POS"
    })
  }

  if (body.transactionType === 'Classes' || body.transactionType === '') {
    queryCond = {}
    if (body.branch) queryCond["branch"] = body.branch
    let classes = await Classes.find(queryCond, { _id: 1 }).lean()
    const classesArray = classes.map(ele => ele._id.toString());
    queryCond = {}
    if (body.staffName) queryCond["doneBy"] = body.staffName
    queryCond["classId"] = { '$in': classesArray }
    memberClasses = await MemberClass.find({ classId: { $in: classesArray } })
      .populate('doneBy')
      .populate({ path: 'member', populate: { path: "credentialId branch" } }).lean()
    memberClasses = memberClasses.filter(doc => {
      if (new Date(setTime(new Date)).getTime() === doc.dateOfPurchase.getTime()) {
        return doc
      }
    })
    memberClasses.forEach(doc => {
      transactionType[2].amount += +doc.totalAmount
      paymentMethod[0].amount += (+doc.digitalAmount ? +doc.digitalAmount : 0)
      paymentMethod[1].amount += (+doc.cashAmount ? +doc.cashAmount : 0)
      paymentMethod[2].amount += (+doc.cardAmount ? +doc.cardAmount : 0)
      doc.transactionType = "Classes"
    })
  }

  if (body.transactionType === 'Packages' || body.transactionType === '') {
    queryCond = {}
    if (body.branch) queryCond["branch"] = body.branch
    if (body.staffName) queryCond["packageDetails.doneBy"] = body.staffName
    totalAmountOfMember = await Member.find(queryCond)
      .populate('credentialId branch').populate("packageDetails.packages packageDetails.doneBy")
      .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } }).lean();
    totalAmountOfMember.forEach(ele => {
      ele.packageDetails = ele.packageDetails.filter(doc => {
        if (doc.paidStatus === 'Paid') {
          if (new Date(setTime(new Date)).getTime() === (doc.startDate ? doc.startDate : ele.admissionDate).getTime()) {
            return doc
          }
        }
      })
      ele.transactionType = "Packages"
      ele.packageDetails.forEach(doc => {
        transactionType[0].amount += +doc.totalAmount
        paymentMethod[0].amount += (+doc.digitalAmount ? +doc.digitalAmount : 0)
        paymentMethod[1].amount += (+doc.cashAmount ? +doc.cashAmount : 0)
        paymentMethod[2].amount += (+doc.cardAmount ? +doc.cardAmount : 0)
      })
    })
  }

  let response = [...totalAmountOfStockSell, ...memberClasses, ...totalAmountOfMember]
  return { response, paymentMethod, transactionType }
}

const getSales = async (body) => {
  if (body.reportName === 'General Sales') {
    const response = await getGeneralSales(body)
    return response
  } else if (body.reportName === 'Package Sales') {
    const response = await getPackageSales(body)
    return response
  } else if (body.reportName === 'Item Sales') {
    const response = await getItemSales(body)
    return response
  } else if (body.reportName === 'Classes Sales') {
    const response = await getClassesSales(body)
    return response
  } else if (body.reportName === 'POS Profit and Loss') {
    const response = await getPOSProfitAndLoss(body)
    return response
  } else if (body.reportName === 'Sales By Payment Method') {
    const response = await getSalesByPaymentMethod(body)
    return response
  } else if (body.reportName === 'Today Sales By Staff') {
    const response = await getTodaySalesByStaff(body)
    return response
  }
}



//Stock //////////////////////////////////////////////////////////////////////////////////////////////////////
//Stock //////////////////////////////////////////////////////////////////////////////////////////////////////
//Stock //////////////////////////////////////////////////////////////////////////////////////////////////////

const getCurrentStockDetails = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let response = await Stocks.find(queryCond).populate('branch offerDetails.offerDetails supplierName vat').lean()
  return { response }
}

const getProductExpiryDetails = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let response = await Stocks.find(queryCond).populate('branch offerDetails.offerDetails supplierName vat').lean()
  return { response }
}

const getExpiredProductDetails = async (body) => {
  let queryCond = {}
  queryCond["expiryDate"] = { $lte: new Date() }
  if (body.branch) queryCond["branch"] = body.branch
  let response = await Stocks.find(queryCond).populate('branch offerDetails.offerDetails supplierName vat').lean()
  return { response }
}

const getStock = async (body) => {
  if (body.reportName === 'Current Stock Details') {
    const response = await getCurrentStockDetails(body)
    return response
  } else if (body.reportName === 'Product Expiry Details') {
    const response = await getProductExpiryDetails(body)
    return response
  } else if (body.reportName === 'Expired Product Details') {
    const response = await getExpiredProductDetails(body)
    return response
  }
}



//Classes //////////////////////////////////////////////////////////////////////////////////////////////////////
//Classes //////////////////////////////////////////////////////////////////////////////////////////////////////
//Classes //////////////////////////////////////////////////////////////////////////////////////////////////////

const getClassesRegistrationDetails = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let response = await Classes.find(queryCond).populate('branch room')
    .populate({ path: 'trainer', populate: { path: "credentialId" } }).lean()
  response = response.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.startDate && new Date(setTime(body.toDate)) >= doc.startDate) {
        return doc
      }
    } else {
      return doc
    }
  })
  return { response }
}

const getClasses = async (body) => {
  if (body.reportName === 'Classes Registration Details') {
    const response = await getClassesRegistrationDetails(body)
    return response
  }
}


//HR //////////////////////////////////////////////////////////////////////////////////////////////////////
//HR //////////////////////////////////////////////////////////////////////////////////////////////////////
//HR //////////////////////////////////////////////////////////////////////////////////////////////////////

const getEmployeeDetails = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let designationResponse = await Designation.find({ designationName: { $nin: DESIGNATION.slice(0, 3) } }, 'designationName').lean();
  let designations = []
  designationResponse.forEach(ele => {
    designations.push({ ...ele, ...{ count: 0 } })
  })
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  let response = await Employee.find(queryCond).populate('credentialId designation branch').lean()
  response.forEach(employee => {
    let designationIndex = designations.findIndex(ele => ele._id.toString() === employee.designation._id.toString());
    if (employee.designation._id.toString() === designations[designationIndex]._id.toString() && designationIndex !== -1) {
      designations[designationIndex].count++
    }
    employee.branch.forEach(doc => {
      let branchIndex = branches.findIndex(b => b._id.toString() === doc._id.toString())
      if (doc._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        branches[branchIndex].count++
      }
    })
  })
  return { response, branches, designations }
}

const getEmployeeShiftDetails = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let shiftResponse = await Shift.find({}, 'shiftName color').lean();
  let shifts = []
  shiftResponse.forEach(ele => {
    shifts.push({ ...ele, ...{ count: 0 } })
  })
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  let employeeResponse = await Employee.find(queryCond).populate('credentialId designation branch').lean()
  let response = await EmployeeShift.find(queryCond).populate('employee branch shift')
    .populate({ path: 'employee', populate: { path: "credentialId designation branch" } }).lean()
  response = response.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.fromDate && new Date(setTime(body.toDate)) >= doc.fromDate || new Date(setTime(body.fromDate)) <= doc.toDate && new Date(setTime(body.toDate)) >= doc.toDate) {
        return doc
      }
    } else {
      return doc
    }
  })
  let servingEmployee = [...new Set(response.map(r => r.employee))]
  servingEmployee.forEach(employee => {
    employee.branch.forEach(doc => {
      let branchIndex = branches.findIndex(b => b._id.toString() === doc._id.toString())
      if (doc._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
        branches[branchIndex].count++
      }
    })
  })
  response.forEach(employeeShift => {
    let shiftIndex = shifts.findIndex(ele => ele._id.toString() === employeeShift.shift._id.toString());
    if (employeeShift.shift._id.toString() === shifts[shiftIndex]._id.toString() && shiftIndex !== -1) {
      shifts[shiftIndex].count++
    }
    // employee.branch.forEach(doc => {
    //   let branchIndex = branches.findIndex(b => b._id.toString() === doc._id.toString())
    //   if (doc._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
    //     branches[branchIndex].count++
    //   }
    // })
  })
  return { response, branches, shifts, employeeResponse }
}

const getHR = async (body) => {
  if (body.reportName === 'Employee Details') {
    const response = await getEmployeeDetails(body)
    return response
  } else if (body.reportName === 'Employee Shift Details') {
    const response = await getEmployeeShiftDetails(body)
    return response
  }
}



//Appointments //////////////////////////////////////////////////////////////////////////////////////////////////////
//Appointments //////////////////////////////////////////////////////////////////////////////////////////////////////
//Appointments //////////////////////////////////////////////////////////////////////////////////////////////////////

const getBookedAppointmentsByMembers = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = [], dates = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  let response = await MemberAppointment.find(queryCond)
    .populate('branch doneBy')
    .populate({ path: 'member', populate: { path: "credentialId" } })
    .populate({ path: 'trainer', populate: { path: "credentialId" } }).lean()
  response = response.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.date && new Date(setTime(body.toDate)) >= doc.date) {
        return doc
      }
    } else {
      return doc
    }
  })
  response.forEach(doc => {
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.branch._id.toString())
    if (doc.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].count++
    }
    let index = dates.findIndex(ele => setTime(ele.date) === setTime(doc.date));
    if (index === -1) {
      dates.push({ date: doc.date, count: 1 })
    } else {
      dates[index].count++
    }
  })
  return { response, branches, dates }
}

const getBookedAppointmentsStatus = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = [], statuses = [{ name: 'Attended', count: 0 }, { name: 'Yet to Come', count: 0 }, { name: 'Missed', count: 0 }]
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  let response = await MemberAppointment.find(queryCond)
    .populate('branch doneBy')
    .populate({ path: 'member', populate: { path: "credentialId" } })
    .populate({ path: 'trainer', populate: { path: "credentialId" } }).lean()
  response = response.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.date && new Date(setTime(body.toDate)) >= doc.date) {
        return doc
      }
    } else {
      return doc
    }
  })
  response.forEach(doc => {
    let { status, toTime, date } = doc
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.branch._id.toString())
    if (doc.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].count++
    }
    let resultedStatus = ''
    if (status) resultedStatus = status
    else if (setTime(date) > setTime(new Date())) resultedStatus = 'Yet to Come'
    else if (setTime(date) === setTime(new Date()) && new Date(toTime).setFullYear(2020, 11, 9) >= new Date().setFullYear(2020, 11, 9)) resultedStatus = 'Yet to Come'
    else resultedStatus = 'Missed'
    let index = statuses.findIndex(ele => ele.name === resultedStatus);
    if (index !== -1) {
      statuses[index].count++
    }
  })
  return { response, branches, statuses }
}

const getBookedAppointmentsByVisitors = async (body) => {
  let queryCond = {}
  if (body.branch) queryCond["branch"] = body.branch
  let branchResponse = await Branch.find({}, 'branchName').lean();
  let branches = [], dates = []
  branchResponse.forEach(ele => {
    branches.push({ ...ele, ...{ count: 0 } })
  })
  let response = await VisitorAppointment.find(queryCond)
    .populate('branch doneBy').lean()
  response = response.filter(doc => {
    if (body.fromDate && body.toDate) {
      if (new Date(setTime(body.fromDate)) <= doc.date && new Date(setTime(body.toDate)) >= doc.date) {
        return doc
      }
    } else {
      return doc
    }
  })
  response.forEach(doc => {
    let branchIndex = branches.findIndex(b => b._id.toString() === doc.branch._id.toString())
    if (doc.branch._id.toString() === branches[branchIndex]._id.toString() && branchIndex !== -1) {
      branches[branchIndex].count++
    }
    let index = dates.findIndex(ele => setTime(ele.date) === setTime(doc.date));
    if (index === -1) {
      dates.push({ date: doc.date, count: 1 })
    } else {
      dates[index].count++
    }
  })
  return { response, branches, dates }
}

const getAppointments = async (body) => {
  if (body.reportName === 'Booked Appointments By Members') {
    const response = await getBookedAppointmentsByMembers(body)
    return response
  } else if (body.reportName === 'Booked Appointments Status') {
    const response = await getBookedAppointmentsStatus(body)
    return response
  } else if (body.reportName === 'Booked Appointments By Visitors') {
    const response = await getBookedAppointmentsByVisitors(body)
    return response
  }
}



//Vat //////////////////////////////////////////////////////////////////////////////////////////////////////
//Vat //////////////////////////////////////////////////////////////////////////////////////////////////////
//Vat //////////////////////////////////////////////////////////////////////////////////////////////////////

const getVatReport = async (body) => {
  let queryCond = {};
  if (body.branch) queryCond["branch"] = body.branch

  let totalAmountOfStockSell = [], memberClasses = [], totalAmountOfMember = []

  if (body.transactionType === 'POS' || body.transactionType === '') {
    totalAmountOfStockSell = await StockSell.find(queryCond)
      .populate('branch doneBy')
      .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
    totalAmountOfStockSell = totalAmountOfStockSell.filter(doc => {
      if (body.fromDate && body.toDate) {
        if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
          return doc
        }
      } else {
        return doc
      }
    })
    totalAmountOfStockSell.forEach(doc => {
      doc.transactionType = "POS"
    })
  }

  if (body.transactionType === 'Classes' || body.transactionType === '') {
    let classes = await Classes.find(queryCond, { _id: 1 }).lean()
    const classesArray = classes.map(ele => ele._id.toString());
    memberClasses = await MemberClass.find({ classId: { $in: classesArray } })
      .populate('doneBy classId')
      .populate({ path: 'member', populate: { path: "credentialId branch" } }).lean()
    memberClasses = memberClasses.filter(doc => {
      if (body.fromDate && body.toDate) {
        if (new Date(setTime(body.fromDate)) <= doc.dateOfPurchase && new Date(setTime(body.toDate)) >= doc.dateOfPurchase) {
          return doc
        }
      } else {
        return doc
      }
    })
    memberClasses.forEach(doc => {
      doc.transactionType = "Classes"
    })
  }

  if (body.transactionType === 'Packages' || body.transactionType === '') {
    totalAmountOfMember = await Member.find(queryCond)
      .populate('credentialId branch').populate("packageDetails.packages packageDetails.doneBy")
      .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } })
      .lean();
    totalAmountOfMember.forEach(ele => {
      ele.packageDetails = ele.packageDetails.filter(doc => {
        if (doc.paidStatus === 'Paid') {
          if (body.fromDate && body.toDate) {
            if (
              new Date(setTime(body.fromDate)) <= (doc.startDate ? doc.startDate : ele.admissionDate) &&
              new Date(setTime(body.toDate)) >= (doc.startDate ? doc.startDate : ele.admissionDate)
            ) {
              return doc
            }
          } else {
            return doc
          }
        }
      })
      ele.transactionType = "Packages"
    })
  }

  let response = [...totalAmountOfStockSell, ...memberClasses, ...totalAmountOfMember]
  return { response }
}

const getVat = async (body) => {
  if (body.reportName === 'Vat Report') {
    const response = await getVatReport(body)
    return response
  }
}



exports.getReport = async (req, res) => {
  try {
    if (req.body.reportType === 'Members') {
      const response = await getMembers(req.body)
      successResponseHandler(res, response, "successfully get all member details !!");
    } else if (req.body.reportType === 'Sales') {
      const response = await getSales(req.body)
      successResponseHandler(res, response, "successfully get all sales details !!");
    } else if (req.body.reportType === 'Stock') {
      const response = await getStock(req.body)
      successResponseHandler(res, response, "successfully get all stock details !!");
    } else if (req.body.reportType === 'Classes') {
      const response = await getClasses(req.body)
      successResponseHandler(res, response, "successfully get all class details !!");
    } else if (req.body.reportType === 'HR') {
      const response = await getHR(req.body)
      successResponseHandler(res, response, "successfully get all hr details !!");
    } else if (req.body.reportType === 'Appointments') {
      const response = await getAppointments(req.body)
      successResponseHandler(res, response, "successfully get all appointment details !!");
    } else if (req.body.reportType === 'Vat') {
      const response = await getVat(req.body)
      successResponseHandler(res, response, "successfully get all VAT details !!");
    }
  }
  catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting all member details !");
  }
}