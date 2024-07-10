const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const interactions = sequelize.define(
    'interactions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      interaction_time: {
        type: DataTypes.DATE,
      },

      notes: {
        type: DataTypes.TEXT,
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

  interactions.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.interactions.belongsTo(db.leads, {
      as: 'lead',
      foreignKey: {
        name: 'leadId',
      },
      constraints: false,
    });

    db.interactions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.interactions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return interactions;
};
