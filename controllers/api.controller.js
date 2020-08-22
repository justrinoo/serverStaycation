const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Treveller = require("../models/Booking");
const Category = require("../models/Category");

module.exports = {
	landingPage: async (req, res, next) => {
		try {
			const mostpicked = await Item.find()
				.select("_id title price city price unit imageId")
				.populate({ path: "imageId", select: "_id imageUrl" })
				.limit(5);
			const treveler = await Treveller.find();
			const treasure = await Treasure.find();
			const city = await Item.find();

			const categories = await Category.find()
				.select("_id name ")
				.populate({
					path: "itemId",
					select: '"_id title imageId country city isPopular"',
					populate: {
						path: "imageId",
						select: "_id imageUrl",
						perDocumentLimit: 1,
					},
					perDocumentLimit: 4,
				});
			res.status(200).json({
				hero: {
					treveller: treveler.length,
					treasure: treasure.length,
					city: city.length,
				},
				mostpicked,
				categories,
			});
		} catch (error) {
			next(error);
		}
	},
};
