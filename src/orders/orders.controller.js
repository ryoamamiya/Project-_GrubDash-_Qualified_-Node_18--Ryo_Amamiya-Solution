const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  if (!deliverTo) {
    return next({ status: 400, message: "Order must include a deliverTo" });
  }
  if (!mobileNumber) {
    return next({ status: 400, message: "Order must include a mobileNumber" });
  }
  if (!dishes) {
    return next({ status: 400, message: "Order must include a dish" });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
  dishes.forEach((dish, index) => {
    if (
      !dish.quantity ||
      dish.quantity <= 0 ||
      !Number.isInteger(dish.quantity)
    ) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order does not exist: ${orderId}`,
  });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

function update(req, res, next) {
  const { orderId } = req.params;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body;

  if (!deliverTo) {
    return res.status(400).json({ error: "Order must include a deliverTo" });
  }
  if (!mobileNumber) {
    return res.status(400).json({ error: "Order must include a mobileNumber" });
  }
  if (!dishes) {
    return res.status(400).json({ error: "Order must include a dish" });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return res
      .status(400)
      .json({ error: "Order must include at least one dish" });
  }
  if (!status || status === "") {
    return res.status(400).json({
      error:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }
  if (
    status !== "pending" &&
    status !== "preparing" &&
    status !== "out-for-delivery" &&
    status !== "delivered"
  ) {
    return res.status(400).json({
      error:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }
  if (res.locals.order.status === "delivered") {
    return res.status(400).json({ error: "A delivered order cannot be changed" });
  }

  dishes.forEach((dish, index) => {
    if (
      !dish.hasOwnProperty("quantity") ||
      !dish.quantity ||
      dish.quantity <= 0 ||
      !Number.isInteger(dish.quantity)
    ) {
      return res.status(400).json({
        error: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });

  if (id && id !== orderId) {
    return res.status(400).json({
      error: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
    });
  }

  res.locals.order = {
    id: orderId,
    deliverTo: deliverTo,
    mobileNumber: mobileNumber,
    status: status,
    dishes: dishes,
  };

  res.json({ data: res.locals.order });
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  if (res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }
  // `splice()` returns an array of the deleted elements, even if it is one element
  orders.splice(index, 1);

  res.sendStatus(204);
}

function list(req, res) {
  res.json({ data: orders });
}

module.exports = {
  create,
  read: [orderExists, read],
  update: [orderExists, update],
  delete: [orderExists, destroy],
  list,
};

