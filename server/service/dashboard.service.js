const { Formate: { setTime } } = require('../utils');


module.exports = {

    getStockSellTotalAmount: (stockSells, type) => {
        let totalAmount = 0;
        for (let i = 0; i < stockSells.length; i++) {
            if (type === 'all') totalAmount += stockSells[i].totalAmount;
            if (type === 'digital') totalAmount += stockSells[i].digitalAmount;
            if (type === 'cash') totalAmount += stockSells[i].cashAmount;
            if (type === 'card') totalAmount += stockSells[i].cardAmount;
        }
        return totalAmount;
    },

    getClassesSellTotalAmount: (classSells, type) => {
        let totalAmount = 0;
        for (let i = 0; i < classSells.length; i++) {
            if (type === 'all') totalAmount += classSells[i].totalAmount;
            if (type === 'digital') totalAmount += classSells[i].digitalAmount;
            if (type === 'cash') totalAmount += classSells[i].cashAmount;
            if (type === 'card') totalAmount += classSells[i].cardAmount;
        }
        return totalAmount;
    },

    getPackageSellTotalAmount: (members, date, type) => {
        let totalAmount = 0;
        for (const member of members) {
            for (const packages of member.packageDetails) {
                if (packages.Installments && packages.Installments.length) {
                    for (const installment of packages.Installments) {
                        totalAmount = module.exports
                            .handleInstallmentAmount(installment, type, totalAmount, date);
                    }
                } else {
                    totalAmount = module.exports
                        .handleInstallmentAmount(packages, type, totalAmount, date);
                }
                if (packages.trainerDetails && packages.trainerDetails.length) {
                    for (const trainer of packages.trainerDetails) {
                        if (trainer.Installments && trainer.Installments.length) {
                            for (const installment of trainer.Installments) {
                                totalAmount = module.exports
                                    .handleInstallmentAmount(installment, type, totalAmount, date);
                            }
                        } else {
                            totalAmount = module.exports
                                .handleInstallmentAmount(trainer, type, totalAmount, date);
                        }
                    }
                }
            }
        }
        return totalAmount;
    },

    getBranchPackageSells: (branches, members, date, type) => {
        for (const member of members) {
            let memberBranch = member.branch.toString();
            const index = branches.findIndex(doc => memberBranch === doc._id.toString());
            for (const packages of member.packageDetails) {
                if (packages.Installments && packages.Installments.length) {
                    for (const installment of packages.Installments) {
                        let totalAmount = 0;
                        totalAmount = module.exports
                            .handleInstallmentAmount(installment, type, totalAmount, date);
                        branches[index]['amount'] = typeof branches[index]['amount'] === 'number' ? branches[index]['amount'] += totalAmount : totalAmount;
                    }
                } else {
                    let totalAmount = 0;
                    totalAmount = module.exports
                        .handleInstallmentAmount(packages, type, totalAmount, date);
                    branches[index]['amount'] = typeof branches[index]['amount'] === 'number' ? branches[index]['amount'] += totalAmount : totalAmount;
                }
                if (packages.trainerDetails && packages.trainerDetails.length) {
                    for (const trainer of packages.trainerDetails) {
                        if (trainer.Installments && trainer.Installments.length) {
                            let totalAmount = 0;
                            for (const installment of trainer.Installments) {
                                totalAmount = module.exports
                                    .handleInstallmentAmount(installment, type, totalAmount, date);
                                branches[index]['amount'] = typeof branches[index]['amount'] === 'number' ? branches[index]['amount'] += totalAmount : totalAmount;
                            }
                        } else {
                            let totalAmount = 0;
                            totalAmount = module.exports
                                .handleInstallmentAmount(trainer, type, totalAmount, date);
                            branches[index]['amount'] = typeof branches[index]['amount'] === 'number' ? branches[index]['amount'] += totalAmount : totalAmount;
                        }
                    }
                }
            }
        }
    },

    handleInstallmentAmount: (installment, type, totalAmount, date) => {
        if (installment.paidStatus === 'Paid') {
            const dateOfPaid = new Date(setTime(installment.dateOfPaid))
            if (new Date(date).getTime() === dateOfPaid.getTime()) {
                if (type === 'all') totalAmount += (+installment.totalAmount);
                if (type === 'digital') totalAmount += installment.digitalAmount;
                if (type === 'cash') totalAmount += installment.cashAmount;
                if (type === 'card') totalAmount += installment.cardAmount;
            }
        }
        return totalAmount;
    },

    getBranchStockSells: (branches, stockSells, type) => {
        for (let i = 0; i < stockSells.length; i++) {
            let totalAmount = 0;
            let stockBranch = stockSells[i].branch.toString();
            if (type === 'all') totalAmount += stockSells[i].totalAmount;
            if (type === 'digital') totalAmount += stockSells[i].digitalAmount;
            if (type === 'cash') totalAmount += stockSells[i].cashAmount;
            if (type === 'card') totalAmount += stockSells[i].cardAmount;
            const index = branches.findIndex(doc => stockBranch === doc._id.toString());
            branches[index]['amount'] = typeof branches[index]['amount'] === 'number' ? branches[index]['amount'] += totalAmount : totalAmount;
        }

    },

    getBranchClassSells: (branches, classSells, type) => {
        return 0;
    },



};