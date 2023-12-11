const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const db = process.env.CONNECT.replace('<%PASSWORD%>', process.env.DB_PASSWORD);
// console.log(db);
mongoose.connect(db).then(connection => {
  // console.log(connection);
  console.log('Database connection established');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
