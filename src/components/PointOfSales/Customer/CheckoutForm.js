import React, { useState } from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from 'react-stripe-elements'
import axios from 'axios'

const CheckoutForm = ({ stripe, defaultCurrency, amount }) => {

  // const [receiptUrl, setReceiptUrl] = useState('')
  const [disable, setDisable] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    const { token } = await stripe.createToken({
      name: 'customer name'
    })
    if (token) {
      setDisable(true)
      axios.post('http://localhost:5000/api/stripe/charge', {
        amount: amount.toString().replace('.', ''),
        source: token.id,
        receipt_email: 'customer@example.com'
      })
        .then(order => {
          // setReceiptUrl(order.data.response.receipt_url)
          alert('Payment Successful!')
          setDisable(true)
        })
        .catch(err => {
          setDisable(true)
          alert('Unexpected Error')
        })
    } else {
      alert('Unexpected Error')
    }
  }

  // if (receiptUrl) {
  //   return (
  //     <div className="success">
  //       <h2>Payment Successful!</h2>
  //       <a href={receiptUrl} target="_blank" rel="noopener noreferrer">View Receipt</a>
  //     </div>
  //   )
  // }

  return (
    <div className="checkout-form">
      <p>Amount: {defaultCurrency}{amount}</p>
      <label>
        Card details
          <CardNumberElement />
      </label>
      <label>
        Expiration date
          <CardExpiryElement />
      </label>
      <label>
        CVC
          <CardCVCElement />
      </label>
      <button disabled={disable} type="submit" className="order-button" onClick={handleSubmit}>
        Pay
        </button>
    </div>
  )
}

export default injectStripe(CheckoutForm)