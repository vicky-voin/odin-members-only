const { Router } = require("express");
const {
  renderForm,
  processNewMessage,
} = require("../controllers/newController");

const newRouter = Router();

newRouter.get("/", renderForm);
newRouter.post("/", processNewMessage);

module.exports = newRouter;
