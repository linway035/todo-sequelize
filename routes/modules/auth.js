const express = require("express");
const router = express.Router();

const passport = require("passport");

//向 Facebook 發出請求要求資料，參數scope為資料範圍(optional)
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

//Facebook 把資料發回來的地方，這條路由其實和 POST /users/login 差不多。
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

module.exports = router;
