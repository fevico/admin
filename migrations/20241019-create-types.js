module.exports = {
	up: async (queryInterface, Sequelize) => {
		const tableExist = await queryInterface.sequelize.query(
			"SHOW TABLES LIKE 'types'"
		);
		
		// Check if the table exists first
		if (tableExist[0].length === 0) {
			return queryInterface.createTable('types', {
				type: {
					type: Sequelize.ENUM('super_admin', 'admin', 'user', 'customer', 'supplier', 'SP'), // Match ENUM values with DDL
					allowNull: false,
					primaryKey: true,  // Make `type` the primary key as per your model
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: true,
					defaultValue: null,
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: true,
					defaultValue: null,
				},
			});
		} else {
			console.log("Table 'types' already exists!");
		}
	},

	down: async (queryInterface, Sequelize) => {
		const tableExist = await queryInterface.sequelize.query(
			"SHOW TABLES LIKE 'types'"
		);

		if (tableExist[0].length > 0) {
			return queryInterface.dropTable('types');
		} else {
			console.log("Table 'types' does not exist, cannot be dropped.");
		}
	}
};
