const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { Formate: { setTime } } = require('../../utils');

/**  
 * models.
*/


const { Member, Package, Stocks, Classes, StockSell, MemberPurchase, MemberClass, MemberAttendance } = require('../../model');


const { getStockSellTotalAmount, getClassesSellTotalAmount, getPackageSellTotalAmount } = require('../../service/dashboard.service');


exports.getMemberDashBoard = async (req, res) => {
    try {
        let queryCond = {}, queryCond1 = {}, queryCond2 = {}, queryCond3 = {};
        if (req.body.branch && req.body.branch !== 'all') {
            queryCond["branch"] = req.body.branch
            queryCond1["branch"] = req.body.branch
            queryCond2["branch"] = req.body.branch
            queryCond3["branch"] = req.body.branch
        }
        queryCond1["doneFingerAuth"] = false
        queryCond1["isPackageSelected"] = false
        queryCond2["doneFingerAuth"] = false
        queryCond2["isPackageSelected"] = true
        queryCond3["doneFingerAuth"] = true
        queryCond3["isPackageSelected"] = true
        let total = await Member.find(queryCond).count();
        let pending = await Member.find(queryCond1).count();
        let newMember = await Member.find(queryCond2).count();
        let activeMember = await Member.find(queryCond3).count();
        successResponseHandler(res, { total, pending, newMember, activeMember }, "successfully get all member  !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all member  !");
    }
};






exports.getPackageDistribution = async (req, res) => {
    try {
        let queryCond = {};
        if (req.body.branch && req.body.branch !== 'all') queryCond["branch"] = req.body.branch;
        // queryCond["doneFingerAuth"] = true;
        queryCond["isPackageSelected"] = true;
        let packagesResponse = await Package.find({}, 'packageName color').lean();
        let packages = []
        packagesResponse.forEach(ele => {
            packages.push({ ...ele, ...{ count: 0 } })
        })
        let activeMember = await Member.find(queryCond).lean();
        let total = 0;
        activeMember.forEach(member => {
            member.packageDetails.forEach(doc => {
                let packageIndex = packages.findIndex(ele => ele._id.toString() === doc.packages.toString());
                if (doc.paidStatus === 'Paid' && doc.packages.toString() === packages[packageIndex]._id.toString() && packageIndex !== -1) {
                    packages[packageIndex].count++;
                }
            });
        })
        packages.forEach(ele => total += ele.count);
        successResponseHandler(res, { packages, total }, "successfully get package distribution !");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting  package distribution  !");
    }
};


exports.getMostSellingStock = (req, res) => {
    let query = {};
    query["noOfTimeSell"] = { $ne: 0 };
    if (req.body.branch && req.body.branch !== 'all') query["branch"] = req.body.branch;
    Stocks.find(query).sort({ noOfTimeSell: -1 }).limit(5).populate('branch')
        .then(response => {
            successResponseHandler(res, response, "successfully get package distribution !");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while selling stock");
        })
};



