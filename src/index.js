// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const blockchainRoutes = require('../api/api');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', blockchainRoutes);

app.listen(port, () => {
  console.log(`Blockchain API running on port ${port}`);
});
