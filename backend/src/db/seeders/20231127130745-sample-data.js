const db = require('../models');
const Users = db.users;

const Appointments = db.appointments;

const Interactions = db.interactions;

const Invoices = db.invoices;

const Leads = db.leads;

const Reports = db.reports;

const AppointmentsData = [
  {
    // type code here for "relation_one" field

    start_time: new Date('2023-10-01T09:00:00Z'),

    end_time: new Date('2023-10-01T10:00:00Z'),

    confirmation_status: 'confirmed',
  },

  {
    // type code here for "relation_one" field

    start_time: new Date('2023-10-02T11:00:00Z'),

    end_time: new Date('2023-10-02T12:00:00Z'),

    confirmation_status: 'pending',
  },

  {
    // type code here for "relation_one" field

    start_time: new Date('2023-10-03T13:00:00Z'),

    end_time: new Date('2023-10-03T14:00:00Z'),

    confirmation_status: 'confirmed',
  },

  {
    // type code here for "relation_one" field

    start_time: new Date('2023-10-04T15:00:00Z'),

    end_time: new Date('2023-10-04T16:00:00Z'),

    confirmation_status: 'pending',
  },

  {
    // type code here for "relation_one" field

    start_time: new Date('2023-10-05T17:00:00Z'),

    end_time: new Date('2023-10-05T18:00:00Z'),

    confirmation_status: 'confirmed',
  },
];

const InteractionsData = [
  {
    // type code here for "relation_one" field

    interaction_time: new Date('2023-09-25T10:00:00Z'),

    notes: 'Discussed service options and pricing.',
  },

  {
    // type code here for "relation_one" field

    interaction_time: new Date('2023-09-26T11:00:00Z'),

    notes: 'Customer requested a follow-up call.',
  },

  {
    // type code here for "relation_one" field

    interaction_time: new Date('2023-09-27T12:00:00Z'),

    notes: 'Scheduled appointment for next week.',
  },

  {
    // type code here for "relation_one" field

    interaction_time: new Date('2023-09-28T13:00:00Z'),

    notes: 'Provided estimate for battery replacement.',
  },

  {
    // type code here for "relation_one" field

    interaction_time: new Date('2023-09-29T14:00:00Z'),

    notes: 'Customer confirmed appointment.',
  },
];

const InvoicesData = [
  {
    // type code here for "relation_one" field

    amount: 100,

    payment_status: 'paid',
  },

  {
    // type code here for "relation_one" field

    amount: 200,

    payment_status: 'paid',
  },

  {
    // type code here for "relation_one" field

    amount: 150,

    payment_status: 'pending',
  },

  {
    // type code here for "relation_one" field

    amount: 250,

    payment_status: 'pending',
  },

  {
    // type code here for "relation_one" field

    amount: 300,

    payment_status: 'pending',
  },
];

const LeadsData = [
  {
    customer_name: 'Alice Johnson',

    contact_information: 'alice.johnson@example.com',

    service_interest: 'Oil Change',

    status: 'in_progress',

    // type code here for "relation_one" field
  },

  {
    customer_name: 'Bob Brown',

    contact_information: 'bob.brown@example.com',

    service_interest: 'Brake Repair',

    status: 'in_progress',

    // type code here for "relation_one" field
  },

  {
    customer_name: 'Charlie Davis',

    contact_information: 'charlie.davis@example.com',

    service_interest: 'Tire Replacement',

    status: 'completed',

    // type code here for "relation_one" field
  },

  {
    customer_name: 'Diana Evans',

    contact_information: 'diana.evans@example.com',

    service_interest: 'Battery Check',

    status: 'completed',

    // type code here for "relation_one" field
  },

  {
    customer_name: 'Ethan Foster',

    contact_information: 'ethan.foster@example.com',

    service_interest: 'Engine Tune-Up',

    status: 'in_progress',

    // type code here for "relation_one" field
  },
];

