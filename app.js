const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const routes = require("./routes"); //refactor時加上

// 載入設定檔，要寫在 express-session 以後
const usePassport = require("./config/passport"); //載入一包 Passport 設定檔
//這兩個放const的最後
const app = express();
const PORT = process.env.PORT;

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app);

// 掛載套件
app.use(flash());

//使用 app.use 代表這組 middleware 會作用於所有的路由
app.use((req, res, next) => {
  // console.log(req.user); //在反序列化的時候，取出的 user 資訊
  // {
  // _id: 6360d8d82f2cdb12c0beb392,
  // name: 'lin',
  // email: 'wa@gmail.com',
  // password: 'WmRL.4BXUjbAN',
  // createdAt: 2022-11-01T08:29:12.292Z,
  // __v: 0
  // }
  res.locals.isAuthenticated = req.isAuthenticated(); //把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
  res.locals.user = req.user; //把使用者資料交接給 res 使用
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next(); //res.locals：所有樣板都可以使用的變數，放在 res.locals 裡的資料，所有的 view 都可以存取。
});

// refactor時加上，將 request 導入路由器
app.use(routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
