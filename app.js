const express = require('express');
const cors = require('cors');

const app = express();
const appMid = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

appMid.use(express.json());
appMid.use(express.urlencoded({ extended: true }));
appMid.use(cors());

const uploadRoute = require('./routes/upload');
appMid.use('/proxy/:url/upload-national-api/', uploadRoute);

const addInfoRoute = require('./routes/addInfo');
appMid.use('/proxy/:url/add-info-api/', addInfoRoute);

const searchFileRoute = require('./routes/searchFile');
appMid.use('/proxy/:url/id_dashboard_search_file_api/', searchFileRoute);

app.use('/api', appMid);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
