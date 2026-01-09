const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

exports.renderForm = (req, res) => {
  res.render("newMessage");
};

const messageValidation = [
  body("message").notEmpty().withMessage("Please enter a message"),
];

exports.processNewMessage = [
  messageValidation,
  async (req, res, next) => {
    const errors = validationResult(req);

    try {
      if (!req.user) {
        throw Error("Unauthenticated!");
      }

      if (!errors.isEmpty()) {
        return res.status(400).render("newMessage", { errors: errors.array() });
      }

      await db.addMessage(matchedData(req).message, req.user.id);

      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
