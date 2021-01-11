/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')


/**
 * models.
*/

const { MoneyCollection, StockSell, Classes, MemberClass, Member } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');



/**
 *****  Offer controller  *****
*/


exports.getMoneyCollection = async (req, res) => {
  try {
    let queryCond = {};
    if (req.body.branch) queryCond["branch"] = req.body.branch
    req.body["date"] = setTime(req.body.date);
    const isExist = await MoneyCollection.findOne({ date: req.body.date, branch: req.body.branch });
    if (isExist) {
      MoneyCollection.findOne({ date: req.body.date, branch: req.body.branch })
        .then(response => {
          successResponseHandler(res, response, "successfully update money collection");
        }).catch(error => {
          logger.error(error);
          errorResponseHandler(res, error, "Exception while update money collection !");
        });
    } else {
      let collections = [{ collectionName: "Packages", total: 0, cash: 0, card: 0, digital: 0 },
      { collectionName: "POS", total: 0, cash: 0, card: 0, digital: 0 }, { collectionName: "Classes", total: 0, cash: 0, card: 0, digital: 0 }]

      let totalAmountOfStockSell = await StockSell.find(queryCond).lean()
      totalAmountOfStockSell = totalAmountOfStockSell.filter(doc => new Date(setTime(req.body.date)).toISOString() === doc.dateOfPurchase.toISOString())
      totalAmountOfStockSell.forEach(doc => {
        collections[1].total += doc.totalAmount ? +doc.totalAmount : 0
        collections[1].cash += doc.cashAmount ? +doc.cashAmount : 0
        collections[1].card += doc.cardAmount ? +doc.cardAmount : 0
        collections[1].digital += doc.digitalAmount ? +doc.digitalAmount : 0
      })

      let classes = await Classes.find(queryCond, { _id: 1 }).lean()
      const classesArray = classes.map(ele => ele._id.toString());
      let memberClasses = await MemberClass.find({ classId: { $in: classesArray } }).lean()
      memberClasses = memberClasses.filter(doc => new Date(setTime(req.body.date)).toISOString() === doc.dateOfPurchase.toISOString())
      memberClasses.forEach(doc => {
        collections[2].total += doc.totalAmount ? +doc.totalAmount : 0
        collections[2].cash += doc.cashAmount ? +doc.cashAmount : 0
        collections[2].card += doc.cardAmount ? +doc.cardAmount : 0
        collections[2].digital += doc.digitalAmount ? +doc.digitalAmount : 0
      })

      let totalAmountOfMember = await Member.find(queryCond).lean();
      totalAmountOfMember.forEach(ele => {
        ele.packageDetails = ele.packageDetails.filter(doc => doc.paidStatus === 'Paid' && new Date(setTime(req.body.date)).toISOString() === doc.dateOfPurchase.toISOString())
        ele.packageDetails.forEach(doc => {
          collections[0].total += doc.totalAmount ? +doc.totalAmount : 0
          collections[0].cash += doc.cashAmount ? +doc.cashAmount : 0
          collections[0].card += doc.cardAmount ? +doc.cardAmount : 0
          collections[0].digital += doc.digitalAmount ? +doc.digitalAmount : 0
        })
      })
      console.log("collections", collections)
      let totalAmount = 0
      collections.forEach(collection => totalAmount += +collection.total)

      const pushObj = {
        branch: req.body.branch,
        date: req.body.date,
        original: {
          totalAmount,
          collections
        },
        remain: {
          totalAmount,
          collections
        },
        taken: []
      }
      console.log("pushObj", pushObj)

      if (totalAmount) {
        const newMoneyCollection = new MoneyCollection(pushObj);
        newMoneyCollection.save().then(response => {
          successResponseHandler(res, response, "successfully create new money collection");
        }).catch(error => {
          logger.error(error);
          errorResponseHandler(res, error, "Exception while create new money collection !");
        });
      } else {
        errorResponseHandler(res, 'error', "Sorry no transaction on this date");
      }
    }
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "error ocurred while create money collection");
  };
};

exports.addMoneyCollection = async (req, res) => {
  try {
    req.body.taken["dateOfTaken"] = setTime(new Date());
    req.body.taken["timeOfTaken"] = new Date();
    if (req.headers.userid) {
      req.body.taken["collectedBy"] = req.headers.userid
    }
    req.body["date"] = setTime(req.body.date);
    await MoneyCollection.findOneAndUpdate({ date: req.body.date, branch: req.body.branch }, {
      $set: { 'remain': req.body.remain, 'collectMoneyHistory': req.body.collectMoney },
      $push: {
        'taken': req.body.taken
      }
    }, { new: true }).then(response => {
      auditLogger(req, 'Success')
      successResponseHandler(res, response, "successfully add new money collection");
    }).catch(error => {
      logger.error(error);
      auditLogger(req, 'Failed')
      errorResponseHandler(res, error, "Exception while add new money collection !");
    });
  } catch (err) {
    logger.error(error);
    auditLogger(req, 'Failed')
    errorResponseHandler(res, error, "error ocurred while add money collection");
  }
}


exports.getMoneyCollectionHistory = async (req, res) => {
  try {
    let queryCond = {}
    if (req.body.date) queryCond["date"] = setTime(req.body.date)
    if (req.body.branch) queryCond["branch"] = req.body.branch
    let response = await MoneyCollection.find(queryCond).populate('branch').lean();
    successResponseHandler(res, response, "successfully get money collection");
  } catch (err) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting money collection!");
  }
}


exports.getMoneyCollectionById = (req, res) => {
  MoneyCollection.findById(req.params.id).populate('branch taken.collectedBy')
    .then((response) => {
      successResponseHandler(res, response, "successfully get  MoneyCollection details");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "error ocurred getting  MoneyCollection by id");
    });
};