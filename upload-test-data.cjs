const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

const form = new FormData();
form.append('file', fs.createReadStream('sample-data/test_data.csv'));
form.append('tableName', 'test_data');
form.append('hasHeaders', 'true');

const options = {
  method: 'POST',
  host: 'localhost',
  port: 3001,
  path: '/api/v1/upload/preview',
  headers: form.getHeaders()
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
});

form.pipe(req);
req.on('error', (e) => console.error('Error:', e));
