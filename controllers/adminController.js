const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");
module.exports = {
	viewDashboard: (req, res) => {
		res.render("admin/dashboard/view_dashboard", {
			title: "Staycation | Dashboard",
		});
	},
	viewCategory: async (req, res) => {
		try {
			const alertMessage = req.flash("alertMessage");
			const alertStatus = req.flash("alertStatus");
			const alert = { message: alertMessage, status: alertStatus };
			const category = await Category.find();
			res.render("admin/category/view_category", {
				category,
				alert,
				title: "Staycation | Category",
			});
		} catch (error) {
			res.redirect("/admin/category");
		}
	},
	addCategory: async (req, res) => {
		try {
			const { name } = req.body;
			await Category.create({ name });
			req.flash("alertMessage", "Success Add Category");
			req.flash("alertStatus", "success");
			res.redirect("/admin/category");
		} catch (error) {
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
			res.redirect("/admin/category");
		}
	},
	editCategory: async (req, res) => {
		try {
			const { id, name } = req.body;
			req.flash("alertMessage", "Success Update Category");
			req.flash("alertStatus", "success");
			const category = await Category.findById({ _id: id });
			category.name = name;
			await category.save();
			res.redirect("/admin/category");
		} catch (error) {
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
			res.redirect("/admin/category");
		}
	},
	deleteCategory: async (req, res) => {
		try {
			const { id } = req.params;
			req.flash("alertMessage", "Success Delete Category");
			req.flash("alertStatus", "success");
			const category = await Category.findOne({ _id: id });
			await category.remove();
			res.redirect("/admin/category");
		} catch (error) {
			res.redirect("/admin/category");
		}
	},
	viewBank: async (req, res) => {
		try {
			const alertMessage = req.flash("alertMessage");
			const alertStatus = req.flash("alertStatus");
			const bank = await Bank.find();
			const alert = { message: alertMessage, status: alertStatus };
			res.render("admin/bank/view_bank", {
				title: "Staycation | Bank",
				bank,
				alert,
			});
		} catch (error) {
			res.redirect("/admin/bank");
		}
	},
	addBank: async (req, res) => {
		try {
			const { name, nameBank, nomorRekening } = req.body;
			await Bank.create({
				name,
				nameBank,
				nomorRekening,
				imageUrl: `images/${req.file.filename}`,
			});
			req.flash("alertMessage", "Success Add Bank");
			req.flash("alertStatus", "success");
			res.redirect("/admin/bank");
		} catch (error) {
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
			res.redirect("/admin/bank");
		}
	},
	editBank: async (req, res) => {
		try {
			const { id, name, nameBank, nomorRekening } = req.body;
			const bank = await Bank.findOne({ _id: id });
			if (req.file == undefined) {
				bank.name = name;
				bank.nameBank = nameBank;
				bank.nomorRekening = nomorRekening;
				req.flash("alertMessage", "Success Update Bank");
				req.flash("alertStatus", "success");
				await bank.save();
				res.redirect("/admin/bank");
			} else {
				await fs.unlink(path.join(`public/${bank.imageUrl}`));
				bank.name = name;
				bank.nameBank = nameBank;
				bank.nomorRekening = nomorRekening;
				bank.imageUrl = `images/${req.file.filename}`;
				req.flash("alertMessage", "Success Update Bank");
				req.flash("alertStatus", "success");
				await bank.save();
				res.redirect("/admin/bank");
			}
		} catch (error) {
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
			res.redirect("/admin/bank");
		}
	},
	deleteBank: async (req, res) => {
		try {
			const { id } = req.params;
			req.flash("alertMessage", "Success Delete Bank");
			req.flash("alertStatus", "success");
			const bank = await Bank.findOne({ _id: id });
			await bank.remove();
			res.redirect("/admin/bank");
		} catch (error) {
			res.redirect("/admin/bank");
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
		}
	},
	viewItem: async (req, res) => {
		try {
			const category = await Category.find();
			const alertMessage = req.flash("alertMessage");
			const alertStatus = req.flash("alertStatus");
			const alert = { message: alertMessage, status: alertStatus };
			const item = await Item.find()
				.populate({ path: "imageId", select: "id imageUrl " })
				.populate({ path: "categoryId", select: "id name" });

			res.render("admin/item/view_item", {
				title: "Staycation | Item",
				category,
				alert,
				item,
				action: "view",
			});
		} catch (error) {
			res.redirect("/admin/item");
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
		}
	},
	addItem: async (req, res) => {
		try {
			const { categoryId, title, price, city, about } = req.body;
			if (req.files.length > 0) {
				const category = await Category.findOne({ _id: categoryId });
				const newItem = {
					categoryId,
					title,
					description: about,
					price,
					city,
				};
				const item = await Item.create(newItem);
				category.itemId.push({ _id: item._id });
				await category.save();
				for (let i = 0; i < req.files.length; i++) {
					const imageSave = await Image.create({
						imageUrl: `images/${req.files[i].filename}`,
					});
					item.imageId.push({ _id: imageSave._id });
					await item.save();
				}
				req.flash("alertMessage", "Success Add Item");
				req.flash("alertStatus", "success");
				res.redirect("/admin/item");
			}
		} catch (error) {
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
			res.redirect("/admin/item");
		}
	},
	ItemOne: async (req, res) => {
		try {
			const { id } = req.params;
			const alertMessage = req.flash("alertMessage");
			const alertStatus = req.flash("alertStatus");
			const alert = { message: alertMessage, status: alertStatus };
			const item = await Item.findOne({ _id: id }).populate({
				path: "imageId",
				select: "id imageUrl ",
			});

			res.render("admin/item/view_item", {
				title: "Staycation | Show Image Item",
				category,
				alert,
				item,
				action: "show image",
			});
		} catch (error) {
			res.redirect("/admin/item");
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
		}
	},
	updateOneItem: async (req, res) => {
		try {
			const { id } = req.params;
			const category = await Category.find();
			const alertMessage = req.flash("alertMessage");
			const alertStatus = req.flash("alertStatus");
			const alert = { message: alertMessage, status: alertStatus };
			const item = await Item.findOne({ _id: id })
				.populate({
					path: "imageId",
					select: "id imageUrl ",
				})
				.populate({
					path: "categoryId",
					select: "id name",
				});

			res.render("admin/item/view_item", {
				title: "Staycation | Edit Item",
				category,
				alert,
				item,
				action: "edit",
			});
		} catch (error) {
			res.redirect("/admin/item");
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
		}
	},
	updateOnePostItem: async (req, res) => {
		try {
			const { id } = req.params;
			const { categoryId, title, price, city, category, about } = req.body;
			const item = await Item.findOne({ _id: id })
				.populate({
					path: "imageId",
					select: "id imageUrl ",
				})
				.populate({
					path: "categoryId",
					select: "id name",
				});

			if (req.files.length > 0) {
				for (let i = 0; i < item.imageId.length; i++) {
					const imageUpdate = await Image.findOne({ _id: item.imageId[i].id });
					await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
					console.log(imageUpdate);
					imageUpdate.imageUrl = `images/${req.files[i].filename}`;
					await imageUpdate.save();
				}
				item.title = title;
				item.price = price;
				item.city = city;
				item.category = category;
				item.description = about;
				item.categoryId = categoryId;
				await item.save();
				req.flash("alertMessage", "Success Update Items");
				req.flash("alertStatus", "success");
				res.redirect("/admin/item");
			} else {
				item.title = title;
				item.price = price;
				item.city = city;
				item.category = category;
				item.description = about;
				item.categoryId = categoryId;
				await item.save();
				req.flash("alertMessage", "Success Update Items");
				req.flash("alertStatus", "success");
				res.redirect("/admin/item");
			}
		} catch (error) {
			res.redirect("/admin/item");
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
		}
	},
	deleteItem: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id }).populate("imageId");

			for (let i = 0; i < item.imageId.length; i++) {
				Image.findOne({ _id: item.imageId[i]._id })
					.then((resultImage) => {
						fs.unlink(path.join(`public/${resultImage.imageUrl}`));
						Image.remove();
					})
					.catch((err) => {
						res.redirect("/admin/item");
						req.flash("alertMessage", `${err.message}`);
						req.flash("alertStatus", "danger");
					});
			}
			await item.remove();
			req.flash("alertMessage", "Success Delete Items");
			req.flash("alertStatus", "success");
			const itemDelete = await Item.findOne({ _id: id });
			await itemDelete.remove();
			res.redirect("/admin/item");
		} catch (error) {
			res.redirect("/admin/item");
			req.flash("alertMessage", `${error.message}`);
			req.flash("alertStatus", "danger");
		}
	},
	viewBooking: (req, res) => {
		res.render("admin/booking/view_booking", { title: "Staycation | Booking" });
	},
};
