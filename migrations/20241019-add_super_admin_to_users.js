module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Alter the users table to add 'super_admin' to the type enum
      await queryInterface.sequelize.transaction(async (transaction) => {
        // Change the type column to add a new value
        await queryInterface.changeColumn('users', 'type', {
          type: Sequelize.ENUM('admin', 'user', 'customer', 'supplier', 'SP', 'super_admin'),
          allowNull: false,
          defaultValue: 'user',
        }, { transaction });
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      // Revert the changes made in the up function
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.changeColumn('users', 'type', {
          type: Sequelize.ENUM('admin', 'user', 'customer', 'supplier', 'SP'), // remove 'super_admin'
          allowNull: false,
          defaultValue: 'user',
        }, { transaction });
      });
    }
  };
  