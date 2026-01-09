const db = require("../db/queries");

exports.renderForm = async (req, res) => {
  const message = await db.getMessageWithId(req.params.messageId);
  const result = await db.getUserWithId(message[0].user_id);
  message[0].username = result[0].first_name + " " + result[0].last_name;
  res.render("deleteMessage", { message: message[0] });
};

exports.processDeleteRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw Error("Unauthenticated!");
    }

    await db.deleteMessageWithId(req.params.messageId);

    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
