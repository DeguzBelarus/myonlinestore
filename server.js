require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const sequelize = require("./sequelize");
const dbmodels = require("./models/dbmodels");
const router = require("./routes/index");
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);
app.use(errorHandlingMiddleware);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (request, response) => {
    response.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

(async function () {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(
        "\x1b[40m\x1b[32m\x1b[4m\x1b[1m",
        `Server has been started on port ${PORT}...`
      );
    });
  } catch (exception) {
    console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
  }
})();
