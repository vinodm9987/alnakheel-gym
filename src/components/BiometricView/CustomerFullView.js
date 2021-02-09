import React, { Component } from 'react'
import { NAMESPACE } from '../../config';
import { getItemFromStorage } from '../../utils/localstorage';
import { withTranslation } from 'react-i18next'
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux'
import { socketConnect } from '../../utils/socket';
import { getMemberEntrance } from '../../actions/member.action';
import { dateToDDMMYYYY, dateToHHMM, setTime } from '../../utils/apis/helpers';
import { changeLanguage } from '../../utils/changeLanguage';
import { removeLoading, setLoading } from '../../actions/loader.action';
import gymnagologo from '../../assets/img/gymnago.png'
import algymlogo from '../../assets/img/al-main-logo.png'
class CustomerFullView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userToken: getItemFromStorage('jwtToken'),
    }
  };

  componentDidMount() {
    if (this.state.userToken) {
      const userInfo = jwt_decode(this.state.userToken)
      const io = socketConnect(NAMESPACE.entrance, { userId: userInfo.credential })
      this.props.dispatch(getMemberEntrance(io))
    }
  }

  changedLanguage = () => {
    this.props.dispatch(setLoading())
    changeLanguage(this.props.i18n.language)
    this.props.i18n.changeLanguage(this.props.i18n.language === 'ar' ? 'en' : 'ar')
    setTimeout(() => {
      this.props.dispatch(removeLoading())
    }, 1000)
  }

  render() {
    const { t } = this.props
    if (this.props.memberEntrance) {
      const { credentialId: { avatar, userName }, mobileNo, admissionDate, gender,
        packageDetails, status, fingerScanStatus, notes } = this.props.memberEntrance
      const sortedPackage = packageDetails.filter(packageDetail =>
        packageDetail.extendDate
          ? (setTime(packageDetail.startDate) <= setTime(new Date()) && setTime(packageDetail.extendDate) >= setTime(new Date()))
          : (setTime(packageDetail.startDate) <= setTime(new Date()) && setTime(packageDetail.endDate) >= setTime(new Date()))
      )
      let resultedStatus, resultedClass
      if (sortedPackage[0] && sortedPackage[0].reactivationDate && setTime(sortedPackage[0].reactivationDate) > setTime(new Date())) {
        resultedStatus = t('Freezed')
        resultedClass = "bg-orange text-white font-weight-bold px-5 py-2 rounded text-center blinker-1"
      } else if (status) {
        resultedStatus = t('Active')
        resultedClass = "bg-success text-white font-weight-bold px-5 py-2 rounded text-center blinker-1"
      } else {
        resultedStatus = t('Inactive')
        resultedClass = "bg-danger text-white font-weight-bold px-5 py-2 rounded text-center blinker-1"
      }
      return (
        <div className="pr">
          <div className="container-fluid bg-black w-100 d-flex cfvwrap h-100">
            <div className="row CFV h-100">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 p-5 align-self-center text-center h-100 d-flex bg-black">
                <div className="bg-black py-4 w-100 h-100">
                  <img alt='' src={`/${avatar.path}`} className="CFVPhoto" />
                  {/* <img alt='' src="https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528" className="CFVPhoto" /> */}
                </div>
                <div className="powered-in-cfv">
                  <p className="my-1 mx-1 text-white"><small>{t('Powered by')}</small></p>
                  <a href="https://gymnago.com/" target="_blank" className="mx-1"><img src={gymnagologo} alt='' width="100" height="20" /></a>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 p-0 h-100 rightcnt">
                <div className="bg-white p-0">
                  <div className="d-flex justify-content-start pt-2 pl-5">
                    <div className="w-100 d-flex justify-content-end">
                      <img alt='' src={algymlogo} width="100" height="100"  />
                    </div>
                    <span className="cursorPointer d-inline-flex align-items-center CFV-ar-text" onClick={() => this.changedLanguage()}>
                      <span className="iconv1 iconv1-globe language-icon px-1" style={{ fontSize: '20px' }}></span>
                      <span className="px-1 SegoeSemiBold">{t('TopBarLanguage')}</span>
                    </span>
                    <span className="cursorPointer d-inline-flex align-items-center CFV-en-text" onClick={() => this.changedLanguage()}>
                      <span className="iconv1 iconv1-globe language-icon px-1" style={{ fontSize: '20px' }}></span>
                      <span className="px-1 SegoeSemiBold">English</span>
                    </span>
                  </div>
                  <div className="px-5 pt-1">
                    <div className="d-flex flex-wrap justify-content-between">
                      <div className="w-100 pl-2">
                        <h2 className="font-weight-bold CVF-Name">{userName}</h2>
                        <h5 className="text-body font-weight-bold">{gender}</h5>
                        <h4 className="text-orange font-weight-bold pb-0 blinker-1">{fingerScanStatus}</h4>
                        {/* <h2 className="font-weight-bold CVF-Name">Ansar</h2>
                      <h5 className="text-body font-weight-bold">Male</h5>
                      <h4 className="text-orange font-weight-bold pb-0 blinker-1">Fingerprint successfully</h4> */}
                        {/* <h4 className="text-danger font-weight-bold pb-0 blinker-1">Fingerprint successfully</h4> */}
                      </div>
                      <div className="d-flex p-2 w-50 mt-3 CFVW100sm">
                        <h4 className="text-danger iconv1 iconv1-biomatric-phone font-weight-bold mt-1 CFV-iconv1-biomatric-phone"> </h4>
                        <div className="px-2">
                          <h5 className="font-weight-bold text-muted">{t('Phone')}</h5>
                          <h5 className="text-danger font-weight-bold dirltrtar">{mobileNo}</h5>
                          {/* <h5 className="text-danger font-weight-bold dirltrtar">+918281591021</h5> */}
                        </div>
                      </div>
                      <div className="d-flex p-2 w-50 mt-3 CFVW100sm">
                        <h3 className="text-danger iconv1 iconv1-biomatric-status font-weight-bold mt-1"> </h3>
                        <div className="px-2">
                          <h5 className="font-weight-bold text-muted">{t('Status')}</h5>
                          <h5 className={resultedClass}>{resultedStatus}</h5>
                          {/* no change in this below class so use above {resultedClass} only and comment below line */}
                          {/* <h5 className="bg-orange text-white font-weight-bold px-5 py-2 rounded text-center blinker-1">{t('Freezed')}</h5> */}
                          {/* <h3 className="bg-success text-white font-weight-bold px-5 py-2 rounded text-center">{t('Active')}</h3> */}
                          {/* <h5 className="bg-danger text-white font-weight-bold px-5 py-2 rounded text-center blinker-1">{t('Inactive')}</h5> */}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between">
                      <div className="d-flex p-2 w-50 mt-0 CFVW100sm">
                        <h3 className="text-danger iconv1 iconv1-biomatric-punch font-weight-bold mt-1"> </h3>
                        <div className="px-2">
                          <h5 className="font-weight-bold text-muted">{t('Punched At')}</h5>
                          <h5 className="text-danger font-weight-bold dirltrtar">{dateToDDMMYYYY(new Date())}</h5>
                          {/* <h5 className="text-danger font-weight-bold dirltrtar">22/01/1199</h5> */}
                          <label className="text-muted dirltrtar">{dateToHHMM(new Date())}</label>
                          {/* <label className="text-muted dirltrtar">22:00 PM</label> */}
                        </div>
                      </div>
                      <div className="d-flex p-2 w-50 mt-0 CFVW100sm">
                        <h3 className="text-danger iconv1 iconv1-biomatric-package font-weight-bold"> </h3>
                        {sortedPackage[0] &&
                          <div className="px-2">
                            <h5 className="font-weight-bold text-muted">{t('Packages')}</h5>
                            <h5 className="text-danger font-weight-bold dirltrtar">{sortedPackage[0].packages.packageName}</h5>
                            {/* <h5 className="text-danger font-weight-bold dirltrtar">1 month golden plan</h5> */}
                            <label className="text-muted dirltrtar">{dateToHHMM(sortedPackage[0].packages.fromTime)} - {dateToHHMM(sortedPackage[0].packages.toTime)}</label>
                            {/* <label className="text-muted dirltrtar">12:00 PM - 12:00 AM</label> */}
                          </div>
                        }
                      </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between">
                      <div className="d-flex p-2 w-50 mt-0 CFVW100sm">
                        <h3 className="text-danger iconv1 iconv1-calander font-weight-bold mt-1"> </h3>
                        <div className="px-2">
                          <h5 className="font-weight-bold text-muted">{t('Admission Date')}</h5>
                          <h5 className="text-danger font-weight-bold dirltrtar">{dateToDDMMYYYY(admissionDate)}</h5>
                        </div>
                      </div>
                      <div className="d-flex p-2 w-50 mt-0 CFVW100sm">
                        <h2 className="text-danger iconv1 iconv1-note-main-screen font-weight-bold mt-1"> </h2>
                        <div className="px-2">
                          <h5 className="font-weight-bold text-muted">{t('Note')}</h5>
                          <h5 className="text-danger font-weight-bold dirltrtar">{notes}</h5>
                        </div>
                      </div>
                    </div>
                    {sortedPackage[0] && sortedPackage[0].reactivationDate && setTime(sortedPackage[0].reactivationDate) > setTime(new Date()) &&
                      <div className="d-flex flex-wrap justify-content-between">
                        <div className="d-flex p-2 w-50 mt-0 CFVW100sm">
                          <h3 className="text-danger iconv1 iconv1-calander font-weight-bold mt-1"> </h3>
                          <div className="px-2">
                            <h5 className="font-weight-bold text-muted">{t('Freeze From')}</h5>
                            <h5 className="text-danger font-weight-bold dirltrtar">{dateToDDMMYYYY(sortedPackage[0].freezeDate)}</h5>
                          </div>
                        </div>
                        <div className="d-flex p-2 w-50 mt-0 CFVW100sm">
                          <h3 className="text-danger iconv1 iconv1-calander font-weight-bold mt-1"> </h3>
                          <div className="px-2">
                            <h5 className="font-weight-bold text-muted">{t('Freeze To')}</h5>
                            <h5 className="text-danger font-weight-bold dirltrtar">
                              {dateToDDMMYYYY(new Date(new Date(sortedPackage[0].reactivationDate).setDate(new Date(sortedPackage[0].reactivationDate).getDate() - 1)))}
                            </h5>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className="p-2 d-flex flex-wrap justify-content-between w-100 bg-black jjjj">
                  {sortedPackage[0] &&
                    <div className="m-2">
                      <h5 className="font-weight-bold text-white">{t('Date of Purchase')}</h5>
                      <h5 className="text-white font-weight-bold dirltrtar">{dateToDDMMYYYY(sortedPackage[0].dateOfPurchase)}</h5>
                    </div>
                  }
                  <div className="m-2">
                    <h5 className="font-weight-bold text-white">{t('From Date')}</h5>
                    <h5 className="text-white font-weight-bold dirltrtar">{dateToDDMMYYYY(sortedPackage[0].startDate)}</h5>
                    {/* <h5 className="text-white font-weight-bold dirltrtar">22/01/2020</h5> */}
                  </div>
                  <div className="m-2">
                    <h5 className="font-weight-bold text-white">{t('To Date')}</h5>
                    <h5 className="text-white font-weight-bold dirltrtar">
                      {sortedPackage[0].extendDate ? dateToDDMMYYYY(sortedPackage[0].extendDate) : dateToDDMMYYYY(sortedPackage[0].endDate)}
                    </h5>
                    {/* <h5 className="text-white font-weight-bold dirltrtar">22/01/2020</h5> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div>{t('Please place your finger on the device to check status.')}</div>
    }
  }
}

function mapStateToProps({ member: { memberEntrance } }) {
  return { memberEntrance }
}
export default withTranslation()(connect(mapStateToProps)(CustomerFullView))