const { Router } = require("express");
const {
  renderForm,
  processDeleteRequest,
} = require("../controllers/deleteController");

const deleteRouter = Router();

deleteRouter.get("/:messageId", renderForm);
deleteRouter.post("/:messageId", processDeleteRequest);

module.exports = deleteRouter;
