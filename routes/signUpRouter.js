const { Router } = require("express");
const { processSignUp } = require("../controllers/signUpController");

const signUpRouter = Router();

signUpRouter.get("/", (req, res) => {
  res.render("sign-up");
});

signUpRouter.post("/", processSignUp);

module.exports = signUpRouter;
