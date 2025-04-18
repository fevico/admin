

const fs = require('fs');
const path = require('path');
const { host } = require('pg/lib/defaults');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`);
const db = {};

let sequelize;
	sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
		host:  config.development.host,
		dialect: config.development.dialect
	});

fs
	.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach((file) => {
		const model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
