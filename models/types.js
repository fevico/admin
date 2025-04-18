module.exports = (sequelize, DataTypes) => {
	const Type = sequelize.define('Type', {
		type: {
			type: DataTypes.ENUM('super_admin', 'admin', 'user', 'customer', 'supplier', 'SP'),
			allowNull: false,
			primaryKey: true,
		}
	}, {
		timestamps: false, // Disable timestamps for this model
	});

	Type.associate = function(models) {
		// Define associations if needed
	};

	return Type;
};
