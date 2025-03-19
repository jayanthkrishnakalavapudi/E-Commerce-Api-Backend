const DataLoader = require('dataloader');
const Customer = require('../../models/Customer');

async function batchCustomers(ids) {
  // Fetch customers where _id is in the provided list
  const customers = await Customer.find({ _id: { $in: ids } });

  // Ensure order matches input keys
  return ids.map(id => customers.find(customer => customer._id.toString() === id.toString()) || null);
}

// ✅ Correct function export
const createCustomerLoader = () => new DataLoader(batchCustomers);

module.exports = createCustomerLoader;
