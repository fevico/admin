module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('job', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        sp_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        quote_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        customer_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        service_request_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        quote_status: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        last_current_status: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
        },
        cancel_reason: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        cancel_order_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
        },
        reopen_order_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
        },
        cancel_order_initiator: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        total_days: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
        },
        sp_rating_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        cu_rating_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        sp_completion_consent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        cs_completion_consent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: 'job',
    });

    return Job;
};