module.exports = {

    /** 
     * For Admin and Employee
    */

    NewMemberRegister: () => {
        return {
            title: "New member has registered online",
            webPath: `/members/new-members`,
            mobileCompo: ``
        }
    },

    MemberPackageExpiry: () => {
        return {
            title: "Member package about to expire!",
            webPath: `/members/expiry-members`,
            mobileCompo: ``
        }
    },

    MemberPackageExpired: () => {
        return {
            title: "Member package is expired!",
            webPath: `/members/expiry-members`,
            mobileCompo: ``
        }
    },

    ClassCapacity: (className, branchName, id) => {
        return {
            title: `Class ${className} in branch ${branchName} is reached 90% of the capacity !`,
            webPath: `/classes-details/${id}`,
            mobileCompo: ``
        }
    },

    ClassFullBooked: (className, branchName, id) => {
        return {
            title: `Class ${className} in branch ${branchName} is fully booked!`,
            webPath: `/classes-details/${id}`,
            mobileCompo: ``
        }
    },


    StockExpiry: (stockName, branchName) => {
        return {
            title: `The Stock item ${stockName} about to expire in Branch ${branchName}!`,
            webPath: `/stock/stock-list`,
            mobileCompo: ``
        }
    },

    StockExpired: (stockName, branchName) => {
        return {
            title: `The Stock item ${stockName} in Branch ${branchName} is expired!`,
            webPath: `/stock/stock-list`,
            mobileCompo: ``
        }
    },

    StockQuantity: (stockName, branchName) => {
        return {
            title: `The Stock for item ${stockName} in Branch ${branchName} is about to be finished!`,
            webPath: `/stock/stock-list`,
            mobileCompo: ``
        }
    },

    StockFinish: (stockName, branchName) => {
        return {
            title: `The Stock for item ${stockName} in Branch ${branchName} is finished!`,
            webPath: `/stock/stock-list`,
            mobileCompo: ``
        }
    },

    MemberOrderOnline: () => {
        return {
            title: `New online order is received!`,
            webPath: ``,
            mobileCompo: ``
        }
    },


    AssetsExpiry: (assetsName, branchName, id) => {
        return {
            title: `The Fixed Asset ${assetsName} warranty in branch ${branchName} is about to be ended!`,
            webPath: `/asset-details/${id}`,
            mobileCompo: ``
        }
    },


    AssetsExpired: (assetsName, branchName, id) => {
        return {
            title: ` The Fixed Asset ${assetsName} warranty in branch ${branchName} is ended!`,
            webPath: `/asset-details/${id}`,
            mobileCompo: ``
        }
    },

    ContractExpiry: (contractName, id) => {
        return {
            title: ` The Contract ${contractName} is about to be ended!  !`,
            webPath: `/contract-details/${id}`,
            mobileCompo: ``
        }
    },

    ContractExpired: (contractName, id) => {
        return {
            title: ` The Contract ${contractName} is ended! `,
            webPath: `/contract-details/${id}`,
            mobileCompo: ``
        }
    },

    EmployeeVisaExpiry: (EmployeeName, id) => {
        return {
            title: `  The Employee visa for ${EmployeeName} about to expire!`,
            webPath: `/employee-details/${id}`,
            mobileCompo: ``
        }
    },

    NewFeedback: () => {
        return {
            title: ` New feedback has been received!`,
            webPath: `/feedback-request-list`,
            mobileCompo: ``
        }
    },

    FreezeAction: (count) => {
        return {
            title: `You have ${count} member(s) Freeze requests needs an action!`,
            webPath: `/freeze-members/pending-freeze`,
            mobileCompo: ``
        }
    },


    /** 
     * For Trainer
    */

    NewMemberAssign: () => {
        return {
            title: `You have new member is assigned for you !`,
            webPath: `/trainer-members`,
            mobileCompo: `MyMembers`
        }
    },

    NewClassAssign: () => {
        return {
            title: `New Class is assigned for you ! `,
            webPath: `/trainer-classes`,
            mobileCompo: `MyClasses`
        }
    },

    NewAnnouncement: () => {
        return {
            title: `New announcement has been sent by the GYM ! `,
            webPath: `/announcement`,
            mobileCompo: `Announcement`
        }
    },

    NewEvent: () => {
        return {
            title: `New event is added by the GYM !`,
            webPath: ``,
            mobileCompo: `SchedulePage`
        }
    },




    /** 
     * For Member
    */

    PackageExpiry: (packageName) => {
        return {
            title: `Your package ${packageName} is about to expire - click to renew! `,
            webPath: `/my-details`,
            mobileCompo: `RenewPackage`
        }
    },

    PackageExpired: (packageName) => {
        return {
            title: `Your package ${packageName} is expired - click to renew! `,
            webPath: `/my-details`,
            mobileCompo: `RenewPackage`
        }
    },

    NewClassCreate: (className) => {
        return {
            title: `New Class ${className} has been scheduled - Register now!  `,
            webPath: `/customer-classes`,
            mobileCompo: `ClassHome`
        }
    },

    ClassRegistration: (className) => {
        return {
            title: `You have been registered for the class ${className} - View your schedule !  `,
            webPath: `/customer-classes-shedule`,
            mobileCompo: `SchedulePage`
        }
    },

    PackageRenewal: (packageName) => {
        return {
            title: `Your Package ${packageName} has been renewed successfully!     `,
            webPath: `/my-details`,
            mobileCompo: `RenewPackage`
        }
    },

    GymTimeSpent: (time) => {
        return {
            title: `You have spent (${time} of minutes) Today at the GYM !      `,
            webPath: `/member-attendance`,
            mobileCompo: `MemberAttendance`
        }
    },

    SalesOffer: () => {
        return {
            title: `New sales offer has been added - Don't miss out !`,
            webPath: `/shopping`,
            mobileCompo: `MenuItems`
        }
    },

    SalesOrder: () => {
        return {
            title: `Your new Sales order is completed successfully !`,
            webPath: `/order-history`,
            mobileCompo: `Orders`
        }
    },

    OderDelivered: () => {
        return {
            title: `Your ordered item has been delivered ! `,
            webPath: `/order-history`,
            mobileCompo: `Orders`
        }
    },

    FeedbackReply: () => {
        return {
            title: `You have received a reply regarding your feedback ! `,
            webPath: `/feedback`,
            mobileCompo: `Feedback`
        }
    },

    FreezeAccept: () => {
        return {
            title: `Your freeze request has been completed successfully ! `,
            webPath: `/my-details`,
            mobileCompo: `RenewPackage`
        }
    },

    NewDietPlan: () => {
        return {
            title: `New diet plan is assigned for you !  `,
            webPath: `/my-details`,
            mobileCompo: `DietPlanScreen`
        }
    },

    NewWorkOut: () => {
        return {
            title: ` New Workout is assigned for you !  `,
            webPath: `/my-details`,
            mobileCompo: `Workouts`
        }
    },

    PointEarn: (point, type) => {
        return {
            title: ` You have earned ${point} points for the ${type}  `,
            webPath: `/reward-transaction-history`,
            mobileCompo: `RewardMember`
        }
    },

    RedeemCompleted: (point) => {
        return {
            title: `You have redeemed ${point} points successfully!    `,
            webPath: `/reward-transaction-history`,
            mobileCompo: `RewardMember`
        }
    },


};