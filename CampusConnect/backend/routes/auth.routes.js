const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const c = require("../controllers/auth.controller");

router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }).withMessage("Name too short"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password ≥ 6 chars"),
  ],
  validate,
  c.register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  c.login
);

router.post("/refresh", c.refresh);
router.post("/logout", c.logout);
router.get("/me", protect, c.me);

module.exports = router;
