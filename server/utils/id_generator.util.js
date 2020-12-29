const { Counter } = require('../model')

exports.createId = async (felid) => {
    let counter = await Counter.findOne({})
    if (counter) {
        let obj = {};
        let felidObj = {};
        felidObj[felid] = 1;
        obj["$inc"] = felidObj;
        let response = await Counter.findByIdAndUpdate(counter._id, obj, { new: true });
        return response;
    } else {
        let obj = {};
        obj[felid] = 2
        let newCounter = new Counter(obj);
        const response = await newCounter.save();
        return response
    }
};


exports.makeCode = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


exports.getNoPointToIncrease = (amount, noOfPoints, paidAmount) => {
    // let count = 1;
    // for (let i = 1; i < paidAmount; i += amount) {
    //     count++;
    // }
    return Math.round((noOfPoints * paidAmount) / amount);
}


exports.generateOrderId = (date) => {
    let now = date
        ? new Date(date).getTime().toString()
        : Date.now().toString();

    // pad with additional random digits
    if (now.length < 14) {
        const pad = 14 - now.length;
        now += this.randomNumber(pad);
    }

    // split into xxxx-xxxxxx-xxxx format
    return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join('-');
}

exports.getTime = (id) => {
    let res = id.replace(/-/g, '');
    res = res.slice(0, 13);
    res = parseInt(res, 10);
    return res;
}

exports.randomNumber = (length) => {
    return Math.floor(
        Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    ).toString();
}