exports.getAllBranchSales = async (req, res) => {
    try {
        let queryCond = {};
        if (req.body.branch && req.body.branch !== 'all') queryCond["branch"] = req.body.branch;
        let profits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (req.body.category === "Packages") {
            let totalAmountOfMember = await Member.find(queryCond).lean();
            totalAmountOfMember.forEach(doc => {
                doc.packageDetails
                    .filter(ele => ele.paidStatus === 'Paid' && (ele.startDate ? ele.startDate.getFullYear() : doc.admissionDate.getFullYear()) === req.body.year)
                    .forEach(ele => profits[(ele.startDate ? ele.startDate.getMonth() : doc.admissionDate.getMonth())] += +ele.totalAmount)
            });
        } else if (req.body.category === "POS") {
            let totalAmountOfStockSell = await StockSell.find(queryCond).lean()
            totalAmountOfStockSell
                .filter(doc => doc.dateOfPurchase.getFullYear() === req.body.year)
                .forEach(doc => profits[doc.dateOfPurchase.getMonth()] += +doc.totalAmount)
        } else if (req.body.category === "Classes") {
            let classes = await Classes.find(queryCond, { _id: 1 }).lean()
            const classesArray = classes.map(ele => ele._id.toString());
            const memberClasses = await MemberClass.find({ classId: { $in: classesArray } });
            memberClasses
                .filter(doc => doc.dateOfPurchase.getFullYear() === req.body.year)
                .forEach(doc => profits[doc.dateOfPurchase.getMonth()] += +doc.totalAmount)
        } else {
            let totalAmountOfStockSell = await StockSell.find(queryCond).lean()
            totalAmountOfStockSell
                .filter(doc => doc.dateOfPurchase.getFullYear() === req.body.year)
                .forEach(doc => profits[doc.dateOfPurchase.getMonth()] += +doc.totalAmount)
            let classes = await Classes.find(queryCond, { _id: 1 }).lean()
            const classesArray = classes.map(ele => ele._id.toString());
            const memberClasses = await MemberClass.find({ classId: { $in: classesArray } });
            memberClasses
                .filter(doc => doc.dateOfPurchase.getFullYear() === req.body.year)
                .forEach(doc => profits[doc.dateOfPurchase.getMonth()] += +doc.totalAmount)
            let totalAmountOfMember = await Member.find(queryCond).lean();
            totalAmountOfMember.forEach(doc => {
                doc.packageDetails
                    .filter(ele => ele.paidStatus === 'Paid' && (ele.startDate ? ele.startDate.getFullYear() : doc.admissionDate.getFullYear()) === req.body.year)
                    .forEach(ele => profits[(ele.startDate ? ele.startDate.getMonth() : doc.admissionDate.getMonth())] += +ele.totalAmount)
            });
        }
        successResponseHandler(res, profits, "successfully get sales by branch !")
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting  package distribution  !");
    }
};


exports.getMemberAttendanceDashboard = async (req, res) => {
    try {
        let queryCond = {};
        if (req.body.branch && req.body.branch !== 'all') queryCond["branch"] = req.body.branch
        queryCond["doneFingerAuth"] = true
        queryCond["isPackageSelected"] = true
        if (req.body.trainerId) {
            queryCond["packageDetails"] = { $elemMatch: { trainer: req.body.trainerId } }
        }
        let totalMembers = await Member.find(queryCond, { _id: 1 }).lean();
        let totalMembersArray = totalMembers.map(ele => ele._id.toString());
        let totalMembersCount = totalMembersArray.length;
        let memberAttendances = await MemberAttendance.find({ memberId: { $in: totalMembersArray } }).lean();
        memberAttendances = memberAttendances.filter(doc => doc.date.getMonth() === req.body.month && doc.date.getFullYear() === new Date().getFullYear())
        let datesArr = []
        memberAttendances.forEach(doc => {
            var dateIndex = datesArr.findIndex(d => setTime(d.date) === setTime(doc.date))
            if (dateIndex === -1) {
                datesArr.push({ date: doc.date, memberIds: [doc.memberId] })
            } else {
                var memberIdIndex = datesArr[dateIndex].memberIds.findIndex(m => m === doc.memberId)
                if (memberIdIndex === -1) {
                    datesArr[dateIndex].memberIds.push(doc.memberId)
                }
            }
        })
        let present = 0, absent = 0
        datesArr.forEach(doc => {
            present += doc.memberIds.length
            absent += (totalMembersCount - doc.memberIds.length)
        })
        let response = [{ name: 'Present', data: present }, { name: 'Absent', data: absent }]
        successResponseHandler(res, response, "successfully get Attendances !")
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting Attendances !");
    }
};



