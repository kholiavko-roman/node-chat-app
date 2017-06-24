exports.post = (req, res) => {
	req.session.destroy();
	res.json({ success: 1 });
};