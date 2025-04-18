

require('dotenv').config();

// config.js
module.exports = {
	app: {
		port: process.env.DEV_APP_PORT || 2000,
		appName: process.env.APP_NAME || 'S&S Admin',
		env: process.env.NODE_ENV || 'development',
	},
	db: {
		port: process.env.DB_PORT || 3306,
		database: process.env.DB_DATABASE || 'screwsspanners',
		password: process.env.DB_PASSWORD || 'FileOpen@2022',
		username: process.env.DB_USER || 'mysql',
		host: process.env.DB_HOST || '127.0.0.1',
		dialect: 'mysql',
		logging: true,
	},
	winiston: {
		logpath: '/iLrnLogs/logs/',
	},
	auth: {
		jwt_secret: process.env.JWT_SECRET || '2y$10$K1ZXnbnav36NDofMwis.O69nRX9RHkjsr9MVHtfI5idStzpM3Wu',
		jwt_expiresin: process.env.JWT_EXPIRES_IN || '1d',
		saltRounds: process.env.SALT_ROUND || 10,
		refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'VmVyeVBvd2VyZnVsbFNlY3JldA==',
		refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || '2d', // 2 days
	},
	sendgrid: {
		api_key: process.env.SEND_GRID_API_KEY,
		api_user: process.env.USERNAME,
		from_email: process.env.FROM_EMAIL || 'alaa.mezian.mail@gmail.com',
	},

};
