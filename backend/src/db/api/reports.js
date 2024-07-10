const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ReportsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reports = await db.reports.create(
      {
        id: data.id || undefined,

        report_name: data.report_name || null,
        kpi: data.kpi || null,
        value: data.value || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return reports;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const reportsData = data.map((item, index) => ({
      id: item.id || undefined,

      report_name: item.report_name || null,
      kpi: item.kpi || null,
      value: item.value || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const reports = await db.reports.bulkCreate(reportsData, { transaction });

    // For each item created, replace relation files

    return reports;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reports = await db.reports.findByPk(id, {}, { transaction });

    await reports.update(
      {
        report_name: data.report_name || null,
        kpi: data.kpi || null,
        value: data.value || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return reports;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reports = await db.reports.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of reports) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of reports) {
        await record.destroy({ transaction });
      }
    });

    return reports;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reports = await db.reports.findByPk(id, options);

    await reports.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await reports.destroy({
      transaction,
    });

    return reports;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const reports = await db.reports.findOne({ where }, { transaction });

    if (!reports) {
      return reports;
    }

    const output = reports.get({ plain: true });

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
    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.report_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('reports', 'report_name', filter.report_name),
        };
      }

      if (filter.kpi) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('reports', 'kpi', filter.kpi),
        };
      }

      if (filter.valueRange) {
        const [start, end] = filter.valueRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            value: {
              ...where.value,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            value: {
              ...where.value,
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
          count: await db.reports.count({
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
      : await db.reports.findAndCountAll({
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
          Utils.ilike('reports', 'report_name', query),
        ],
      };
    }

    const records = await db.reports.findAll({
      attributes: ['id', 'report_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['report_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.report_name,
    }));
  }
};
