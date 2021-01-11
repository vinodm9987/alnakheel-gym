import { isValidPhoneNumber } from 'react-phone-number-input';
import { store } from '../../store';


export const validator = (e, type, fieldName, error, empty) => {
  var emailVer = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var numberVer = /^[0-9]*$/
  var value, valueE, valueD = {}
  if (fieldName === 'text') {
    value = {
      [type]: e.target.value
    }
    if (e.target.value === '' && !empty) {
      valueE = {
        [type + 'E']: error ? error[0] || 'This field is required' : 'This field is required'
      }
    } else if (empty && !e.target.value) {
      valueE = {
        [type + 'E']: ''
      }
    } else {
      valueE = {
        [type + 'E']: ''
      }
    }
  } else if (fieldName === 'number') {
    value = {
      [type]: e.target.value
    }
    if (e.target.value === '' && !empty) {
      valueE = {
        [type + 'E']: error ? error[0] || 'This field is required' : 'This field is required'
      }
    } else if (empty && !e.target.value) {
      valueE = {
        [type + 'E']: ''
      }
    } else {
      if (!numberVer.test(e.target.value)) {
        valueE = {
          [type + 'E']: error ? error[1] || 'This field is required' : 'This field is required'
        }
      } else {
        valueE = {
          [type + 'E']: ''
        }
      }
    }
  } else if (fieldName === 'numberText') {
    value = {
      [type]: e.target.value ? Math.abs(e.target.value) : e.target.value
    }
    if (!e.target.value && !empty) {
      valueE = {
        [type + 'E']: error ? error[0] || 'This field is required' : 'This field is required'
      }
    } else if (empty && !e.target.value) {
      valueE = {
        [type + 'E']: ''
      }
    } else {
      valueE = {
        [type + 'E']: ''
      }
    }
  } else if (fieldName === 'date') {
    value = {
      [type]: e
    }
    valueE = {
      [type + 'E']: ''
    }
  } else if (fieldName === 'email') {
    value = {
      [type]: e.target.value
    }
    if (e.target.value === '' && !empty) {
      valueE = {
        [type + 'E']: error ? error[0] || 'This field is required' : 'This field is required'
      }
    } else if (empty && !e.target.value) {
      valueE = {
        [type + 'E']: ''
      }
    } else {
      if (!emailVer.test(e.target.value)) {
        valueE = {
          [type + 'E']: error ? error[1] || 'This field is required' : 'This field is required'
        }
      } else {
        valueE = {
          [type + 'E']: ''
        }
      }
    }
  } else if (fieldName === 'photo') {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type.split('/')[0] === 'image') {
        value = {
          [type]: e.target.files[0]
        }
        valueE = {
          [type + 'E']: ''
        }
        valueD = {
          [type + 'D']: URL.createObjectURL(e.target.files[0])
        }
      } else {
        value = {
          [type]: null
        }
        valueE = {
          [type + 'E']: error ? error[0] || 'This field is required' : 'This field is required'
        }
        valueD = {
          [type + 'D']: ''
        }
      }
      document.getElementById(e.target.id).value = ''
    }
  } else if (fieldName === 'video') {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type.split('/')[0] === 'video') {
        value = {
          [type]: e.target.files[0]
        }
        valueE = {
          [type + 'E']: ''
        }
        valueD = {
          [type + 'D']: URL.createObjectURL(e.target.files[0])
        }
      } else {
        value = {
          [type]: null
        }
        valueE = {
          [type + 'E']: error ? error[0] || 'This field is required' : 'This field is required'
        }
        valueD = {
          [type + 'D']: ''
        }
      }
      document.getElementById(e.target.id).value = ''
    }
  } else if (fieldName === 'doc') {
    if (e.target.files && e.target.files[0]) {
      value = {
        [type]: e.target.files[0]
      }
      valueE = {
        [type + 'E']: ''
      }
      valueD = {
        [type + 'D']: URL.createObjectURL(e.target.files[0])
      }
      document.getElementById(e.target.id).value = ''
    }
  } else if (fieldName === 'mobile') {
    value = {
      [type]: e
    }
    if (e && isValidPhoneNumber(e)) {
      valueE = {
        [type + 'E']: ''
      }
    } else {
      valueE = {
        [type + 'E']: error ? error[0] || 'This field is required' : 'This field is required'
      }
    }
  } else if (fieldName === 'select') {
    value = {
      [type]: e
    }
    valueE = {
      [type + 'E']: ''
    }

  }
  return { ...value, ...valueE, ...valueD }
}


