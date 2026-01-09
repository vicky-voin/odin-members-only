const { Router } = require("express");
const {
  processMembershipRequest,
  processAdminRequest,
  renderForm,
} = require("../controllers/joinController");

const joinRouter = Router();

joinRouter.get("/", renderForm);

joinRouter.post("/admin", processAdminRequest);
joinRouter.post("/member", processMembershipRequest);

module.exports = joinRouter;
