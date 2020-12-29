const { getAllGiftcardForAdmin, getAllGiftcard,
  getGiftcardById, addGiftcard, updateGiftcard } = require('../controller/reward/giftcard.controller')

const { addNewPolicy, updatePolicy, getAllPolicy,
  getAllPolicyForAdmin, getPolicyById } = require('../controller/reward/policy.controller')

const { referFriend, getAllTransactionsForAdmin, getRedeemCode, getAmountByRedeemCode,
  getMemberTransaction, redeemOffer, useRedeemCode, cancelRedeem, checkReferralCodeValidity } = require('../controller/reward/pointTransaction.controller');



exports.routes = (express, app) => {


  const router = express.Router();

  /**
   *****  Giftcard routes  *****
  */


  router.get('/getAllGiftcardForAdmin', getAllGiftcardForAdmin);


  router.get('/getAllGiftcard', getAllGiftcard);


  router.get('/getGiftcardById/:id', getGiftcardById);


  router.post('/addGiftcard', addGiftcard);


  router.put('/updateGiftcard/:id', updateGiftcard);


  /**
   *****  policy routes  *****
  */

  router.get('/getAllPolicyForAdmin', getAllPolicyForAdmin);


  router.get('/getAllPolicy', getAllPolicy);


  router.get('/getPolicyById/:id', getPolicyById);


  router.post('/addNewPolicy', addNewPolicy);


  router.put('/updatePolicy/:id', updatePolicy);




  /**
   *****  refer friend routes  *****
  */


  router.post('/referFriend', referFriend);


  router.post('/getAllTransactionsForAdmin', getAllTransactionsForAdmin);


  router.post('/getMemberTransaction', getMemberTransaction);


  router.post('/checkReferralCodeValidity', checkReferralCodeValidity);




  /**
   *****  gift card redeem routes  *****
  */


  router.post('/getRedeemCode', getRedeemCode);


  router.post('/redeemOffer', redeemOffer);


  router.post('/useRedeemCode', useRedeemCode);


  router.post('/cancelRedeem', cancelRedeem);


  router.post('/getAmountByRedeemCode', getAmountByRedeemCode);



  app.use('/api/reward/', router);

}