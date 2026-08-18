const express = require("express");
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);

module.exports = router;