const ReportsData = [
  {
    report_name: 'Monthly Leads',

    kpi: 'Number of Leads',

    value: 50,
  },

  {
    report_name: 'Conversion Rate',

    kpi: 'Conversion Rate',

    value: 20.5,
  },

  {
    report_name: 'Total Revenue',

    kpi: 'Revenue',

    value: 5000,
  },

  {
    report_name: 'Pending Invoices',

    kpi: 'Pending Invoices',

    value: 10,
  },

  {
    report_name: 'Completed Services',

    kpi: 'Completed Services',

    value: 30,
  },
];

// Similar logic for "relation_many"

async function associateAppointmentWithLead() {
  const relatedLead0 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Appointment0 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Appointment0?.setLead) {
    await Appointment0.setLead(relatedLead0);
  }

  const relatedLead1 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Appointment1 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Appointment1?.setLead) {
    await Appointment1.setLead(relatedLead1);
  }

  const relatedLead2 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Appointment2 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Appointment2?.setLead) {
    await Appointment2.setLead(relatedLead2);
  }

  const relatedLead3 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Appointment3 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Appointment3?.setLead) {
    await Appointment3.setLead(relatedLead3);
  }

  const relatedLead4 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Appointment4 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Appointment4?.setLead) {
    await Appointment4.setLead(relatedLead4);
  }
}

async function associateInteractionWithLead() {
  const relatedLead0 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Interaction0 = await Interactions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Interaction0?.setLead) {
    await Interaction0.setLead(relatedLead0);
  }

  const relatedLead1 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Interaction1 = await Interactions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Interaction1?.setLead) {
    await Interaction1.setLead(relatedLead1);
  }

  const relatedLead2 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Interaction2 = await Interactions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Interaction2?.setLead) {
    await Interaction2.setLead(relatedLead2);
  }

  const relatedLead3 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Interaction3 = await Interactions.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Interaction3?.setLead) {
    await Interaction3.setLead(relatedLead3);
  }

  const relatedLead4 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Interaction4 = await Interactions.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Interaction4?.setLead) {
    await Interaction4.setLead(relatedLead4);
  }
}

async function associateInvoiceWithLead() {
  const relatedLead0 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Invoice0 = await Invoices.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Invoice0?.setLead) {
    await Invoice0.setLead(relatedLead0);
  }

  const relatedLead1 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Invoice1 = await Invoices.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Invoice1?.setLead) {
    await Invoice1.setLead(relatedLead1);
  }

  const relatedLead2 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Invoice2 = await Invoices.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Invoice2?.setLead) {
    await Invoice2.setLead(relatedLead2);
  }

  const relatedLead3 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Invoice3 = await Invoices.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Invoice3?.setLead) {
    await Invoice3.setLead(relatedLead3);
  }

  const relatedLead4 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Invoice4 = await Invoices.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Invoice4?.setLead) {
    await Invoice4.setLead(relatedLead4);
  }
}

async function associateLeadWithOwner() {
  const relatedOwner0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead0 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Lead0?.setOwner) {
    await Lead0.setOwner(relatedOwner0);
  }

  const relatedOwner1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead1 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Lead1?.setOwner) {
    await Lead1.setOwner(relatedOwner1);
  }

  const relatedOwner2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead2 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Lead2?.setOwner) {
    await Lead2.setOwner(relatedOwner2);
  }

  const relatedOwner3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead3 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Lead3?.setOwner) {
    await Lead3.setOwner(relatedOwner3);
  }

  const relatedOwner4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead4 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Lead4?.setOwner) {
    await Lead4.setOwner(relatedOwner4);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Appointments.bulkCreate(AppointmentsData);

    await Interactions.bulkCreate(InteractionsData);

    await Invoices.bulkCreate(InvoicesData);

    await Leads.bulkCreate(LeadsData);

    await Reports.bulkCreate(ReportsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateAppointmentWithLead(),

      await associateInteractionWithLead(),

      await associateInvoiceWithLead(),

      await associateLeadWithOwner(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('appointments', null, {});

    await queryInterface.bulkDelete('interactions', null, {});

    await queryInterface.bulkDelete('invoices', null, {});

    await queryInterface.bulkDelete('leads', null, {});

    await queryInterface.bulkDelete('reports', null, {});
  },
};
