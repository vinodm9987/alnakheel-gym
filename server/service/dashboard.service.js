const { Formate: { setTime } } = require('../utils');


module.exports = {

    getStockSellTotalAmount: (memberSells, stockSells, type) => {
        let totalAmount = 0;
        for (let i = 0; i < stockSells.length; i++) {
            if (type === 'all') totalAmount += stockSells[i].totalAmount;
            if (type === 'digital') totalAmount += stockSells[i].digitalAmount;
            if (type === 'cash') totalAmount += stockSells[i].cashAmount;
            if (type === 'card') totalAmount += stockSells[i].cardAmount;
        }
        for (let i = 0; i < memberSells.length; i++) {
            if (type === 'all') totalAmount += stockSells[i].totalAmount;
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

    handleInstallmentAmount: (installment, type, totalAmount, date) => {
        if (installment.paidStatus === 'Paid') {
            const dateOfPaid = new Date(setTime(installment.dateOfPaid))
            if (new Date(date) === dateOfPaid) {
                if (type === 'all') totalAmount += (+installment.totalAmount);
                if (type === 'digital') totalAmount += installment.digitalAmount;
                if (type === 'cash') totalAmount += installment.cashAmount;
                if (type === 'card') totalAmount += installment.cardAmount;
            }
        }
        return totalAmount;
    },

};