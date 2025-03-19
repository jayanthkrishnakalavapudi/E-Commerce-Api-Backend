const DataLoader = require('dataloader');
const Order = require('../../models/Order');

// Batch function to load orders by order IDs
const batchOrders = async (orderIds) => {
  try {
    const orders = await Order.find({ _id: { $in: orderIds } });

    // Ensure the output matches the order of orderIds
    const orderMap = new Map(orders.map(order => [order._id.toString(), order]));
    return orderIds.map(id => orderMap.get(id.toString()) || null);
  } catch (error) {
    console.error("Error in batchOrders DataLoader:", error);
    throw new Error("Failed to load orders");
  }
};

// Batch function to load orders by customer IDs
const batchOrdersByCustomer = async (customerIds) => {
  try {
    const orders = await Order.find({ customerId: { $in: customerIds } });

    // Group orders by customer ID
    const customerOrderMap = new Map();
    customerIds.forEach(id => customerOrderMap.set(id.toString(), []));

    orders.forEach(order => {
      const customerIdStr = order.customerId.toString();
      if (customerOrderMap.has(customerIdStr)) {
        customerOrderMap.get(customerIdStr).push(order);
      }
    });

    return customerIds.map(id => customerOrderMap.get(id.toString()) || []);
  } catch (error) {
    console.error("Error in batchOrdersByCustomer DataLoader:", error);
    throw new Error("Failed to load orders by customer");
  }
};

// Create and export the data loaders
const createOrderLoader = () => new DataLoader(batchOrders);
const createCustomerOrdersLoader = () => new DataLoader(batchOrdersByCustomer);

module.exports = {
  createOrderLoader,
  createCustomerOrdersLoader
};
