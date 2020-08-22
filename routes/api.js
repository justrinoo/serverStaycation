const router = require("express").Router();
// const { uploadSingle, uploadMultiply } = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const apiController = require("../controllers/api.controller");

router.get("/landing-page", apiController.landingPage);

module.exports = router;
