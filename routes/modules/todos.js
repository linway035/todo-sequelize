// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
// 引用 Todo model (與mongoose不同方法)
const db = require("../../models");
const Todo = db.Todo;

//展現Create頁面
router.get("/new", (req, res) => {
  return res.render("new");
});

//Create後表單回傳至首頁
router.post("/", (req, res) => {
  const UserId = req.user.id; //(與m不同).id不加底線
  const name = req.body.name; //從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name, UserId }) //{name:name} //存入資料庫  //依使用者新增至資料庫
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.log(error));
});

//展項各id的detail頁面
router.get("/:id", (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  //根據使用者而顯示不同
  return Todo.findOne({
    where: { id, UserId },
  })
    .then((todo) => res.render("detail", { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});

//展項各id的edit頁面
router.get("/:identity/edit", (req, res) => {
  const UserId = req.user.id; //(與m不同).id不加底線
  const id = req.params.identity;
  return (
    Todo.findOne({ where: { id, UserId } }) //(與m不同)改用where，id不用底線
      // .lean() (與m不同)不用lean
      .then((todo) => res.render("edit", { todo: todo.get() })) //(與m不同).get()
      .catch((error) => console.log(error))
  );
});

//edit後表單回傳至各id明細頁面
router.put("/:identity", (req, res) => {
  const UserId = req.user.id; //(與m不同).id不加底線
  const id = req.params.identity;
  const { name, isDone } = req.body;
  return Todo.findOne({ where: { id, UserId } }) //查詢資料 //(與m不同)改用where，id不用底線
    .then((todo) => {
      //若成功查詢
      todo.name = name; //重新賦值 (=修改)
      todo.isDone = isDone === "on"; //即為 todo.isDone =true ,or todo.isDone =false
      return todo.save(); //存檔
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error)); //中途任一時點失敗就回傳error
});

//delete後回首頁
router.delete("/:identity", (req, res) => {
  const UserId = req.user.id; //(與m不同).id不加底線
  const id = req.params.identity;
  return Todo.findOne({ where: { id, UserId } }) //(與m不同)改用where，id不用底線
    .then((todo) => todo.destroy()) //(與m不同)用destroy
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
