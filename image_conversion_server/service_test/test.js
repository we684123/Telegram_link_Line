var fs = require('fs');
const fetch = require('node-fetch');

let media_id = 1
let local_path = '.\\image_conversion_server\\test\\'
let file_name = 'sticker.webp'
let file_path = local_path + file_name
var media_blob2 = fs.readFileSync(file_path)

var er = fs.readFile(file_path, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        console.log(data.length + ' bytes');
    }
});

let new_format = 'png'

var payload = {
  "media_id": String(media_id),
  "media_blob": er,
  "new_format": String(new_format),
  "agree_server_save": false,
}
let data = {
  "method": "post",
  "payload": payload
}

let conservion_blob4 = fetch('http://127.0.0.1:5000/media_conversion', data);
