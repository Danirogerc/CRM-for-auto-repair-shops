const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class LeadsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const leads = await db.leads.create(
      {
        id: data.id || undefined,

        customer_name: data.customer_name || null,
        contact_information: data.contact_information || null,
        service_interest: data.service_interest || null,
        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await leads.setOwner(data.owner || null, {
      transaction,
    });

    return leads;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const leadsData = data.map((item, index) => ({
      id: item.id || undefined,

      customer_name: item.customer_name || null,
      contact_information: item.contact_information || null,
      service_interest: item.service_interest || null,
      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const leads = await db.leads.bulkCreate(leadsData, { transaction });

    // For each item created, replace relation files

    return leads;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const leads = await db.leads.findByPk(id, {}, { transaction });

    await leads.update(
      {
        customer_name: data.customer_name || null,
        contact_information: data.contact_information || null,
        service_interest: data.service_interest || null,
        status: data.status || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await leads.setOwner(data.owner || null, {
      transaction,
    });

    return leads;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const leads = await db.leads.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of leads) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of leads) {
        await record.destroy({ transaction });
      }
    });

    return leads;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const leads = await db.leads.findByPk(id, options);

    await leads.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await leads.destroy({
      transaction,
    });

    return leads;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const leads = await db.leads.findOne({ where }, { transaction });

    if (!leads) {
      return leads;
    }

    const output = leads.get({ plain: true });

    output.appointments_lead = await leads.getAppointments_lead({
      transaction,
    });

    output.interactions_lead = await leads.getInteractions_lead({
      transaction,
    });

    output.invoices_lead = await leads.getInvoices_lead({
      transaction,
    });

    output.owner = await leads.getOwner({
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
        model: db.users,
        as: 'owner',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.customer_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('leads', 'customer_name', filter.customer_name),
        };
      }

      if (filter.contact_information) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'leads',
            'contact_information',
            filter.contact_information,
          ),
        };
      }

      if (filter.service_interest) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'leads',
            'service_interest',
            filter.service_interest,
          ),
        };
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

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
        };
      }

      if (filter.owner) {
        var listItems = filter.owner.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          ownerId: { [Op.or]: listItems },
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
          count: await db.leads.count({
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
      : await db.leads.findAndCountAll({
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
          Utils.ilike('leads', 'customer_name', query),
        ],
      };
    }

    const records = await db.leads.findAll({
      attributes: ['id', 'customer_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['customer_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.customer_name,
    }));
  }
};
