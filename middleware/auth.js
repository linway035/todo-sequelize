//這個設定檔會匯出一個物件，物件裡是一個叫做 authenticator 的函式。
module.exports = {
  authenticator: (req, res, next) => {
    //req.isAuthenticated() 是 Passport.js 提供的函式，會根據 request 的登入狀態回傳 true 或 false。
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("warning_msg", "請先登入才能使用！");
    res.redirect("/users/login");
  },
};
//掛在總路由index.js，而不是在app.js

// 在login表單中，設定當auth.js收到未登入狀態的req時則使用req.flash，經由app.js中寫好的res.locals = req.flash 接力傳送給前端，最後使用res.redirect導回login頁面並顯示提醒字樣給使用者。

//而register表單中，因為一次有較多的資料需要驗證並提醒使用者，若使用上述login表單的方式，每當有一個錯誤訊息就redirect一次，相對不夠簡便(且若有2個以上的錯誤訊息則會redirect兩次以上)。因此使用errors變數將所有的錯誤訊息都包裝起來，最後以res.render傳送給前端的register樣版一併渲染出來。
