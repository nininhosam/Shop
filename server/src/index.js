require('dotenv').config({ path: 'server/.env' });
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
app.use(routes);
app.listen(process.env.PORT, () => {
  console.log(`Server Started on port: ${process.env.PORT}`);
});
