module.exports = (sequelize, DataTypes) => {
	const Permissions = sequelize.define('Permissions', {
	  id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	  },
	  name: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
		comment: 'Unique name of the permission (e.g., view_users, edit_users)',
	  },
	  description: {
		type: DataTypes.STRING(255),
		allowNull: true,
		comment: 'Description of the permission',
	  },
	  created_at: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	  },
	  updated_at: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	  },
	  deleted_at: {
		type: DataTypes.DATE,
		allowNull: true,
	  },
	}, {
	  paranoid: true,
	  timestamps: true,
	  tableName: 'permissions', // Explicit table name for clarity
	});
  
	Permissions.associate = function (models) {
	  // Many-to-many with Roles via role_permissions
	  Permissions.belongsToMany(models.Roles, {
		through: 'role_permissions',
		foreignKey: 'permission_id',
		otherKey: 'roleName', // Matches Roles model primary key
	  });
	  // Many-to-many with users via user_permissions
	  Permissions.belongsToMany(models.users, {
		through: 'user_permissions',
		foreignKey: 'permission_id',
		otherKey: 'id', // Matches users model primary key
	  });
	};
  
	return Permissions;
  };