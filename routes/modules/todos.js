// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
// 引用 Todo model (與mongoose不同方法)
const db = require("../../models");
const Todo = db.Todo;

//把app都改成router，以及把路由的前綴詞 /todos 刪掉

//展現Create頁面
router.get("/new", (req, res) => {
  return res.render("new");
});

//Create後表單回傳至首頁
router.post("/", (req, res) => {
  const userId = req.user._id; //存使用者ID，下下句用
  const name = req.body.name; //從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name, userId }) //{name:name} //存入資料庫  //依使用者新增至資料庫
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.log("error"));
});

//展項各id的detail頁面
router.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findByPk(id)
    .then((todo) => res.render("detail", { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});

//展項各id的edit頁面
router.get("/:identity/edit", (req, res) => {
  const userId = req.user._id;
  const id = req.params.identity;
  return (
    Todo.findOne({ _id: id, userId })
      .lean()
      .then((todo) => res.render("edit", { todo }))
      // .then((todo) => console.log(todo)) //若想知道為什模要在edit.hbs寫todo.name可以用此查看(前一句需註解調)
      .catch((error) => console.log("error"))
  );
});

//edit後表單回傳至各id明細頁面
router.put("/:identity", (req, res) => {
  const userId = req.user._id;
  const id = req.params.identity;
  const { name, isDone } = req.body;
  return Todo.findOne({ _id: id, userId }) //查詢資料
    .then((todo) => {
      //若成功查詢
      todo.name = name; //重新賦值 (=修改)
      todo.isDone = isDone === "on"; //即為 todo.isDone =true ,or todo.isDone =false
      return todo.save(); //存檔
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log("error")); //中途任一時點失敗就回傳error
});
//解構賦值 (destructuring assignment)
// const name = req.body.name; 可以寫成=> const { name } = req.body;
// const name = req.body.name; const isDone = req.body.isDone; 兩句合併成一句 => const { name, isDone } = req.body

//delete後回首頁
router.delete("/:identity", (req, res) => {
  const userId = req.user._id;
  const id = req.params.identity;
  return Todo.findOne({ _id: id, userId })
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
