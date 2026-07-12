const router = require("express").Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/stats.controller");

router.use(protect);
router.get("/overview", c.overview);

module.exports = router;
