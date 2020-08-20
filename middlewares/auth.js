const isLogin = (req, res, next) => {
	if (req.session.user == null || req.session.user == undefined) {
		req.flash("alertMessage", "Session Expired, please login first!!");
		req.flash("alertStatus", "danger");
		res.status(404);
		res.redirect("/admin/signin");
	} else {
		next();
	}
};

module.exports = isLogin;