export const dateToDDMMYYYY = (date) => {
  var dateStart = new Date(date)
  if (dateStart instanceof Date && !isNaN(dateStart)) {
    return `${("0" + (dateStart.getDate())).slice(-2)}/${("0" + (dateStart.getMonth() + 1)).slice(-2)}/${dateStart.getFullYear()}`
  } else {
    return ''
  }
}

export const dateToHHMM = (date) => {
  var dateStart = new Date(date)
  if (dateStart instanceof Date && !isNaN(dateStart)) {
    return `${dateStart.toLocaleTimeString('en-US').slice(0, -6)} ${dateStart.toLocaleTimeString('en-US').slice(-2)}`
  } else {
    return ''
  }
}

export const calculateDOB = (date) => {
  var dateStart = new Date(date)
  if (dateStart instanceof Date && !isNaN(dateStart)) {
    var ageDifMs = Date.now() - dateStart.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } else {
    return ''
  }
}

export const calculateDays = (first, second) => {
  var dateStart = new Date(new Date(first).setHours(0, 0, 0, 0))
  var dateEnd = new Date(new Date(second).setHours(0, 0, 0, 0))
  if (dateStart instanceof Date && !isNaN(dateStart) && dateEnd instanceof Date && !isNaN(dateEnd)) {
    return Math.round((dateEnd - dateStart) / (1000 * 60 * 60 * 24))
  } else {
    return 0
  }
}


export const formatAM_PM = (newDate) => {
  var date = new Date(newDate)
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const countHours = (startDate, endDate) => {
  var d1 = new Date(startDate);
  var d2 = new Date(endDate);
  var date = new Date(d2 - d1);
  var hour = date.getUTCHours();
  var min = date.getUTCMinutes();
  return hour + ' Hrs ' + min + ' Mins'
}

export const countHoursGraph = (startDate, endDate) => {
  var d1 = new Date(startDate);
  var d2 = new Date(endDate);
  var date = new Date(d2 - d1);
  var hour = date.getUTCHours();
  var min = date.getUTCMinutes();
  return hour + ':' + min
}


export const monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const weekDaysSmall = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const monthSmallNamesCaps = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']



export const retry = (fn, retriesLeft = 5, interval = 1000) => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }
          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

export const getPageWiseData = (pageNumber, fullData, dataPerPage) => {                // Here value 5 is dataPerPage
  if (!pageNumber) {
    pageNumber = 1
  }
  if (pageNumber && fullData && fullData.length > 0) {
    const pagedData = fullData.filter((data, i) => (data) && (i < (dataPerPage ? dataPerPage * pageNumber : 5 * pageNumber)) && (i >= (dataPerPage ? dataPerPage * (pageNumber - 1) : 5 * (pageNumber - 1))))
    return pagedData
  } else {
    return []
  }
}

export const timeDiffCalc = (dateFuture, dateNow) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  let difference = '';
  if (days) difference += (days === 1) ? `${days} day, ` : `${days} days, `;
  if (hours) difference += (hours === 1) ? `${hours} hour, ` : `${hours} hours, `;
  if (minutes) difference += (minutes === 1) ? `${minutes} minute` : `${minutes} minutes`;
  if (!days && !hours && !minutes) difference += 'now'
  return difference.split(',')[0];
}

export const scrollToTop = () => {
  document.getElementById('NotTop').scrollTo(0, 0)
}

export const setTime = (date) => {
  if (date) {
    var myDate = new Date(date);
    myDate.setHours(0, 0, 0, 0)
    return myDate.toISOString()
  }
};

let inDebounce = {};
window.dispatchWithDebounce = (fn, delay = 800) => {
  return args => {
    clearTimeout(inDebounce[fn.name]);
    inDebounce[fn.name] = setTimeout(() => store.dispatch(fn(args)), delay);
  }
}


export const minimiseOrderNo = (orderNo) => {
  if (orderNo) {
    return parseInt(orderNo.split('-').join('')).toString(36).toUpperCase()
  } else {
    return ''
  }
}


export const getDataUri = (url, tabledData, reportName, fromDate, toDate, branchName, description, language, cb) => {
  var image = new Image();
  image.setAttribute('crossOrigin', 'anonymous'); //getting images from external domain

  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;

    //next three lines for white background in case png has a transparent background
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';  /// set white fill style
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.getContext('2d').drawImage(this, 0, 0);

    url ? cb(canvas.toDataURL('image/jpeg'), tabledData, reportName, fromDate, toDate, branchName, description, language)
      : cb(null, tabledData, reportName, fromDate, toDate, branchName, description, language)
  };

  image.src = url;
}