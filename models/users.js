module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('users', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED, // Corrected to BIGINT for id
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		type: {
			type: DataTypes.ENUM('super-admin', 'admin', 'user', 'customer', 'supplier', 'SP'), // Matching the enum values
			defaultValue: 'user',
			allowNull: false,
		},
		firstname: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		avatar_location: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		email_verified_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},
		category_id: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		gender: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		smileid: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		uniq_id: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		is_business_register: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		referral_code: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		phone_code: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		phone: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		device_token: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		otp: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		password_token: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		new_phone: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		password_changed_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},
		active: {
			type: DataTypes.TINYINT.UNSIGNED,
			defaultValue: 1,
			allowNull: false,
		},
		timezone: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		last_login_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		last_login_ip: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		to_be_logged_out: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
			allowNull: false,
		},
		subscribe: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: DataTypes.DATE,
			field: 'updated_at',
		},
		deletedAt: {
			type: DataTypes.DATE,
			field: 'deleted_at',
			allowNull: true,
		},
	}, {
		paranoid: true, // Soft deletes
		timestamps: true, // Enable createdAt and updatedAt
	});

	// Change association to use type instead of role
	Users.associate = function (models) {
		Users.belongsTo(models.Type, {
			foreignKey: 'type',
			targetKey: 'type',
		});
	};

	return Users;
};
