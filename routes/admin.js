const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { uploadSingle, uploadMultiply } = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router.get("/signin", adminController.viewSign);
router.post("/signin", adminController.actionLogin);
router.use(auth);
router.get("/logout", adminController.logout);
router.get("/dashboard", adminController.viewDashboard);

// area endpoint Category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// area endpoint Bank
router.get("/bank", adminController.viewBank);
router.post("/bank", uploadSingle, adminController.addBank);
router.put("/bank", uploadSingle, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

// area endpoint Item
router.get("/item", adminController.viewItem);
router.get("/item/details/:id", adminController.ItemOne);
router.get("/item/:id", adminController.updateOneItem);
router.put("/item/:id", uploadMultiply, adminController.updateOnePostItem);
router.post("/item", uploadMultiply, adminController.addItem);
router.delete("/item/:id/delete", adminController.deleteItem);

// area endpoint detail item
router.get("/item/show-detail-item/:itemId", adminController.viewDetail);
router.post("/item/add/feature", uploadSingle, adminController.addFeature);
router.put("/item/update/feature", uploadSingle, adminController.updateFeature);
router.delete("/item/:itemId/feature/:id", adminController.deleteFeature);

router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showDetailBooking);
router.put("/booking/:id/confirmation", adminController.confirmation);
router.put("/booking/:id/reject", adminController.rejected);

module.exports = router;
