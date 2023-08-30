const mongoose = require('mongoose');

const main = function(callback) {
  mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log("Connected to PL database.")
      callback();
    }).catch((e) => {
      console.error(e.message);
    });
}

module.exports = main;