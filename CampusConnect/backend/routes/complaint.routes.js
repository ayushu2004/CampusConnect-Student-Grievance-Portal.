const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");
const c = require("../controllers/complaint.controller");

router.use(protect);

router.get("/", c.list);
router.get("/:id", c.getOne);

router.post(
  "/",
  [
    body("title").isLength({ min: 4, max: 140 }),
    body("description").isLength({ min: 10, max: 4000 }),
    body("category").isString().notEmpty(),
  ],
  validate,
  c.create
);

router.post("/:id/responses", c.addResponse);
router.post("/:id/upvote", c.toggleUpvote);

router.patch("/:id/status", authorize("admin", "faculty"), c.updateStatus);
router.delete("/:id", c.remove);

module.exports = router;
