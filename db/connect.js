const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose
  .connect(process.env.DB_CONNECT, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("not connected");
  });
