module.exports = {
	// generate random string
	generateString() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 6; i += 1) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},

	removeLeadingZero(str) {
		if (str.charAt(0) === '0') {
			return str.substring(1);
		}
		return str;
	},
	
};
