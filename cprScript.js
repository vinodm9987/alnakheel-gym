const fs = require('fs');
const eRevealerGccPath = 'C:/Users/Admin/AppData/Local/Temp';
const FormData = require('form-data');
const { request } = require('http');

function checkFileExists(path) {
  return fs.existsSync(path);
}

if (checkFileExists(eRevealerGccPath)) {
  fs.watch(eRevealerGccPath, async function (event, filename) {
    if (filename === 'eRevealerGcc.xml' && event === 'change') {
      try {
        const readStream = fs.createReadStream(eRevealerGccPath + '/' + filename);
        const form = new FormData();
        form.append('photo', readStream);
        const req = request(
          {
            host: '192.168.0.76',
            port: '5600',
            path: '/api/cpr/uploadCpr',
            method: 'POST',
            headers: form.getHeaders(),
          },
          response => {
            console.log(response.statusCode); // 200
          }
        );
        form.pipe(req);

        // var newFile = await fs.readFile('C:/Users/Admin/AppData/Local/Temp/eRevealerGcc.xml',);
        // const form_data = new FormData();
        // form_data.append("file", newFile);
        // form_data.append("data", 'test');
        // const headers = { "Content-Type": "multipart/form-data" };
        // const response = await axios.post('http://localhost:5600/api/cpr/uploadCpr', form_data, headers);
      } catch (error) {
        console.log(error);
      }
    }
  });
}

