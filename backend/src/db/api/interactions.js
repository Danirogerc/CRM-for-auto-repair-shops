const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InteractionsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const interactions = await db.interactions.create(
      {
        id: data.id || undefined,

        interaction_time: data.interaction_time || null,
        notes: data.notes || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await interactions.setLead(data.lead || null, {
      transaction,
    });

    return interactions;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const interactionsData = data.map((item, index) => ({
      id: item.id || undefined,

      interaction_time: item.interaction_time || null,
      notes: item.notes || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const interactions = await db.interactions.bulkCreate(interactionsData, {
      transaction,
    });

    // For each item created, replace relation files

    return interactions;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const interactions = await db.interactions.findByPk(
      id,
      {},
      { transaction },
    );

    await interactions.update(
      {
        interaction_time: data.interaction_time || null,
        notes: data.notes || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await interactions.setLead(data.lead || null, {
      transaction,
    });

    return interactions;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const interactions = await db.interactions.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of interactions) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of interactions) {
        await record.destroy({ transaction });
      }
    });

    return interactions;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const interactions = await db.interactions.findByPk(id, options);

    await interactions.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await interactions.destroy({
      transaction,
    });

    return interactions;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const interactions = await db.interactions.findOne(
      { where },
      { transaction },
    );

    if (!interactions) {
      return interactions;
    }

    const output = interactions.get({ plain: true });

    output.lead = await interactions.getLead({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.leads,
        as: 'lead',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.notes) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('interactions', 'notes', filter.notes),
        };
      }

      if (filter.interaction_timeRange) {
        const [start, end] = filter.interaction_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            interaction_time: {
              ...where.interaction_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            interaction_time: {
              ...where.interaction_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.lead) {
        var listItems = filter.lead.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          leadId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.interactions.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.interactions.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('interactions', 'interaction_time', query),
        ],
      };
    }

    const records = await db.interactions.findAll({
      attributes: ['id', 'interaction_time'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['interaction_time', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.interaction_time,
    }));
  }
};
