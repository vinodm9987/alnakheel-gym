import React from 'react'

export default function Error() {
  return (
    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">

      <b>
        <h1 className="text-center text-danger">{t('OOPs!...')}</h1>
      </b>
      <p className="text-center text-danger">{t('Something Went Wrong Try Again...')}</p>

    </div>
  )
}
