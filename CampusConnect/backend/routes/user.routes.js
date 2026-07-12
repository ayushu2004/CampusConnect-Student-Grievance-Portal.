const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const c = require("../controllers/user.controller");

router.use(protect);

router.patch("/me", c.updateMe);

router.get("/", authorize("admin"), c.list);
router.patch("/:id/role", authorize("admin"), c.updateRole);
router.delete("/:id", authorize("admin"), c.remove);

module.exports = router;
