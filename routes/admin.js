const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { uploadSingle, uploadMultiply } = require("../middlewares/multer");
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

router.get("/booking", adminController.viewBooking);

module.exports = router;
