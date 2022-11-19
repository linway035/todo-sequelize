const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 3000;

const db = require("./models");
const Todo = db.Todo;
const User = db.User;

// 載入設定檔，要寫在 express-session 以後
const usePassport = require("./config/passport"); //載入一包 Passport 設定檔
const passport = require("passport"); //把 Passport 套件本身載入進來

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
