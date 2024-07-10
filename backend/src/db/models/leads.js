const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const leads = sequelize.define(
    'leads',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      customer_name: {
        type: DataTypes.TEXT,
      },

      contact_information: {
        type: DataTypes.TEXT,
      },

      service_interest: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.ENUM,

        values: ['new', 'in_progress', 'completed'],
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  leads.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.leads.hasMany(db.appointments, {
      as: 'appointments_lead',
      foreignKey: {
        name: 'leadId',
      },
      constraints: false,
    });

    db.leads.hasMany(db.interactions, {
      as: 'interactions_lead',
      foreignKey: {
        name: 'leadId',
      },
      constraints: false,
    });

    db.leads.hasMany(db.invoices, {
      as: 'invoices_lead',
      foreignKey: {
        name: 'leadId',
      },
      constraints: false,
    });

    //end loop

    db.leads.belongsTo(db.users, {
      as: 'owner',
      foreignKey: {
        name: 'ownerId',
      },
      constraints: false,
    });

    db.leads.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.leads.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return leads;
};
