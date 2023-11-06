const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const download_image = require('../utils/download_image');

//production
const imageUrl = 'http://167.172.53.19:8000';
const url = 'http://167.172.53.19:8000/';
const hostURL = 'https://167.172.53.19:5000';

router.use(fileUpload({ createParentPath: true }));

router.post('/', async (req, res) => {
  console.log('post');
  console.log(req.files);
  const nexturl = url + 'upload-national-api/';
  console.log('url', nexturl);
  const method = req.method.toLocaleUpperCase();
  console.log('method', method);
  const headers = req.headers;
  console.log('headers', headers);
  const data = req.body;
  console.log('data', data);

  const form = new FormData();
  Object.entries(req.files).forEach(([key, value], index) => {
    form.append(key, value.data, { filename: value.name });
  });
  try {
    const response = await axios.post(nexturl, form, {
      headers: {
        ...form.getHeaders(),
        authorization: headers.authorization,
        // include any other headers needed
      },
    });
    console.log('response', response.data);

    let PreName = new Date().getTime();
    download_image(response.data.front.face_photo, 'public/images/' + PreName + 'face_id.jpeg');
    download_image(imageUrl + response.data.front_img, 'public/images/' + PreName + 'front.jpg');
    download_image(imageUrl + response.data.back_img, 'public/images/' + PreName + 'back.jpg');

    response.data.front.face_photo = hostURL + '/images/' + PreName + 'face_id.jpeg';
    response.data.front_img_node = hostURL + '/images/' + PreName + 'front.jpg';
    response.data.back_img_node = hostURL + '/images/' + PreName + 'back.jpg';
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
