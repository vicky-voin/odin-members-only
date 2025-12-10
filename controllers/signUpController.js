const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");

const validateUserData = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty")
    .isAlpha()
    .withMessage("Frist name must only contain alphabet characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("First name must be between 1 and 255 characters long"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty")
    .isAlpha()
    .withMessage("Last name must only contain alphabet characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("Last name must be between 1 and 255 characters long"),
  body("username")
    .trim()
    .isEmail()
    .withMessage("Username must be a valid email"),
  body("password")
    .trim()
    .isStrongPassword({
      minSymbols: 0,
    })
    .withMessage(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number"
    ),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords must match"),
];

exports.processSignUp = [
  validateUserData,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    try {
      let userData = matchedData(req);

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      await db.registerNewUser(userData);

      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
