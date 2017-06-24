exports.get = (req, res) => {
	res.render('index', {
		title: 'Express',
		heading2: '<h2>heading 2</h2>'
	});
}