const { dateToHHMM, dateToDDMMYYYY } = require("./timeFormate.util");

exports.getUpdatedValue = (newData, oldData) => {
    if (oldData) {
        var keys = Object.keys(newData);
        let newValues = Object.assign({}, {});
        let oldValues = Object.assign({}, {});
        keys.map(key => {
            var result = this.getValue(oldData, key)
            if (key.toLowerCase().includes('date')) {
                if (result !== null && result !== undefined && typeof result === typeof new Date(newData[key]) && new Date(newData[key]).getTime() !== result.getTime()) {
                    newValues[this.getFormattedText(key)] = dateToDDMMYYYY(new Date(newData[key]))
                    oldValues[this.getFormattedText(key)] = dateToDDMMYYYY(new Date(result))
                }
            } else if (key.toLowerCase().includes('time')) {
                if (result !== null && result !== undefined && typeof result === typeof new Date(newData[key]) && new Date(newData[key]).getTime() !== result.getTime()) {
                    newValues[this.getFormattedText(key)] = dateToHHMM(new Date(newData[key]))
                    oldValues[this.getFormattedText(key)] = dateToHHMM(new Date(result))
                }
            } else {
                if (result !== null && result !== undefined && typeof result === typeof newData[key] && newData[key] !== result) {
                    newValues[this.getFormattedText(key)] = newData[key]
                    oldValues[this.getFormattedText(key)] = result
                }
            }
        })
        return { newValues, oldValues }
    } else {
        let newValues = this.getKey(newData)
        return { newValues }
    }
}

exports.getKey = (newData) => {
    let newValues = Object.assign({}, {});
    Object.keys(newData).forEach(key => {
        if (newData[key] instanceof Object) newData[key] = this.getKey(newData[key])
        else if (key.toLowerCase().includes('date')) newData[key] = dateToDDMMYYYY(new Date(newData[key]))
        else if (key.toLowerCase().includes('time')) newData[key] = dateToHHMM(new Date(newData[key]))
        else if (key === '_id') delete newData[key]
        else if (newData[key].length === 24) delete newData[key]
        else if (newData[key] instanceof Array) delete newData[key]
    })
    Object.keys(newData).forEach(key => {
        newValues[this.getFormattedText(key)] = newData[key]
    })
    return newValues
}

exports.getValue = (oldData, key) => {
    if (oldData instanceof Array) {
        for (var i = 0; i < oldData.length; i++) {
            let result = this.getValue(oldData[i], key);
            if (result) return result
        }
    } else {
        for (var prop in oldData) {
            if (prop === key) {
                return oldData[prop]
            } else if (prop !== '_id' && prop !== '__proto__' && prop !== key && (oldData[prop] instanceof Object || oldData[prop] instanceof Array)) {
                let result = this.getValue(oldData[prop], key);
                if (result) return result
            }
        }
    }
    return null
}


exports.getFormattedText = (str) => {
    return str.replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, ' $1').replace(/^./, s => s.toUpperCase())
}

exports.getFormattedObject = (obj) => {
    let formattedObj = {}
    Object.keys(obj).forEach(key => {
        formattedObj[this.getFormattedText(key)] = obj[key]
    })
    return formattedObj
}
