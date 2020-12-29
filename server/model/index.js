module.exports = {
  Member: require('./member/member.model'),
  Employee: require('./employee/employee.model'),
  Credential: require('./credential/credential.model'),
  Package: require('./masterTable/package.model'),
  Branch: require('./masterTable/branch.model'),
  Period: require('./masterTable/period.model'),
  Designation: require('./masterTable/designation.model'),
  ActivityLog: require('./activityLog/activity_log.model'),
  TrainerFees: require('./masterTable/trainerFees.model'),
  Currency: require('./masterTable/currency.model'),
  Workout: require('./workouts/workout.model'),
  MemberWorkout: require('./workouts/memberWorkout.model'),
  WorkoutLevel: require('./workouts/workoutLevel.model'),
  DietFood: require('./memberDiet/dietFood.model'),
  DietSession: require('./memberDiet/dietSession.model'),
  MemberDiet: require('./memberDiet/memberDiet.model'),
  Stocks: require('./pointOfSales/stock.model'),
  StockSell: require('./pointOfSales/stockSell.model'),
  MemberPurchase: require('./pointOfSales/memberPurchase.model'),
  MemberCart: require('./pointOfSales/memberCart.model'),
  WebPrivilege: require('./privilege/webPrivilege.model'),
  MobilePrivilege: require('./privilege/mobilePrivilege.model'),
  MemberAttendance: require('./attendance/memberAttendance.model'),
  Shift: require('./shift/shift.model'),
  EmployeeShift: require('./shift/employeeShift.model'),
  MemberBmi: require('./bmi/memberBmi.model'),
  WaterInTake: require('./member/waterInTake.model'),
  MemberReminder: require('./member/memberReminder.model'),
  WorkoutAttendance: require('./workouts/workoutAttendance.model'),
  Room: require('./classes/room.model'),
  Classes: require('./classes/classes.model'),
  MemberClass: require('./classes/memberClasses.model'),
  Counter: require('./counter'),
  Assets: require('./assets/assets.model'),
  Contract: require('./assets/contract.model'),
  Supplier: require('./assets/supply.model'),
  Feedback: require('./feedback/feedback.model'),
  Offer: require('./offer/offer.model'),
  Announcement: require('./announcement/announcement.model'),
  Event: require('./events/event.model'),
  GiftCard: require('./reward/giftCard.model'),
  RewardPolicy: require('./reward/policy.model'),
  MemberTransaction: require('./reward/memberTransaction.model'),
  MemberCode: require('./reward/memberCode.model'),
  MemberFreezing: require('./member/memberFreezing.model'),
  Notification: require('./notification'),
  Vat: require('./financeReporting/vat'),
  SystemYear: require('./masterTable/systemYear.model'),
  Messaging: require('./messaging'),
  MemberAppointment: require('./appointment/memberAppointment.model'),
  VisitorAppointment: require('./appointment/visitorAppointment.model'),
  TrafficStatistics: require('./appointment/trafficStatistics.model'),
  AdminPassword: require('./privilege/adminPassword.model'),
  ManualBackup: require('./backupRestore/manualBackup.model'),
  Restore: require('./backupRestore/restore.model')
};
