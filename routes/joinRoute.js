const { Router } = require("express");
const { processMembershipRequest } = require("../controllers/joinController");

const joinRouter = Router();

joinRouter.get("/", (req, res) => {
  res.render("join");
});

joinRouter.post("/", processMembershipRequest);

module.exports = joinRouter;
