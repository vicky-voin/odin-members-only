const { body, validationResult } = require("express-validator");
require("dotenv").config();
const db = require("../db/queries");

const memberPasswordValidation = [
  body("password")
    .notEmpty()
    .custom((value, { req }) => {
      return value === process.env.MEMBERS_PW;
    })
    .withMessage("An incorrect secret password was provided"),
];

const adminPasswordValidation = [
  body("password")
    .notEmpty()
    .custom((value, { req }) => {
      return value === process.env.ADMIN_PW;
    })
    .withMessage("An incorrect secret password was provided"),
];

exports.processMembershipRequest = [
  memberPasswordValidation,
  async (req, res, next) => {
    const errors = validationResult(req);

    try {
      if (!req.user) {
        throw Error("Unauthenticated!");
      }

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .render("join", { user: req.user, errors: errors.array() });
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

exports.processAdminRequest = [
  adminPasswordValidation,
  async (req, res, next) => {
    const errors = validationResult(req);

    try {
      if (!req.user) {
        throw Error("Unauthenticated!");
      }

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .render("join", { user: req.user, errors: errors.array() });
      }

      const result = await db.makeUserAdmin(req.user.id);

      if (result[0].id !== req.user.id || !result[0].is_member) {
        console.log(result);
        throw Error("Failed to update admin status");
      }

      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

exports.renderForm = [
  (req, res, next) => {
    try {
      if (!req.user) {
        throw Error("Unauthenticated!");
      }

      res.render("join", { user: req.user });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
