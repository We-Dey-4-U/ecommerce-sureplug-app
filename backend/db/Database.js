const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
      useUnifiedTopology: true,
    })
   .then((data) => {
     console.log(`mongod connected with server: ${data.connection.host}`);
   });
   
};

module.exports = connectDatabase;


















//const mongoose = require("mongoose");

//const connectDatabase = () => {
 // mongoose
  //  .connect(process.env.DB_URI, {
  //    useNewUrlParser: true,
   //   useUnifiedTopology: true,
   //   user: process.env.MONGO_USERNAME,
   //   pass: process.env.MONGO_PASSWORD,
   //   ssl: true,
   //   tls: true,
   // })
  //  .then((data) => {
   //   console.log(`MongoDB connected with server: ${data.connection.host}`);
  //  })
  //  .catch((error) => {
  //    console.error(`MongoDB connection error: ${error.message}`);
  //  });
//};

//module.exports = connectDatabase;

















//const mongoose = require("mongoose");

//const connectDatabase = () => {
 // mongoose
 //   .connect(process.env.DB_URL, {
  //    useNewUrlParser: true,
  //    useUnifiedTopology: true,
 //   })
//    .then((data) => {
  //    console.log(`mongod connected with server: ${data.connection.host}`);
 //   });
   
//};

module.exports = connectDatabase;
