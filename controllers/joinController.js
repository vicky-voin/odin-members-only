const { body, validationResult } = require("express-validator");
require("dotenv").config();
const db = require("../db/queries");

const passwordValidation = [
  body("password")
    .notEmpty()
    .custom((value, { req }) => {
      return value === process.env.MEMBERS_PW;
    })
    .withMessage("An incorrect secret password was provided"),
];

exports.processMembershipRequest = [
  passwordValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    try {
      if (!req.user) {
        throw Error("Unauthenticated!");
      }

      const result = await db.giveUserMembership(req.user.id);

      if (result[0].id !== req.user.id || !result[0].is_member) {
        console.log(result);
        throw Error("Failed to update membership status");
      }

      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
