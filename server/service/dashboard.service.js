const { Formate: { setTime } } = require('../utils');


module.exports = {

    getStockSellTotalAmount: (stockSells, type) => {
        let totalAmount = 0;
        for (let i = 0; i < stockSells.length; i++) {
            if (type === 'all') totalAmount += stockSells[i].totalAmount?stockSells[i].totalAmount:0;
            if (type === 'digital') totalAmount += stockSells[i].digitalAmount?stockSells[i].digitalAmount:0;
            if (type === 'cash') totalAmount += stockSells[i].cashAmount?stockSells[i].cashAmount:0;
            if (type === 'card') totalAmount += stockSells[i].cardAmount?stockSells[i].cardAmount:0;
            if (type === 'cheque') totalAmount += stockSells[i].chequeAmount?stockSells[i].chequeAmount:0;
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
            if (type === 'cheque') totalAmount += classSells[i].chequeAmount;
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
                            for (const installment of trainer.Installments) {
                                let totalAmount = 0;
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
        return branches;
    },

    handleInstallmentAmount: (installment, type, totalAmount, date) => {
        if (installment.paidStatus === 'Paid') {
            const dateOfPaid = new Date(setTime(installment.dateOfPaid))
            if (new Date(date).getTime() === dateOfPaid.getTime()) {
                if (type === 'all') totalAmount += typeof installment.totalAmount === 'number' ?installment.totalAmount :0 ;
                if (type === 'digital') totalAmount += typeof installment.digitalAmount === 'number' ?installment.digitalAmount :0 ;
                if (type === 'cash') totalAmount += typeof installment.cashAmount === 'number' ?installment.cashAmount :0;
                if (type === 'card') totalAmount += typeof installment.cardAmount === 'number' ?installment.cardAmount :0;
                if (type === 'cheque') totalAmount +=typeof  installment.chequeAmount === 'number' ? installment.chequeAmount :0 ;
            }
        }
        return totalAmount;
    },

    getBranchStockSells: (branches, stockSells, type) => {
        for (let i = 0; i < stockSells.length; i++) {
            let totalAmount = 0;
            let stockBranch = stockSells[i].branch.toString();
            if (type === 'all') totalAmount += stockSells[i].totalAmount?stockSells[i].totalAmount:0 ;
            if (type === 'digital') totalAmount += stockSells[i].digitalAmount?stockSells[i].digitalAmount:0;
            if (type === 'cash') totalAmount += stockSells[i].cashAmount?stockSells[i].cashAmount:0;
            if (type === 'card') totalAmount += stockSells[i].cardAmount?stockSells[i].cardAmount:0;
            if (type === 'cheque') totalAmount += stockSells[i].chequeAmount?stockSells[i].chequeAmount:0;
            const index = branches.findIndex(doc => stockBranch === doc._id.toString());
            branches[index]['amount'] = typeof branches[index]['amount'] === 'number' ? branches[index]['amount'] += totalAmount : totalAmount;
        }
        return branches;
    },

    getBranchClassSells: (branches, classSells, type) => {
        return 0;
    },



};