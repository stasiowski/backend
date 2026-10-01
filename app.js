const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

logger.info("connecting to", config.uri);

mongoose
  .connect(config.uri, { family: 4 })
  .then(console.log("connected to mongoDB"))
  .catch((error) => logger.error(error));

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/testing", testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;
