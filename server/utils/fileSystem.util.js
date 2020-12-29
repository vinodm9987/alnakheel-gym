const fs = require('fs')

exports.base64Encode = (file) => {
    var bitmap = fs.readFileSync(file);
    return bitmap.toString('base64');
}