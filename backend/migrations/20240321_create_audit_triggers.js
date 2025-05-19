'use strict';

export const up = async (queryInterface, Sequelize) => {
    // Create audit_logs table
    await queryInterface.createTable('audit_logs', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tableName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        recordId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        action: {
            type: Sequelize.ENUM('INSERT', 'UPDATE', 'DELETE'),
            allowNull: false
        },
        oldData: {
            type: Sequelize.JSON,
            allowNull: true
        },
        newData: {
            type: Sequelize.JSON,
            allowNull: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        timestamp: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    // Create function to handle audit logging
    await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION audit_trigger_function()
        RETURNS TRIGGER AS $$
        BEGIN
            IF (TG_OP = 'DELETE') THEN
                INSERT INTO audit_logs (table_name, record_id, action, old_data, timestamp)
                VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), NOW());
                RETURN OLD;
            ELSIF (TG_OP = 'UPDATE') THEN
                INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, timestamp)
                VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NOW());
                RETURN NEW;
            ELSIF (TG_OP = 'INSERT') THEN
                INSERT INTO audit_logs (table_name, record_id, action, new_data, timestamp)
                VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), NOW());
                RETURN NEW;
            END IF;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Create triggers for each table
    const tables = [
        'users',
        'vehicles',
        'parking_slots',
        'reservations',
        'payments',
        'notifications',
        'otps',
        'verification_tokens'
    ];

    for (const table of tables) {
        await queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS ${table}_audit_trigger ON ${table};
            CREATE TRIGGER ${table}_audit_trigger
            AFTER INSERT OR UPDATE OR DELETE ON ${table}
            FOR EACH ROW
            EXECUTE FUNCTION audit_trigger_function();
        `);
    }
};

export const down = async (queryInterface, Sequelize) => {
    // Drop triggers
    const tables = [
        'users',
        'vehicles',
        'parking_slots',
        'reservations',
        'payments',
        'notifications',
        'otps',
        'verification_tokens'
    ];

    for (const table of tables) {
        await queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS ${table}_audit_trigger ON ${table};
        `);
    }

    // Drop function
    await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS audit_trigger_function();
    `);

    // Drop audit_logs table
    await queryInterface.dropTable('audit_logs');
}; 