// 建立專案總路由器：express.Router

// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

// 準備引入路由模組

// 引入 模組程式碼
const home = require("./modules/home");
const todos = require("./modules/todos");
const users = require("./modules/users");
const auth = require("./modules/auth");

// 掛載 middleware
const { authenticator } = require("../middleware/auth");

// 將網址結構符合  字串的 request 導向  模組
router.use("/todos", authenticator, todos); // 加入驗證程序
router.use("/users", users);
router.use("/auth", auth);
//程式是由上而下，所以定義寬鬆的路由引到清單下方
router.use("/", authenticator, home); // 加入驗證程序

// 匯出路由器
module.exports = router; //語法 : module.exports = 任何資料型別
