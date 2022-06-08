const path = require("path");
const { engine } = require("express-handlebars");

module.exports = (app) => {
  app.engine(
    "handlebars",
    engine({
      layoutsDir: path.join(__dirname, "../views/layout"),
      partialsDir: path.join(__dirname, "../views/partials"),
      defaultLayout: "index"
    })
  );
  app.set("view engine", "handlebars");
};