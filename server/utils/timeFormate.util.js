exports.setTime = (date) => {
    if (date) {
        var myDate = new Date(date);
        myDate.setHours(0, 0, 0, 0)
        return myDate.toISOString()
    }
};


exports.convertToDate = (date) => {
    if (date) {
        var [day, month, year] = new Date(date).toLocaleDateString().split('/');
        var newDate = new Date(year, month - 1, new Date(date).getDate() === day ? day + 1 : day)
        return newDate.toISOString()
    }
};


exports.setHourTo = (date) => {
    if (date) {
        var myDate = new Date(date);
        myDate.setHours(23, 59)
        return myDate.toISOString()
    }
};



exports.convertTo24Hour = (time) => {
    var hours = parseInt(time.substr(0, 2));

    if (time.indexOf('am') !== -1 && hours === 12) {
        time = time.replace('12', '0');
    }
    if (time.indexOf('pm') !== -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '');
};




exports.convertToMinute = (hms) => {
    var a = hms.split(':');
    var minutes = (+a[0]) * 60 + (+a[1]);
    return minutes;
};



exports.getAllEqualTime = (date, date1, interval) => {
    let newDate = new Date(date).getTime();
    let newDate1 = new Date(date1).getTime();
    let diff = parseInt((newDate1 - newDate) / interval);
    let arr = [new Date(newDate)]
    for (let i = 1; i < interval; i++) {
        newDate += diff;
        arr.push(new Date(newDate));
    }
    return arr;
};


exports.getIncrementEqualTime = (date, date1, interval) => {
    let from = new Date(new Date(date).setMilliseconds(0)).setSeconds(0);
    let to = new Date(new Date(date1).setMilliseconds(0)).setSeconds(0);
    let arr = [];
    while (from <= to) {
        let data = new Date(new Date(from).setMinutes(new Date(from).getMinutes() + interval)).getTime()
        from = data
        arr.push(new Date(data))
    }
    return arr;
};

exports.formateBioStarDate = (date) => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() < 9 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
    let dateOfDay = newDate.getDate();
    return `${year}-${month}-${dateOfDay}T23:00:00.007Z`
};


exports.checkDateInBetween = (check, start, end) => {
    const checkDate = new Date(check).getTime();
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    return (checkDate <= endDate && checkDate >= startDate);
};


exports.dateToDDMMYYYY = (date) => {
    var dateStart = new Date(date)
    if (dateStart instanceof Date && !isNaN(dateStart)) {
      return `${("0" + (dateStart.getDate())).slice(-2)}/${("0" + (dateStart.getMonth() + 1)).slice(-2)}/${dateStart.getFullYear()}`
    } else {
      return ''
    }
  }
  
  exports.dateToHHMM = (date) => {
    var dateStart = new Date(date)
    if (dateStart instanceof Date && !isNaN(dateStart)) {
      return `${dateStart.toLocaleTimeString('en-US').slice(0, -6)} ${dateStart.toLocaleTimeString('en-US').slice(-2)}`
    } else {
      return ''
    }
  }