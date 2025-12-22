const { Router } = require("express");
const loadAllMessages = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  const messages = await loadAllMessages(req.user);
  res.render("index", { user: req.user, messages: messages });
});

module.exports = indexRouter;
