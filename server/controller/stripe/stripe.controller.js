const stripe = require('stripe')('sk_test_MPMiqq37KtKJufbSxGALXhIB00tpgdPR1p');


const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')


exports.postCharge = async (req, res) => {
  try {
    const { amount, source, receipt_email } = req.body

    const response = await stripe.charges.create({
      amount,
      currency: 'usd',
      source,
      receipt_email,
      description: "Charge for test@example.com"
    })

    return successResponseHandler(res, response, "charge posted successfully !")
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(res, error, "Exception while posting charge !");
  }
};