exports.getIndividualMemberAttendance = async (req, res) => {
    try {
        let memberAttendances = await MemberAttendance.find({ branch: req.body.branch }).lean();
        let individualAttendance = await MemberAttendance.find({ branch: req.body.branch, memberId: req.body.member }).lean();
        memberAttendances = memberAttendances
            .filter(doc => doc.date.getMonth() === req.body.month && doc.date.getFullYear() === new Date().getFullYear())
        let individualAttendanceLength = individualAttendance
            .filter(doc => doc.date.getMonth() === req.body.month && doc.date.getFullYear() === new Date().getFullYear()).length
        let datesLength = [...new Set(memberAttendances.map(doc => setTime(doc.date)))].length
        let present = individualAttendanceLength, absent = datesLength - individualAttendanceLength
        let response = [{ name: 'Present', data: present }, { name: 'Absent', data: absent }]
        successResponseHandler(res, response, "successfully get Attendances !")
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting Attendances !");
    }
};




exports.getDashboardTotalSales = async (req, res) => {
    try {
        let conditions = { dateOfPurchase: setTime(req.body.date) }, response = {};
        const memberSells = await MemberPurchase.find(conditions).lean();
        const stockSells = await StockSell.find(conditions).lean();
        const classSells = await MemberClass.find(conditions).lean();
        const members = await Member.find({ updated_at: { $gte: setTime(req.body.date) } }).lean();
        if (req.body.category === 'all') {
            const totalStockSells = getStockSellTotalAmount(memberSells, stockSells, req.body.type);
            const totalClassSells = getClassesSellTotalAmount(classSells, req.body.type);
            const totalPackageSells = getPackageSellTotalAmount(members, setTime(req.body.date), req.body.type);
            response['totalStockSells'] = totalStockSells;
            response['totalClassSells'] = totalClassSells;
            response['totalPackageSells'] = totalPackageSells;
        } else if (req.body.category === 'StockSell') {
            const totalStockSells = getStockSellTotalAmount(memberSells, stockSells, req.body.type);
            response['totalStockSells'] = totalStockSells;
        } else if (req.body.category === 'ClassSell') {
            const totalClassSells = getClassesSellTotalAmount(classSells, req.body.type);
            response['totalClassSells'] = totalClassSells;
        } else if (req.body.category === 'PackageSells') {
            const totalPackageSells = getPackageSellTotalAmount(members, setTime(req.body.date), req.body.type);
            response['totalPackageSells'] = totalPackageSells;
        }
        return successResponseHandler(res, response, "success");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "failed  !");
    }
};


exports.getPendingInstallments = async (req, res) => {
    try {
        const members = await Member.find({}).populate('credentialId').lean();
        const todayMonth = new Date().getMonth();
        const todayDay = new Date().getDay();
        let response = [];
        for (const member of members) {
            for (const packages of member.packageDetails) {
                if (packages.Installments && packages.Installments.length) {
                    for (const installment of packages.Installments) {
                        const dueDate = new Date(setTime(installment.dueDate));
                        const monthConditions = req.body.month ? req.body.month === todayMonth : true;
                        const dayConditions = req.body.day ? req.body.day === todayDay : true;
                        const conditions = (new Date() > dueDate) && monthConditions && dayConditions;
                        if (new Date() > dueDate && conditions) {
                            const memberObj = Object.assign({}, member);
                            memberObj['packageAmount'] = installment.actualAmount;
                            memberObj['packageAmount'] = installment.dueDate;
                            memberObj['type'] = 'Package';
                            response.push(memberObj);
                        }
                    }
                }
                if (packages.trainerDetails && packages.trainerDetails.length) {
                    for (const trainer of packages.trainerDetails) {
                        for (const installment of trainer.Installments) {
                            const dueDate = new Date(setTime(installment.dueDate));
                            const monthConditions = req.body.month ? req.body.month === todayMonth : true;
                            const dayConditions = req.body.day ? req.body.day === todayDay : true;
                            const conditions = (new Date() > dueDate) && monthConditions && dayConditions;
                            if (new Date() > dueDate && conditions) {
                                const memberObj = Object.assign({}, member);
                                memberObj['trainerAmount'] = installment.actualAmount;
                                memberObj['trainerAmount'] = installment.dueDate;
                                memberObj['type'] = 'Package';
                                response.push(memberObj);
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "failed  !");
    }
};

