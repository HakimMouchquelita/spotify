const mongoose = require("mongoose");


// Connect to the database
module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    userUnifiedTopology: true,
  };
  try {
    await mongoose.connect(process.env.DB_CONNECT, connectionParams);
    console.log("Connected to database succesfully");
  } catch (error) {
    console.log(`Error connecting to database: ${error}`);
  }
};
