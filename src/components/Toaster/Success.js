import React from 'react'

export default function Success() {
  return (
    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
      <h2 className="text-center text-success">{t('SUCCESS!...')}</h2>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th className="text-center">{t('Label')}</th>
              <th className="text-center">{t('Description')}</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    </div>
  )
}
